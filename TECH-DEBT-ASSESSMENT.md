# SNACK CRM — Architecture & Tech Debt Assessment

**Date:** 2026-07-13
**Branch:** `clod-refactor`
**Scope:** Full repo — legacy Apps Script CRM (root) and active cloud app (`snack-crm-cloud/`)

---

## 1. What Exists

Two complete, unrelated CRM implementations live in this repo:

| System | Location | Stack | Status |
|---|---|---|---|
| Legacy CRM | repo root (`*.gs`, `WebApp.html`) | Google Apps Script + Spreadsheet as DB | Dormant, superseded |
| Cloud CRM | `snack-crm-cloud/` | Firebase Hosting + Cloud Run (Express) + Firestore | Live at snack-crm.web.app |

The cloud app began as a "hello world" plumbing test (README still says so) and grew through 116 commits into a full CRM: referrals, clients, scheduling, tasks, activity logs, grants/fundraising, outreach, referral network, KPI dashboards, public self-booking, CSV imports, and admin data tools.

### Current size of the cloud app

| File | Lines | Size | Contents |
|---|---|---|---|
| `frontend/public/app.js` | 16,273 | 692 KB | Entire frontend: 799 functions, one file, no modules |
| `frontend/public/styles.css` | 8,153 | 187 KB | All styling, incl. 496 `scheduling-v2` selectors on top of v1 styles |
| `backend/server.js` | 4,107 | 145 KB | Entire API: 63 routes, all inline handlers |
| `frontend/public/index.html` | 2,489 | 132 KB | All panels/modals as static markup |

No framework, no bundler, no linter, no formatter, no types, no CI. Deploys are manual `gcloud` / `firebase` commands.

---

## 2. Why Bugs Now Outpace Progress — Root Causes, Ranked

### 2.1 Manual render wiring in a single-file frontend (highest impact)

There is no reactivity. Every `loadX()` function must remember to call the correct subset of ~100 render functions, and every save/delete handler must remember which loads to re-trigger. Example — `loadClients()` (app.js:14848) calls eight render functions, including `renderActiveAdminComputedViews()` **twice** (lines 14869 and 14874). That duplicate is the tell: the dependency graph is no longer known, so calls get added defensively.

Consequence: every new feature adds wiring points to existing flows. Miss one → stale-UI bug in a module you didn't touch. This is the direct mechanism behind "each new feature breaks something."

Second-order effect: at 692 KB, `app.js` no longer fits in an AI assistant's context window. Codex is editing a file it can only partially see, so it re-implements helpers that already exist, misses wiring points, and introduces regressions. **The file size itself is now degrading the quality of AI-assisted changes.**

### 2.2 Two UI generations running side by side in the same file

- Scheduling **v1** (`renderSchedulingTodayBoard`, `renderSchedulingCalendar`, `renderSchedulingColumn`, `renderSchedulingCard`) and scheduling **v2** (~90 `*SchedulingV2*` functions, roughly lines 7,100–9,800) both live in `app.js`, toggled by `let activeSchedulingDesign = "v2"` (app.js:848).
- Both versions share the same global state variables and CSS file, so a change intended for v2 can silently alter v1 behavior and vice versa. There are ~794 `V2`-pattern references in `app.js` and 496 `scheduling-v2` selectors in `styles.css`.
- The legacy Apps Script app in the repo root is a third, inert copy of CRM logic — harmless at runtime but a real source of confusion for any human or AI reading the repo.

### 2.3 ~76 top-level mutable globals as application state

`selectedClientId`, `editingReferralId`, `completingAppointmentId`, `loadedClients`, `loadedAppointments`, `schedulingV2InlineMode`, … (app.js:784–850). Any of the 799 functions can mutate any of them. Classic failure mode: a background refresh overwrites `loadedX` while a modal is mid-edit, or a `selectedX` id survives a view switch and points at stale data. These bugs are timing-dependent and effectively impossible to reproduce reliably — which matches "mysterious bugs" better than any other single cause.

### 2.4 Copy-paste CRUD across 63 inline route handlers

`server.js` repeats the same fetch→validate→write→timestamp→respond pattern per entity (referrals, clients, appointments, tasks, grants, grant questions, outreach events, outreach contacts, referral network, activity logs…). The four CSV import endpoints are ~100 lines each of near-identical logic. A validation fix applied to one entity does not propagate to its siblings, so behavior drifts apart entity by entity.

### 2.5 Hard query caps = future "data loss" bugs

Every list endpoint has a fixed cap and no pagination:

| Endpoint | Cap |
|---|---|
| `/api/clients` | 150 |
| `/api/referrals` | 200 |
| `/api/tasks` | 300 |
| `/api/appointments` | 500 |
| `/api/activity-logs` | 500 |
| appointment-import client lookup | 1,000 |

The day the org passes 150 clients, the oldest clients silently vanish from the UI — no error, no warning. Appointment history will cross 500 within a normal program year. These will present as terrifying "the CRM lost our client" incidents. **This is the most urgent time bomb even though it hasn't detonated yet.**

### 2.6 The frontend test suite punishes refactoring and catches nothing

`backend/test/frontend-contracts.test.mjs` (40 KB) reads the **source code as text** and regex-asserts that element ids, CSS class names, and literal UI strings appear in a given order. These tests:

