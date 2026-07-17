# SNACK Program Manager

The SNACK Program's operations system for scheduling, referrals, clients, outreach, fundraising, marketing, operations, public booking, and administrative tools.

- Production staff site: https://snack-crm.web.app
- Database: Firestore in the `snack-crm` Google Cloud project
- Staff sign-in: Google accounts restricted to `@snackprogram.org`
- Public booking: standalone client-facing booking and booking-management pages

The Google Apps Script files in the repository root are retired and are not part of this application.

## How the application is organized

```text
Staff or client browser
        |
        | secure staff token for protected actions
        v
Firebase Hosting ---- /api requests ----> Cloud Run server
                                                |
                                                v
                                             Firestore
```

### Backend

```text
backend/
  server.js              Small setup file that registers feature files
  lib/core.js            Shared database, sign-in, cleaning, and serialization rules
  routes/
    appointments.js      Appointment and prep-checklist actions
    clients.js           Client actions
    referrals.js         Referral actions
    tasks.js             Task actions
    activity-logs.js     Calls and texts
    grants.js            Grant tracking
    outreach.js          Outreach events and contacts
    referral-network.js  Provider and organization contacts
    admin.js             Counts, exports, deletion controls, and settings
    public-booking.js    Public booking, canceling, and rescheduling
    messages.js          Connection check
  test/
    backend-helpers.test.mjs
    clean-schedule.test.mjs
    frontend-contracts.legacy.mjs  Historical checks for the retired interface
    qa-public-booking-api.mjs
```

List actions use `fetchAllDocuments()` to load every record in batches. There is no fixed total-record ceiling that can make older records disappear.

### Staff interface

The clean staff interface is built from one locked visual system:

```text
frontend/public/
  clean.css              Shared approved colors, typography, spacing, and interaction rules
  clean.js               Shared navigation, module rendering, and connected behavior
  modules/schedule.js    Testable schedule data and formatting rules
  template.html          Visual rulebook preview
  template.js            Generic rulebook content and interactions
  schedule.html          Clean Scheduling page
  crm.html               Clean CRM page
  outreach.html          Clean Outreach page
  fundraising.html       Clean Fundraising page
  marketing.html         Clean Marketing page
  operations.html        Clean Operations page
  admin.html             Clean Admin page
  index.html             Current default clean module entry page
  app-config.js          Local and production server addresses
```

The older `app.js` and `styles.css` files remain temporarily as functionality and public-booking references. They are not the design foundation for clean staff pages and should not be expanded.

### Public booking

`booking.html` and `booking.js` provide the public landing page and appointment-type selection. `book.html` and `book.js` provide scheduling, multi-child booking, confirmation, and private booking management. Public actions do not require staff sign-in, but they are rate-limited and cancel/reschedule actions require a secure management token.

## Database collections

`referrals`, `clients`, `appointments`, `tasks`, `activityLogs`, `grants`, `grantQuestions`, `referralNetwork`, `outreachEvents`, `outreachContacts`, `adminSettings`, and `messages`.

## Local development

Start the backend from `snack-crm-cloud/backend/`:

```bash
npm install
npm run dev
```

The backend runs at `http://127.0.0.1:8080` unless configured otherwise.

Serve `snack-crm-cloud/frontend/public/` with a local static server. The clean Scheduling page is `schedule.html`, and the visual reference is `template.html`.

## Required checks

Run the backend tests:

```bash
cd snack-crm-cloud/backend
npm test
```

Run the shared code-quality check:

```bash
cd snack-crm-cloud
npm install
npm run lint
```

GitHub automatically runs both checks whenever a branch is pushed or proposed for inclusion in the main version.

## Security

- Protected server actions verify a Firebase sign-in token and require an `@snackprogram.org` account.
- Public booking actions have separate protections appropriate for clients who do not have staff accounts.
- Mass deletion is disabled unless `ALLOW_ADMIN_BULK_DELETE=true`; production should keep it disabled.
- Staff access levels are not implemented yet. Current staff accounts have the same server permissions.

## Current combination work

This branch combines the clean visual-rulebook interface with the July 2026 backend reorganization:

1. The clean module pages and visual template remain the staff-interface foundation.
2. The backend is separated into feature-specific files.
3. Full-record loading replaces fixed list limits.
4. Scheduling prep checkboxes save through the appointment feature file.
5. Automatic tests and code-quality checks run locally and on GitHub.

The rejected rulebook restyling of the older single-page interface is not included.
