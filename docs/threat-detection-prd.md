# PRD — Threat / Incitement Detection (Task #41)

**Status:** Draft for review · **Owner:** Jeffrey De La Nuez · **Drafted:** 2026-05-28 (Claude Opus 4.8)
**Related:** `docs/LEGAL-REVIEW-ROADMAP.md` (policy needs attorney review), Task #91 (AI Gateway — cost/observability), `docs/INCIDENT-RESPONSE.md`

---

## 1. Problem & goals

CivicView's hard rule: **content comes down only via (a) user reports or (b) a threat-detection algorithm** — never unilateral admin deletion. The report path exists today (`report_count` → `auto_hidden`). This feature builds path (b): an automated check that flags content which credibly threatens violence, incites imminent lawless action, doxxes, or targets someone for harassment — so it can be reviewed and, in the most egregious cases, auto-hidden pending review.

**Goals**
- Catch credible threats / incitement / doxxing on posts, polls, and comments shortly after they're authored.
- **Flag for human review** by default; **auto-hide only the highest-confidence, highest-harm cases** (doxxing, credible violent threats).
- Integrate with the *existing* moderation plumbing (`hide_reason`, the admin queue, appeals) — don't build a parallel system.
- Be **cheap to update** (edit a rubric, not retrain a model) and **auditable** (every verdict stored with its policy version + rationale).

**Non-goals (v1)**
- Not a general toxicity/profanity filter. We target threats/incitement/doxxing, not rudeness or "uncivil" political speech.
- No unilateral *deletion* — auto-hide is reversible; permanent removal stays a human decision.
- No account-level bans from this signal alone (suspension stays a separate admin action).
- Not real-time-blocking the author's submit (runs async; see §7).

## 2. Principles & guardrails (these constrain every design choice)

1. **Protect political speech.** CivicView is a non-partisan civic platform; heated criticism, hyperbole, satire, and calls to *lawful* action ("vote them out", "flood their office with calls") are **not** violations. The rubric biases toward `none` on ambiguity.
2. **Flag, don't delete.** The algorithm sets a *reversible* hidden state and/or queues for review. It never hard-deletes. Matches Jeffrey's rule: "I should only delete polls if someone reports it or if it consists of a threat" — and even then, review-first.
3. **Human in the loop.** Auto-hide is a safety brake for the worst cases; everything else waits for review. Appeals (existing system) are the backstop for mistakes.
4. **Viewpoint-neutral.** The rubric and eval set must be tested on left- and right-coded examples to avoid partisan skew.
5. **Fail open.** If the AI is unconfigured, rate-limited, or over the daily spend cap, content publishes normally and is queued for later re-check — AI availability never blocks civic participation.
6. **Auditable + reversible.** Every verdict is stored (category, severity, rationale, model, policy version). Overturned verdicts feed threshold tuning.

## 3. How it works (pipeline)

```
author submits post/poll/comment
        │
        ▼
 (optional) cheap lexicon pre-filter ──clean & short──▶ publish, no LLM call
        │ (anything not obviously clean)
        ▼
 background task: moderation_service.assess()
        │   → ai_service.chat(rubric + content)  →  JSON verdict
        ▼
 parse {category, severity, rationale, span}  →  store ContentModerationVerdict
        │
        ▼
 decision matrix (§5)
   ├─ publish    → no change (content already visible)
   ├─ flag       → add to admin moderation queue (content stays visible)
   └─ auto_hide  → set hide_reason='threat_hidden' + queue + alert
        │
        ▼
 author sees it under "Hidden by moderation" → can appeal (existing flow)
```

LLM-based classification (approach (c) from our discussion) is chosen over keyword rules (brittle, evadable) and a trained classifier (hard to update) because it handles nuance and is updated by editing text. We reuse `ai_service.chat()` (lazy client, daily spend cap, graceful 429/5xx handling).

## 4. Categories & severity rubric (draft)

The model returns one **primary category**, a **severity 0.0–1.0**, a short **rationale**, and the **offending span** (for the review UI). Draft categories:

