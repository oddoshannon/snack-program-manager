# Test Status

Last updated: August 11, 2026

## Passed

- The August 11 release passes 350 automated tests. New behavior coverage
  includes the isolated four-module training sandbox, Volunteer version 1,
  bilingual message Drafts, approved one-week unanswered-contact tasks,
  sequential form-packet loading, and the aggregate-only weekly performance
  email preview. Lint has 0 errors and only 62 older warnings in retired
  `frontend/public/app.js`; changed files introduce no warning. Cloud Run
  revision `snack-crm-api-00099-xlj` serves 100% of traffic, and the read-only
  production QA passed after deployment.
- A real headless-browser check opened `/sandbox.html`, confirmed two fictional
  Schedule records, switched to CRM, created a third fictional CRM record, and
  verified the full desktop layout. No API or production write was available.
- The six-page volunteer guide was privacy-scrubbed and every rendered page was
  visually inspected after correcting the bullet layout. No clipping,
  overlap, or broken page was found.
- The production reconciliation verified a 1,245-document private backup before
  creating 21 clients, four referrals, and 69 Clinic appointment documents
  representing 71 Setmore rows. It made no deletions and retained every
  ambiguous row for review.

- The August 8 print, referral, grant-tab, and appointment-note release passed
  all 322 automated checks. Lint has 0 errors and the same 62 older warnings;
  the files changed in this pass have no warnings. Cloud Run revision
  `snack-crm-api-00081-ltw` serves 100% of traffic. Its no-traffic test address
  passed health, public-page, unsigned protected-API, blocked-origin, and
  security-header checks before production traffic moved. Live checks then
  confirmed the printable three-child referral, `Call Us`, checkbox Print
  Center, duplex document logic, new-grant tab panels, and interpreter field.
- Stage 2 hosting cutover passed all 320 automated checks and lint has 0 errors
  with the same 62 older warnings. Cloud Run revision
  `snack-crm-api-00081-ltw` now serves the pages and API at
  `https://hub.snackprogram.org`.
- The final hub address passed its managed certificate, Home, health, public
  booking, referral, booking settings, fake management-link rejection,
  unsigned CRM rejection, approved-origin, blocked-origin, and security-header
  checks. Admin Google Workspace sign-in and protected CRM client access also
  passed.
- The Storage bucket now accepts signed-in grant-file browser reads only from
  the hub and keeps Public Access Prevention enforced. Firebase Hosting is
  disabled; the old `web.app` address returns 404 while the hub remains healthy.

- All 297 backend tests passed after the local Home, Schedule Forms, referral
  task, Enrollment-form task, connection-failure task, and Marketing grouping
  pass.
- That 297-test pass is live on Cloud Run revision
  `snack-crm-api-00070-7f2` with matching Hosting files. A short signed-in
  read-only check confirmed Home Workflow, Schedule Forms, and Marketing contact
  groups without changing a production record.
- All 291 backend tests passed after the August 5 production workflow release.
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
- Revision `snack-crm-api-00070-7f2` is serving 100% of traffic with the approved
  Calendar ID and automatic sync disabled.
- The production Calendar lifecycle test passed access, create, update, delete,
  and cleanup. The temporary QA event was removed and everyday appointment sync
  remained paused.
- The post-deployment read-only production checks passed.
- The six QuickBooks workbooks passed a no-write structural and visual review.
  The eligible General Ledger expense rows, monthly totals, and class totals all
  reconcile to $56,123.92. Ending cash and balance-sheet totals also reconcile.
  See `docs/QUICKBOOKS-PREVIEW-2026-08-01.md`.
- All six 2025 QuickBooks workbooks also passed a no-write structural and visual
  review. The class and monthly reports reconcile to $167,550.62 revenue,
  $102,876.94 expenditures, and $64,673.68 net revenue. Payroll is $69,074.31.
  A private seven-sheet classification workbook was created; no source workbook
  was changed and no data was imported.
- The Data Center coverage test proves that all 28 application collections are
  backed up, all full-system fixture collections are known, eligible Outreach
  and grant-question fixtures are reachable, and staff/configuration collections
  cannot enter ordinary cleanup.
- The full-system guide and future sample-data recipe now use retrospective
  Knowledge Assessment 2026.2. No cleanup was run and no sample data was removed.
- New checks cover Manager's Grants/Giving limits, editable CRM statuses and Age
  Limit, protected staff-account removal, the Finances address, active 1-4
  feedback forms with preserved older 0-5 responses, and HRSN 2026.2.
- The server and Hosting releases completed successfully. Production serves
  revision `snack-crm-api-00070-7f2`, shared interface version
  `20260805-home-workflow1`, and form version `20260805-appointment-link1`.
- A short signed-in production review passed for Schedule settings, Manager
  access, protected staff-account removal controls, CRM statuses, Finances,
  Child Feedback, Caregiver Feedback, and HRSN in client, staff, and print
  views. It made no data changes.
- The August 5 independent full-system browser pass covered the ordinary local
  Schedule, CRM, Outreach, Finances, Marketing, Operations, Evaluation, Reports,
  and Admin workflows in short batches. YCCO editing and HRSN prefills passed.
  English and Spanish packet files opened as valid Word files.
- The stale local retrospective sample was corrected through the real Staff
  Entry form. It now shows 14.3% Before SNACK, 71.4% Now, and +57.1 points in the
  print view, client Forms tab, and Operations result. The future sample recipe
  uses the current External Clinic Referral wording.