- **fail** on harmless changes (rename an id, reword a label, reorder markup) — so cleanup work is actively penalized;
- **pass** on real bugs (nothing executes; no behavior is verified).

This inverts the purpose of tests. The pain of "tests break when I improve things, yet bugs still ship" is a predictable outcome of this style.

By contrast, `backend-helpers.test.mjs` (34 KB) contains genuine unit tests over ~80 exported pure helpers. That file is an asset — keep it and grow it.

### 2.7 No guardrails

No ESLint (an undefined variable ships to production and fails at click-time), no Prettier, no CI, no staging environment, no error tracking on the frontend (errors go to `console.error` and disappear). Every bug must be user-discovered in production.

### 2.8 Flat authorization

Any verified `@snackprogram.org` Google account has full power: read everything, delete records, export every collection (`/api/admin/export/...`). Roles were flagged as "future work" in DEPLOYMENT.md but never built, and the app now stores child health-adjacent data (HRSN screeners, feedback forms, DOB, addresses). Bulk delete is env-gated (`ALLOW_ADMIN_BULK_DELETE=false`) — good — but per-record delete and full export are open to all staff.

### 2.9 Documentation describes an app that no longer exists

`snack-crm-cloud/README.md` still says the app "intentionally does almost nothing." There is no module map, no schema doc, no workflow doc. Every new session with an AI assistant starts blind, which compounds problem 2.1.

---

## 3. What Is Genuinely Good

Credit where due — the failure mode here is structural scale, not competence:

- **Escaping discipline:** 135 `escapeHtml` calls; sampled `innerHTML` render paths escape interpolated data correctly.
- **Auth done properly:** Firebase ID tokens verified server-side via `jose` + JWKS; domain allowlist enforced on the backend, not just the UI.
- **Public booking surface is thoughtful:** rate limiting, field length caps, hashed manage-tokens (`publicManageTokenHash`), reschedule/cancel flows.
- **Storage rules default-deny** with a scoped staff-only match.
- **Real unit tests** exist for backend helpers, and helpers are exported for testability.
- **Consistent naming and readable code style** throughout — the code is verbose but not clever, which makes the coming refactor tractable.
- **Destructive ops are env-gated** and documented.

---

## 4. The Causal Chain (one paragraph)

A file too large for any collaborator — human or AI — to hold in view, plus hand-wired render dependencies, plus 76 shared mutable globals, plus a duplicated v1/v2 UI sharing that state, means every change has invisible blast radius; the string-matching test suite then blocks the safe cleanups while letting real regressions through, and with no linter, CI, or staging, the first detector of any bug is Shannon in production. Progress-per-change falls as surface area grows: that is exactly the "more bugs than progress" curve.

---

## 5. Recommended Remediation Sequence

Ordered so each step de-risks the next. No framework adoption required — native ES modules run in the browser with zero build step.

| # | Action | Why first/next | Effort |
|---|---|---|---|
| 1 | **Commit to scheduling v2; delete v1** (functions, CSS, toggle). Delete or archive the root Apps Script app. Git history preserves everything. | Shrinks the file ~15–20%, removes shared-state crosstalk, halves confusion for AI-assisted edits | S |
| 2 | **Replace frontend string-match tests** with a small set of real API integration tests against the Firestore emulator (create referral → convert → appointment → task). Keep backend-helpers tests. | Must happen before refactoring or every subsequent step "fails" the suite | S–M |
| 3 | **Split `app.js` into ES modules by domain** (`state.js`, `api.js`, `scheduling/`, `clients/`, `referrals/`, `grants/`, …) with an explicit shared-state module instead of file-scope globals. Mechanical moves, no rewrites. | Restores AI-assistability and reviewability; each module fits in context | M–L |
| 4 | **Split `server.js` into Express routers** + one shared CRUD/validation factory for the repeated entity patterns. | Validation fixes propagate; file fits in context | M |
| 5 | **Add ESLint + Prettier + GitHub Actions CI** (lint + tests on push). | Catches undefined-variable class bugs pre-deploy; near-zero ongoing cost | S |
| 6 | **Pagination / windowing strategy** for clients, referrals, appointments before caps are hit. Interim cheap fix: raise caps + add a server-side warning when a query returns exactly the cap. | Defuses the silent data-loss bomb | M |
| 7 | **Roles (admin/staff/viewer) via Firebase custom claims**; gate delete + export to admin. | Required before more real client/child data accumulates | M |
| 8 | **Rewrite README** as a 2-page map: modules, collections, workflows, deploy steps. | Every future AI session starts oriented instead of blind | S |

Steps 1–3 are the refactor that directly attacks the bug rate. Steps 6–7 are the ones with a real-world deadline attached (client #151; data sensitivity).

## 6. Open Questions for Shannon

1. Which specific bugs have hurt most recently? (Map them to the causes above — prediction: stale-view-after-save and edit-modal weirdness dominate.)
2. Is scheduling v2 fully trusted, or are there v1 behaviors still relied on? (Blocks step 1.)
3. Current client count and monthly appointment volume? (Sets the fuse length on the caps in §2.5.)
4. Who besides Shannon has a `@snackprogram.org` login today? (Scopes urgency of roles.)
5. Any Zoho/Setmore import still pending, or is CSV import work done? (Determines whether the 4 import endpoints can be consolidated or frozen.)
