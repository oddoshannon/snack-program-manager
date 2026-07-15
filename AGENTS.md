# SNACK Program Manager - Agent Instructions

Read this file and `snack-crm-cloud/README.md` before changing the app.

## Active application

The active application is `snack-crm-cloud/`, a Firebase Hosting, Cloud Run, and Firestore system for the SNACK Program. The `.gs` and `WebApp.html` files in the repository root are retired and must not be edited.

The staff interface uses the clean visual-rulebook pages in `frontend/public/`:

- `schedule.html`, `crm.html`, `outreach.html`, `fundraising.html`, `marketing.html`, `operations.html`, and `admin.html`
- `clean.js` for the shared staff interface and module behavior
- `clean.css` for the locked shared visual system
- `template.html` and `template.js` as the visual rulebook reference

Do not rebuild staff pages from the older `app.js`, `styles.css`, or the old single-page `index.html` structure. Those files remain only as legacy functionality and public-booking references while useful behavior is moved into the clean interface.

## Backend structure

```text
snack-crm-cloud/backend/
  server.js         App setup and feature-file registration only
  lib/core.js       Database setup, sign-in protection, serializers, and shared rules
  routes/*.js       One server file per feature area
```

## Required rules

1. Put new server actions in the matching `backend/routes/<feature>.js` file. Put genuinely shared rules in `backend/lib/core.js` and export them there.
2. Use `fetchAllDocuments(query)` for list reads. Never add a fixed total-record cap that can silently hide older records.
3. Keep `backend/server.js` small. Do not add feature actions or data-cleaning rules there.
4. Keep staff-interface changes in the clean page system. Refer to `template.html`, `template.js`, and `clean.css` before changing shared layout, typography, colors, navigation, tabs, counters, hover behavior, or spacing.
5. Preserve the approved visual rules. Do not reintroduce the old green styling, all-capital labels, dark-green hovers, or older single-page layout.
6. Escape any data inserted into HTML by using the existing `escapeHtml` helper.
7. All `/api/**` server actions except `/api/public/**` must require verified staff sign-in.
8. Public booking must remain rate-limited and protected by booking-management tokens for canceling and rescheduling.
9. Run `npm test` in `snack-crm-cloud/backend/` and `npm run lint` in `snack-crm-cloud/` before finishing a change. Every test must pass, and no new lint errors or warnings may be introduced.
10. Add behavior tests for new shared backend and clean-interface rules. Do not reactivate or add to `frontend-contracts.legacy.mjs`; it is only a historical record of the retired interface.

## Working with Shannon

- Explain progress in plain product language first.
- When a technical term is necessary, define it immediately in parentheses.
- Avoid unexplained terms such as scaffold, ported, tracked, untracked, committed, deployed, and checkpoint.
- Do not change approved visual structure to make content easier to fit without Shannon's approval.
- At the end of a work summary, include what comes next and what input, if any, Shannon needs to provide.

## Current priorities

1. Complete and verify the clean Scheduling workflow.
2. Carry working CRM behavior into the clean CRM interface.
3. Connect the remaining clean module pages to real data and actions.
4. Add staff access levels before onboarding additional users.
5. Replace older source-text checks with behavior tests and continue retiring unused legacy frontend code.
