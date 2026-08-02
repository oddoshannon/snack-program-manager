# Test Status

Last updated: August 1, 2026

## Passed

- All 269 backend tests passed after the August 1 Calendar permission repair.
- Lint completed with 0 errors.
- The same 64 pre-existing unused-code warnings remain in retired or partially
  retired files; the Calendar repair introduced no new warning.
- Controlled local fixture verified 35 Operations totals and 5 Financial
  Activity totals.
- Controlled totals included 22 Total Children Served, 25 Program Engagements,
  and $2,050 Total Revenue.
- All six reversible mutation scenarios passed: sibling results, School totals,
  Kitchen attendance, HRSN approval revenue, gift corrections, and in-kind
  exclusion.
- Recovery drill removed and restored controlled records and reproduced all 40
  expected totals.
- Cleanup restored all 39 pre-test records and left no controlled session active.
- July 31 local browser audit opened every staff submodule, public referral page,
  and native form mode without current console errors or page-level overflow.
- Historical form preview read 18 sources and 1,068 rows without imports.
- Production root and shared navigation were corrected so `/` opens Home.
- Revision `snack-crm-api-00060-kpj` is serving 100% of traffic with the approved
  Calendar ID and automatic sync disabled.
- The production Calendar lifecycle test passed access, create, update, delete,
  and cleanup. The temporary QA event was removed and everyday appointment sync
  remained paused.
- The post-deployment read-only production checks passed.
- The six QuickBooks workbooks passed a no-write structural and visual review.
  The eligible General Ledger expense rows, monthly totals, and class totals all
  reconcile to $56,123.92. Ending cash and balance-sheet totals also reconcile.
  See `docs/QUICKBOOKS-PREVIEW-2026-08-01.md`.

Detailed evidence:

- `docs/FOCUSED-RISK-QA-2026-08-01.md`
- `docs/CONTROLLED-COUNTING-REVENUE-QA-RESULTS-2026-07-29.md`
- `docs/FULL-SYSTEM-WORKFLOW-AUDIT.md`

## Pending

- Controlled appointment create-reschedule-status-cancel Calendar test.
- Admin Data Center collection coverage fix and behavior test. The current
  registry omits `outreachEvents`, `outreachContacts`, `grantQuestions`,
  `staffUsers`, `adminSettings`, and `messages` from the claimed complete backup.
  Eligible Outreach/grant-question QA records in omitted collections are
  unreachable to current Admin cleanup. The test must also prove that protected
  staff accounts and essential configuration can never enter ordinary cleanup.
- Refresh `docs/FULL-SYSTEM-TEST-GUIDE.md` to test the implemented retrospective
  Knowledge Assessment 2026.2 and Questionnaire 2026.1 scoring rules.
- Real Admin, Staff, and Intern account access test.
- Full guided system test in `docs/FULL-SYSTEM-TEST-GUIDE.md`.
- Final production public booking create, reschedule, and cancel pass.
- Real Firebase Storage grant-document upload check after selecting the release
  candidate.
- Remaining English form and public referral review.
- Approval and later testing of the proposed QuickBooks monthly actual-spending
  import. No importer exists and no data was imported during the preview.
- Historical-form match review, duplicate review, and later guarded import.
- Real-data migration preview and production cutover.

## Known Test Constraints

- Calendar automatic sync is disabled.
- MailerLite sending and client reminders are disabled.
- QuickBooks has no Budget vs. Actual report and no AR/AP aging details with data.
- School participant-level attendance is not collected; approved aggregate
  counting rules apply.
- School and Kitchen outcome instruments remain future work.
- Questionnaire and knowledge assessment can receive further refinements during
  the system test, but their current versions are acceptable for testing.
- The original Codex task caused severe memory pressure during Chrome automation.
  Use shorter tasks and avoid a long browser-control session on this Mac.
- The 269-test and lint result above is the current run after the live Calendar
  repair.

## Safe Test Data

Run the local fake-system seed only against the loopback Firestore emulator:

```bash
cd snack-crm-cloud/backend
npm run seed:local-system
```

Use the controlled counting test only with its exact confirmation phrases in
`docs/CONTROLLED-COUNTING-REVENUE-QA.md`. Never point either tool at production.
