# SNACK Program Manager Project State

Last updated: August 1, 2026

This file is the durable starting point for future Codex tasks. Read it with
`AGENTS.md`, `README.md`, and `docs/NEXT-SESSION.md` before changing the app.

## Active System

- Application: `snack-crm-cloud/`
- Production staff site: `https://snack-crm.web.app`
- Production API: Cloud Run service `snack-crm-api` in `us-central1`
- Database: Firestore project `snack-crm`
- Staff authentication: Google accounts in `@snackprogram.org`
- Retired code: root `.gs`, `WebApp.html`, older `app.js`, older `styles.css`,
  and the old single-page interface are references only.
- Clean staff interface: `frontend/public/*.html`, `clean.js`, `clean.css`, and
  feature modules under `frontend/public/modules/`.

The production root now opens the compact Home dashboard. The logo returns to
Home from each clean module. Production was deployed after the July 31 browser
audit and the August 1 root-navigation correction.

## Current Stage

The connected application is broadly test-ready, but it is not ready for real
data cutover. The next gates are:

1. Finish the paused live Google Calendar lifecycle test.
2. Review the supplied QuickBooks reports and design a guarded monthly import.
3. Review the remaining English forms and public referral wording.
4. Run the guided full-system test with sample data and real access accounts.
5. Fix test findings, back up production, remove only marked QA fixtures, and
   preview real-data imports before writing anything.

The questionnaire and knowledge assessment are "done enough" for the system
test. Further wording or print refinements should be recorded as test findings
instead of delaying the test.

## Production Calendar State

- Calendar name: `Clinic Appts`
- Calendar ID:
  `c_dce512191e2885e00d1d69a36f42333524f01cf84cf4b71ab289bbeae74eff96@group.calendar.google.com`
- Cloud Run service account:
  `1013266498299-compute@developer.gserviceaccount.com`
- Live Cloud Run revision configured on August 1:
  `snack-crm-api-00058-j8n`
- `GOOGLE_CALENDAR_ID` is present on the live service.
- `GOOGLE_CALENDAR_ENABLED=false`; automatic appointment sync is paused.
- The service account has been shared on the calendar and Google Workspace
  external sharing was adjusted by Shannon.
- The protected lifecycle test has not run successfully against production.
- No temporary calendar event was created during the interrupted test.
- Do not enable automatic sync until create, update, and delete all pass and a
  controlled sample appointment passes create, reschedule, status, and cancel.

## Financial Source State

Finances > Financial Activity is the revenue source of truth. Operations reads
dated source records and calculates totals; it must not become a second manual
entry location.

QuickBooks exports are under the repository root at `Quickbooks Reports/`.
WOCPLC is SNACK's legal name, so that name on the reports is expected.

Available exports:

- Statement of Financial Position
- Statement of Activity by Class
- Statement of Cash Flows
- General Ledger
- Account List
- Statement of Activity by Month

Known unavailable reports:

- Budget vs. Actual does not exist in QuickBooks.
- Accounts Receivable Aging Detail contained no data.
- Accounts Payable Aging Detail contained no data.

Do not invent budget values or aging balances. Build the import preview around
the reports that actually exist and label unavailable calculations clearly.

## Data And Migration State

- Historical form preview inspected 18 sources and 1,068 rows without writing
  to Firestore.
- Exact client matches: 106.
- Strong matches requiring review: 4.
- Other identifiable rows requiring person review: 239.
- Anonymous aggregate-only rows: 719.
- Possible duplicate-export rows: 38.
- Do not guess links for anonymous or ambiguous records.
- Real historical imports wait until sample data is cleared and the real CRM
  data is imported in one controlled cutover.

## Repository Safety

The worktree contains a large amount of intentional, uncommitted application
work. Never reset, clean, restore, or overwrite it. Read changes carefully and
work with them. Stage only files that belong to the current task.

Before finishing application changes, run:

```bash
cd snack-crm-cloud/backend
npm test

cd ..
npm run lint
```

## Codex Stability Incident

This original Codex task became unsafe to continue. On August 1, Codex-related
processes consumed roughly 10 GB of memory and macOS terminated WindowServer,
restarting the graphical session. Do not use this retired task for active work.
Prefer short, focused tasks, repository documentation, and direct CLI/API checks
over long Chrome automation sessions. Preserve new decisions in these files.

## Detailed References

- `docs/FULL-SYSTEM-WORKFLOW-AUDIT.md`
- `docs/FULL-SYSTEM-TEST-GUIDE.md`
- `docs/FOCUSED-RISK-QA-2026-08-01.md`
- `docs/CONTROLLED-COUNTING-REVENUE-QA.md`
- `docs/CONTROLLED-COUNTING-REVENUE-QA-RESULTS-2026-07-29.md`
- `docs/CLINIC-QUESTIONNAIRE-MAPPING-DRAFT-2026-07-29.md`
- `docs/HISTORICAL-FORM-MIGRATION-MAP-2026-07-31.md`
- `docs/HISTORICAL-FORM-MIGRATION-PREVIEW-2026-07-31.md`
- `docs/GOOGLE-CALENDAR-CONNECTION-PLAN.md`
- `docs/OPERATIONS-KPI-DECISION-GUIDE.md`
- `docs/CLEAN-MODULE-GAP-AUDIT.md`

