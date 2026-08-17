# Remaining Work

Last updated: August 17, 2026

## Immediate: Post-Cutover Staff-Test Edits

Completed in the approved August 11 pass:

- Production backup and deterministic Zoho/Setmore reconciliation through
  August 5: 21 clients, four referrals, and 69 Clinic appointment documents
  representing 71 source rows; no deletes or guessed matches.
- Fake-data training sandbox for Schedule, CRM, Outreach, and Marketing.
- Volunteer application/workspace version 1 and a visually verified volunteer
  orientation guide.
- Sequential 60-second form-packet loading to reduce multi-child print timeouts.
- Spanish message drafts and a protected aggregate-only weekly email preview;
  neither family delivery nor weekly scheduling is enabled.

Still requires review: six ambiguous Setmore Clinic rows, one uncertain referral
provider link, all historical-form/spreadsheet resolution, and user-entered
changes after August 5.

The independent browser pass and the approved temporary production checks are
complete. Keep all prepared sample records until the user explicitly approves
cleanup. The exact temporary production records created during testing have
already been removed.

1. Review and approve the remaining automatic-action timing, consent, recipient,
   and message-template decisions. Do not enable message delivery until the
   bilingual templates and consent rules are approved and tested.
2. Continue the user's remaining edits from the live staff test. The August 8
   print selection, duplex spacing, printable referral, new-grant tabs, public
   `Call Us`, and appointment interpreter field are complete. Keep all prepared
   sample records until the user explicitly approves cleanup.
3. Review the six ambiguous Setmore Clinic rows left out of the approved pass,
   then confirm user-entered changes after August 5 before SNACK becomes the
   only booking source. The staff Calendar lifecycle and public booking
   lifecycle already passed.
4. Review Program Enrollment and the published public family-referral page if
   you want a final wording/appearance check. Their required functional checks
   passed, including Staff Entry, Client View, print, multiple children, unknown
   provider alerts, and exact cleanup.
5. Keep Google Voice active while the replacement is prepared. The Azure
   subscription is already an active pay-as-you-go Azure Plan; its current cost
   and forecast were both $0.00 on August 10, and no further account upgrade is
   required. Create the Communication Services resource, add a monthly budget
   alert, confirm that the existing local number is eligible to transfer, finish
   US messaging registration, approve bilingual copy and consent rules, and
   complete one controlled live reminder test before transferring the number.
   The Azure Communication Services resource and $10 budget alert were created
   by the user. No Hub credential, phone number, messaging registration, sender,
   calling action, or texting action is connected yet.
   MailerLite's director-only private contact sync and signed opt-out webhook
   are working. The exact allowlist contains only the Executive Director's test
   address; campaign delivery remains disabled.
6. The English templates are approved. Human-review the editable Spanish Drafts
   before approving them. The
   Workspace sender and Reply-To behavior are already verified; automatic
   service-email delivery remains off.
   The combined fail-closed launch checklist and operating procedure are in
   `docs/MESSAGING-LAUNCH-PACKAGE-2026-08-17.md`.
7. Continue the August 5 private finance workbook review. All eight named class
   mappings and the first Executive Director planning split are recorded.
   Confirm Alessandra's exact SNACK payment and program split, September intern
   stipends and program assignments, and shared-cost rules before importer work.
8. Review the consolidated contact and grant inventory, the six unresolved
   Setmore rows, and all historical-form/spreadsheet conflicts. Do not guess or
   bulk-resolve uncertain identities.

## Full-System Test

Use `docs/FULL-SYSTEM-TEST-GUIDE.md`. At minimum test:

- Admin, Manager, Staff, and Intern with real accounts and direct-URL denial.
  Completed by the user on August 10, 2026.
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
  Completed by the user on August 10, 2026, including opening the uploaded file.

The August 5 independent pass completed the ordinary Schedule, CRM, Outreach,
Financial Activity, Grants, Giving, Budget, Marketing, Operations, Evaluation,
Reports, Admin Schedule, Team, Forms, Integrations, YCCO prefill, and native
form-score checks. It also completed the controlled production staff and public
appointment lifecycles, public Kitchen duplicate review, public multi-child
referral/provider review, HRSN bulk approval, and assessment draft
create/edit/delete. Exact temporary records were removed. It did not clean the
prepared sample set, send messages, import records, impersonate unavailable
staff roles, or perform a real Storage upload. The latest release passed 291
automated tests and production checks. It adds conservative public-booking client
matching, the multi-child public family-referral page, searchable client and
referral siblings, collapsible referral status groups, working new-record tabs,
and regular-weight form program points.

