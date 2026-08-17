# SNACK Program Hub

The SNACK Program's system for scheduling, referrals, clients, outreach, finances, marketing, operations reporting, public booking, and administrative tools.

- Production staff site: https://hub.snackprogram.org
- Database: Firestore in the `snack-crm` Google Cloud project
- Staff sign-in: Google accounts restricted to `@snackprogram.org`
- Public booking: standalone client-facing booking and booking-management pages

The Google Apps Script files in the repository root are retired and are not part of this application.

## How the application is organized

```text
Staff or client browser
        |
        | secure staff token for protected actions
        v
Cloud Run pages and API
        |
        v
     Firestore
```

### Backend

```text
backend/
  server.js              Small setup file that registers feature files
  lib/core.js            Shared database, sign-in, cleaning, and serialization rules
  routes/
    appointments.js      Appointment and prep-checklist actions
    program-schedule.js  Kitchen and School sessions, rosters, and attendance
    clients.js           Client actions
    referrals.js         Referral actions
    tasks.js             Task actions
    activity-logs.js     Calls and texts
    grants.js            Grant tracking
    fundraising.js       Financial Activity, grants, giving, HRSN Billing, and budget records
    marketing.js         Campaign planning, reporting, and provider status
    outreach.js          Outreach events, leads, and lead conversions
    volunteers.js        Volunteer directory and opportunity actions
    reminders.js         Safe Workspace email and Azure Communications readiness checks
    referral-network.js  Provider and organization contacts
    admin.js             Data Center, Calendar checks, access-safe cleanup, and scheduling settings
    public-booking.js    Public booking, canceling, and rescheduling
    messages.js          Connection check
  test/
    backend-helpers.test.mjs
    clean-schedule.test.mjs
    frontend-contracts.legacy.mjs  Historical checks for the retired interface
    qa-public-booking-api.mjs
```

List actions use `fetchAllDocuments()` to load every record in batches. There is no fixed total-record ceiling that can make older records disappear.

### Staff interface

The clean staff interface is built from one locked visual system:

```text
frontend/public/
  clean.css              Shared approved colors, typography, spacing, and interaction rules
  clean.js               Shared navigation, module rendering, and connected behavior
  modules/schedule.js    Testable schedule data and formatting rules
  modules/program-schedule.js  Kitchen and School schedule and roster rules
  modules/marketing.js   Marketing campaign, filter, and reporting rules
  modules/admin-data.js  CSV parsing, validation, normalization, and import previews
  template.html          Visual rulebook preview
  template.js            Generic rulebook content and interactions
  schedule.html          Clean Scheduling page
  crm.html               Clean CRM page
  outreach.html          Clean Outreach page
  finances.html          Clean Finances page
  fundraising.html       Safe forward from the retired Fundraising address
  marketing.html         Clean Marketing page
  operations.html        Clean Operations page
  admin.html             Clean Admin page
  index.html             Compact Home dashboard and default staff entry page
  client-form.html       Native iPad, print, and historical form reader
  client-form.js         Version-aware questionnaire workflow and autosave
  client-form.css        Minimal client mode and printable form layout
  app-config.js          Local and production server addresses
```

The older `app.js` and `styles.css` files remain temporarily as functionality and public-booking references. They are not the design foundation for clean staff pages and should not be expanded.

The isolated training sandbox is available at `/sandbox.html`. It contains only
Schedule, CRM, Outreach, and Marketing, uses clearly fictional records stored
in that browser's local storage, and cannot call the production API, send a
message, change a calendar, or write to Firestore. Reset Training Data restores
the original practice records. A separate training Google account is not
required for this version.

Fundraising grant files are stored in Firebase Storage under `grant-documents/`, while their labels and Storage paths are saved with the related grant or organization record in Firestore. Storage rules require an active staff record with Finances and Grants access. New uploads do not create permanent download-token links.

### Public booking

`booking.html` and `booking.js` provide the public landing page and appointment-type selection. `book.html` and `book.js` provide scheduling, multi-child booking, confirmation, and private booking management. Public actions do not require staff sign-in, but they are rate-limited and cancel/reschedule actions require a secure management token.

## Database collections

