# CivicView — Copyright (c) 2026 Jeffrey Nuez. All rights reserved.
# Proprietary and confidential. See LICENSE at the repository root.

"""
Vote explainer service — turns a roll-call vote into a plain-language
"what was this vote?" breakdown.

Why this is separate from bill_summary_service:
  The Bills tab summary explains what a BILL would do. The Votes tab
  often shows procedural motions — motion to table, motion to
  recommit, motion to suspend the rules, amendments, cloture — that
  aren't "about the bill" in any meaningful sense. They're tactics.
  A bill-text summary doesn't help; the user needs the procedural
  meaning ("voting YEA on a motion to table KILLS the underlying
  thing without taking a position on its merits").

Strategy:
  • Template-based per category. The GovTrack `category` field
    classifies every vote into one of ~14 buckets — passage,
    cloture, amendment, etc. Each bucket has a known practical
    meaning we encode as a template that gets filled in with the
    bill citation + result.
  • Zero LLM cost in the common case. Templates handle ~95% of
    votes; the response is generated in microseconds.
  • Optional Haiku upgrade for "Explain in more detail" — kicks
    off a separate /explain-detail endpoint that uses the vote
    question text + bill context to produce a longer, contextual
    explanation. Cached forever by vote_id when used.

Response shape (BillSummary-style):
  {
    "vote_id": str,
    "category": str,        # canonical category
    "what_was_voted": str,  # one-sentence "what this vote was"
    "what_yea_means": str,  # one-sentence "voting YEA means..."
    "what_nay_means": str,  # one-sentence "voting NAY means..."
    "outcome_meaning": str, # one-sentence interpretation of result
    "source": "template" | "ai",
  }
"""
from __future__ import annotations

import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)


# Categories GovTrack emits for every roll-call vote, mapped to a
# template generator. The generator gets the vote payload and returns
# the 4-field explainer body.
#
# Categories not listed here fall through to a generic "from question"
# template that does its best with the question text alone.
_KNOWN_CATEGORIES = (
    "passage",
    "passage_suspension",
    "cloture",
    "conference",
    "veto_override",
    "treaty",
    "amendment",
    "nomination",
    "conviction",
    "impeachment",
    "procedural",
    "quorum",
    "leadership",
)


def _bill_citation(vote: dict) -> Optional[str]:
    """Return a clean bill citation like 'H.R. 8469' when the vote is
    attached to a bill. Falls back to None for votes that don't have
    one (procedural motions, nominations, etc.)."""
    bill = vote.get("bill") or {}
    disp = (bill.get("display_number") or "").strip()
    return disp or None


def _bill_title(vote: dict) -> Optional[str]:
    bill = vote.get("bill") or {}
    title = (bill.get("title") or "").strip()
    return title or None


def _result_outcome_word(result: str) -> str:
    """Normalize the GovTrack result string ('Passed', 'Failed', etc.)
    into something usable inside template prose. We lean on the GovTrack
    label rather than trying to reinterpret yes/no counts."""
    if not result:
        return "the outcome is unknown"
    r = result.strip().lower()
    if "passed" in r or "agreed" in r or "confirmed" in r:
        return "passed"
    if "failed" in r or "rejected" in r or "not " in r:
        return "failed"
    return r


def _strip_question_prefix(question: str) -> str:
    """GovTrack question strings often start with a procedural prefix
    like 'On Passage of the Bill: ' or 'On Motion to Table: ' which is
    redundant once we've classified the category. Strip the common
    leading clauses so the bare subject remains."""
    if not question:
        return ""
    q = question.strip()
    # Common prefixes to peel off (case-insensitive, only at the start)
    prefixes = (
        r"^On Passage of the Bill:\s*",
        r"^On Passage:\s*",
        r"^On the Cloture Motion:\s*",
        r"^On Cloture:\s*",
        r"^On Agreeing to the Resolution:\s*",
        r"^On Agreeing to the Conference Report:\s*",
        r"^On Agreeing to the Amendment:\s*",
        r"^On Motion to Table:\s*",
        r"^On Motion to Suspend the Rules and Pass:\s*",
        r"^On Motion to Suspend the Rules and Agree:\s*",
        r"^On the Nomination:\s*",
        r"^On the Conference Report:\s*",
        r"^On the Joint Resolution:\s*",
        r"^On the Resolution:\s*",
        r"^On the Motion to Recommit:\s*",
    )
    for p in prefixes:
        q = re.sub(p, "", q, flags=re.IGNORECASE)
    return q.strip()