- The Access-page alignment and three-part Clinic score display were published
  as interface version `20260805-system-review1`. A short live Access check
  confirmed the version, Manager data, New Access Level row, and no overflow.
- MailerLite now uses a real read-only provider request instead of treating a
  stored token as proof of connection. The no-token, accepted-token, and
  rejected-token behaviors pass automated tests. No contact write or send route
  exists.
- The MailerLite secret was attached to production and the short signed-in check
  reported **Connected; read-only check passed**. No email or contact write was
  sent.
- Admin Integrations now includes a Twilio no-send simulation. Its tested server
  request always uses Twilio's fake test number, reports delivery disabled, and
  cannot send to SNACK clients. The production code is live, but Twilio test
  details are not configured yet.
- Twilio's One Console Auth Tokens page was checked and showed only live
  credentials, not the separate Test credentials described in Twilio's
  instructions. The live token was not used or stored.
- The August 5 workflow release served interface version
  `20260805-workflow-pass1`. Its read-only production check passed API health,
  public booking pages and settings, availability, and anonymous staff-data
  protection.
- A short signed-in live check confirmed the Kitchen search-first client picker,
  automatic caregiver/phone fill, plain capacity explanation, CRM status groups
  and open/closed defaults, approved form order with hidden metadata, and `OR`
  address display. It did not save a registration, form, client, or setting.
- The latest release adds conservative existing-client matching to public
  appointment and Kitchen booking, a multi-child public family-referral page,
  exact-only provider-network linking, searchable sibling pickers, collapsible
  referral status groups, usable new-record tabs, and regular-weight form
  program points. Automated tests and local visual checks passed. Production GET
  checks confirmed the release without submitting a form or changing data.
- The controlled staff appointment lifecycle passed create, edit, reschedule,
  status, cancel, Calendar changes, and exact cleanup. The original client status
  was restored and automatic Calendar sync stayed disabled.
- The public appointment lifecycle passed create, private-link reschedule,
  cancel, and exact cleanup.
- The public Kitchen duplicate path created a visible staff review alert, let
  staff clear it, and removed the exact temporary client, registration, and task.
- The public multi-child referral path created sibling-linked referrals and a
  visible unknown-provider task. The prefilled Add to Referral Network action
  linked both referrals and closed the task; all exact temporary records were
  then removed.
- Two temporary submitted HRSN claims passed bulk approval, approval-date display,
  and exact cleanup.
- Program Enrollment passed Staff Entry, Client View, print, form ordering, draft
  create/edit, and the new two-step draft deletion. A direct database check found
  zero remaining responses and no QA text. Completed forms do not show Delete
  Draft.
- Production forms also confirmed the Feedback 1-4 scale, Caregiver print view,
  and the approved HRSN wording and removed provider-phone field.

Detailed evidence:

- `docs/FOCUSED-RISK-QA-2026-08-01.md`
- `docs/CONTROLLED-COUNTING-REVENUE-QA-RESULTS-2026-07-29.md`
- `docs/FULL-SYSTEM-WORKFLOW-AUDIT.md`

## Pending
- Optional user visual/wording review of Program Enrollment and the public
  family-referral page.
- Setmore future-appointment reconciliation at the August 5, 1:00 PM cutover,
  followed by a read-only configuration check before Calendar sync is enabled.
- Approval and later testing of the proposed QuickBooks monthly actual-spending
  import. No importer exists and no data was imported during the preview.
- Historical-form match review, duplicate review, and later guarded import.
- Real-data migration preview and production cutover.
- Continue the read-only Setmore/Zoho reconciliation from the current exports.
- Review the preview-only combined contact workbook. Its formulas and five
  sheets passed structural and visual checks with no spreadsheet formula errors.
  No contact was imported, deleted, emailed, or attached.
- Supply a read-only Squarespace key and choose Zapier or a dedicated Google
  Sheet before the sticker-request task connection is built.

## Known Test Constraints

- Calendar automatic sync is disabled.
- MailerLite contact writes and sending are disabled. Twilio real delivery and
  all client reminders are disabled. The optional Twilio test-credential
  simulation is not a launch requirement.
- QuickBooks has no Budget vs. Actual report and no AR/AP aging details with data.
- School participant-level attendance is not collected; approved aggregate
  counting rules apply.
- School and Kitchen outcome instruments remain future work.
- Questionnaire and knowledge assessment can receive further refinements during
  the system test, but their current versions are acceptable for testing.
- The original Codex task caused severe memory pressure during Chrome automation.
  Use shorter tasks and avoid a long browser-control session on this Mac.
- The current local result is 297 passing tests and lint with 0 errors. The same
  64 older warnings remain in `backend/lib/core.js` and retired or partially
  retired `frontend/public/app.js`; the current pass introduced no warning.

## Safe Test Data

Do not run the local fake-system seed or sample cleanup during the current
full-system test. Preserve the prepared sample data until the test is complete
and the user explicitly approves cleanup. After that approval, the seed may run
only against the loopback Firestore emulator:

The current local set intentionally reflects completed test actions: the
disposable public referral named `QA Referral Test` was converted into a client,
and the graduated Knowledge Assessment was saved in the current Before/Now
format. Neither record has been removed. Do not rebuild the set merely to return
these records to their starting state.

```bash
cd snack-crm-cloud/backend
npm run seed:local-system
```

Use the controlled counting test only with its exact confirmation phrases in
`docs/CONTROLLED-COUNTING-REVENUE-QA.md`. Never point either tool at production.
