# SNACK Program Manager Project State

Last updated: August 10, 2026

This file is the durable starting point for future Codex tasks. Read it with
`AGENTS.md`, `README.md`, and `docs/NEXT-SESSION.md` before changing the app.

## Active System

- Application: `snack-crm-cloud/`
- Production staff site: `https://hub.snackprogram.org`
- Production API: Cloud Run service `snack-crm-api` in `us-central1`
- Database: Firestore project `snack-crm`
- Staff authentication: Google accounts in `@snackprogram.org`
- Retired code: root `.gs`, `WebApp.html`, older `app.js`, older `styles.css`,
  and the old single-page interface are references only.
- Clean staff interface: `frontend/public/*.html`, `clean.js`, `clean.css`, and
  feature modules under `frontend/public/modules/`.

The production root opens the combined Home dashboard, and the logo returns to
Home from each clean module. Cloud Run revision `snack-crm-api-00099-xlj` serves
the clean pages and protected API from `hub.snackprogram.org` with 100% of
traffic. Google Workspace sign-in and protected CRM client access passed on the
final address. Firebase Hosting is disabled and the former `web.app` address
returns 404. Identity Platform/Firebase Authentication, Firestore, and Cloud
Storage remain active. Production retains the approved 120-minute inactivity
limit, 5-minute warning, and `GOOGLE_CALENDAR_ENABLED=false`.

The August 8 print and form pass is live on that revision. Schedule > Print
Forms now lets staff choose the exact daily schedule, prep lists, native forms,
and appointment notes to print. Each selected form stays a separate document;
the print preview adds a blank back page only when an odd-length document needs
one for double-sided printing. The public referral page links to a separate
two-page handwriting form with three child sections. Public booking says
`Call Us`. New-grant detail tabs work before the first save, and appointment
notes now record whether an interpreter was used.

## Current Stage

### August 11 approved overnight pass

- A private 17-collection production backup was created and verified before
  any reconciliation write (1,245 documents; SHA-256 recorded with the ignored
  backup file).
- The deterministic Zoho/Setmore pass created 21 clients, four referrals, and
  69 Clinic appointment documents representing 71 Setmore rows through August
  5. It made no deletions. Six ambiguous Clinic rows and one uncertain provider
  link were left for review, and 92 classes, events, or blocked-time rows stayed
  outside the Clinic appointment collection.
- Production now contains 150 clients, 39 referrals, 293 appointments, and five
  referral-network organizations. Every Zoho client and referral source ID in
  the approved files is represented.
- `/sandbox.html` is an isolated browser-local training sandbox for Schedule,
  CRM, Outreach, and Marketing. It contains fictional data and has no API or
  integration calls.
- The public volunteer application and staff Volunteer workspace are version 1.
  The six-page volunteer orientation guide is built from the current DEI, Code
  of Conduct, screening, and Youth Protection documents and passed visual QA.
- Enrollment/Graduation packet loading is sequential with a 60-second per-form
  limit, reducing the multi-child packet timeout failure.
- English templates remain approved, Spanish templates remain editable Drafts,
  service delivery remains off, and the protected weekly-performance email is
  preview-only with no recipient or schedule.

The connected application is broadly test-ready. The approved deterministic
Zoho/Setmore records are now in production, but historical forms, uncertain
matches, and remaining spreadsheets have not been imported. The independent
portions of the guided full-system test have now
passed in short local browser batches across Schedule, CRM, Outreach, Finances,
Marketing, Operations, and Admin. The pass preserved the prepared sample set,
fixed the Access-page spacing, corrected a stale local Knowledge Assessment
sample through the real form, and now shows Before SNACK, Now, and gain together
on the client Forms tab.

The remaining gates are:

1. Review and complete the edits found during the live staff test. Keep the
   current sample data until the user explicitly approves cleanup.