A later published pass adds Schedule-linked native forms, the combined Home/CRM
Workflow dashboard, referral call tasks, confirmed Not Interested closure,
missing Enrollment-form tasks, provider connection-failure tasks, and grouped
Marketing contacts. The current full suite has 344 passing tests. Cloud Run
revision `snack-crm-api-00096-wqx` is live, and the short
signed-in check passed without changing a record.

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

Codex, not the user, will reconcile the supplied Setmore appointments and Zoho
records. Codex will also preview a conservative Marketing contact merge from
Squarespace subscribers, MailerLite, CRM, and Outreach spreadsheets. The user
reviews the resulting duplicate, conflict, consent, and exclusion lists before
any write. The current Setmore, Zoho, Squarespace, and older contact exports are
present under `Real Data Import`. The first preview-only combined workbook is
complete; continue reconciliation from it rather than rebuilding the source
inventory.

## Connections After Source Workflows Pass

- Enable one-way Clinic Calendar sync only after the future Setmore appointments
  are reconciled at cutover. The lifecycle and controlled appointment tests pass.
- Implement guarded monthly QuickBooks report imports and reconciliation.
- Keep MailerLite in the director-only private group until the full Marketing
  audience is reviewed. The private opt-out path is connected; campaign sending
  remains outside the Hub.
- Build a read-only Squarespace general-contact sync only after its key is
  supplied. Build the sticker-request task route only after choosing Zapier or a
  dedicated Google Sheet. Do not send the sticker email automatically.
- Build Azure reminder texting only after the Communication Services resource,
  monthly budget alert, sender,
  registration, bilingual copy, consent, timing, opt-out handling, and logging
  are approved.
- Keep Google Voice active through the Azure pilot. Prepare browser calling and
  in-Hub two-way texting before transferring the existing number. Start the
  Google Workspace Voice port-out only after Azure voice, messaging, logging,
  and fallback behavior pass controlled tests.
- Review the completed preview-only weekly performance email, agree on
  recipients and the included measures, send one controlled Workspace test,
  and only then schedule weekly delivery.

## Deferred, Not Launch Blockers

- School and Kitchen outcome instruments, survey mappings, and targets.
- Decision rules for every active KPI.
- General custom report builder and polished PDF exports.
- Advanced task snooze, reassignment, archive, and user preferences.
- Shared-overhead allocations and restricted-fund reporting.
- QR check-in, arrival alerts, missed-call capture, and voicemail capture.
- Kitchen and School Calendar synchronization.
- Formal graduation/prize checklist and inactive-client follow-up sequence.
- Volunteer portal sign-in and self-service opportunity signup. The public
  application and staff directory/opportunity workspace are already in version 1.

## Input Still Needed From You

- Any optional final visual comments on Program Enrollment and the published
  public family-referral page.
- Review the editable QuickBooks expense and shared-cost rules in the private
  workbook. The 2025 Not specified amount is almost entirely payroll plus $80
  in bank fees, so the main unresolved unclassified assignment is payroll.
- Final confirmation immediately before creating the Azure Communication
  Services resource and later before starting the number-transfer request.
  Google Voice stays active until the transfer completes.
- The recipients, preferred send day/time, and must-have measures for the first
  weekly performance-email preview.
- Alessandra's exact SNACK-paid amount and program split, September intern
  stipend amounts and assignments, and a rule for shared rent, utilities,
  insurance, and similar organization-wide costs.
- Your confirmation that all future Setmore appointments have been reconciled at
  the approved August 5, 1:00 PM cutover before Calendar sync is enabled.
- A read-only Squarespace Contacts API key and your choice of Zapier or a
  dedicated Google Sheet for the sticker-request form.
- The completed 2026 Oregon Community Foundation and Ford Family Foundation
  applications, which are still missing from the downloaded grant folder.
