# Integrations And External Data Sources

Last updated: August 1, 2026

Do not store tokens, passwords, client identifiers, or private financial data in
this file.

## Google Calendar

- Private calendar: `Clinic Appts`
- Calendar ID:
  `c_dce512191e2885e00d1d69a36f42333524f01cf84cf4b71ab289bbeae74eff96@group.calendar.google.com`
- Cloud Run service account:
  `1013266498299-compute@developer.gserviceaccount.com`
- Production service: `snack-crm-api`, region `us-central1`
- Last confirmed revision: `snack-crm-api-00060-kpj`, serving 100% of traffic
- Last confirmed configuration: approved Calendar ID present;
  `GOOGLE_CALENDAR_ENABLED=false`
- Server permission: limited Calendar-information reading plus event changes;
  full Calendar access is not requested
- Calendar share: the service account can make changes and see event details
- Current status: production lifecycle passed on August 1

The lifecycle test confirmed access, created one QA event containing only test
information, updated it, removed it, and left no QA event behind. Automatic appointment sync remained
disabled. The next Calendar action is a controlled appointment create,
reschedule, status, and cancel test. Do not enable automatic sync before that
test passes. Continue to keep browser sessions short on this Mac.

Setmore stays connected until the final controlled appointment and public
booking tests pass. Once SNACK becomes the source of truth, disable new Setmore
appointment creation to prevent duplicates.

## QuickBooks

API approval is not assumed. The approved practical path is a monthly report
export with a guarded preview, mapping, import, and reconciliation.

Source folder: `Quickbooks Reports/`

The August 1 handoff audit confirmed that all six named workbook files are
present. It intentionally did not open or analyze them; report headers, periods,
basis, classes, and accounts still require the preview-only review.

Available files:

- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Financial Position.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Activity by Class.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Cash Flows.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_General Ledger (1).xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Account List.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Activity by Month.xlsx`

WOCPLC is SNACK's legal name; the QuickBooks entity name is therefore expected.
The General Ledger is confirmed cash-basis with a January-December 2026 report
header and transactions through July 31, 2026. It has one worksheet, used range
`A1:J458`, 413 transaction rows, and no class/location column. The preview should
still reconcile those facts before mapping and must not invent a class mapping.

Unavailable:

- Budget vs. Actual does not exist.
- Accounts Receivable Aging Detail was empty.
- Accounts Payable Aging Detail was empty.

The first import pass must be preview-only. It should identify report period,
basis, account/class names, duplicate risks, unsupported rows, and proposed
Budget/Financial Activity mappings. Do not calculate budget variance without an
approved budget source. Do not infer aging balances from an empty report.

## MailerLite

- Intended use: approved contact synchronization and later campaign delivery.
- Marketing sends remain disabled.
- Only contacts with Active consent, consent source/date, and no opt-out are
  eligible.
- Appointment-reminder consent remains separate from marketing consent.
- API token has not been supplied to Codex.
- Never paste the token into chat.

When the token is ready, use a secure hidden-input prompt and configure the
server secret without exposing it in the browser or repository. Then implement
and test read-only connection validation before any contact write or send.

## Google Voice And Reminders

Google Voice remains a separate shared workflow. Do not add partial click-to-call
or click-to-text behavior when the app cannot also support shared inbound calls
and texts. Staff may continue using the director Google Voice account outside
the CRM.

Automated reminders are paused. Provider selection, bilingual copy, timing,
consent, and message logging must be approved before delivery is enabled.

## YNAB And Budget

No active YNAB connection is required for launch. Budget categories remain
editable in SNACK Program Manager. QuickBooks or future monthly imports can
supply actuals. Cash projection, months of cash on hand, and direct cost per
participant are app calculations, but they require reliable balances,
transactions, program costs, and participant denominators.

Restricted/unrestricted funds and shared overhead are deferred.