| Category | Definition (what it IS) | What it is NOT (→ `none`) |
| --- | --- | --- |
| `credible_threat` | A serious expression of intent to harm a specific person or identifiable group ("true threat"). | Hyperbole, venting, fiction, "I could kill for a coffee", lawful warnings. |
| `incitement` | Urging *imminent* lawless/violent action that is likely to occur (Brandenburg-style). | Advocacy of lawful protest, civil disobedience debate, "vote them out", policy anger. |
| `doxxing` | Publishing private identifying info (home address, personal phone, workplace) to enable harassment. | A public official's public office contact info; already-public bio facts. |
| `targeted_harassment` | Sustained abuse/threats aimed at a specific private individual. | Sharp criticism of public figures' public conduct. |
| `violent_extremism` | Promoting/glorifying terrorism or violent extremist orgs or attacks. | Discussing, condemning, or reporting on extremism. |
| `self_harm` | Content expressing intent to self-harm. | Handled with care (resources, not punishment) — see §5. |
| `none` | Everything else, including all protected political speech. | — |

**Rubric prompt (draft, lives in config — see §8):** the system prompt gives Claude the definitions above plus explicit instructions: bias toward `none` for political speech, hyperbole, satire, and **quoting/reporting** a threat (e.g., news, "he said he'd…"); require *specificity + seriousness* for `credible_threat`; require *imminence + likelihood* for `incitement`; output strict JSON. Low temperature for consistency.

## 5. Decision matrix (thresholds — all configurable)

| Condition | Decision | Effect |
| --- | --- | --- |
| `category == none` OR `severity < 0.40` | **publish** | No change; verdict stored for audit only. |
| `0.40 ≤ severity < 0.75` (any harmful category) | **flag** | Stays visible; enters admin queue for review. |
| `severity ≥ 0.75` AND category ∈ {`credible_threat`, `doxxing`, `violent_extremism`} | **auto_hide** | `hide_reason='threat_hidden'`; queue; alert; author can appeal. |
| `incitement` at any severity | **flag** (not auto-hide) | Highest legal bar — always human-reviewed, never auto-hidden in v1. |
| `self_harm` | **resources** | Never punitive. Surface support resources to the author; optional low-priority review. Not hidden. |

Doxxing is auto-hidden aggressively even at moderate severity (privacy harm is immediate and concrete). Thresholds start **conservative** (favor `flag` over `auto_hide`) and tighten only with eval + appeal data.

## 6. Data model

**New table — `ContentModerationVerdict`** (audit trail; one row per assessment):

| Field | Type | Notes |
| --- | --- | --- |
| `id` | int PK | |
| `content_type` | str(16) | `post` \| `poll` \| `post_comment` \| `poll_comment` |
| `content_id` | int | FK-by-convention to the target row |
| `author_kind` / `author_id` | str / int | denormalized for queue filtering + repeat-offender signals |
| `category` | str(32) | from §4 |
| `severity` | float | 0.0–1.0 |
| `decision` | str(16) | `publish` \| `flag` \| `auto_hide` \| `skipped` |
| `rationale` | text | model's short reason (shown to reviewer, never auto-shown to author) |
| `offending_span` | text \| null | quoted span for the review UI |
| `model` | str(64) | e.g. `claude-haiku-…` |
| `policy_version` | str(16) | which rubric/threshold set produced this (rollback + audit) |
| `created_at` | datetime | |

**Reuse (no new fields needed on content tables):**
- `hide_reason` — add one new value `'threat_hidden'` (distinct from report-driven `'auto_hidden'` and `'admin_hidden'`). The "Hidden by moderation" author surface already filters on `hide_reason IS NOT NULL`, so threat-hidden content shows there automatically.
- `body_at_delete` — already retained for moderation review.
- **Appeals** — `Appeal` already covers hidden content; threat-hidden items are appealable with no change.
- **Admin queue** — extend the existing reports queue to also surface `flag`/`auto_hide` verdicts not yet actioned (a `reviewed_at`-style marker on the verdict, or join against admin action). Reviewer sees report-driven and verdict-driven items in one place.

## 7. Flag → queue → appeal flow (integrates existing systems)

1. **Create** (post/poll/comment) → endpoint enqueues `bg_tasks.add_task(moderation_service.assess, …)` (we already use `BackgroundTasks`). Author isn't blocked.
2. **Assess** → verdict stored; decision applied (`auto_hide` sets `hide_reason='threat_hidden'`).
3. **Queue** → `flag`/`auto_hide` verdicts appear in the admin moderation queue alongside reports.
4. **Review** (Jeffrey/admin) → confirm-hide, unhide (`hide_reason=None`), or escalate to suspend. Recorded.
5. **Appeal** → author appeals via the existing flow; overturns feed threshold tuning (§10).
6. **Re-check on edit** → editing flagged content re-runs assessment (the model notes `edited_at` exists for this reason).

## 8. Service & config design

