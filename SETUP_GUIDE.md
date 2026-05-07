# CivicView - Setup Guide

## Quick Start

### 1. Start the Backend (Python/FastAPI)

```bash
# Open a terminal and navigate to the backend folder
cd CivicLens/backend

# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload

# You should see: INFO: Uvicorn running on http://127.0.0.1:8000
```

Test it by visiting:
- http://localhost:8000 — Welcome message
- http://localhost:8000/docs — Interactive API docs
- http://localhost:8000/api/congress/members?state=FL — Florida congress members

### 2. Start the Frontend (Next.js/React)

```bash
# Open a SECOND terminal and navigate to the frontend folder
cd CivicLens/frontend

# Install dependencies
npm install

# Run the dev server
npm run dev

# You should see: ▲ Next.js - Local: http://localhost:3000
```

Visit http://localhost:3000 to see CivicView!

### 3. Using the App

- Click any state on the map to see its elected officials
- The app fetches live data from the Congress.gov API when the backend is running
- If the backend isn't running, the frontend gracefully falls back to sample data
- Click any Congress member to see their full profile (bio, committees, bills, votes)
- Use the tabs to switch between Congress, State Legislature, and Elections
- Use the search bar to find members by name

## Testing on Your Phone

By default both servers bind to `localhost`, which the phone can't reach. To
load CivicView on a real phone (same Wi-Fi or via hotspot / Tailscale), do
the following one-time setup:

### 1. Find your computer's local IP

```bash
# macOS
ipconfig getifaddr en0          # use en1 if you're wired in via Ethernet

# Windows (in Command Prompt or PowerShell)
ipconfig
# Look for "IPv4 Address" under your Wi-Fi adapter, e.g. 192.168.1.42

# Linux
hostname -I
```

You'll get something like `192.168.1.42`. Treat that as `LOCAL_IP` in the
steps below.

### 2. Bind the backend to all interfaces

Stop the running uvicorn (Ctrl+C in its terminal), then restart with the
`--host` flag so it listens on every network interface — not just
localhost:

```bash
cd CivicLens/backend
uvicorn app.main:app --reload --host 0.0.0.0
```

### 3. Allow your phone in CORS

In `backend/app/main.py`, find the `app.add_middleware(CORSMiddleware, ...)`
block (around line 53) and add a third entry to `allow_origins`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.42:3000",   # ← your LOCAL_IP
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Without this, the phone's requests will be blocked by CORS even though the
network path works.

### 4. Tell the frontend where the backend lives

In `frontend/.env.local`, set:

```
NEXT_PUBLIC_API_URL=http://192.168.1.42:8000
```

(Replace with your actual `LOCAL_IP`.) The frontend reads this at build time
and falls back to `http://localhost:8000` only when it's missing. Without
this step, the phone would load the page but every API call would try to
hit `localhost:8000` *on the phone itself* and 404.

### 5. Bind the frontend to all interfaces

Stop the Next.js dev server (Ctrl+C), then restart with the `-H` flag:

```bash
cd CivicLens/frontend
npm run dev -- -H 0.0.0.0
```

### 6. Open it on your phone

Make sure the phone is on the same Wi-Fi as the computer, then open the
browser and go to:

```
http://192.168.1.42:3000
```

(With your `LOCAL_IP`.) The app should load and API calls should succeed.

### Troubleshooting

- **Page never loads / connection times out.** The most common culprit is
  **AP isolation** (also called "client isolation") on apartment, hotel,
  coffee-shop, and some home Wi-Fi networks. It blocks devices on the same
  Wi-Fi from talking to each other. Fastest fix: turn on your **phone's
  hotspot**, connect the laptop to it, run `ipconfig` again, and use the
  new IP that appears under the Wi-Fi adapter. The hotspot creates a
  private subnet where AP isolation doesn't apply.
- **Page loads but API calls fail with CORS errors.** Double-check that
  the IP in `NEXT_PUBLIC_API_URL` matches the IP you added to
  `allow_origins` exactly, and that you bounced *both* dev servers after
  the edits. Env file changes don't hot-reload.
- **Page loads but data never appears.** Make sure the backend was
  started with `--host 0.0.0.0`. A backend bound to `127.0.0.1` will only
  accept localhost connections, not your phone.
- **CGNAT IP (e.g. `100.x.x.x`).** If `ipconfig` shows a `100.x.x.x`
  address with a building / ISP DNS suffix, you're behind carrier-grade
  NAT (common in apartment / managed networks). It still works for
  same-Wi-Fi testing as long as AP isolation is off.
- **Tailscale fallback.** If the local-network path is blocked entirely,
  installing Tailscale on both your laptop and phone (signed in to the
  same account) gives each device a stable `100.x.x.x` IP that works
  across networks. Use the laptop's Tailscale IP in place of `LOCAL_IP`
  everywhere above.
- **HTTPS-only browser features stay disabled.** Geolocation, push
  notifications, and the PWA install prompt all require HTTPS — they
  won't work over plain `http://` on a phone. Not a blocker for testing
  layout / interaction, but flag for the PWA polish phase.

### Switching back to desktop-only dev

When you're done with phone testing:

1. Comment out the `NEXT_PUBLIC_API_URL` line in `frontend/.env.local`
   (or delete it). The frontend goes back to the `localhost:8000`
   default.
2. You can leave the extra entry in `allow_origins` — it doesn't hurt
   anything and saves you a step next time.
3. Restart both dev servers without the `--host 0.0.0.0` / `-H 0.0.0.0`
   flags if you want them back to localhost-only (optional — binding to
   `0.0.0.0` is harmless on a trusted network).

## Congress.gov API Key

Your API key is already configured in `backend/.env`. If you ever need a new one:
1. Visit https://api.congress.gov/sign-up/
2. Sign up for a free key
3. Replace the value in `backend/.env`

## Project Structure

```
CivicLens/
├── SETUP_GUIDE.md              ← This file
│
├── backend/                     ← Python / FastAPI
│   ├── requirements.txt         ← Python dependencies
│   ├── .env                     ← API key (not committed to git)
│   ├── .env.example             ← Template for API keys
│   └── app/
│       ├── main.py              ← FastAPI entry point & CORS config
│       ├── routers/
│       │   ├── congress.py      ← Congress API endpoints
│       │   └── states.py        ← State data API endpoints
│       └── services/
│           ├── congress_service.py  ← Congress.gov API + caching + fallback
│           └── states_service.py    ← State legislature & election data
│
└── frontend/                    ← JavaScript / Next.js / React
    ├── package.json             ← JavaScript dependencies
    ├── next.config.js           ← Next.js settings
    ├── tailwind.config.js       ← Tailwind CSS theme
    ├── app/
    │   ├── layout.js            ← Root layout
    │   ├── page.js              ← Home page (map + panel)
    │   └── globals.css          ← Global styles
    ├── components/
    │   ├── Navbar.js            ← Top navigation + search
    │   ├── MapView.js           ← Interactive US map (MapLibre)
    │   ├── SidePanel.js         ← Right panel (list + tabs)
    │   ├── PersonCard.js        ← Politician card component
    │   ├── ProfileView.js       ← Detailed politician profile
    │   └── NotificationBanner.js
    └── lib/
        ├── api.js               ← API client (backend + fallback)
        └── constants.js         ← State codes, party colors
```

## What's Next

Future features to build:
1. Address-based district lookup (enter your address → find your specific representatives)
2. User accounts with Supabase (save followed politicians, notification preferences)
3. Push notifications for new legislation and votes
4. More state legislature data via Open States API
5. Campaign finance data via OpenSecrets API
