# SNACK CRM Cloud

The operations system for the SNACK Program: referrals, clients, appointment scheduling, tasks, activity logging, outreach, fundraising/grants, KPI dashboards, public self-booking, CSV imports, and admin data tools.

- **Production frontend:** https://snack-crm.web.app (Firebase Hosting)
- **Production API:** Cloud Run service `snack-crm-api` (see [DEPLOYMENT.md](DEPLOYMENT.md) for URLs and deploy commands)
- **Database:** Firestore, project `snack-crm`
- **Sign-in:** Firebase Authentication (Google), restricted to `@snackprogram.org` accounts, verified server-side

The Google Apps Script files in the repo root are an earlier, retired version of this CRM and are not part of this app.

## Architecture

```text
Browser (frontend/public, vanilla JS ES modules)
   │  Firebase Auth ID token on every /api call
   ▼
Firebase Hosting ── rewrites /api/** and /health ──► Cloud Run (backend, Express)
                                                        │
                                                        ▼
                                                     Firestore
```

## Repo Map

```text
snack-crm-cloud/
  package.json             Lint/format tooling (eslint, prettier)
  eslint.config.js         Flat config: node globals for backend, browser for frontend
  firebase.json            Hosting config + /api rewrite to Cloud Run
  storage.rules            Firebase Storage rules (staff-only grant documents)
  DEPLOYMENT.md            Live URLs, deploy commands, verification steps

  backend/
    server.js              Thin composition root: express app, middleware, router mounts
    lib/core.js            Config, Firestore setup, auth middleware, all shared helpers
    routes/                One Express router per domain:
      public-booking.js      /api/public/** (no auth, rate-limited, hashed manage tokens)
      messages.js            /api/message
      admin.js               /api/admin/** (data counts, export, bulk delete, settings)
      referrals.js           /api/referrals**
      clients.js             /api/clients**
      appointments.js        /api/appointments**
      tasks.js               /api/tasks**
      activity-logs.js       /api/activity-logs
      grants.js              /api/grants**, grant questions, organization info
      referral-network.js    /api/referral-network**
      outreach.js            /api/outreach-events**, /api/outreach-contacts**
    test/
      backend-helpers.test.mjs     Unit tests for exported helpers and route registration
      frontend-contracts.test.mjs  Source-text contract checks (legacy; being phased out)
      qa-public-booking-api.mjs    Manual QA script against a running server

  frontend/public/
    index.html             App shell: all panels and modals as static markup
    app.js                 Main application module (state, rendering, event wiring)
    modules/format.js      Pure date/time/phone/string helpers (no DOM, no state)
    booking.html/.js       Public self-booking page
    styles.css             All styling
    app-config.js          API base URL per environment
    archive/scheduling-v1.js  Retired "classic" scheduling design (not loaded)
    print-forms/           Printable enrollment/feedback packets (docx/xlsx)
```

## Firestore Collections

`referrals`, `clients`, `appointments`, `tasks`, `activityLogs`, `grants`, `grantQuestions`, `referralNetwork`, `outreachEvents`, `outreachContacts`, `adminSettings` (scheduling settings doc), `messages` (connection check).

All list endpoints page through the full collection with a batched cursor loop (`fetchAllDocuments` in `lib/core.js`) — there are no fixed row caps.

## Local Development

```bash
# Backend (terminal 1)
cd backend
cp .env.example .env      # points at the Firestore emulator
npm install
npm run dev               # http://localhost:8080

# Firestore + Hosting emulators (terminal 2, repo folder snack-crm-cloud/)
firebase emulators:start --only firestore,hosting --project demo-snack-crm
# frontend at http://localhost:5002
```

## Tests and Lint

```bash
cd backend && npm test        # 98 tests (node --test)
cd .. && npm install && npm run lint    # eslint: errors fail CI, warnings tolerated
```

CI (GitHub Actions, `.github/workflows/ci.yml` at repo root) runs both on every push and pull request.

## Deploying

See [DEPLOYMENT.md](DEPLOYMENT.md). Short version:

```bash
# Backend
cd backend
gcloud run deploy snack-crm-api --source . --region us-central1 --project snack-crm \
  --update-env-vars FIREBASE_AUTH_PROJECT_ID=snack-crm,ALLOWED_EMAIL_DOMAIN=snackprogram.org,ALLOW_ADMIN_BULK_DELETE=false

# Frontend
cd ..
firebase deploy --only hosting --project snack-crm
```

## Security Model (current state)

- API requires a verified Firebase ID token from an `@snackprogram.org` Google account (checked in `requireAuth`, `lib/core.js`).
- Public booking endpoints are unauthenticated by design: rate-limited, length-capped fields, and reschedule/cancel guarded by hashed manage tokens.
- Admin bulk delete is disabled unless `ALLOW_ADMIN_BULK_DELETE=true` (keep it `false` in production).
- **There are no roles yet.** Every staff account can view, edit, delete, and export everything. Role-based access (admin/staff/viewer via Firebase custom claims) is the top item on the roadmap before onboarding more staff.

## Refactor Status and Roadmap

A structural refactor started in July 2026 (see [TECH-DEBT-ASSESSMENT.md](../TECH-DEBT-ASSESSMENT.md) at the repo root). Done so far:

1. Scheduling v1 ("classic") archived to `frontend/public/archive/`; the app is v2-only.
2. Silent list caps replaced with full paged reads.
3. Backend split from a 4,700-line `server.js` into `lib/core.js` + 11 domain routers.
4. Frontend modularization started: pure helpers in `modules/format.js`.
5. ESLint + Prettier + CI added.

Next, in rough priority order:

1. **Roles** (admin/staff/viewer) via Firebase custom claims; gate delete and export to admin.
2. **Continue splitting `app.js`** (~18,000 lines) into domain modules — next candidates: API layer (`authedFetch` + load functions), scheduling v2, client/referral profiles.
3. **Delete dead code** — `npm run lint` warnings list ~65 unused functions.
4. **Replace `frontend-contracts.test.mjs`** (regex checks on source text) with API integration tests against the Firestore emulator.
5. **Split `styles.css`** (~8,000 lines) per module once app.js domains exist.

Conventions for new code:

- New frontend helpers go in `frontend/public/modules/` (pure modules must not touch the DOM or app state).
- New API endpoints go in the matching `backend/routes/*.js` file; shared logic goes in `lib/core.js`.
- Run `npm test` (backend) and `npm run lint` (repo folder) before deploying.