- **`app/services/moderation_service.py`** — `assess(content_type, content_id, text, author_kind, author_id) -> Verdict`. Builds the rubric messages, calls `ai_service.chat()`, parses strict JSON (with a defensive fallback to `skipped` on unparseable output), writes the verdict, applies the decision. Pure + unit-testable with a stubbed `chat`.
- **Hook points** — `create_post`, the comment create endpoints, and standalone-poll create. Async background task; never in the request's critical path.
- **Graceful degradation** — `ai_service.is_configured()` false / 429 / spend-cap → write `decision='skipped'`, publish, optionally enqueue for later batch re-check.
- **Config (`moderation_policy.py` or a DB row)** — the rubric text, category list, and thresholds live here behind a `policy_version`. **Updating = editing this file/row + bumping the version.** No retrain, no model redeploy. Optionally hot-editable from an admin screen later.

## 9. Accuracy & evaluation

- **Build a labeled eval set** (~200–400 examples): real-ish threats/doxxing/incitement **plus hard negatives** — political hyperbole, satire, lawful-protest language, both left- and right-coded. This is the single most important artifact; the rubric is only as trustworthy as the set it's measured on.
- **Metrics:** precision/recall **per category**; tune for **high recall on `credible_threat` + `doxxing`** (don't miss real harm), accepting lower precision since humans review. Track **appeal-overturn rate** as the live false-positive signal, plus flag rate, auto-hide rate, and review latency.
- **Regression:** re-run the eval set on every rubric/threshold change before shipping it.
- Honest expectation: strong on explicit cases, weaker in the political gray zone — which is exactly why v1 is flag-first with human review and appeals.

## 10. Cost

One LLM call per non-trivial submission. Use a **cheap/fast model** (Haiku-class) and the optional lexicon pre-filter to skip obviously-clean short content. The `ai_service` daily spend cap already protects against runaway cost. This is the workload that makes **Task #91 (AI Gateway)** worth revisiting for per-call cost dashboards + failover.

## 11. Rollout (phased)

- **Phase 0 — Shadow mode:** run assessments, store verdicts, **take no action**. Measure against the eval set *and* real traffic; tune the rubric/thresholds. (De-risks false positives before anything is hidden.)
- **Phase 1 — Flag-to-queue:** verdicts populate the admin queue; still no auto-hide. Human reviews everything.
- **Phase 2 — Auto-hide (narrow):** enable `auto_hide` for `doxxing` + `credible_threat` only, at conservative thresholds.
- **Phase 3 — Tune:** adjust thresholds from appeal-overturn data; consider widening categories.

## 12. Risks & mitigations

- **Suppressing protected political speech (top risk).** → Shadow mode first; flag-not-delete; conservative thresholds; bias-to-`none` rubric; appeals; viewpoint-balanced eval set.
- **Evasion** (typos, coded language). → LLM handles paraphrase better than keywords; accept some misses; reports remain the second path.
- **Legal exposure** (true-threats / Brandenburg are high bars). → `incitement` never auto-hidden; attorney review of the policy (`LEGAL-REVIEW-ROADMAP.md`).
- **Model nondeterminism.** → low temperature; store rationale + policy version; verdicts are advisory, humans decide.
- **Cost / availability.** → cheap model + pre-filter + spend cap + fail-open.
- **Partisan-bias accusations.** → publish the policy; viewpoint-neutral eval; transparent appeals.

## 13. Resolved decisions (2026-05-28)

1. **Self-harm:** in scope, **non-punitive** — surface support resources to the author; never hidden or penalized.
2. **Which authors:** **uniform** — applies to citizen, rep, and candidate content alike.
3. **Sync vs async:** **async background** for v1. FUTURE (deferred): an optional synchronous *block-on-submit* path for the very worst, highest-confidence cases (e.g. doxxing / explicit credible threats), so the most harmful content never goes live even briefly. Not in v1.
4. **Who reviews:** **Jeffrey solo** for now (sole operator). The verdict table + queue are built reviewer-agnostic so a small moderation team can be added later with no schema change.
5. **Launch posture:** ship **Phase 0 (shadow mode) first** — verdicts logged, nothing hidden — then advance through Phases 1–3 as the eval set + real-traffic data justify. Auto-hide stays off until attorney review of the policy is complete.

## 14. Out of scope / future

Image/media moderation; multi-language; repeat-offender escalation to auto-suspend; embeddings-based near-duplicate threat detection; user-facing "why was this flagged" explanations.
