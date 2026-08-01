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
- Live configuration: calendar ID present; `GOOGLE_CALENDAR_ENABLED=false`
- Current status: configured but lifecycle test pending
- No event was created during the interrupted August 1 test.

Next action: run Admin > Integrations > Google Calendar lifecycle test using the
deployed service identity. Confirm access, created, updated, removed, and no
remaining QA event. Keep sync disabled afterward. Because Chrome automation
contributed to a Mac crash, prefer Shannon manually clicking Run Test while the
next Codex task observes the returned status or uses a direct authenticated API
method.

Setmore stays connected until the final controlled appointment and public
booking tests pass. Once SNACK becomes the source of truth, disable new Setmore
appointment creation to prevent duplicates.

## QuickBooks

API approval is not assumed. The approved practical path is a monthly report
export with a guarded preview, mapping, import, and reconciliation.

Source folder: `Quickbooks Reports/`

Available files:

- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Financial Position.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Activity by Class.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Cash Flows.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_General Ledger (1).xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Account List.xlsx`
- `Western Oregon Center for Pediatric Thereapeutic L_Statement of Activity by Month.xlsx`

WOCPLC is SNACK's legal name; the QuickBooks entity name is therefore expected.
The General Ledger is cash-basis and includes transactions through July 31,
2026. Verify every report header and reporting basis before mapping.

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
- Shannon should never paste the token into chat.

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

