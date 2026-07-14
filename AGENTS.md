# SNACK CRM — Agent Instructions

Read this before making any change. It reflects a structural refactor completed July 2026 on the `clod-refactor` branch (details in `TECH-DEBT-ASSESSMENT.md` and `snack-crm-cloud/README.md`).

## What this repo is

The active app is **`snack-crm-cloud/`** — a Firebase Hosting + Cloud Run (Express) + Firestore CRM for the SNACK Program. The `.gs` / `WebApp.html` files in the repo root are a **retired** Google Apps Script version: never edit or extend them.

## Structure (do not fight it)

```text
snack-crm-cloud/
  backend/
    server.js         Composition root ONLY (app setup, router mounts). Do not add routes or helpers here.
    lib/core.js       Config, Firestore collections, requireAuth, all shared helpers. Exported names; server.js re-exports for tests.
    routes/*.js       One Express router per domain (referrals, clients, appointments, tasks, grants,
                      outreach, referral-network, activity-logs, admin, public-booking, messages).
  frontend/public/
    app.js            Main app module (large; being split — help shrink it, never grow it needlessly).
    modules/format.js Pure date/time/phone/string helpers. Pure modules must not touch the DOM or app state.
    archive/          Retired scheduling v1 design. NOT loaded by the app. Never import, load, or edit it.
```

## Hard rules

1. **New API endpoints** go in the matching `backend/routes/<domain>.js`. Shared logic goes in `lib/core.js` and is added to its export list.
2. **Never add `.limit(n)` caps to list reads.** Use `fetchAllDocuments(query)` from `lib/core.js` — fixed caps silently hide records and previously looked like data loss.
3. **New frontend helpers** that are pure (no DOM, no app state) go in `frontend/public/modules/` and are imported by `app.js`. When you touch a feature area in `app.js`, prefer extracting its helpers over adding more inline code.
4. **Scheduling UI is v2 only.** There is no design toggle. Do not resurrect anything from `archive/`.
5. **Interpolated HTML must go through `escapeHtml`** (from `modules/format.js`) exactly as existing render functions do.
6. **Tests:** run `cd snack-crm-cloud/backend && npm test` (98 tests must pass) before finishing any change. Add unit tests for new backend helpers in `test/backend-helpers.test.mjs`.
7. **Do not add new regex-on-source-text assertions** to `test/frontend-contracts.test.mjs`. That style blocks refactoring without catching bugs and is being phased out.
8. **Lint:** run `cd snack-crm-cloud && npm run lint`. Zero errors required; do not introduce new warnings. The existing ~65 warnings are dead functions queued for deletion.
9. **Auth:** all `/api/**` routes except `/api/public/**` must use `requireAuth`. Public booking endpoints stay rate-limited and manage-token-guarded.
10. Keep the existing code style: verbose, explicit, `camelCase`, double quotes, no clever abstractions. Match `.prettierrc.json`.

## Roadmap priorities (in order)

1. Role-based access (admin/staff/viewer) via Firebase custom claims; gate delete/export to admin.
2. Continue splitting `app.js` into domain modules (API layer, scheduling v2, profiles).
3. Delete the dead functions flagged by lint warnings.
4. Replace `frontend-contracts.test.mjs` with Firestore-emulator integration tests.
5. Split `styles.css` per module once app.js domains exist.
