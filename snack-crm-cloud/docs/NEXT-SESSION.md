# Next Codex Session

Last updated: August 11, 2026

## Required Reading Order

1. `/Users/shannonoddo/Desktop/CRM App/AGENTS.md`
2. `/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/README.md`
3. `docs/PROJECT-STATE.md`
4. `docs/PRODUCT-DECISIONS.md`
5. `docs/REMAINING-WORK.md`
6. `docs/TEST-STATUS.md`
7. `docs/INTEGRATIONS.md`

Read detailed referenced documents only when the current task needs them. Do not
load every historical document or every screenshot into one context.

## First Work Item

Start by reviewing the August 11 release and the six ambiguous Setmore Clinic
rows plus one uncertain referral-provider link that were intentionally left
untouched. The approved deterministic pass already created 21 missing Zoho
clients, four missing Zoho referrals, and 69 Clinic appointment documents
representing 71 Setmore source rows through August 5. It made no deletions and
the private audit report is under the ignored `backend/.data/` folder. The user
will manually enter changes after August 5. Do not re-import those records or
guess the unresolved matches.

The fake-data training sandbox is `/sandbox.html` and contains only Schedule,
CRM, Outreach, and Marketing. It stores practice records in browser local
storage and has no production or integration calls. The volunteer application,
staff Volunteer directory/opportunities workspace, six-page volunteer guide,
Spanish message Drafts, and aggregate-only weekly email preview are also ready
for user review. Family delivery, weekly scheduling, MailerLite sending, Azure
texting/calling, number transfer, and Calendar sync remain disabled.

Begin with the remaining automatic-action and message-template decisions, then
continue the user's edits from the live staff test. The August 8 print pass is
complete: Schedule has checkbox print selection with separate duplex-safe
documents, the handwriting referral has three children across two pages, public
booking says `Call Us`, new-grant tabs work before saving, and appointment notes
record interpreter use. Stage 2 hosting is complete: Cloud Run revision
`snack-crm-api-00100-lbb` serves the pages and protected API from
`https://hub.snackprogram.org`, final Google Workspace sign-in and protected CRM
access passed, and Firebase Hosting is disabled. Do not restore or deploy
Firebase Hosting. Keep the current sample data until the user explicitly
approves cleanup.

The preview workbook at
`outputs/real_data_contact_review_20260805/SNACK Real Data Contact and Grant Review.xlsx`
organizes the current downloads. It records 62 source sections, 516 unique email
addresses, 248 contacts with clear marketing permission, 268 contacts needing
consent, 965 identity or missing-email review rows, and 124 grant/support files.
No record was imported, deleted, emailed, or attached. Use it to plan the
Setmore/Zoho/Marketing migration and resolve conflicts before building an
import package.

The independent full-system pass and approved temporary production checks are
complete. The user also completed the real Admin/Manager/Staff/Intern access and
direct-address denial checks and one real grant-document upload/open test; do not
repeat them without a new reason. Program Enrollment, public family referral, duplicate-review,
unknown-provider review, HRSN bulk approval, and assessment draft deletion have
passed. The former Twilio account is closed. The next communications work is an
Azure Communication Services resource and budget alert, number eligibility,
registration, consent, bilingual wording, controlled live-text and call tests,
then the Google Workspace Voice port. The Azure subscription is already an
active pay-as-you-go Azure Plan; no further upgrade is required. Do not rebuild,
reset, or clean the sample set
until the user explicitly approves cleanup. Avoid one long browser session
because it previously caused severe memory pressure on this Mac.

The QuickBooks no-write review is complete. Its source findings, exclusions,
checks, and proposed monthly actual-spending design are in
`docs/QUICKBOOKS-PREVIEW-2026-08-01.md`. No data was imported. The monthly
summary design, editable categories, HRSN-to-Clinic mapping,
Kids-CAN!-to-Kitchen mapping, General-operating-to-General-Operations mapping,
payroll-assistance method, and Admin-only access are approved. Cynthia's rule is
4 monthly Kitchen hours with 2 fewer Clinic hours in that class week. The six
2025 workbooks also passed a no-write review, and the private seven-sheet
payroll and expense workbook records those decisions.