2. At the August 5, 1:00 PM Setmore cutover, reconcile every future appointment
   before making SNACK the only booking source. The controlled staff and public
   booking lifecycles have already passed and must not be repeated without a
   new reason.
3. Create and control-test the Azure Communication Services reminder,
   two-way-texting, and browser-calling path before the existing Google Voice
   number is transferred. The Azure subscription is already pay-as-you-go; no
   additional account upgrade is required. MailerLite's read-only connection is
   complete.
4. Complete the remaining private QuickBooks shared-cost and stipend decisions
   before building an importer.
5. Preview real-data imports, back up production, remove only marked QA fixtures
   after explicit approval, and re-preview every import against the cutover
   destination before writing anything.
6. Review the consolidated contact and grant inventory before any real-data
   import. Do not automatically merge uncertain identities or contacts without
   clear marketing permission.

The real Admin, Manager, Staff, and Intern account/access checks and the real
grant-document upload/open check are complete. The Calendar lifecycle test,
2026 and 2025 QuickBooks no-write reviews, Data
Center repair, and full-system guide correction are complete. The Data Center
repair remains included in production. Current revision
`snack-crm-api-00099-xlj` serves 100% of traffic. The MailerLite secret is
attached and its signed-in read-only provider check passed. The former Twilio
account is closed. No Azure Communication Services resource, credential,
sender, calling action, texting action, or message-delivery route is connected
to SNACK Program Manager. Do not run
sample cleanup until the user explicitly approves it, and do not import real
data until the user explicitly says it is time. The controlled Calendar and
public-booking tests passed, but automatic sync stays off until the future
Setmore appointments are reconciled at cutover.

The questionnaire and knowledge assessment are "done enough" for the system
test. Further wording or print refinements should be recorded as test findings
instead of delaying the test.

## Production Calendar State

- Calendar name: `Clinic Appts`
- Calendar ID:
  `c_dce512191e2885e00d1d69a36f42333524f01cf84cf4b71ab289bbeae74eff96@group.calendar.google.com`
- Cloud Run service account:
  `1013266498299-compute@developer.gserviceaccount.com`
- Cloud Run revision `snack-crm-api-00099-xlj` is serving 100% of traffic.
- `GOOGLE_CALENDAR_ID` matches the approved `Clinic Appts` calendar.
- `GOOGLE_CALENDAR_ENABLED=false`; automatic appointment sync is paused.
- The server asks Google for limited permission to read Calendar information and
  change events. It does not ask for full Calendar access.
- The service account's existing calendar share was corrected from view-only to
  `Make changes and see all event details`.
- The August 1 connection lifecycle passed access, create, update, delete, and
  cleanup. Its one temporary QA event was removed.
- The August 5 controlled staff appointment passed create, update, reschedule,
  status, cancel, Calendar changes, and exact cleanup. The original client
  status was restored.
- The August 5 public appointment passed create, private-link reschedule, cancel,
  and exact cleanup.
- Do not enable automatic sync until all future Setmore appointments are
  reconciled at the approved August 5, 1:00 PM cutover.

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

The August 1 no-write review is recorded in
`docs/QUICKBOOKS-PREVIEW-2026-08-01.md`. It confirmed:

- No 2026 income through July 31.
- 66 eligible payroll expense rows totaling $56,123.92: $50,984.62 in Wages and
  $5,139.30 in Taxes.
- 347 other General Ledger rows that must be excluded from spending to prevent
  double counting or misclassification.
- Matching $56,123.92 totals in the General Ledger, monthly report, and class
  report; matching $110,499.59 ending cash in two reports; and balanced
  $111,780.87 assets and liabilities plus equity.
- About 90% of expense has no class, and the General Ledger has no class field,
  so no program allocation can be inferred.

