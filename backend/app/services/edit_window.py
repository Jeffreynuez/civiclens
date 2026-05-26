# CivicView — Copyright (c) 2026 Jeffrey De La Nuez. All rights reserved.
# Proprietary and confidential. See LICENSE at the repository root.

"""Edit-window policy (Task #41).

Single source of truth for "can this post or comment be edited right
now?" Both rules + their constants live here so the routers stay free
of magic numbers and the next person tuning these doesn't have to
hunt through endpoint code to find them.

Posts:
  • Editable for 24h from created_at.
  • Window runs from creation, NOT from the last edit — editing again
    cannot extend the window. (Otherwise a bait-and-switch attacker
    could keep an edit alive indefinitely.)

Comments:
  • Editable until the FIRST reply lands AND the 60-second silent
    grace window has elapsed.
  • The 60s grace beats the reply lock: if someone replies 30 seconds
    after the original comment posted, the original author still has
    the rest of the 60s window to fix a typo. After 60s, the lock-on-
    reply rule applies strictly.
  • The grace window is "silent" — edits inside it do NOT set
    edited_at and do NOT show the "Edited" chip in the UI. Reasoning:
    almost every edit inside the first minute is a typo fix; flagging
    it adds noise without informational value.

Polls are not editable at all (voting integrity — changing the
question after votes are cast voids the results). Not enforced here;
no edit endpoint exists for polls in the first place.

The functions take the model row + a `now` argument so tests can
inject a fixed time. Callers in routers pass datetime.utcnow().
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional


# Window after which posts can no longer be edited.
POST_EDIT_WINDOW = timedelta(hours=24)

# Silent grace window for comment edits — within this window after
# creation, edits don't set edited_at and don't carry the "Edited"
# chip, AND the lock-on-reply rule is suspended.
COMMENT_TYPO_GRACE = timedelta(seconds=60)


def _now() -> datetime:
    """Centralized clock so tests can monkey-patch one symbol instead
    of patching datetime module-wide."""
    return datetime.utcnow()


def can_edit_post(*, created_at: datetime, deleted_at: Optional[datetime], now: Optional[datetime] = None) -> bool:
    """True iff this post is still editable.

    Conditions:
      • Not deleted (deleted_at is None).
      • Within the 24h window from created_at.

    Window starts at created_at, not last edit — editing cannot extend.
    """
    if deleted_at is not None:
        return False
    now = now or _now()
    return (now - created_at) < POST_EDIT_WINDOW


def can_edit_comment(
    *,
    created_at: datetime,
    deleted_at: Optional[datetime],
    first_reply_at: Optional[datetime],
    now: Optional[datetime] = None,
) -> bool:
    """True iff this comment is still editable.

    Conditions:
      • Not deleted (deleted_at is None).
      • Within the 60s silent grace window from created_at, OR no
        reply has landed yet (first_reply_at is None).

    The grace beats the reply lock: a reply within 60s does NOT
    prevent the author from editing inside that same 60s window.
    """
    if deleted_at is not None:
        return False
    now = now or _now()
    in_grace = (now - created_at) < COMMENT_TYPO_GRACE
    if in_grace:
        return True
    return first_reply_at is None


def comment_edit_is_silent(*, created_at: datetime, now: Optional[datetime] = None) -> bool:
    """True iff a comment edit happening NOW would be inside the silent
    typo grace window. Used by the comment-edit endpoint to decide
    whether to set edited_at on save (silent edits leave it NULL so
    no "Edited" chip renders in the UI)."""
    now = now or _now()
    return (now - created_at) < COMMENT_TYPO_GRACE
