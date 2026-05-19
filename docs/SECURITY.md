# CivicView — Security Posture & Setup

How CivicView is hardened against common web threats, what's already done, and what
to verify before launching to real (non-demo) accounts. Companion doc to
`DEPLOY.md` (which covers deployment) and `INCIDENT-RESPONSE.md` (the runbook for
when things go wrong).

**Current state** (May 2026):

- Frontend hosted on Vercel; backend on Render; DNS on Cloudflare (DNS-only mode,
  no proxy).
- HTTPS enforced end-to-end via Vercel's automatic Let's Encrypt + Render's
  managed certs.
- Session cookies are `Secure` + `SameSite=None` in production (see `render.yaml`).
- SQLAlchemy parameterized queries throughout the backend — no raw SQL string
  interpolation anywhere user input touches.
- React auto-escapes all string content rendered into the DOM.
- Pydantic schemas validate every request body at the API boundary.
- Admin-only endpoints gated by `ADMIN_EMAILS` allow-list, not just "any logged-in
  user."

**What's missing and worth adding before real-account launch** is below.

---

## 1. Cloudflare — proxy the API subdomain

The frontend (Vercel) has built-in DDoS protection and edge caching, so Cloudflare
proxy on `civicview.app` itself adds limited value and introduces SSL-provisioning
friction (per `DEPLOY.md` §4 the apex records are intentionally DNS-only). The
**backend** is a different story: `civicview-api.onrender.com` is currently
accessed directly with no WAF, no DDoS protection, and no rate limiting. Putting
the API behind Cloudflare changes that for $0.

**Setup steps:**

1. **In Render** → `civicview-api` → Settings → Custom Domains → Add
   `api.civicview.app`. Render shows you a CNAME target like
   `civicview-api.onrender.com` and waits for DNS verification.

2. **In Cloudflare** → DNS → Records → Add record:
   - Type: `CNAME`
   - Name: `api`
   - Target: `civicview-api.onrender.com`
   - Proxy status: **Proxied (orange cloud)** — this is the key part. Unlike the
     frontend apex (which has to be DNS-only for Vercel SSL), the API subdomain
     can be proxied because Render handles its own backend SSL termination.
   - TTL: Auto

3. **Cloudflare** → SSL/TLS → Overview → set encryption mode to **Full (strict)**.
   This forces Cloudflare → Render to use HTTPS with cert validation, which
   matches what Render serves anyway.