The August 5 no-write review also opened all six 2025 workbooks without changing
the originals. It confirmed 2025 cash-basis revenue of $167,550.62, expenditures
of $102,876.94, net revenue of $64,673.68, and payroll of $69,074.31. The 2025
General Ledger contains 883 transaction rows and no class column. The class and
monthly reports reconcile. A private seven-sheet review workbook is at
`outputs/snack_finance_classification_20260805/SNACK Payroll and Expense Classification Review.xlsx`.
It includes the supplied payroll inputs, Cynthia's confirmed monthly rule of 4
Kitchen hours with 2 fewer Clinic hours in that class week, all 36 QuickBooks
expense accounts, the 2025 expense detail, editable class mappings, and
reconciliation checks. The average planning calculation is 63 Clinic hours and
4 Kitchen hours per month, or about 94% Clinic and 6% Kitchen; actual paid hours
should replace that average when available. It is a review tool only; nothing
was imported.

All eight named 2025 QuickBooks classes now have confirmed program mappings:
Commit To Be Fit and Monster Mania to Community Programs, Dayton Nutrition
Education to School, General operating to General Operations, HRSN, SMCF, and
SNACK pass to Clinic, and Kids CAN! to Kitchen. Not specified remains visibly
Unallocated because it combines payroll with $80 in bank fees. The bank fee is
General Operations; payroll follows the staff-time allocation. Dayton printing
is School nutrition workbooks and Dayton member-benefit spending is student
incentives.

The Executive Director monthly planning estimate now assigns 8 hours to Clinic,
8 to Kitchen, and 15 to Community Programs. School receives 40 hours in each of
two fall months, or 80 fall hours total. General Operations receives the
remaining monthly paid hours: about 142.34 in a normal month and 102.34 in a
40-hour School month. These are planning estimates and should be replaced with
tracked monthly hours when available.

The approved design stores monthly totals by expense account and SNACK program,
not detailed employee payroll rows. QuickBooks spending remains separate from
Financial Activity, which is the revenue ledger. HRSN maps to Clinic, Kids CAN!
maps to Kitchen, General operating maps to General Operations, all expense
mappings stay editable, and QuickBooks actuals are Admin-only. The main program
allocation choices are Clinic, Kitchen, School, Community Programs, and General
Operations; unresolved items remain Unallocated. A private classification
review calculates payroll program splits from employee hours and hourly rates
supplied by the user. See the QuickBooks preview for all 38 source expense
accounts.

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

### Verified Data Center repair

The August 4 local repair now includes all 28 application collections in the
complete backup. The six formerly missing collections are `outreachEvents`,
`outreachContacts`, `grantQuestions`, `staffUsers`, `adminSettings`, and
`messages`.

Eligible marked Outreach and grant-question sample records can now appear in
ordinary sample cleanup. `staffUsers`, `adminSettings`, and `messages` are
backup-only and are explicitly rejected by both cleanup paths. This prevents
ordinary cleanup from removing the protected director account, staff access,
essential configuration, or the connection-check record.

The safe local backup/reset list also now includes
`performanceEvaluationInstruments` and `performanceEvaluationResponses`. One
behavior test compares the application, backup, local safety, cleanup, and
full-system fixture lists so they cannot silently drift. All 291 backend tests
pass; lint has 0 errors and the same 64 older warnings. No cleanup was run, no
sample record was deleted, and the repair remains in the current production
revision.

## Published August 4 Access And Forms Release

- Manager is the built-in access level between Staff and Admin. It can use
  Schedule, CRM, Outreach, and only Grants and Giving inside Finances.
- Admin can choose Finance sections for any reusable access level. The server
  enforces the same limits even when someone enters a hidden page address.
- Admin can remove a temporary staff account from this app with a two-step
  confirmation. This does not delete the person's Google account. The protected
  director account and the account currently in use cannot be removed.
- Client statuses and colors are editable under Admin > Settings > CRM. Age
  Limit is included for children outside the 6-18 age range; Scheduled remains
  required for new clients.
- The live page is now `finances.html`; the old `fundraising.html` address safely
  forwards to it.