The five older class questions and the Executive Director planning split are now
resolved. Commit To Be Fit and Monster Mania map to Community Programs; Dayton
Nutrition Education maps to School; SMCF and SNACK pass map to Clinic. The
Executive Director estimate is 8 Clinic, 8 Kitchen, and 15 Community Program
hours per month, plus 40 School hours in each of two fall months; General
Operations receives the remaining paid hours. Shared-cost rules, Alessandra's
exact payment and split, and intern stipends remain before importer development.

Calendar handoff: revision `snack-crm-api-00096-wqx` serves 100% of traffic with
the approved Calendar ID and `GOOGLE_CALENDAR_ENABLED=false`. The production
lifecycle passed access, create, update, delete, and cleanup. The controlled
staff appointment passed create/edit/reschedule/status/cancel and the public
appointment passed create/private-link reschedule/cancel. All exact temporary
records were removed. At the approved August 5, 1:00 PM Setmore cutover,
reconcile every future Setmore appointment before enabling automatic sync.

## Completed Local Safety Fix

The Data Center now includes all 28 application collections in backup. Eligible
Outreach and grant-question fixtures are reachable, while staff accounts, Admin
settings, and connection records are explicitly blocked from cleanup. The safe
local list also includes both implemented evaluation collections. The behavior
test compares application, backup, cleanup, local safety, and fixture lists.

All 291 backend tests pass and lint has 0 errors with the same 64 older warnings.
The full-system guide and future fake-data recipe now use retrospective
Knowledge Assessment 2026.2. No cleanup was run, no sample data was deleted, and
the repair is deployed. The same release adds Manager access
limited to Grants and Giving, editable Finance-section permissions, safe
temporary staff-account removal, editable CRM statuses including Age Limit, the
Finances address correction, default appointment length, Feedback 2026.2 on the
approved 1-4 scale, and HRSN 2026.2. Cloud Run and the matching screens are
published. The short signed-in review
passed without saving settings, submitting forms, or changing records.

The August 5 short-batch system review passed the ordinary local Schedule, CRM,
Outreach, Finances, Marketing, Operations, Evaluation, Reports, and Admin
workflows. It confirmed YCCO editing and HRSN prefills, valid English and Spanish
packet files, and the 57.1-point retrospective Knowledge result. It fixed the
New Access Level alignment and now shows Before SNACK, Now, and gain together on
the client Forms tab. The current Hosting release serves shared version
`20260805-review-alerts1` and client-form version
`20260805-draft-delete1`; the live Access page has no horizontal overflow. All
291 tests pass and lint has 0 errors with
the same 64 older warnings.

Production now verifies MailerLite through a read-only provider request.
MailerLite contact writes, marketing email sending, Azure real delivery, and all client reminders
remain disabled. The MailerLite secret is attached and the signed-in production
check passed. The former Twilio account is closed, and no live Azure credential,
phone number, messaging sender, calling action, texting action, or delivery
route is connected to SNACK Program Manager.

The current workflow release adds the search-first Kitchen client picker with
automatic family-contact fill and whole-family capacity wording, collapsible CRM
status groups, the approved client form order with internal metadata hidden,
and `OR` address display. A short signed-in production review passed without
saving anything. `docs/AUTOMATIONS-2026-08-05.md` records existing automatic
changes and proposals; no proposed communication or status rule was activated.

The current CRM and referral release prevents ordinary public-booking
duplicates by reusing exactly one client matched by name and birthdate, or by
name and caregiver phone/email when birthdate is missing. Unclear matches are
never guessed. The public family-referral page accepts multiple children,
creates linked New referrals, and links only one exact existing network
provider. Client and referral sibling fields are search-first; referral status
groups can expand and collapse; new-record tabs work; form program points use
regular-weight text. Production functional checks passed with labeled temporary
data. Staff alerts made possible client duplicates and unknown providers visible,
and staff could resolve them. HRSN bulk approval and assessment draft
create/edit/two-step delete also passed. Every exact temporary record and task
was removed.

The published August 5 pass combines the CRM Workflow queues with
Today's Schedule and Tasks on Home; links Schedule appointment Forms to their
CRM native forms; changes the appointment-type paper icon to a check; groups
long Marketing contact lists; creates a first-call task for each new referral;
closes that task when a referral call is logged; requires explicit confirmation
before Not Interested closes a referral; creates a task when an Enrollment
appointment is completed without Program Enrollment; and creates one Admin task
for a real provider connection failure. The verified result is 297 passing
tests, not 291. A short signed-in production check passed without changing a
record.

