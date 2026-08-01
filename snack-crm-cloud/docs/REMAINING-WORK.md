# Remaining Work

Last updated: August 1, 2026

## Immediate: Before Full-System Testing

1. Complete the live `Clinic Appts` lifecycle test while automatic sync remains
   disabled. Confirm access, create, update, delete, and cleanup.
2. Inspect the available QuickBooks reports and create a no-write import preview.
   Do not invent Budget vs. Actual or aging values because those reports do not
   exist or contain no data.
3. Review Program Enrollment, Child Feedback, Caregiver Feedback, and public
   referral wording and visual treatment.
4. Confirm YCCO number is editable on the client profile and prefills linked
   HRSN Billing and the HRSN Screener.
5. Confirm packet buttons assemble the active forms after the remaining form
   review is complete.
6. Revisit only the minimum custom-reporting needs required for the test. Do not
   build a general report builder without a concrete use case.
7. Restart local services and seed the repeatable fake system dataset.

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

## After Test Findings Are Fixed

1. Download a complete production JSON backup.
2. Remove only records with all required QA-fixture safety markers.
3. Preview every real client, referral, provider, contact, appointment, and form
   import before writing.
4. Review strong historical-form matches and possible duplicates manually.
5. Keep anonymous forms aggregate-only and never guess a profile link.
6. Deploy the tested build and repeat critical checks against production.
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

## Input Still Needed From Shannon

- Final review of the remaining English forms and public referral wording.
- Real Staff and Intern test accounts for access testing.
- Approval of any QuickBooks import mapping after the preview is shown.
- A MailerLite token only through a secure hidden-input flow, never in chat.
- Final Setmore cutover date after production booking tests pass.

