# CivicView — Copyright (c) 2026 Jeffrey Nuez. All rights reserved.
# Proprietary and confidential. See LICENSE at the repository root.

"""
Citizen-poll service — backing logic for the "Subscribed citizens
post polls on unclaimed rep pages" feature.

Three responsibilities:

  1. Serialize standalone (citizen-authored) polls into the wire
     shape the frontend consumes — including comment/report counts
     and the caller's own report state.

  2. Enforce the rate-limit rules at the model layer:
       • 1 active poll per (citizen, page) at a time.
       • PER_PAGE_ACTIVE_POLL_CAP active polls per page total.
     The first is checked at create-time; the second triggers an
     auto-archive of the oldest active poll on the page.

  3. Trigger archive cascades when a rep claims a previously-
     unclaimed page. Called from the rep-account-creation path
     (currently seed.py; later from a real claim endpoint).

The service is intentionally light — heavier orchestration lives in
the citizen-polls router which composes these helpers with the
existing auth / scope helpers from pages.py.
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.pages import (
    CitizenAccount,
    Poll,
    PollComment,
    PollOption,
    PollReport,
    PollVote,
    RepAccount,
)
from app.schemas.pages import (
    CitizenAuthorSummary,
    CitizenPollRead,
    PER_PAGE_ACTIVE_POLL_CAP,
    PollOptionRead,
    PollRead,
    PollScopeBreakdown,
)


# ── Serialization ─────────────────────────────────────────────────────
def _poll_to_simple_read(
    poll: Poll,
    voter_choice_id: Optional[int] = None,
) -> PollRead:
    """Lightweight poll-to-read for citizen polls.

    Citizen polls have no rep owner, so the 'owner geography' scope
    concept (state / district / city) doesn't apply — every vote
    rolls up under 'country'. We still return the same PollRead
    shape the rep-poll surface uses so the frontend's PollCard
    component can render it without forking on author kind.
    """
    mode = (poll.presentation_mode or "full").lower()
    now = datetime.utcnow()
    poll_is_closed = poll.closes_at is not None and now >= poll.closes_at
    # `reveal_after_close` blacks out counts on the wire until the
    # close tick passes. Citizen polls don't have an "owner" who
    # bypasses this, so suppression is binary.
    suppress_counts = mode == "reveal_after_close" and not poll_is_closed

    options_out: List[PollOptionRead] = []
    active_total = 0
    for opt in poll.options:
        votes = opt.votes or []
        active_count = 0 if suppress_counts else len(votes)
        active_total += active_count
        options_out.append(PollOptionRead(
            id=opt.id, text=opt.text, sort_order=opt.sort_order,
            vote_count=active_count,
        ))

    breakdown = PollScopeBreakdown(country_total=active_total)

    return PollRead(
        id=poll.id,
        question=poll.question,
        closes_at=poll.closes_at,
        options=options_out,
        total_votes=active_total,
        voter_choice_id=voter_choice_id,
        default_visibility_scope="country",
        active_scope="country",
        allowed_scopes=["country"],
        scope_totals=breakdown,
        active_scope_label=None,
        presentation_mode=mode,
        counts_suppressed=suppress_counts,
    )


def serialize_citizen_poll(
    db: Session,
    poll: Poll,
    me_citizen: Optional[CitizenAccount],
    me_rep: Optional[RepAccount],
) -> CitizenPollRead:
    """Compose a CitizenPollRead from a Poll + author lookup +
    counts (comments, reports, the caller's own state).

    Performs at most three small COUNT queries per poll, plus a
    single citizen lookup. List endpoints invoking this in a loop
    eat N+3 round-trips — fine for our cap of 20 polls per page.
    If we ever raise the cap, fold these into a single GROUP BY.
    """
    author = db.get(CitizenAccount, poll.author_citizen_id) if poll.author_citizen_id else None

    # Caller's own vote on the poll, if any. Used to highlight the
    # option they picked in the wire shape.
    voter_choice_id = None
    if me_citizen is not None:
        existing_vote = (
            db.query(PollVote)
            .filter(
                PollVote.poll_id == poll.id,
                PollVote.citizen_id == me_citizen.id,
            )
            .first()
        )
        if existing_vote:
            voter_choice_id = existing_vote.option_id

    # Live comment count — the model relationship loads soft-deleted
    # rows too, so filter at query time.
    comment_count = (
        db.query(func.count(PollComment.id))
        .filter(
            PollComment.poll_id == poll.id,
            PollComment.deleted_at.is_(None),
        )
        .scalar()
    ) or 0

    # Has the caller already reported this poll? Affects whether the
    # UI shows "Report" or "Reported".
    my_report_filed = False
    if me_citizen is not None:
        my_report_filed = bool(
            db.query(PollReport.id)
            .filter(
                PollReport.poll_id == poll.id,
                PollReport.reporter_citizen_id == me_citizen.id,
            )
            .first()
        )
    elif me_rep is not None:
        my_report_filed = bool(
            db.query(PollReport.id)
            .filter(
                PollReport.poll_id == poll.id,
                PollReport.reporter_rep_id == me_rep.id,
            )
            .first()
        )

    # Author can close their own poll; nobody else can.
    can_close = (
        me_citizen is not None
        and poll.author_citizen_id == me_citizen.id
        and poll.archived_at is None
    )

    author_payload = (
        CitizenAuthorSummary(
            id=author.id,
            display_name=author.display_name,
            state=author.state,
            city=author.city,
            congressional_district=author.congressional_district,
            verified=author.verified,
        )
        if author is not None
        else CitizenAuthorSummary(id=0, display_name="(deleted citizen)")
    )

    return CitizenPollRead(
        id=poll.id,
        target_official_id=poll.target_official_id or "",
        author=author_payload,
        poll=_poll_to_simple_read(poll, voter_choice_id=voter_choice_id),
        created_at=poll.created_at or datetime.utcnow(),
        archived_at=poll.archived_at,
        archived_reason=poll.archived_reason,
        comment_count=comment_count,
        report_count=poll.report_count or 0,
        my_report_filed=my_report_filed,
        can_close=can_close,
    )


# ── Querying ──────────────────────────────────────────────────────────
def list_citizen_polls_for_page(
    db: Session,
    target_official_id: str,
    *,
    active: bool = True,
) -> List[Poll]:
    """All citizen-authored polls on this rep's page, newest first.
    `active=True` (the default) returns the visible feed; False
    returns archived polls (for the rep's "Pre-claim discussion"
    section)."""
    q = (
        db.query(Poll)
        .options(selectinload(Poll.options).selectinload(PollOption.votes))
        .filter(
            Poll.author_kind == "citizen",
            Poll.target_official_id == target_official_id,
        )
    )
    if active:
        q = q.filter(Poll.archived_at.is_(None))
    else:
        q = q.filter(Poll.archived_at.is_not(None))
    return q.order_by(Poll.created_at.desc()).all()


def list_citizen_polls_for_citizen(
    db: Session,
    citizen_id: int,
    *,
    active: bool = True,
) -> List[Poll]:
    """All polls authored by this citizen, for their dashboard."""
    q = (
        db.query(Poll)
        .options(selectinload(Poll.options).selectinload(PollOption.votes))
        .filter(
            Poll.author_kind == "citizen",
            Poll.author_citizen_id == citizen_id,
        )
    )
    if active:
        q = q.filter(Poll.archived_at.is_(None))
    else:
        q = q.filter(Poll.archived_at.is_not(None))
    return q.order_by(Poll.created_at.desc()).all()


def citizen_has_active_poll_on_page(
    db: Session,
    citizen_id: int,
    target_official_id: str,
) -> bool:
    """Rate-limit check: 1 active poll per (citizen, page) at a time."""
    return bool(
        db.query(Poll.id)
        .filter(
            Poll.author_kind == "citizen",
            Poll.author_citizen_id == citizen_id,
            Poll.target_official_id == target_official_id,
            Poll.archived_at.is_(None),
        )
        .first()
    )


def active_poll_count_for_page(db: Session, target_official_id: str) -> int:
    """How many active citizen polls live on this page right now.
    Used both for the cap check and surfaced to the client so the
    UI can disable the create-poll button before the round-trip."""
    return (
        db.query(func.count(Poll.id))
        .filter(
            Poll.author_kind == "citizen",
            Poll.target_official_id == target_official_id,
            Poll.archived_at.is_(None),
        )
        .scalar()
    ) or 0


# ── Mutations ─────────────────────────────────────────────────────────
def archive_poll(
    db: Session,
    poll: Poll,
    *,
    reason: str,
    commit: bool = True,
) -> Poll:
    """Soft-archive a citizen poll. Reason is one of POLL_ARCHIVE_REASONS;
    the router validates that. Idempotent — re-calling on an already-
    archived poll updates the timestamp + reason."""
    poll.archived_at = datetime.utcnow()
    poll.archived_reason = reason
    if commit:
        db.commit()
        db.refresh(poll)
    return poll


def maybe_supersede_oldest_active_poll(
    db: Session,
    target_official_id: str,
) -> Optional[Poll]:
    """Enforce the per-page active cap. If the page is already at
    PER_PAGE_ACTIVE_POLL_CAP, archive the oldest active poll with
    reason='superseded'. Caller commits.

    Returns the poll that was superseded, or None if no eviction
    was needed.
    """
    active = list_citizen_polls_for_page(db, target_official_id, active=True)
    if len(active) < PER_PAGE_ACTIVE_POLL_CAP:
        return None
    oldest = min(active, key=lambda p: p.created_at or datetime.utcnow())
    archive_poll(db, oldest, reason="superseded", commit=False)
    return oldest


def archive_polls_for_claim(
    db: Session,
    target_official_id: str,
) -> int:
    """Archive every active citizen poll on a page that just got
    claimed by a rep. Called from the rep-account-creation pathway
    (seed + future claim endpoint).

    Returns the number of polls archived. Safe to call on a page
    with no citizen polls — returns 0.

    Run inside the caller's transaction; we don't commit so the
    rep-account-create + archive-cascade both land atomically.
    """
    active = list_citizen_polls_for_page(db, target_official_id, active=True)
    for poll in active:
        archive_poll(db, poll, reason="rep_claimed", commit=False)
    return len(active)