The Setmore, Zoho, Squarespace, and older contact exports are present under
`Real Data Import`, and the first conservative combined preview is complete.
Continue the read-only Setmore/Zoho reconciliation from that inventory. The user
does not need to reconcile appointments by hand. No cleanup or import follows automatically:
first verify a complete production backup and present duplicate, conflict,
consent, exclusion, count, and money checks for explicit approval.

The downloaded support-letter set was text-reviewed. All 15 files support the
2026 Roundhouse application, including the YCCO-named file. `MPR Letter for
SNACK.pdf` and `SNACK Letter of Support.pdf` appear to be scanned and need a
quick visual confirmation before attachment. Avoid attaching both a Word file
and its PDF copy as separate evidence unless that duplication is intentional.

For Squarespace, the approved plan is a read-only Contacts API connection for
general contacts plus a form-specific sticker route. The sticker route creates
or updates the Marketing contact and creates a shared task to send the email; it
does not send automatically. A read-only Squarespace key and the choice between
Zapier and a dedicated Google Sheet remain before implementation.

At the August 5, 1:00 PM Setmore cutover, reconcile all future Setmore
appointments before enabling `GOOGLE_CALENDAR_ENABLED=true` and stopping new
Setmore bookings. The controlled appointment and public-booking lifecycles have
already passed and should not be repeated without a new reason.

## Known Stale References

- The root Launch Tracker and Production Readiness Checklist still say the
  QuickBooks reports need to be supplied; the six files are already present.
- The root Launch Tracker and Roadmap place the Calendar lifecycle later or call
  for credential setup. The handoff now records the successful production
  lifecycle test. Do not repeat setup or that test unless a later check finds a
  problem. The controlled appointment and public booking tests also passed;
  Setmore reconciliation is the remaining step before enabling automatic sync.
- The Roadmap proposes a QuickBooks Budget vs. Actual import, but that report
  does not exist.
- The Roadmap still lists controlled counting and survey/KPI mapping as pending;
  the focused-risk evidence and current implementation supersede those entries.
- The questionnaire mapping draft and KPI decision guide contain superseded
  prospective Knowledge Assessment status. Use `PRODUCT-DECISIONS.md` and the
  current repository for the implemented rules.
- The Calendar connection plan's broad reference to program-session sync is not
  current launch scope. Only one-way Clinic appointment sync is implemented;
  Kitchen and School Calendar sync remain future work.

## Working Rules

- Speak to the user as `you`, not by name. Use very plain English and avoid
  jargon. If a technical term is necessary, explain it immediately.
- Prefer one large, safe pass of related work over many small approval stops.
  Afterward, separate what Codex can continue independently from what truly
  needs the user's decision or participation.
- End every user-facing update with bold `Next step` and `Input needed from you`
  lines so they are easy to find.
- Never reset or clean the dirty worktree.
- Work only in `snack-crm-cloud/`; root Apps Script files are retired.
- Preserve the clean visual rulebook.
- Record every newly approved durable decision in these handoff documents.
- Keep tasks focused and compact.
- Run tests and lint after code changes.
- Do not deploy unless the current change has been verified and you have asked
  for or approved the deployment stage.

## Prompt For The New Task

Use the following prompt verbatim:

> Continue the SNACK Program Manager project from its durable handoff. First
> read `/Users/shannonoddo/Desktop/CRM App/AGENTS.md`,
> `/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/README.md`, and these files:
> `docs/PROJECT-STATE.md`, `docs/PRODUCT-DECISIONS.md`,
> `docs/REMAINING-WORK.md`, `docs/TEST-STATUS.md`,
> `docs/INTEGRATIONS.md`, and `docs/NEXT-SESSION.md`. Treat those files as the
> source of truth and do not reconstruct decisions from the retired task. Begin
> with the first work item in `docs/NEXT-SESSION.md`: finish the remaining
> user-dependent full-system gates without repeating the completed short-batch
> browser pass. Do not rebuild, reset, or clean the sample set until the user
> explicitly approves cleanup. The Data Center repair, corrected test guide,
> access/forms work, Access layout repair, and Clinic score-summary repair are
> published. The approved QuickBooks proposal is in
> `docs/QUICKBOOKS-PREVIEW-2026-08-01.md`; the 2025 no-write review workbook is
> ready for user mapping decisions. Do not reset the dirty worktree, do not
> touch retired root Apps Script files, and do not import or deploy unverified
> data.