def _explain_passage(vote: dict) -> dict:
    citation = _bill_citation(vote)
    title = _bill_title(vote)
    subject = citation or (title or "this measure")
    result_word = _result_outcome_word(vote.get("result") or "")
    next_step = (
        "moves to the other chamber for consideration"
        if result_word == "passed"
        else "is not advanced"
    )
    return {
        "what_was_voted":
            f"Final passage of {subject}. A simple majority is needed to send "
            f"the bill to the other chamber (or, if both chambers have passed it, "
            f"to the President's desk).",
        "what_yea_means":
            f"Voting YEA means supporting the bill becoming law.",
        "what_nay_means":
            f"Voting NAY means opposing the bill — either on its merits or "
            f"because the member wants different text.",
        "outcome_meaning":
            f"The measure {result_word}; it {next_step}.",
    }


def _explain_passage_suspension(vote: dict) -> dict:
    citation = _bill_citation(vote)
    subject = citation or "this measure"
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"Passage of {subject} under suspension of the rules. This is a "
            f"fast-track procedure typically used for non-controversial bills — "
            f"it skips amendments and limits debate, but requires a two-thirds "
            f"supermajority to pass.",
        "what_yea_means":
            f"Voting YEA means supporting passage AND agreeing the bill is "
            f"non-controversial enough for fast-track treatment.",
        "what_nay_means":
            f"Voting NAY means either opposing the bill, OR opposing the "
            f"fast-track procedure (the member may want amendments / fuller debate).",
        "outcome_meaning":
            f"The measure {result_word}. Suspension requires 2/3, so even a "
            f"majority can fail.",
    }


def _explain_cloture(vote: dict) -> dict:
    citation = _bill_citation(vote)
    subject = (
        f"on {citation}" if citation else "on the matter currently being debated"
    )
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"A cloture motion {subject}. Cloture ends Senate debate so a "
            f"final vote can happen — without it, opponents can filibuster "
            f"indefinitely. Requires 60 votes to invoke.",
        "what_yea_means":
            f"Voting YEA means supporting moving to a final vote. It does NOT "
            f"mean supporting the underlying bill — many senators vote yes on "
            f"cloture to allow a vote even on bills they plan to oppose.",
        "what_nay_means":
            f"Voting NAY means supporting continued debate (effectively, "
            f"blocking the final vote via filibuster).",
        "outcome_meaning":
            f"Cloture {result_word}. " + (
                "Debate ends and the chamber moves to a final vote."
                if result_word == "passed"
                else "Debate continues and the underlying bill is blocked from a vote."
            ),
    }


def _explain_conference(vote: dict) -> dict:
    citation = _bill_citation(vote)
    subject = citation or "the bill"
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"The conference report on {subject}. When the House and Senate "
            f"pass different versions of a bill, conferees from each chamber "
            f"negotiate a single reconciled text. This vote approves or rejects "
            f"that final negotiated version.",
        "what_yea_means":
            f"Voting YEA means supporting the final negotiated text.",
        "what_nay_means":
            f"Voting NAY means rejecting the negotiated compromise. Sometimes "
            f"members vote against a conference report whose underlying bill "
            f"they supported, when the negotiation moved too far the other way.",
        "outcome_meaning":
            f"The conference report {result_word}. " + (
                "The reconciled bill now goes to the President's desk for signature."
                if result_word == "passed"
                else "Conferees may need to renegotiate."
            ),
    }