- Child and Caregiver Feedback 2026.2 use the approved 1-4 scale: Not at all, A
  little, Mostly, Completely. Older 0-5 responses keep their original version
  and scoring.
- HRSN Screener 2026.2 uses the original approved reimbursement wording, removes
  provider phone, hides Program Point, and uses compact choices in client,
  staff, and print views.
- Admin > Schedule now includes editable default appointment length.

The server was published as revision `snack-crm-api-00061-d7j`, serving 100% of
traffic. A read-only check confirmed the approved Calendar ID,
`GOOGLE_CALENDAR_ENABLED=false`, disabled bulk cleanup, and disabled reminder
delivery. The August 4 release used interface version
`20260804-access-forms1` and form version `20260804-feedback-hrsn1`.

A short signed-in production review confirmed Manager's Grants/Giving limits,
protected account-removal controls, editable CRM statuses and Age Limit,
default appointment length, the Finances address, and the revised HRSN and
feedback forms in client, staff, and print views. No settings were saved, no
forms were submitted, and no records were changed or deleted.

## Published August 5 System Review Release

- The New Access Level row now keeps its name field, module choices, Finance
  choices, and Add Level button aligned without horizontal overflow.
- A completed retrospective Knowledge Assessment now shows Before SNACK, Now,
  and the percentage-point gain together on the client Forms tab.
- The future local full-system sample recipe uses the current External Clinic
  Referral option instead of the retired Provider Referral wording.
- That Firebase Hosting release served interface version
  `20260805-system-review1`. A short
  signed-in live check confirmed the new version, Manager data, the New Access
  Level row, and no page overflow.
- That release passed 276 backend tests. Lint had 0 errors and the same 64 older
  warnings.

## Published August 5 Provider Check Release

- Cloud Run revision `snack-crm-api-00064-vzv` served 100% of traffic and
  Hosting served interface version `20260805-provider-check1`.
- MailerLite now reports Connected only after MailerLite accepts the stored
  token in a read-only request. No contact write or email-send action exists.
- Admin > Integrations includes a Twilio test-credential simulation that always
  uses Twilio's fake test number. It cannot deliver a real text or create a
  charge, and real reminder delivery remains disabled.
- The MailerLite token is stored and attached, and the signed-in read-only check
  passed. Twilio test details remain blocked because the current One Console
  shows only live credentials; the live token must not be used.
- That release passed 278 backend tests. Lint had 0 errors and the same 64 older
  warnings.

## Published August 5 Workflow Release

- Cloud Run revision `snack-crm-api-00065-ngg` served 100% of traffic and
  Hosting served interface version `20260805-workflow-pass1`.
- Kitchen class registration begins with a client search and shows no initial
  alphabetical checkbox list. Selecting a child fills the stored caregiver,
  phone, and email when those values exist. The automatic status explanation
  states that the whole family registers only when every selected child fits;
  otherwise the whole family is waitlisted.
- The client list is grouped by status with Expand All and Collapse All.
  Reschedule, Scheduled, and Active begin open; Waiting on Family, Graduated,
  Inactive, Closed, and other statuses begin closed.
- The client Forms tab shows Program Enrollment, Questionnaire, HRSN Screener,
  Knowledge Assessment, Child Feedback, and Caregiver Feedback in that order.
  Internal version, effective-date, and description text is hidden there.
- Address cleaning and display use `OR` instead of spelling out Oregon.
- `docs/AUTOMATIONS-2026-08-05.md` records current automatic workflow changes
  and proposed additions. Proposed communications and status changes were not
  activated.
- That release passed 280 backend tests. Lint had 0 errors and the same 64 older
  warnings.
  The post-publication read-only production check and short signed-in review
  passed. No record was saved, deleted, imported, or messaged.

## Published August 5 CRM And Referral Release

- Cloud Run revision `snack-crm-api-00066-7pt` serves 100% of traffic and
  Hosting serves interface version `20260805-crm-referrals1`.