`referrals`, `clients`, `appointments`, `publicReviews`, `programSessions`, `programRegistrations`, `tasks`, `activityLogs`, `securityAuditLogs`, `grants`, `grantQuestions`, `fundraisingDonors`, `fundraisingCampaigns`, `fundraisingGifts`, `earnedIncome`, `marketingCampaigns`, `marketingSubscribers`, `performanceMetrics`, `performanceMeasurements`, `performanceEvaluationQuestions`, `performanceEvaluationInstruments`, `performanceEvaluationResponses`, `hrsnClaims`, `budgetCategories`, `referralNetwork`, `outreachEvents`, `outreachContacts`, `volunteerProfiles`, `volunteerOpportunities`, `adminSettings`, `staffUsers`, and `messages`.

Finances > Financial Activity is the income source of truth. Its Dashboard summarizes year-to-date and quarterly revenue, and its Ledger combines grants, approved HRSN billing, product sales, donor gifts, and older grant entries. Linked grants, campaigns, donors, and HRSN billing records remain connected to their source profiles. Staff edit HRSN amounts and approval status in HRSN Billing rather than entering a duplicate HRSN Ledger row. Operations reads those dated source records and calculates revenue measures; staff do not enter financial values inside Operations. The older `performanceMeasurements` grant entries remain readable and correctable through the Financial Activity Ledger until they have been cleaned up.

Operations > Performance stores editable measure definitions and targets in `performanceMetrics`. The Performance list shows core KPIs by default and offers an explicit switch for future measures, preserving later ideas without crowding current management work. Measures with a reliable existing source are calculated from program records. Measures that still require an approved definition or a future survey mapping remain visibly marked `Needs Definition` or `Not Configured` instead of displaying a guessed result.

Finances > HRSN Billing stores protected service and invoice records in `hrsnClaims`. Medicaid identifiers appear only inside the selected authenticated billing record, not in list subtitles or summary counters. Description and Outcome support multiple selections. Submitted and Approved remain separate visible fields. During the temporary pre-accounting workflow, approving a billing record recognizes its Dollar Amount as HRSN Revenue on its Approval Date and feeds Total Revenue automatically. That recognized revenue is not treated as cash on hand. Once a reliable accounting payment source is connected, the HRSN revenue trigger can move from Approval Date to payment receipt.

Clinic reporting is participant-aware. A shared sibling visit is one Appointment Delivered, while Program Engagements counts one engagement for each child on that appointment. Wrap Up stores a separate Goal and Goal Result for every child, even when siblings choose the same goal, and Goal Achievement uses those child-level results. School Total Children Served currently sums the Participant Count from each completed class because individual School participant identifiers are not collected.

Clinic Knowledge Assessment 2026.2 is a native per-child retrospective form with 34 approved Yes/No self-report items across seven color-coded lessons. At Graduation, each child answers every item for Before SNACK and Now; each lesson contributes equally to both scores. The Nutrition & Healthy Habits Questionnaire 2026.1 is administered at Enrollment and Graduation, treats `I don't know` as missing rather than zero, applies age-based sleep guidance, and produces the approved food-behavior and broader behavior-change results only when their completeness rules are met. Native forms can run one section at a time in minimal iPad client mode or print with the child, completion date, and program point already filled in. Earlier Clinic Knowledge Assessment 2026.1 responses remain read-only and retain their original prospective scoring rules.

Completed retrospective Knowledge records show Before SNACK, Now, and the percentage-point gain together on the CRM Forms tab. Operations uses only complete, in-period results and gives each lesson equal weight.

The root page is Home. It combines the four CRM Workflow queues with no more than four clinic appointments and four workflow tasks, followed by near-term Kitchen Classes, School Classes, or Outreach Events. The logo returns to Home from every clean staff page. Home honors the signed-in staff member's configured module access.

Clinic workflow tasks are generated from saved appointment outcomes rather than maintained as a separate checklist. A No-show creates one same-day call task for each linked child who needs rescheduling. A completed or canceled appointment creates one next-appointment task when the child remains in Needs Reschedule. The next time Home or the CRM Dashboard opens on a later calendar day, it reconciles appointments that still remain Scheduled and creates one linked outcome-review task. Reopening either dashboard does not duplicate those tasks; recording the outcome closes the review task, and scheduling a replacement appointment closes active scheduling or rescheduling tasks for the linked child.

