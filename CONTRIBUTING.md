# Contributing to CivicView

How changes get into `civicview.app`. Today CivicView has one developer
(Jeffrey De La Nuez), but the workflow below assumes future contributors
will exist, and the discipline of the workflow protects production even
when the contributor is just future-you returning to the codebase
months later.

---

## The workflow at a glance

```
local change  →  feature branch  →  push to GitHub
                                          │
                                          ▼
                              Vercel auto-builds preview
                                          │
                                          ▼
                              open a Pull Request to main
                                          │
                                          ▼
                              verify + merge the PR
                                          │
                              ┌───────────┴────────────┐
                              ▼                        ▼
                Render redeploys main         Vercel promotes to prod
                              └───────────┬────────────┘
                                          ▼
                                  civicview.app live
```

Direct pushes to `main` are blocked by branch protection rules in
GitHub. Every change must go through a Pull Request, even for the
sole maintainer. This is intentional — it gives you the diff view
before merge, an audit trail of decisions, and a clean revert path
if something breaks.

---

## Step-by-step

### 1. Start from a clean main

```bash
git checkout main
git pull origin main
```

### 2. Create a feature branch

Use a short, descriptive name with a `kind/` prefix:

| Prefix | When to use |
| --- | --- |
| `feat/` | A new feature or surface |
| `fix/` | A bug fix or behavior correction |
| `chore/` | Refactor, dependency bump, mechanical cleanup |
| `docs/` | Documentation only — no code change |

Examples: `feat/save-polls`, `fix/cross-account-tracking`,
`chore/upgrade-fastapi`, `docs/contributing-workflow`.

```bash
git checkout -b feat/save-polls
```

### 3. Make the change locally

Edit code, test locally (see "Local dev" below), commit in logical
chunks with detailed messages. The commit-message convention used
throughout the repo is:

```
<kind>: <one-line subject>

A few paragraphs explaining what changed and why. Include any
context that the diff itself doesn't make obvious — schema
decisions, trade-offs considered, rejected alternatives, etc.

Verification:
- list any local commands you ran to confirm correctness
- e.g., 'sucrase parsed all touched JS files'
- e.g., 'integration test passes 8/8 phases'

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

(The `Co-Authored-By` trailer is appropriate for any commit
authored with Claude's assistance.)

### 4. Push the branch

```bash
git push -u origin feat/save-polls
```

Or in GitHub Desktop: `Publish branch`. The `-u` (upstream) flag is
only needed on the first push; subsequent `git push` calls on the
same branch work without it.

When the push completes, Vercel automatically builds a preview
deployment. Within ~30 seconds to 2 minutes you'll have a URL like
`civicview-git-feat-save-polls-jeffreynuez.vercel.app` (visible in
the Vercel dashboard). This is your branch's frontend running with
the latest code.

**One important note about preview deployments:** the preview
frontend will call the production backend at `api.civicview.app`.
If your change includes backend modifications (new endpoints,
schema migrations, etc.), the preview will fail to exercise those
because the production backend doesn't have them yet. Options:

- **Local end-to-end testing** (recommended for backend changes)
  via the local dev path described below.
- **Manual Render deploy** of the feature branch — switch Render's
  deploy branch to the feature branch temporarily, redeploy, test,
  switch back to `main` before merging.

### 5. Open a Pull Request

```bash
gh pr create  # if you have the GitHub CLI installed
```

Or via the web UI: GitHub will surface a `Compare & pull request`
banner on the repo page right after a fresh push. Click it.

PR description should:
- summarize what changed in a sentence,
- link to any task numbers from the README or HANDOFF,
- mention verification steps you ran locally.

### 6. Verify the PR

Before clicking Merge:
- Read the diff one more time. Anything surprising?
- Open the Vercel preview URL and click around the surfaces you
  changed.
- If you added a backend test, confirm it passes locally:
  ```bash
  cd backend
  python3 tests/test_tracked_cross_account.py
  ```
- For any new feature, verify the cross-account / multi-identity
  scenarios still hold. Cross-tenant data leaks are a class of bug
  that the App Store reviewers will hammer; catching them in PR is
  cheaper than catching them in review.

### 7. Merge the PR

GitHub UI → `Merge pull request` → `Confirm merge`.

Then click `Delete branch` on the green confirmation banner — the
branch is preserved in git history regardless of whether the named
pointer still exists, and removing it keeps the branch list tidy.

### 8. Watch the deploys

- **Vercel** (frontend) — ~30 seconds to 2 minutes. Watch the
  dashboard; the new commit hash on `main` will show "Building"
  then "Ready".
- **Render** (backend) — ~3 to 5 minutes. Watch the "Events" tab.
  If `init_db()` auto-migrate runs, the log will show table
  creation; check it for any errors.

When both pipelines complete, hard-refresh `civicview.app`
(Ctrl+Shift+R / Cmd+Shift+R) to drop your browser's cached
JavaScript and pick up the new build.

### 9. Verify production

Run through the change once on the live site. If something looks
wrong:

```bash
# On GitHub.com, navigate to the merged PR.
# There's a "Revert" button that opens a new PR un-doing the merge.
```

Revert PRs follow the same workflow as feature PRs — open, review,
merge. Production rolls back to the previous state within a deploy
cycle.

---

## Local dev

```bash
# Backend (FastAPI on uvicorn)
cd backend
python3 -m venv venv  # first time only
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (Next.js)
cd frontend
npm install  # first time only
npm run dev
```

The frontend will run at `http://localhost:3000` and talk to the
local backend at `http://localhost:8000`. For phone testing on a
real device, see `SETUP_GUIDE.md`.

---

## Running tests

There's no full test suite yet. The integration test guard for the
cross-account tracked-items fix runs as a standalone script:

```bash
cd backend
python3 tests/test_tracked_cross_account.py
```

Exit code 0 means all assertions passed. Future tests should follow
the same pattern (standalone Python scripts under `backend/tests/`)
until a real CI pipeline is added — at which point pytest or similar
is the right move.

---

## Branch protection rules currently in effect

The `main` branch has the following protections (managed in GitHub
Settings → Branches → branch ruleset `protect-main`):

- Pull request required before merging — 0 required approvals (sole
  maintainer can self-merge)
- Conversation resolution required before merging
- Block force pushes
- Block deletion
- No bypass list — rules apply to all contributors including
  administrators

If you need to change these (e.g., add required approvals once
a second contributor joins), edit the ruleset in GitHub Settings.

---

## When NOT to follow this workflow

There is essentially no case where the workflow should be bypassed
for the live `main` branch. Even for a one-character typo fix in a
README, the PR flow takes < 2 minutes and gives you a clean audit
trail.

The only legitimate workaround is local-only branches that never
get pushed — useful for experiments you're going to throw away.

---

## See also

- [`README.md`](./README.md) — what the project is + architecture
- [`docs/HANDOFF_TO_NEXT_SESSION.md`](./docs/HANDOFF_TO_NEXT_SESSION.md) — cross-session continuity notes
- [`docs/SECURITY.md`](./docs/SECURITY.md) — security posture + env-var setup
- [`docs/INCIDENT-RESPONSE.md`](./docs/INCIDENT-RESPONSE.md) — runbook for production incidents
- [`docs/LEGAL-REVIEW-ROADMAP.md`](./docs/LEGAL-REVIEW-ROADMAP.md) — when + how to engage outside counsel