- Public appointment and Kitchen booking reuse exactly one safe CRM match based
  on child name plus birthdate, or child name plus caregiver phone/email when
  birthdate is missing. Ambiguous matches are never guessed.
- The public family-referral page accepts multiple children and creates one New
  sibling-linked referral per child. It links only one exact existing provider;
  unknown providers stay on the referral for staff review.
- Client and referral sibling fields are search-first, referral statuses have
  expand/collapse controls, new-record detail tabs work, and form program-point
  text is no longer bold.
- That release passed 288 backend tests. Lint had 0 errors and the same 64 older warnings.
  Local visual checks and production read-only checks passed. No public form was
  submitted and no record, Calendar event, message, import, or cleanup was run.

## Completed August 5 Production Workflow Checks

- Cloud Run revision `snack-crm-api-00070-7f2` serves 100% of traffic. Shared
  staff pages use `20260805-home-workflow1`; native forms use
  `20260805-appointment-link1`.
- Public appointment matching, public Kitchen duplicate review, and public
  family referral/provider review passed with clearly labeled temporary data.
  Staff saw high-priority review alerts instead of having to discover separate
  records manually. Every exact temporary record and task was removed.
- The HRSN bulk-approval flow approved two temporary submitted claims, showed
  the approval date and total, and then removed those exact claims.
- Program Enrollment draft create, edit, two-step delete, and database cleanup
  passed. Completed responses cannot use the Delete Draft control.
- Program Enrollment Staff Entry, Client View, and print loaded successfully.
  The approved form order, hidden internal metadata, Feedback 1-4 scale, and
  HRSN wording/prefills were confirmed in production.
- MailerLite reported Connected through its read-only provider check. Calendar
  sync, MailerLite writes/sends, Twilio delivery, and reminders remained off.
- All 291 automated tests pass. Lint has 0 errors and the same 64 older warnings.
  Prepared sample data was preserved; only exact temporary production test
  records were removed.

## Published August 5 Daily Workflow Pass

- The verified result is 297 passing tests. Lint has 0 errors and the same
  64 older warnings in shared core code and the retired interface.
- The pass adds the combined Home Workflow, appointment-linked native Forms,
  referral first-call tasks, confirmed Not Interested closure, a missing
  Enrollment-form task, a provider connection-failure task, and grouped
  Marketing contacts.
- Cloud Run revision `snack-crm-api-00070-7f2` and matching Firebase Hosting
  files published successfully. A short signed-in production check confirmed
  Home Workflow, Schedule Forms, and Marketing contact grouping without saving
  or changing a production record.
- The `Real Data Import` folder was inventoried without changing its files. A
  preview-only workbook records 62 source sections, 516 unique email addresses,
  248 contacts with clear marketing permission, 268 contacts needing consent,
  965 identity or missing-email review rows, and 124 grant/support files. No
  data was imported, deleted, emailed, or attached. Text review confirms that
  all 15 downloaded support letters belong to the 2026 Roundhouse grant; two
  scanned PDFs still need a visual check before attachment.

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

Some references below are evidence from an earlier stage, not current status.
`FULL-SYSTEM-TEST-GUIDE.md` has been corrected and reflects the current
retrospective Knowledge Assessment and Questionnaire scoring:

- `CLINIC-QUESTIONNAIRE-MAPPING-DRAFT-2026-07-29.md` says the approved redesigns
  and scoring were not implemented. That status was superseded by the current
  code, README, and `PRODUCT-DECISIONS.md`.
- `OPERATIONS-KPI-DECISION-GUIDE.md` contains recommendations and older decisions,
  including the superseded prospective Knowledge Assessment rule. Do not treat
  unanswered items as approved.
- `FULL-SYSTEM-WORKFLOW-AUDIT.md` predates the 28-collection Data Center repair.
  Its missing-coverage findings are superseded, but its pending real Firebase
  Storage upload check is still current.
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