The active Clinic form set includes versioned Program Enrollment, HRSN Screener, Nutrition & Healthy Habits Questionnaire, Knowledge Assessment, Child Feedback, and Caregiver Feedback forms. Each supports staff entry, a simplified client iPad view, prefilled printable copies, saved drafts, later review and editing, and version-preserved historical records. On the client Forms tab, staff see Program Enrollment first, then Questionnaire, HRSN Screener, and the three Graduation forms; internal version, effective-date, and description text stays hidden from this action list. Child and Caregiver Feedback 2026.2 use the approved 1-4 scale while older 0-5 responses retain their original form version and scoring. HRSN Screener 2026.2 uses the original approved reimbursement explanation, removes provider phone, and hides Program Point. Enrollment completion can update the linked client profile, including the YCCO member number. Enrollment and Graduation packet buttons assemble the active forms for that program point without duplicating separate print-only records.

The public family referral form at `/refer.html` creates one New CRM referral for each child after the caregiver or referring provider confirms permission to contact the family. Children submitted together are linked as siblings. It uses a honeypot and an hourly per-address limit, does not expose staff data, and links an existing referral-network provider only when the organization and provider details identify exactly one record. Otherwise it keeps the submitted provider details with the referral for staff review; public submissions never create trusted network records.

Public appointment booking and public Kitchen registration use the CRM instead of creating a second client when exactly one safe match is found. The matching rule requires the same child name plus birthdate, or, when birthdate is missing, the same child name plus caregiver phone or email. Ambiguous results are never guessed; they create a separate record for staff review.

Finances > Budget stores editable annual category plans in `budgetCategories`. The starting category list mirrors the initial YNAB budget, but the categories remain editable. SNACK Program Manager performs the budget-versus-actual, cash-flow projection, months-of-cash-on-hand, and direct-cost-per-participant calculations. A connected accounting source such as QuickBooks or YNAB, or a future manual ledger, supplies the dated transactions, balances, and forecast inputs used by those formulas.

QuickBooks files are reviewed without changing the originals. The current private payroll and expense classification workbook is a review aid only: mappings remain editable, uncertain spending stays Unallocated, and no worksheet is treated as an approved import until the user confirms the classifications.

The confirmed QuickBooks class mappings are HRSN, SMCF, and SNACK pass to Clinic; Kids CAN! to Kitchen; Dayton Nutrition Education to School; Commit To Be Fit and Monster Mania to Community Programs; and General operating to General Operations. The Not specified amount remains Unallocated until its payroll and bank-fee parts are separated.

Marketing campaign plans and results are saved in Firestore and appear across Dashboard, Campaigns, and Contacts. Marketing > Contacts assembles one contact per email address from CRM families, referrals, donors, Outreach leads and event partners, class registrations, referral organizations and providers, and manually added Marketing contacts. It does not move or replace those source records. Automatic role tags identify why someone is in the system, while editable audience groups control optional mailings such as Newsletter, Cooking Classes, Volunteers, and Community Partners. Campaigns can target several role tags and audience groups together. Only a contact explicitly marked Active with a consent source and date is eligible for MailerLite. Email opt-outs are always excluded, and appointment-reminder consent remains separate from marketing consent. The server verifies the stored MailerLite token without exposing it in the browser. In private-test mode, saving the allowlisted Marketing contact automatically synchronizes complete consent to the private test group and propagates a Hub opt-out back to MailerLite. A signed MailerLite webhook records unsubscribe, bounce, and spam-report events in the Hub but never reactivates a provider-suppressed contact. Campaign sending remains disabled in the CRM.

The production MailerLite secret is connected and has passed the read-only check. The guarded private-test sync and signed opt-out webhook are enabled for exactly `director@snackprogram.org` in the private SNACK Hub test group. The webhook secret is stored in Google Secret Manager, unsigned requests are rejected, and nonallowlisted events are ignored while the scope remains `private-test`. One controlled connection-test campaign was submitted to that one-recipient group; it contains no family or client information. Campaign creation and delivery from the Hub remain disabled.

Operations exposes a protected weekly-performance email preview made only from
approved aggregate measures. It has no configured recipient and cannot send or
schedule itself. Recipient selection, the final metric set, and a controlled
Workspace delivery test remain required before weekly delivery can be enabled.

