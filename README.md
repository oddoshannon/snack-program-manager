# SNACK CRM System

This project is a Google Apps Script starter app for SNACK's internal operations system. It uses one Google Spreadsheet as the database, Apps Script as the automation layer, Google Calendar for appointment events, and an Apps Script HTML dashboard for daily operations.

The central design rule is: everything important becomes a task. Appointments, no-shows, referrals, forms, outreach, and reporting workflows all feed the `Tasks` sheet.

## What Is Included

- Spreadsheet schema for:
  - `Contacts`
  - `Appointments`
  - `Tasks`
  - `Programs`
  - `KPI Data`
  - `Outreach`
  - `Staff`
  - `Settings`
- Apps Script setup menu for creating and repairing sheets.
- Appointment workflows:
  - created appointments update contact status, create Calendar events, and create prep tasks.
  - completed appointments create chart note and form-entry tasks.
  - graduation appointments update contact status and create graduation paperwork tasks.
  - no-shows update client status and create follow-up tasks.
- Todoist-style task functions for manual and automated tasks.
- A web dashboard showing today's appointments, overdue tasks, due-today tasks, and follow-ups.
- Basic KPI and outreach recording helpers.

## Files

- `appsscript.json` - Apps Script manifest and scopes.
- `Config.gs` - schema, statuses, default settings, and constants.
- `Database.gs` - sheet setup and row helpers.
- `Code.gs` - menu, web app entrypoint, contacts, appointments, tasks, and dashboard API.
- `WorkflowEngine.gs` - appointment, no-show, referral, and Calendar workflows.
- `Reporting.gs` - KPI and outreach helper functions.
- `WebApp.html` - daily operations dashboard UI.

## Setup In Google Workspace

1. Create a new Google Spreadsheet named `SNACK CRM`.
2. Open `Extensions > Apps Script`.
3. Add the `.gs`, `.html`, and `appsscript.json` files from this folder to the Apps Script project.
4. Reload the spreadsheet.
5. Use the `SNACK CRM > Setup / Repair Sheets` menu item.
6. Approve permissions when prompted.
7. Use `SNACK CRM > Open Dashboard` to work from the operational dashboard.

## Optional Clasp Setup

If you want to deploy from this local folder with `clasp`:

```bash
npm install -g @google/clasp
clasp login
clasp create --type sheets --title "SNACK CRM"
clasp push
```

After the Apps Script project exists, keep its generated `.clasp.json` locally. Do not commit private script IDs unless this repository is private.

## First Workflow To Test

1. Run `setupSnackCrm`.
2. Add one row to `Contacts`.
3. From Apps Script, run `createAppointment` with a test payload:

```js
createAppointment({
  ContactID: 'CON-EXAMPLE',
  'Appointment Type': 'Enrollment',
  Date: '2026-05-22',
  Time: '09:00',
  Staff: 'Shannon',
  'Lesson Number': 1,
  Goal: 'Initial enrollment'
});
```

Expected result:

- An appointment row is created.
- A Google Calendar event is created if Calendar permission is approved.
- Contact status becomes `Scheduled`.
- Prep and enrollment form tasks are created.

## Recommended Next Build Steps

1. Add import helpers for current Zoho and Setmore exports.
2. Add Google Form submit triggers for intake, enrollment, feedback, and assessments.
3. Add recurring trigger for `createReferralFollowUpTasks`.
4. Add report-generation exports to Google Docs and PDF.
5. Decide whether the long-term front end should stay as Apps Script HTML or move to AppSheet.
