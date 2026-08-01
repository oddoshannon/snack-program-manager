# Next Codex Session

Last updated: August 1, 2026

## Required Reading Order

1. `/Users/shannonoddo/Desktop/CRM App/AGENTS.md`
2. `/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/README.md`
3. `docs/PROJECT-STATE.md`
4. `docs/PRODUCT-DECISIONS.md`
5. `docs/REMAINING-WORK.md`
6. `docs/TEST-STATUS.md`
7. `docs/INTEGRATIONS.md`

Read detailed referenced documents only when the current task needs them. Do not
load every historical document or every screenshot into one context.

## First Work Item

Resume the Google Calendar connection safely:

1. Verify the live `snack-crm-api` service still has the approved Calendar ID
   and `GOOGLE_CALENDAR_ENABLED=false`.
2. Run the protected `Clinic Appts` create-update-delete lifecycle test.
3. Confirm the response reports access, created, updated, and removed.
4. Confirm no QA event remains.
5. Keep automatic sync disabled and report the result.

Do not repeat Calendar sharing or Cloud Run configuration unless verification
shows it is missing. No temporary event was created in the interrupted task.

Because browser automation caused severe memory pressure on this Mac, prefer a
direct authenticated API test. If that is not reasonably available, ask Shannon
to sign into Admin > Integrations and manually click Run Test while Codex limits
itself to interpreting the result. Do not launch a long Chrome automation
session.

## Second Work Item

Inspect the six available QuickBooks workbooks under `Quickbooks Reports/` and
produce a preview-only mapping proposal. Use the spreadsheet skill and do not
modify the originals.

Important facts:

- WOCPLC is SNACK's legal name.
- Budget vs. Actual does not exist.
- AR Aging Detail and AP Aging Detail contained no data.
- Do not invent or estimate those unavailable values.

Show Shannon the proposed monthly import mapping, exclusions, and reconciliation
rules before changing the app or importing data.

## Working Rules

- Never reset or clean the dirty worktree.
- Work only in `snack-crm-cloud/`; root Apps Script files are retired.
- Preserve the clean visual rulebook.
- Record every newly approved durable decision in these handoff documents.
- Keep tasks focused and compact.
- Run tests and lint after code changes.
- Do not deploy unless the current change has been verified and Shannon has
  asked for or approved the deployment stage.

## Prompt For The New Task

Use the following prompt verbatim:

> Continue the SNACK Program Manager project from its durable handoff. First
> read `/Users/shannonoddo/Desktop/CRM App/AGENTS.md`,
> `/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/README.md`, and these files:
> `docs/PROJECT-STATE.md`, `docs/PRODUCT-DECISIONS.md`,
> `docs/REMAINING-WORK.md`, `docs/TEST-STATUS.md`,
> `docs/INTEGRATIONS.md`, and `docs/NEXT-SESSION.md`. Treat those files as the
> source of truth and do not reconstruct decisions from the retired task. Begin
> with the first work item in `docs/NEXT-SESSION.md`: finish the paused live
> Google Calendar lifecycle test while automatic sync remains disabled. Avoid a
> long Chrome automation session because it previously caused severe memory
> pressure on this Mac. After reporting the Calendar result, inspect the
> QuickBooks reports using the preview-only instructions in the handoff. Do not
> reset the dirty worktree, do not touch retired root Apps Script files, and do
> not import or deploy unverified data.