Outreach > Leads replaces the former Outreach Contacts list. Active leads can be converted to a CRM referral, an audience-only Marketing contact, a Community Partner, or Closed. Converted leads leave the active queue but remain in Lead History, and referral conversions retain the originating outreach event as their referral source. The underlying `outreachContacts` collection and compatibility API names remain unchanged so existing records and links continue to work.

Outreach > Volunteers contains the volunteer directory and opportunity list. Staff can add and edit applications, approval details, interests, skills, availability, background-check status, SNACK email addresses, and notes. Opportunities store their program, date, time, location, capacity, coordinator, requirements, and status. The public application at `/volunteer.html` writes a rate-limited Applicant profile directly into the directory without exposing staff-only approval fields. Volunteer portal access and self-service opportunity signup remain a later phase; approved Google Workspace accounts are created manually.

Clinic appointment types, default appointment length, Kitchen class types, capacity, availability, waitlist behavior, and each program's default location are stored under Admin > Schedule and can be edited by authorized staff. Individual Kitchen classes can override the default class location. The named types in `backend/lib/core.js` are defaults for a new or incomplete settings record, not fixed application limits. School classes are internal-only. Bookings and class registrations keep the applicable location with their records so future confirmations and reminders can use the correct destination. Clinic appointment synchronization is connected to the private **Clinic Appts** calendar. The initial future-appointment reconciliation synchronized ten appointments and reused existing event IDs where present. A protected Admin test checks access, creates one private-safe QA event, updates it, and removes it. Calendar writes are locked to the approved Clinic Appts ID, and an existing event can be changed or removed only after its private Hub record marker matches the same appointment. Calendar descriptions show the assigned lesson and staff member without a Hub link or goal. Create, reschedule, status, cancellation, and public-booking changes update one matching Google event while SNACK remains the scheduling source of truth. Kitchen and School calendar synchronization remains a later expansion.

Admin has three submodules: Settings, Schedule, and Security & Integrations. Settings contains Team, Access, CRM, Forms, and Data tabs. Team stores editable staff names, job titles, phone numbers, and program assignments on `staffUsers`. Access stores reusable access levels in `adminSettings/staffAccess`; an Admin can choose each level's modules and Finance sections, add another level, activate staff accounts, assign additional Admins, and remove temporary app accounts without deleting their Google accounts. Manager is the built-in middle level and can use only Grants and Giving inside Finances. The configured director account remains a protected Admin so the system cannot lose its last owner. CRM stores editable client statuses and colors, including Age Limit; Scheduled remains required for new clients. Forms is the current English/Spanish form library and links to the editable questionnaire workspace in Operations. Data is the guarded Data Center: it downloads a complete JSON backup, previews and validates supported CSV imports, creates an automatic rollback backup before changes, and deletes only records carrying all three independent QA-fixture safety markers after typed confirmation. Security & Integrations contains an editable operational compliance checklist, an editable vendor-agreement register with links to signed copies in restricted Drive storage, and connection health for the data service, sign-in, database, Workspace service email, MailerLite, the paused Clinic Calendar, and Azure Communications. Its Workspace test sends one private-safe message from `appointments@snackprogram.org` to the signed-in Admin or Manager with replies directed to `director@snackprogram.org`; automatic delivery remains disabled. Its Calendar test uses a temporary private-safe event and always attempts cleanup. Azure Communications reports each external readiness requirement and cannot mark production delivery active until the resource secret, phone number, 10DLC registration, incoming events, calling, and final readiness approval are all recorded. Integration credentials are never entered or displayed in the browser. Admin intentionally has no Quick Actions panel.

The current workflow changes and useful proposed additions are summarized in `docs/AUTOMATIONS-2026-08-05.md`. Proposed communications and status-changing rules remain review items; they are not silently activated.

## Local development

Start the backend from `snack-crm-cloud/backend/`:

```bash
npm install
npm run dev
```

The backend runs at `http://127.0.0.1:8080` unless configured otherwise.

Serve `snack-crm-cloud/frontend/public/` with a local static server. The clean Scheduling page is `schedule.html`, and the visual reference is `template.html`.

### Local data safety

The local Firestore emulator has a guarded backup, reset, and restore tool. It
refuses the live `snack-crm` project and refuses any database host that is not
`localhost` or `127.0.0.1`.

