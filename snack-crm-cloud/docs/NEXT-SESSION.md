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

Archived-task confirmation: revision `snack-crm-api-00058-j8n` deployed
successfully, served 100% of traffic, carried the approved Calendar ID, and had
`GOOGLE_CALENDAR_ENABLED=false` immediately before handoff. No later deployment
occurred in that task. Production `/` also opened Home as intended. These are the
last confirmed production states; still begin with the fresh read-only check.

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
- The General Ledger is cash-basis, has a January-December 2026 report header,
  contains transactions through July 31, 2026, uses one worksheet with range
  `A1:J458` and 413 transaction rows, and has no class/location column.
- Budget vs. Actual does not exist.
- AR Aging Detail and AP Aging Detail contained no data.
- Do not invent or estimate those unavailable values.

Show Shannon the proposed monthly import mapping, exclusions, and reconciliation
rules before changing the app or importing data.

## Confirmed Follow-On Safety Fix

Before the guided full-system test or any production cleanup, correct the Admin
Data Center registry. The current "complete" backup omits `outreachEvents`,
`outreachContacts`, `grantQuestions`, `staffUsers`, `adminSettings`, and
`messages`. Current Admin cleanup also cannot reach eligible Outreach and
grant-question fixtures in the omitted collections. Seeded staff/configuration
records use protected document IDs and must remain under the local seed-reset
workflow or a separate explicit manual procedure. Ordinary production cleanup
must never remove protected staff accounts, the protected director account, or
essential configuration. Add a behavior test comparing application, backup,
cleanup, and fixture collection coverage. No cleanup or import may proceed until
the repair passes.

Also refresh `docs/FULL-SYSTEM-TEST-GUIDE.md`. Its Knowledge Assessment 2026.1
and unscored-questionnaire expectations are superseded by the implemented
retrospective Knowledge Assessment 2026.2 and Questionnaire 2026.1 rules.

## Known Stale References

- The root Launch Tracker and Production Readiness Checklist still say the
  QuickBooks reports need to be supplied; the six files are already present.
- The root Launch Tracker and Roadmap place the Calendar lifecycle later or call
  for credential setup. The live configuration is already recorded; verify it,
  then run the paused lifecycle first without repeating setup unless it is missing.
- The Roadmap proposes a QuickBooks Budget vs. Actual import, but that report
  does not exist.
- The Roadmap still lists controlled counting and survey/KPI mapping as pending;
  the focused-risk evidence and current implementation supersede those entries.
- The questionnaire mapping draft and KPI decision guide contain superseded
  prospective Knowledge Assessment status. Use `PRODUCT-DECISIONS.md` and the
  current repository for the implemented rules.
- The Calendar connection plan's broad reference to program-session sync is not
  current launch scope. Only one-way Clinic appointment sync is implemented;
  Kitchen and School Calendar sync remain future work.
- README's shortened `evaluationInstruments`, `evaluationQuestions`, and
  `evaluationResponses` collection names do not match the implemented
  `performanceEvaluation*` collection names.

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
