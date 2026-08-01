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
audit and the August 1 root-navigation correction. The archived task confirmed
that production `/` opened Home before handoff, and no later deployment occurred
in that task. Treat this as the last confirmed production navigation state.

## Current Stage

The connected application is broadly test-ready, but it is not ready for real
data cutover. The next gates are:

1. Finish the paused live Google Calendar lifecycle test.
2. Review the supplied QuickBooks reports and design a guarded monthly import.
3. Correct and verify the Admin Data Center collection coverage described below.
4. Refresh the guided test instructions that still describe the retired 2026.1
   prospective Knowledge Assessment and the earlier unscored questionnaire.
5. Review the remaining English forms and public referral wording.
6. Run the guided full-system test with sample data and real access accounts.
7. Fix test findings, preview real-data imports, deploy the verified release,
   back up production, remove only marked QA fixtures, and re-preview each import
   against the cutover destination before writing anything.

Calendar first, QuickBooks preview second, and Data Center repair third is the
approved immediate order. The first two are read-only except for the Calendar
test's temporary private-safe event. No production cleanup or real-data import
may begin until the Data Center repair passes its tests.

The questionnaire and knowledge assessment are "done enough" for the system
test. Further wording or print refinements should be recorded as test findings
instead of delaying the test.

## Production Calendar State

- Calendar name: `Clinic Appts`
- Calendar ID:
  `c_dce512191e2885e00d1d69a36f42333524f01cf84cf4b71ab289bbeae74eff96@group.calendar.google.com`
- Cloud Run service account:
  `1013266498299-compute@developer.gserviceaccount.com`
- Cloud Run revision `snack-crm-api-00058-j8n` deployed successfully and was
  serving 100% of traffic immediately before handoff.
- `GOOGLE_CALENDAR_ID` matched the approved `Clinic Appts` calendar immediately
  before handoff.
- `GOOGLE_CALENDAR_ENABLED=false` immediately before handoff; automatic
  appointment sync is paused.
- No later deployment occurred in the archived task. Run a fresh read-only
  configuration check before the lifecycle test.
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

Confirmed General Ledger structure:

- Cash basis.
- Report header: January-December 2026.
- Transactions through July 31, 2026.
- One worksheet with used range `A1:J458`.
- 413 transaction rows.
- No class or location column.

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

### Confirmed Data Center coverage gap

The August 1 handoff audit found that `backend/lib/core.js` registers 21
collections in `adminDataCollections`, but the application also uses collections
that are absent from that registry. The Download Complete Backup action therefore
does not currently include `outreachEvents`, `outreachContacts`, `grantQuestions`,
`staffUsers`, `adminSettings`, or `messages`.

The full-system seed creates QA records in the first five of those omitted
collections. The Outreach and grant-question fixture IDs satisfy the Admin
cleanup ID rule but are unreachable because their collections are absent. The
seeded staff and Admin-settings records use protected, non-QA-prefixed document
IDs and are intentionally handled by the local seed reset rather than the Admin
cleanup rule. Protected staff accounts and Admin/configuration fixture records
must stay outside ordinary production bulk cleanup. They remain local-reset-only
or require a separate explicit manual procedure. No cleanup path may remove the
protected director account or essential production configuration.

Treat the Data Center's earlier "complete backup" status as false and its cleanup
coverage as incomplete. Correct the backup registry, preserve the protected
scope above, and add a behavior test comparing application, backup, cleanup, and
fixture collection lists before any production cleanup or real-data cutover.

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

Some references below are evidence from an earlier stage, not current status:

- `FULL-SYSTEM-TEST-GUIDE.md` still expects the prospective 2026.1 Knowledge
  Assessment and says current questionnaire scoring is excluded. The repository
  now implements retrospective Knowledge Assessment 2026.2 and Questionnaire
  2026.1 scoring; update those test rows before the guided test.
- `CLINIC-QUESTIONNAIRE-MAPPING-DRAFT-2026-07-29.md` says the approved redesigns
  and scoring were not implemented. That status was superseded by the current
  code, README, and `PRODUCT-DECISIONS.md`.
- `OPERATIONS-KPI-DECISION-GUIDE.md` contains recommendations and older decisions,
  including the superseded prospective Knowledge Assessment rule. Do not treat
  unanswered items as approved.
- `FULL-SYSTEM-WORKFLOW-AUDIT.md` and the root readiness documents call the Admin
  backup complete, which the current collection registry disproves. The workflow
  audit also retains a pending real Firebase Storage upload check.
- `CLEAN-MODULE-GAP-AUDIT.md` is explicitly historical.

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