def _explain_veto_override(vote: dict) -> dict:
    citation = _bill_citation(vote)
    subject = citation or "the vetoed bill"
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"A vote to override the President's veto of {subject}. Overriding "
            f"requires a two-thirds supermajority in BOTH chambers; if either "
            f"falls short, the veto stands and the bill dies.",
        "what_yea_means":
            f"Voting YEA means supporting the bill becoming law over the "
            f"President's objection.",
        "what_nay_means":
            f"Voting NAY means letting the veto stand — the bill does not "
            f"become law.",
        "outcome_meaning":
            f"The override {result_word}. " + (
                "The bill becomes law without the President's signature."
                if result_word == "passed"
                else "The veto stands; the bill does not become law."
            ),
    }


def _explain_amendment(vote: dict) -> dict:
    citation = _bill_citation(vote)
    subject = f" to {citation}" if citation else ""
    stripped = _strip_question_prefix(vote.get("question") or "")
    detail = f" The amendment in this vote: {stripped}." if stripped else ""
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"An amendment{subject} — a proposed change to the bill's text "
            f"before it gets a final passage vote.{detail}",
        "what_yea_means":
            f"Voting YEA means supporting adding this amendment to the bill. "
            f"It doesn't necessarily mean supporting the bill itself — members "
            f"often vote on amendments separately from the underlying bill.",
        "what_nay_means":
            f"Voting NAY means opposing the amendment (either keeping the bill "
            f"as-is, or wanting a different change).",
        "outcome_meaning":
            f"The amendment {result_word}. " + (
                "The bill text changes to include it before the final passage vote."
                if result_word == "passed"
                else "The bill text stays as written; the underlying bill still awaits a final vote."
            ),
    }


def _explain_nomination(vote: dict) -> dict:
    stripped = _strip_question_prefix(vote.get("question") or "")
    nominee_clause = f" of {stripped}" if stripped else ""
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"Senate confirmation{nominee_clause}. The Senate confirms "
            f"presidential nominations to executive-branch positions, federal "
            f"judgeships, and certain other roles. Simple majority needed.",
        "what_yea_means":
            f"Voting YEA means supporting the nominee's confirmation.",
        "what_nay_means":
            f"Voting NAY means opposing the nominee.",
        "outcome_meaning":
            f"The nomination was {result_word}. " + (
                "The nominee can now be sworn in."
                if result_word == "passed"
                else "The position remains unfilled or open."
            ),
    }


def _explain_impeachment(vote: dict) -> dict:
    stripped = _strip_question_prefix(vote.get("question") or "")
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"A vote on an article of impeachment. "
            + (f"This article concerns: {stripped}." if stripped else ""),
        "what_yea_means":
            f"Voting YEA means supporting the impeachment article (in the House, "
            f"this is a charge; in the Senate, this is a conviction).",
        "what_nay_means":
            f"Voting NAY means opposing the article — declining to charge "
            f"(House) or to convict (Senate).",
        "outcome_meaning":
            f"The article {result_word}.",
    }


def _explain_conviction(vote: dict) -> dict:
    # Same shape as impeachment but framed for the Senate trial side.
    return _explain_impeachment(vote)


def _explain_treaty(vote: dict) -> dict:
    stripped = _strip_question_prefix(vote.get("question") or "")
    result_word = _result_outcome_word(vote.get("result") or "")
    subject = stripped or "the treaty"
    return {
        "what_was_voted":
            f"Senate ratification of {subject}. Treaties require a two-thirds "
            f"supermajority — substantially harder than a simple bill.",
        "what_yea_means":
            f"Voting YEA means consenting to the treaty's ratification.",
        "what_nay_means":
            f"Voting NAY means opposing the treaty.",
        "outcome_meaning":
            f"Ratification {result_word}.",
    }