```bash
cd snack-crm-cloud/backend
npm run local-data -- backup
npm run local-data -- clear
npm run local-data -- restore --file=/path/to/backup.json
npm run local-data -- replace --file=/path/to/backup.json
```

`clear`, `restore`, and `replace` are previews by default. The tool prints the
exact records involved and makes no changes unless the matching confirmation
phrase is supplied. `replace` also creates an automatic local backup before it
removes anything. Backup files default to the ignored `backend/.data/` folder
so client data cannot be accidentally added to GitHub.

Create a connected, repeatable dataset for the full-system browser test with:

```bash
cd snack-crm-cloud/backend
npm run seed:local-system
```

The seed command only accepts a loopback Firestore emulator and refuses the
production `snack-crm` project. It replaces only records explicitly marked as
QA fixtures, uses fake contact details, and never sends email or text messages.

Preview the historical Clinic form exports without changing Firestore:

```bash
cd snack-crm-cloud/backend
python3 scripts/preview-historical-forms.py
```

The row-level result is written to the ignored `backend/.data/` folder because
it can contain client information. The safe aggregate report is written to
`docs/HISTORICAL-FORM-MIGRATION-PREVIEW-2026-07-31.md`. The preview never
imports records and never guesses a client match for anonymous responses.

The approved August 11 real-data reconciliation uses a private, ignored plan
and requires a verified production-backup count before it can create records.
It is idempotent, creates no duplicate source IDs, performs no deletes, and
never guesses an ambiguous appointment or provider link. The completed pass
added 21 Zoho clients, four Zoho referrals, and 69 Clinic appointment documents
representing 71 Setmore rows through August 5. Six ambiguous Clinic rows and
one uncertain provider link remain untouched; 92 Setmore class, event, and
blocked-time rows were intentionally kept out of the Clinic appointment system.

The controlled counting and revenue test temporarily replaces only its listed
local source collections after creating a private backup. Its checklist and
exact expected totals are in `docs/CONTROLLED-COUNTING-REVENUE-QA.md`.

```bash
cd snack-crm-cloud/backend
npm run qa:counting -- start --confirm="START CONTROLLED COUNTING QA"
npm run qa:counting -- reset --confirm="RESET CONTROLLED COUNTING QA"
npm run qa:counting -- cleanup --confirm="RESTORE CONTROLLED COUNTING QA"
```

## Required checks

Run the backend tests:

```bash
cd snack-crm-cloud/backend
npm test
```

Run the shared code-quality check:

```bash
cd snack-crm-cloud
npm install
npm run lint
```

GitHub automatically runs both checks whenever a branch is pushed or proposed for inclusion in the main version.

## Security

- Protected server actions verify a Firebase sign-in token, require an active configured staff account, and enforce its modules and Finance sections.
- Staff sign-in lasts for one browser session and ends automatically after a configurable period without activity. The app warns the user first and provides a visible Sign Out control.
- Production must set `FRONTEND_ORIGINS` to the exact approved web addresses. There is no production wildcard fallback.
- Public booking and referral limits use Firestore so the limit applies across every Cloud Run copy. Public cancel/reschedule tokens are placed in the private URL fragment and moved into temporary tab storage.
- Security actions are appended to `securityAuditLogs`. The app can review and export these records but provides no edit or delete action for them.
- Grant uploads require active Grants access and pass size, type, and file-signature checks in addition to Storage rules.
- Mass deletion is disabled unless `ALLOW_ADMIN_BULK_DELETE=true`; production should keep it disabled.
- The protected director account always retains Admin access. Admins can configure reusable access levels, choose their module access, create additional levels, and assign additional Admins. New SNACK accounts remain inactive until an Admin assigns and activates an access level.

The technical Phase 2 changes, required console actions, hosting recommendation, and operational-policy list are in `docs/HIPAA-PHASE-2-REMEDIATION.md`. These safeguards do not by themselves establish HIPAA compliance.

## Current combination work

This branch combines the clean visual-rulebook interface with the July 2026 backend reorganization:

1. The clean module pages and visual template remain the staff-interface foundation.
2. The backend is separated into feature-specific files.
3. Full-record loading replaces fixed list limits.
4. Scheduling prep checkboxes save through the appointment feature file.
5. Automatic tests and code-quality checks run locally and on GitHub.

The rejected rulebook restyling of the older single-page interface is not included.
