# Integrations And External Data Sources

Last updated: August 10, 2026

Do not store tokens, passwords, client identifiers, or private financial data in
this file.

## Google Calendar

- Private calendar: `Clinic Appts`
- Calendar ID:
  `c_dce512191e2885e00d1d69a36f42333524f01cf84cf4b71ab289bbeae74eff96@group.calendar.google.com`
- Cloud Run service account:
  `1013266498299-compute@developer.gserviceaccount.com`
- Production service: `snack-crm-api`, region `us-central1`
- Last confirmed revision: `snack-crm-api-00081-lor`, serving 100% of traffic
- Last confirmed configuration: approved Calendar ID present;
  `GOOGLE_CALENDAR_ENABLED=false`
- Server permission: limited Calendar-information reading plus event changes;
  full Calendar access is not requested
- Calendar share: the service account can make changes and see event details
- Current status: connection lifecycle and controlled staff/public appointment
  lifecycles passed; automatic sync remains paused
- A provider-failure task rule is published. It creates one shared Admin task
  only for a real connection failure, not for a deliberately paused provider.

The connection lifecycle confirmed access, created one QA event containing only
test information, updated it, removed it, and left no QA event behind. The later
controlled staff appointment passed create, edit, reschedule, status, cancel,
Calendar changes, and exact cleanup. The public appointment passed create,
private-link reschedule, cancel, and exact cleanup. Automatic sync remained
disabled. Do not enable it until every future Setmore appointment is reconciled
at the approved August 5, 1:00 PM cutover. Continue to keep browser sessions
short on this Mac.

Setmore stays connected until cutover reconciliation is complete. The final
controlled appointment and public booking tests already pass. Once SNACK becomes
the source of truth, disable new Setmore appointment creation to prevent
duplicates.
Codex will compare the supplied Setmore appointment/client exports with Zoho and
the destination preview; the user is not expected to reconcile them manually.

## Google Workspace Service Email

- Sender: `appointments@snackprogram.org`
- Display name: `SNACK Program`
- Reply-To: `director@snackprogram.org`
- Signing service account:
  `snack-hub-mailer@snack-crm.iam.gserviceaccount.com`
- Runtime identity:
  `1013266498299-compute@developer.gserviceaccount.com`
- Domain-wide permission: Gmail send only
- Automatic delivery: disabled

Cloud Run uses its own keyless Google identity to sign the narrowly scoped
Workspace request. No downloadable service-account key is stored in the app.
Admin > Integrations includes a controlled test that sends only to the signed-in
Admin or Manager. On August 10, two private-safe production tests arrived in
`director@snackprogram.org` from `appointments@snackprogram.org`; Gmail showed
the expected `director@snackprogram.org` Reply-To address, the SNACK domain
signature, and TLS delivery. This verifies the sender connection only. Referral,
confirmation, and reminder delivery remains disabled until approved templates,
Spanish versions, consent rules, and delivery triggers are ready.

## QuickBooks

API approval is not assumed. The approved practical path is a monthly report
export with a guarded preview, mapping, import, and reconciliation.

Source folder: `Quickbooks Reports/`

Six additional 2025 workbooks are present under `Quickbooks Reports/2025/`.
They passed a no-write structural and visual review on August 5. Do not import
or change them; they are comparison and classification sources only.

The August 1 no-write review opened and checked all six workbooks without
changing the originals. Full results and the proposed mapping are in
`docs/QUICKBOOKS-PREVIEW-2026-08-01.md`.

Available files:

- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Financial Position.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Activity by Class.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Cash Flows.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_General Ledger (1).xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Account List.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Activity by Month.xlsx`

WOCPLC is SNACK's legal name; the QuickBooks entity name is therefore expected.
The General Ledger is cash-basis with a January-December 2026 report
header and transactions through July 31, 2026. It has one worksheet, used range
`A1:J458`, 413 transaction rows, and no class/location column. The preview found
66 eligible Wages and Taxes rows totaling $56,123.92 and 347 balancing-account
rows that must not be imported as spending. The $56,123.92 total matches both
the monthly and class reports. About 90% of spending has no class, so the app
must not invent a program mapping.

The 2025 Statement of Activity by Class is cash-basis and reconciles to the
monthly report: $167,550.62 revenue, $102,876.94 expenditures, and $64,673.68
net revenue. Payroll is $69,074.31. The 2025 General Ledger has 883 transaction
rows and no class column. The private review workbook contains all 36 expense
accounts, class labels, supplied payroll inputs, unresolved mappings, and
formula checks. No QuickBooks file or application record was changed.

Unavailable:

- Budget vs. Actual does not exist.
- Accounts Receivable Aging Detail was empty.
- Accounts Payable Aging Detail was empty.

The approved future design stores monthly totals by editable expense account and
SNACK program. The private Admin review can use detailed ledger rows to classify
spending, but the ordinary app must not store or show employee-level payroll
details. QuickBooks HRSN maps to Clinic, Kids CAN! maps to Kitchen, and General
operating maps to General Operations. Employee hours and hourly rates can be
used to calculate payroll splits; unresolved spending remains Unallocated
instead of being forced into General Operations. Cynthia's confirmed planning
rule is 4 Kitchen hours each month and 2 fewer Clinic hours in that class week.
Commit To Be Fit and Monster Mania map to Community Programs; Dayton Nutrition
Education maps to School; SMCF and SNACK pass map to Clinic. Dayton printing is
School nutrition workbooks and its member-benefit costs are student incentives,
but those editable accounts still follow the linked class or recipient program.
The Executive Director planning estimate is 8 Clinic, 8 Kitchen, and 15
Community Program hours in a normal month, with 40 School hours in each of two
fall months. General Operations receives the remaining paid hours. Replace the
estimates with tracked monthly hours when available.
QuickBooks expenses must not be placed in Financial Activity because that area
is the revenue ledger. Do not calculate budget variance without an approved
budget source. Do not infer aging balances from an empty report.

## MailerLite

- Intended use: approved contact synchronization and later campaign delivery.
- Marketing sends remain disabled.
- Only contacts with Active consent, consent source/date, and no opt-out are
  eligible.
- Appointment-reminder consent remains separate from marketing consent.
- The API token is stored in Google Secret Manager and attached to Cloud Run.
- Never paste the token into chat.

Production now has a read-only connection check that requests at most one group
from MailerLite and reports Connected only when MailerLite accepts the token.
The no-token, accepted-token, and rejected-token paths pass automated tests. On
August 5, the signed-in production result reported **Connected; read-only check
passed** on revision `snack-crm-api-00070-7f2`.

The application also contains a guarded private-test sync and signed opt-out
webhook. Test syncing requires all of the following: the explicit enable flag,
one private MailerLite group ID, an exact email allowlist, the stored API token,
and a Hub contact that is Active with a consent source and date. The provider
payload is limited to email and adult first/last name. The webhook accepts only
valid signed MailerLite requests and records unsubscribe, bounce, spam-report,
and deletion outcomes; it never reactivates a subscriber.

On August 10, 2026, the private test group was created and exactly one approved
test subscriber, `director@snackprogram.org`, was synchronized. The production
test-sync route is enabled only for that exact allowlist and group. A controlled
one-recipient connection-test campaign was then created and submitted for
immediate delivery to that private group; no family or client information was
included. Webhook processing remains disabled until a production signing secret
and MailerLite webhook are configured. Campaign sending from the Hub remains
disabled.

Marketing contact grouping and the automatic connection-failure task are live.
Future contact assembly must preserve source, consent, unsubscribe, conflict,
and possible-duplicate details. It must not treat presence on an old contact
sheet as proof of current consent.

## Squarespace

- Squarespace's Contacts API can supply general website contacts and their
  marketing-permission value through a read-only connection.
- A normal contact record does not reliably identify the exact form that created
  it. The sticker-request form therefore needs a separate form-specific
  connection, using either Squarespace's Zapier form trigger or a dedicated
  Google Sheet that the Program Manager checks.
- The first sticker workflow will create or update the Marketing contact and
  create a shared task to send the approved email. It will not send the email
  automatically.
- A read-only Squarespace API key and the Zapier-versus-Google-Sheet choice are
  still needed. No Squarespace key is stored and no live sync exists yet.
- The August 5 preview-only file review included the current Squarespace contact
  and active-subscriber exports. It did not write to Squarespace or Firestore.

## Google Voice, Azure Communication Services, And Reminders

Google Voice remains the current shared phone workflow. Keep the existing
number and monthly service active while automated reminders are piloted from a
separate sender. Click-to-call, in-Hub texting, and any later number transfer are
a separate phase because they require inbound and outbound call/text handling,
staff access controls, consent, and complete communication logging.

Azure Communication Services is the selected candidate for reminder SMS,
two-way in-Hub texting, and browser calling. The Azure account already has an
active pay-as-you-go `Azure Plan`; its portal showed a $0.00 current cost and
forecast and unused free-service allowances through August 10, 2027. No further
subscription upgrade is required. A credit card is expected for the
pay-as-you-go plan and does not create a fixed monthly platform charge by
itself. The user created the Communication Services resource and a $10 budget
alert on August 10. No phone number, US messaging registration, API credential,
sender, call/text route, or Hub connection has been created.

For a US local number, Microsoft currently lists a $4 one-time brand fee, a $40
one-time standard-brand vetting fee in most cases, a monthly campaign fee (for
example, $1.50 for low volume), a $1 monthly local-number fee, and per-segment
SMS plus carrier fees. These published fees fit under the existing $13 monthly
Google Voice target at SNACK's low volume, before voice-usage charges, but the
actual Azure bill and registration choices must be reviewed before provisioning
or porting. Set a monthly Azure budget alert before any paid number action.

The existing Google Workspace Voice number can be ported out by starting the
request with Azure and using the Google Admin port-out PIN plus the primary
Voice-location ZIP code. Do not cancel Google Voice or begin the transfer until
Azure voice, two-way SMS, consent, delivery logging, and staff fallback behavior
have passed controlled tests.

Microsoft lists Azure Communication Services among the services covered by its
HIPAA Business Associate Agreement. That does not make every configuration
compliant automatically. SNACK must still use the minimum necessary content,
restrict credentials, retain consent and opt-out status, configure STOP and HELP
handling, respect quiet hours, record delivery results, and complete a controlled
end-to-end test.

Automated reminders remain paused. The English templates are approved and the
Spanish versions are editable Drafts for human review. The approved policy uses
a 48-hour email reminder, a 6-hour SMS reminder, and no text before 8:00 AM;
failure alerts and delivery logging are prepared but real delivery is off. No
live Azure or Twilio credential is stored or attached to the application. The
prior Twilio account was closed on August 10 and is no longer the selected
reminder path.

The Workspace service sender and one director-only MailerLite test both passed.
MailerLite's signed opt-out receiver is implemented but remains disabled until
its production signing secret is configured. Hub campaign sending remains
disabled. The weekly Operations email is preview-only, aggregate-only, has no
recipient, and cannot schedule or send itself.

## YNAB And Budget

No active YNAB connection is required for launch. Budget categories remain
editable in SNACK Program Manager. QuickBooks or future monthly imports can
supply actuals. Cash projection, months of cash on hand, and direct cost per
participant are app calculations, but they require reliable balances,
transactions, program costs, and participant denominators.

Restricted/unrestricted funds and shared overhead are deferred.