def _explain_procedural(vote: dict) -> dict:
    # Procedural motions vary widely — motion to recommit, motion to
    # adjourn, motion to table, etc. The question text usually carries
    # enough specifics to be useful.
    stripped = _strip_question_prefix(vote.get("question") or "")
    detail = f" The motion: {stripped}." if stripped else ""
    citation = _bill_citation(vote)
    citation_clause = f" related to {citation}" if citation else ""
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"A procedural motion{citation_clause}.{detail} Procedural votes "
            f"affect how / whether legislation moves forward, but don't take "
            f"a position on the bill's substance.",
        "what_yea_means":
            f"Voting YEA means supporting whatever the motion proposes — often "
            f"these are tactical, so YEA doesn't necessarily reflect support "
            f"for the underlying bill.",
        "what_nay_means":
            f"Voting NAY means opposing the procedural maneuver.",
        "outcome_meaning":
            f"The motion {result_word}. Procedural outcomes shape what comes "
            f"next on the floor schedule.",
    }


def _explain_quorum(vote: dict) -> dict:
    return {
        "what_was_voted":
            "A quorum call — verifying that enough members are present for "
            "the chamber to conduct business. Required when any member raises "
            "the absence-of-quorum point of order.",
        "what_yea_means":
            "There's no 'yea' or 'nay' on quorum calls — members simply respond "
            "that they're present. The vote tally counts attendance.",
        "what_nay_means":
            "(Not applicable — quorum calls are attendance, not opposition.)",
        "outcome_meaning":
            "If quorum is met, the chamber continues with its business. If "
            "not, business is suspended until enough members arrive.",
    }


def _explain_leadership(vote: dict) -> dict:
    stripped = _strip_question_prefix(vote.get("question") or "")
    detail = f" The vote: {stripped}." if stripped else ""
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"A leadership election or chamber-organization vote.{detail} "
            f"These determine who fills key institutional roles (Speaker, "
            f"leader, etc.) or how the chamber organizes itself.",
        "what_yea_means":
            f"Voting YEA means supporting the proposed leader / organization.",
        "what_nay_means":
            f"Voting NAY means opposing it.",
        "outcome_meaning":
            f"The motion {result_word}.",
    }


def _explain_fallback(vote: dict) -> dict:
    """Generic fallback when the category is missing or unrecognized.
    Uses the raw question text since that's the most reliable signal
    we have left."""
    stripped = _strip_question_prefix(vote.get("question") or "")
    subject = stripped or "an unspecified matter"
    citation = _bill_citation(vote)
    citation_clause = f" related to {citation}" if citation else ""
    result_word = _result_outcome_word(vote.get("result") or "")
    return {
        "what_was_voted":
            f"A roll-call vote{citation_clause}: {subject}.",
        "what_yea_means":
            f"Voting YEA means supporting the motion as worded above.",
        "what_nay_means":
            f"Voting NAY means opposing it.",
        "outcome_meaning":
            f"The vote {result_word}.",
    }


_TEMPLATES = {
    "passage":              _explain_passage,
    "passage_suspension":   _explain_passage_suspension,
    "cloture":              _explain_cloture,
    "conference":           _explain_conference,
    "veto_override":        _explain_veto_override,
    "treaty":               _explain_treaty,
    "amendment":            _explain_amendment,
    "nomination":           _explain_nomination,
    "conviction":           _explain_conviction,
    "impeachment":          _explain_impeachment,
    "procedural":           _explain_procedural,
    "quorum":               _explain_quorum,
    "leadership":           _explain_leadership,
}


def explain_vote(vote: dict) -> dict:
    """Generate the structured explainer payload for a single vote.

    `vote` is the dict shape the frontend already has — same fields
    returned by /api/congress/members/{bioguide}/votes (vote_id,
    question, chamber, result, category, date, position, url, bill).

    Returns:
        {
          "vote_id": str | None,
          "category": str (canonical),
          "what_was_voted": str,
          "what_yea_means": str,
          "what_nay_means": str,
          "outcome_meaning": str,
          "source": "template",
        }
    """
    raw_cat = (vote.get("category") or "").lower().strip()
    category = raw_cat if raw_cat in _KNOWN_CATEGORIES else "unknown"

    template_fn = _TEMPLATES.get(category, _explain_fallback)
    body = template_fn(vote)

    return {
        "vote_id": vote.get("vote_id"),
        "category": category,
        **body,
        "source": "template",
    }