4. **Wait ~5 minutes** for DNS to propagate and Cloudflare to issue an edge cert.
   Verify with `curl -I https://api.civicview.app/` — should return a 200 with
   a `cf-ray` header (proves it's going through Cloudflare).

5. **Cloudflare** → Security → Settings:
   - Security Level: **Medium** (default). Bumps to High during an actual attack.
   - Bot Fight Mode: **On**. Free tier; catches obvious scrapers and credential
     stuffers without affecting real users.
   - Challenge Passage: **30 minutes** (default).
   - Browser Integrity Check: **On**.

6. **Cloudflare** → Security → WAF → Managed Rules:
   - Cloudflare Managed Ruleset: **On** (free tier, blocks OWASP Top 10 patterns
     like SQL injection attempts, XSS payloads in URLs, known-malicious user
     agents).

7. **Cloudflare** → Security → WAF → Rate limiting rules → Create rule.
   The form has six sections; fill them out as follows:

   - **Rule name**: `Admin endpoint protection`
   - **When incoming requests match…**:
     - Field: `URI Path`
     - Operator: `contains`
     - Value: `/api/admin/`
     - (Equivalent if you click "Edit expression":
       `(http.request.uri.path contains "/api/admin/")`)
   - **With the same characteristics…**: leave as `IP` (default) — rate-limits
     per source IP, so one bad actor doesn't lock out other users.
   - **When rate exceeds…** — Cloudflare's free tier ONLY offers a 10-second
     period (the 1-minute / 10-minute / 1-hour options unlock on Pro at
     $20/mo). On free, lower the threshold to compensate:
     - Requests: `5`
     - Period: `10 seconds`
     - Effective cap = 30 req/min per IP, still well above normal admin use
       but well below brute-force speeds.
     - On Pro: Requests `10`, Period `1 minute`.
   - **Then take action…**:
     - Choose action: `Block`
   - **For duration…** — also tier-gated. Free tier = 10 seconds only; Pro
     unlocks 1m / 10m / 1h / 1d. On free, leave at `10 seconds`. On Pro,
     bump to `1 minute` or `10 minutes` for stronger deterrence.

   Click **Deploy**. Test by hammering any `/api/admin/*` endpoint 6 times
   in 10 seconds from one IP — the 6th request should return 429 (from
   Cloudflare, not your backend).

   When to upgrade to Cloudflare Pro: once you see measurable abuse traffic
   in the free-tier dashboard, or after your first real attack incident.
   Until then free is genuinely fine.

   This is your highest-value endpoint to rate-limit; brute-forcing admin auth
   would be the obvious first attack.

8. **Update the frontend** to point at `api.civicview.app` instead of the
   Render-hosted URL:
   - **Vercel** → project → Settings → Environment Variables → edit
     `NEXT_PUBLIC_API_URL`:
     ```
     NEXT_PUBLIC_API_URL=https://api.civicview.app
     ```
   - Trigger a redeploy. Test in incognito: open `https://civicview.app`, verify
     map and rep data populate (means the frontend is hitting the new API URL
     and Cloudflare is forwarding requests correctly).

9. **Update Render's `ALLOWED_ORIGINS`** if you also want to keep
   `civicview-api.onrender.com` working as a backup origin — but for
   defense-in-depth, the cleaner move is to leave it as-is so anyone who finds
   the raw Render URL still gets blocked by CORS when they try to use it from a
   browser.

**Optional upgrade to Cloudflare Pro ($20/mo)** — adds more granular WAF rules,
image optimization, and analytics. Not worth it until you cross ~10K weekly
visitors.

---

## 2. GitHub Security — turn on the free scanning tools

All three are free for public repos and take ~5 minutes total to enable. For
private repos, Dependabot + Secret Scanning are still free; CodeQL costs $49 per
active committer per month under GitHub Advanced Security.

1. **GitHub** → `Jeffreynuez/civiclens` → Settings → **Advanced Security**.
   (Path: `/settings/security_analysis`. GitHub reorganized this from
   "Code security and analysis" sometime in 2024; same features, new
   shell. CodeQL on private repos requires GitHub Advanced Security
   licensing ($49/seat/mo); on public repos everything below is free.)

2. **Dependabot section** — turn on:
   - **Dependabot alerts** — notifies you when a dependency has a known CVE.
   - **Dependabot security updates** — auto-opens PRs that upgrade vulnerable
     dependencies. Just review and merge.
   - **Dependabot malware alerts** — flags dependencies that turn out to be
     outright malicious (typosquats, hijacked packages). Free.
   - **Grouped security updates** — bundles related security PRs into one
     instead of opening a separate PR per package. Cleaner queue.
   - **Dependabot version updates** — controlled by `.github/dependabot.yml`
     in this repo (already committed). Once that file is in the repo,
     GitHub picks it up automatically. The "Configure" button here would
     open an inline YAML editor as a fallback; not needed since the file
     is checked in.

3. **Scroll further down on the same page** to find:
   - **Secret scanning** → Enable. Alerts if an API key (Anthropic,
     Stripe, AWS, etc.) lands in a commit.
   - **Push protection** (sub-toggle of Secret scanning) → Enable.
     Blocks the push at GitHub's edge before secrets ever reach the
     remote. Strongly recommended.
   - **Code scanning** → Set up → CodeQL → choose **Default**
     configuration. Runs static analysis on every PR; catches SQL
     injection patterns, hardcoded credentials, unsafe HTML, common
     vuln patterns. Free on public repos; gated by GitHub Advanced
     Security ($49/seat/mo) on private repos — if grayed out, skip and
     rely on Dependabot + Secret Scanning instead, which are the
     highest-leverage tools anyway.

4. The `.github/dependabot.yml` config is already in the repo (committed
   alongside this doc) and covers Python (backend) + npm (frontend) +
   GitHub Actions on a weekly schedule. No additional setup needed
   after pushing the commit.

5. After enabling, walk through any alerts that fire in the first 24
   hours. Likely candidates: outdated `pydantic`, `sqlalchemy`, `next`,
   `react` — all safe to update with the auto-generated PRs.

---

## 3. Backend hardening — what's done, what to add

**Already in place (verified in the codebase):**

- Cookies are `httpOnly` + `Secure` + `SameSite=None` in production. Source:
  `backend/app/services/auth.py` + `render.yaml`.
- CORS allow-list is explicit (`ALLOWED_ORIGINS` env var), not `*`.
- All ORM queries go through SQLAlchemy — no raw SQL string concatenation that
  could enable injection.
- Session tokens are signed with `SESSION_SECRET` (32+ bytes random).
- Admin endpoints gated by `ADMIN_EMAILS` allow-list, not just authenticated-user
  check.
- Auto-hide moderation threshold on reported content (Phase 2 moderation system).

**Worth adding before real-account launch:**

- **Application-level rate limiting** on login + signup + comment-post endpoints.
  Cloudflare rate limiting (step 1.7 above) catches the `/api/admin/*` path
  cleanly, but per-user rate limiting (e.g. "no more than 3 login attempts per
  hour per email") needs to live in the app. Recommended library:
  `slowapi` (FastAPI wrapper around `limits`). ~20 lines of integration work.
- **CSRF token verification** on state-changing endpoints. Currently CivicView
  relies on `SameSite=None` cookies + CORS origin checking, which is mostly
  sufficient for modern browsers but not bulletproof. Adding a CSRF token (e.g.
  via `fastapi-csrf-protect`) is defense-in-depth, especially for admin actions.
- **Login attempt logging + lockout.** Track failed login attempts per email;
  after 5 failures in 15 minutes, lock the account for 15 minutes. Logs go into
  the database with timestamp + IP for incident review.
- **Content Security Policy headers** on the frontend. Vercel can be configured
  to serve a strict CSP via `next.config.js`. Reduces the blast radius if a
  stored XSS slips through.
- **`X-Frame-Options: DENY`** on backend responses to prevent clickjacking. One
  line in `app/main.py`.
- **2FA on rep / candidate / admin accounts.** Tracked as Task #62 — separate
  work, but listed here as the highest-priority outstanding security item.

---

## 4. Operational posture — what to do every week / month

**Weekly:**
- Skim Dependabot PRs. Merge anything labeled "security" the day it opens. Other
  upgrades can wait until you're free.
- Spot-check the Cloudflare Security dashboard. Look at "Top blocked countries"
  and "Top blocked user agents" to see what's hitting the WAF.
- Glance at Render's "Logs" for any unusual 500 spikes — those are often the
  signal that someone's poking at the app.

**Monthly:**
- Rotate `SESSION_SECRET`. Generate a new value, set it on Render. **Warning:**
  this invalidates every existing session, forcing all users to re-login. Coordinate
  with any active demo sessions.
- Review the admin email allow-list (`ADMIN_EMAILS`). Remove anyone who shouldn't
  be there.
- Verify Postgres backups exist and a recent one can be restored to a fresh DB
  (see `INCIDENT-RESPONSE.md` §5 for the procedure). Automated daily backups
  are active on the current Render paid plan — verify they're actually being
  retained and that a restore actually succeeds at least once per quarter so
  you find any breakage during a calm month, not during an incident.

**Quarterly:**
- Audit env vars in Render → check no stale `RESEND_API_KEY` /
  `GOOGLE_CIVIC_API_KEY` / `ANTHROPIC_API_KEY` are set on accounts no longer in
  use.
- Re-read `INCIDENT-RESPONSE.md` so the procedures are fresh in your head.

**Annually (or on schedule):**
- Penetration test (Task #64 — once user count crosses ~100K). $5-15K, one-time.

---

## 5. What NOT to do (anti-patterns to avoid)

- **Don't put `SESSION_SECRET` or any API key in `render.yaml`** — it's in git.
  `sync: false` means Render expects you to set it in the dashboard. Verify
  every secret marked `sync: false` is actually unset in the YAML.
- **Don't disable `COOKIE_SECURE`** in production "just to test something." If
  it's off, cookies leak in plaintext over any non-HTTPS request.
- **Don't widen `ALLOWED_ORIGINS` to `*`** to "fix" a CORS issue. It's never the
  right fix; debug the real origin mismatch.
- **Don't add new admin users by editing `DEMO_CITIZEN_ACCOUNTS_JSON`** in
  production — that env var seeds at boot and is intended for dev. Add admin
  emails to `ADMIN_EMAILS` and have the user create their own account via the
  normal signup flow.
- **Don't ship to production after disabling CodeQL or Dependabot alerts to
  "clear the noise."** Triage the alert instead.

---

## 6. Reference — related docs

- `DEPLOY.md` — how to deploy from scratch (Vercel + Render + Cloudflare DNS).
- `INCIDENT-RESPONSE.md` — runbook for security incidents.
- `docs/identity-model.pdf` — three-tier auth spec.
- `render.yaml` — backend deployment blueprint, including which env vars need
  to be set in the dashboard.
