# Family Messaging Launch Package

Last updated: August 17, 2026

## Current Position

Family messaging is intentionally in safe mode. The Hub may prepare templates,
show consent, and run private-safe connection tests, but it must not send a real
family email or text until every launch gate below is complete.

Ready now:

- Google Workspace can send from `appointments@snackprogram.org` and directs
  replies to the monitored `director@snackprogram.org` inbox.
- All nine English service templates are approved, versioned, and locked.
- Public booking records service-email and service-text permission separately.
- CRM profiles preserve service consent and separate email/text opt-outs.
- The approved reminder policy is email 48 hours before the appointment and
  text 6 hours before it.
- Automated texts may not send before 8:00 AM or after 8:00 PM Pacific Time.
- MailerLite is limited to Marketing contacts and is not the service-message
  provider.
- Automatic family delivery remains off.

Still required:

- Cynthia reviews the eight Spanish family templates. An Admin or Manager then
  records any corrections and uses **Approve & Lock** in the Hub.
- Microsoft resolves the Azure registration issue and the SNACK number is
  assigned to Azure Communication Services.
- The 10DLC brand and service-message campaign are approved.
- Outbound text, incoming reply, delivery-report, STOP/START/HELP, failure,
  duplicate-event, quiet-hour, and calling tests pass with the approved test
  number.
- The appointment confirmation/reminder runner and communication-history
  logging pass controlled tests.
- The Executive Director records final production approval.
- Delivery switches are enabled only after all prior gates pass.

## Approved Message Rules

### Service email

- Service email includes appointment confirmations, reminders, reschedules,
  cancellations, Kitchen registration notices, waitlist offers, and necessary
  program follow-up.
- Send only when service-email permission is recorded and email opt-out is not
  active.
- Use an approved template in the family's recorded language.
- Keep diagnoses, referral reasons, insurance identifiers, form answers, and
  other unnecessary health details out of ordinary messages.
- Replies must go to the monitored SNACK inbox.

### Service text

- Service-text permission is separate from service email and Marketing email.
- Send only when service-text permission is recorded and text opt-out is not
  active.
- A STOP or equivalent request turns off service texts immediately. A later
  START or staff-recorded new opt-in must be documented before delivery resumes.
- Queue a message that falls in quiet hours; do not send it early or late.
- A failed delivery creates staff follow-up. It must never be recorded as sent.

### Marketing email

- MailerLite receives only contacts with active Marketing consent, a consent
  source, and a consent date.
- A MailerLite unsubscribe, bounce, or spam report suppresses Marketing email
  without changing service-email or service-text permission.
- Appointment, referral, health, HRSN, and billing information do not belong in
  MailerLite.

## Automatic Triggers After Launch

| Trigger | Automatic result | Required safeguards |
| --- | --- | --- |
| Appointment booked | Immediate confirmation in the approved language | Consent, opt-out, approved template, delivery log |
| Appointment rescheduled | Updated confirmation; superseded reminder is canceled | Same appointment identity; no duplicate reminder |
| 48 hours before appointment | Service email reminder | Email permission and no email opt-out |
| 6 hours before appointment | Service text reminder | Text permission, no text opt-out, quiet hours |
| Appointment canceled | Pending reminders are canceled | Cancellation is logged once |
| Provider delivery failure | High-priority staff follow-up | No message body or secret in the alert |
| Incoming reply | Reply appears on the linked family record | Staff attribution and timestamp |
| STOP/START/HELP | Provider response and CRM consent update | Idempotent event handling and audit record |

Referral-received and referral-conversion messages remain staff-reviewed for
the first production phase. They do not become automatic merely because
appointment reminders are enabled.

## Controlled Test Order

1. Confirm all templates show Approved and the Hub's Messaging Launch checklist
   shows no wording or consent gaps.
2. Send one English Workspace email to the Executive Director's test address.
3. Send one Spanish Workspace email to the same test address after Cynthia's
   approval.
4. Send one Azure text to the Executive Director's approved test number.
5. Reply to the text and verify that the reply is linked to the correct test
   family record.
6. Test STOP, START, HELP, a wrong or landline number, and a simulated provider
   failure.
7. Test a reminder scheduled inside quiet hours and verify that it waits.
8. Test book, reschedule, cancel, and duplicate provider events.
9. Test click-to-call and the related activity record.
10. Record results, reviewer, date, and any correction. Repeat failed steps only
    after the cause is corrected.

Use fictional family data or the Executive Director's approved test contact.
Do not use an active client's details for connection testing.

## Activation and Rollback

Production activation requires all Hub launch gates plus these environment
settings:

- `MESSAGING_REMINDER_AUTOMATION_READY=true`
- `MESSAGING_DELIVERY_LOGGING_READY=true`
- `MESSAGING_PRODUCTION_APPROVED=true`
- `GOOGLE_GMAIL_DELIVERY_ENABLED=true`
- `AZURE_COMMUNICATIONS_DELIVERY_ENABLED=true`

The Hub must remain in safe mode unless all gates pass. Turning on one provider
does not override a missing language, consent, logging, Azure, or approval gate.

If a production problem appears:

1. Turn both delivery settings off.
2. Keep Google Voice and the monitored Workspace inbox available.
3. Preserve provider event IDs, timestamps, and safe error summaries.
4. Create or reopen the staff follow-up task without copying message bodies or
   client details into the task.
5. Correct the problem and repeat the affected controlled tests before
   reactivation.

## First-Week Review

For the first seven days after cutover, review delivery failures, replies,
opt-outs, duplicate events, message timing, Azure cost, and staff follow-up
every workday. Keep Setmore and Google Voice available as references until the
booking, reminder, reply, cancel/reschedule, and calling workflows are verified
in production.
