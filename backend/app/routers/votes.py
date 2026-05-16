# CivicView — Copyright (c) 2026 Jeffrey Nuez. All rights reserved.
# Proprietary and confidential. See LICENSE at the repository root.

"""
Votes router — per-vote explainer surface.

  POST /api/votes/explain
       Body carries the vote payload the frontend already has on hand
       (vote_id, question, chamber, result, category, date, position,
       bill). Returns a structured explainer body — template-based for
       the common categories, zero LLM cost.

Why POST not GET: the request body is the full vote payload (with the
nested bill object). Encoding that as a query string is awkward, and
the response varies by exact input (question text changes the
amendment template's wording). POST with a JSON body keeps the API
clean.

Why no DB persistence yet: templates are deterministic and cheap to
generate — there's no point caching them across requests. When/if we
add a Haiku-powered "Explain in more depth" upgrade, that'll get its
own cache layer (probably keyed by vote_id).
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services import vote_explainer_service

router = APIRouter()


class VoteBillContext(BaseModel):
    """Subset of the GovTrack `bill` payload the explainer needs."""
    display_number: Optional[str] = None
    title: Optional[str] = None


class VoteExplainRequest(BaseModel):
    """Mirrors the shape of /api/congress/members/{bioguide}/votes rows.
    The frontend should be able to spread the row payload directly.
    Every field is optional — the explainer degrades gracefully when
    the caller has partial data."""
    vote_id: Optional[str] = None
    question: Optional[str] = None
    chamber: Optional[str] = None
    result: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    position: Optional[str] = None
    url: Optional[str] = None
    bill: Optional[VoteBillContext] = None


class VoteExplainResponse(BaseModel):
    vote_id: Optional[str] = None
    category: str
    what_was_voted: str
    what_yea_means: str
    what_nay_means: str
    outcome_meaning: str
    source: str


@router.post("/explain", response_model=VoteExplainResponse)
def explain_vote(payload: VoteExplainRequest) -> VoteExplainResponse:
    """Generate a "what was this vote?" explainer for a roll-call vote.

    Template-based — instant, free, no LLM round-trip. Covers all the
    GovTrack categories (passage / cloture / amendment / procedural /
    nomination / impeachment / etc.) plus a generic fallback for
    novel-shaped votes.
    """
    body = vote_explainer_service.explain_vote(payload.model_dump())
    return VoteExplainResponse(**body)
