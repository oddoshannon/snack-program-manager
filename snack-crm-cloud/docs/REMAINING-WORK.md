# Remaining Work

Last updated: August 4, 2026

## Immediate: Before Full-System Testing

1. Run `docs/FULL-SYSTEM-TEST-GUIDE.md` in short batches without rebuilding or
   cleaning the current sample dataset. Keep all prepared sample records until
   the test is complete and the user explicitly approves cleanup.
2. Test real Staff and Intern sign-in and direct-page denial when those accounts
   are available.
3. Review Program Enrollment, Child Feedback, Caregiver Feedback, and public
   referral wording and visual treatment.
4. Confirm YCCO number is editable on the client profile and prefills linked
   HRSN Billing and the HRSN Screener.
5. Confirm packet buttons assemble the active forms after the remaining form
   review is complete.
6. Revisit only the minimum custom-reporting needs required for the test. Do not
   build a general report builder without a concrete use case.
7. Classify QuickBooks payroll using employee hours and rates, map all editable
   expense accounts, and classify future nonpayroll expenses by program before
   importer work.

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
  any later approved QuickBooks import preview.
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
- Employee hours and hourly rates by program for the private payroll allocation
  review. Codex can calculate the amounts and percentages.
- Review of the editable QuickBooks expense-to-budget mapping and uncertain
  nonpayroll program assignments.
- Participation in the real grant-document upload check if Codex cannot safely
  use an existing short signed-in session.
- A MailerLite token only through a secure hidden-input flow, never in chat.
- Final Setmore cutover date after production booking tests pass.
