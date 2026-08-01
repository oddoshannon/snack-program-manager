# Test Status

Last updated: August 1, 2026

## Passed

- All 268 backend tests passed in the August 1 focused-risk run.
- Lint completed with 0 errors.
- The same 64 pre-existing unused-code warnings remain in retired or partially
  retired files; the focused-risk pass introduced no new warning.
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
- The archived task confirmed revision `snack-crm-api-00058-j8n` was serving 100%
  of traffic with the approved Calendar ID and automatic sync disabled
  immediately before handoff; no later deployment occurred in that task.

Detailed evidence:

- `docs/FOCUSED-RISK-QA-2026-08-01.md`
- `docs/CONTROLLED-COUNTING-REVENUE-QA-RESULTS-2026-07-29.md`
- `docs/FULL-SYSTEM-WORKFLOW-AUDIT.md`

## Pending

- Live Google Calendar create-update-delete lifecycle test.
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
- QuickBooks import preview and reconciliation.
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
- The 268-test and lint result above is the last recorded focused-risk run, not
  a new run performed during the read-only handoff audit.

## Safe Test Data

Run the local fake-system seed only against the loopback Firestore emulator:

```bash
cd snack-crm-cloud/backend
npm run seed:local-system
```

Use the controlled counting test only with its exact confirmation phrases in
`docs/CONTROLLED-COUNTING-REVENUE-QA.md`. Never point either tool at production.
