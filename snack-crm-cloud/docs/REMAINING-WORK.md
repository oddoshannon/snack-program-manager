# Remaining Work

Last updated: August 1, 2026

## Immediate: Before Full-System Testing

1. Inspect the available QuickBooks reports and create a no-write import preview.
   Do not invent Budget vs. Actual or aging values because those reports do not
   exist or contain no data.
2. Fix and verify Admin Data Center coverage. Its registry currently omits
   `outreachEvents`, `outreachContacts`, `grantQuestions`, `staffUsers`,
   `adminSettings`, and `messages` from the claimed complete backup. Define the
   intended cleanup scope explicitly: eligible Outreach and grant-question QA
   records are currently unreachable, while seeded staff/configuration records
   use protected document IDs and must stay under the local reset workflow or a
   separate explicit manual procedure. Never make the protected director account
   or essential production configuration eligible. Add a behavior test that
   prevents the lists from drifting again. No cleanup or import may proceed until
   this repair passes.
3. Update `docs/FULL-SYSTEM-TEST-GUIDE.md` before using it. It still describes
   Knowledge Assessment 2026.1 as active and behavior scoring as excluded;
   current implementation uses retrospective Knowledge Assessment 2026.2 and
   the approved Questionnaire 2026.1 scoring rules.
4. Review Program Enrollment, Child Feedback, Caregiver Feedback, and public
   referral wording and visual treatment.
5. Confirm YCCO number is editable on the client profile and prefills linked
   HRSN Billing and the HRSN Screener.
6. Confirm packet buttons assemble the active forms after the remaining form
   review is complete.
7. Revisit only the minimum custom-reporting needs required for the test. Do not
   build a general report builder without a concrete use case.
8. Restart local services and seed the repeatable fake system dataset.

## Full-System Test

Use `docs/FULL-SYSTEM-TEST-GUIDE.md`. At minimum test:

- Admin, Staff, and Intern with real accounts and direct-URL denial.
- Clinic appointment creation through wrap-up, sibling counting, no-show,
  cancel, reschedule, graduation, and next-day outcome task creation.
- Kitchen and School scheduling, rosters, capacity, attendance, and public
  Kitchen registration.
- Referral conversion, CRM profile actions, activity logs, task completion and
  restoration, and Outreach lead conversions.
- Financial Activity, Grants, Giving, HRSN bulk approval, revenue totals, and
  the QuickBooks import preview.
- Marketing contact assembly, tags, groups, consent, and opt-out behavior with
  sending still disabled.
- Operations calculations, targets, form scores, missing-response rules, and
  data-quality links.
- Client View, Staff Entry, print, draft, edit, completion, and packets on desktop
  and iPad.
- Public booking create, reschedule, and cancel immediately before Setmore
  cutover.
- Data Center backup and sample-cleanup coverage across every application and
  full-system fixture collection.
- One real Firebase Storage grant-document upload after the release candidate is
  selected; existing links and automated rules do not replace this check.

## After Test Findings Are Fixed

1. Preview every available real client, referral, provider, contact, appointment,
   and form source without writing. Resolve mappings, unsupported rows, strong
   historical matches, and possible duplicates before scheduling cutover.
2. Deploy the tested build and repeat critical checks against production.
3. Download and open a verified complete production JSON backup.
4. Remove only records with all required QA-fixture safety markers.
5. Re-run each import preview against the current destination, then import in
   controlled source order. Import real CRM profiles before attaching reviewed
   historical forms.
6. Keep anonymous forms aggregate-only and never guess a profile link.
7. Pilot one Clinic day while Zoho and Setmore remain available as fallback
   references.

## Connections After Source Workflows Pass

- Enable one-way Clinic Calendar sync only after the lifecycle and controlled
  appointment tests pass.
- Implement guarded monthly QuickBooks report imports and reconciliation.
- Connect MailerLite contacts only after consent and opt-out behavior passes.
- Choose a reminder provider after bilingual copy and timing are approved.
- Keep Google Voice separate for inbound and outbound calls/texts.

## Deferred, Not Launch Blockers

- School and Kitchen outcome instruments, survey mappings, and targets.
- Decision rules for every active KPI.
- General custom report builder and polished PDF exports.
- Advanced task snooze, reassignment, archive, and user preferences.
- Shared-overhead allocations and restricted-fund reporting.
- QR check-in, arrival alerts, missed-call capture, and voicemail capture.
- Kitchen and School Calendar synchronization.
- Formal graduation/prize checklist and inactive-client follow-up sequence.

## Input Still Needed From You

- Final review of the remaining English forms and public referral wording.
- Real Staff and Intern test accounts for access testing.
- Approval of any QuickBooks import mapping after the preview is shown.
- Participation in the real grant-document upload check if Codex cannot safely
  use an existing short signed-in session.
- A MailerLite token only through a secure hidden-input flow, never in chat.
- Final Setmore cutover date after production booking tests pass.
