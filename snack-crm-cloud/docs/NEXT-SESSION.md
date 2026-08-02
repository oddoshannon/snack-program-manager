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

Repair and test the Admin Data Center collection coverage. The exact scope and
safety rules are below. Do not clean production or import data while doing this
work.

The QuickBooks no-write review is complete. Its source findings, exclusions,
checks, and proposed monthly actual-spending design are in
`docs/QUICKBOOKS-PREVIEW-2026-08-01.md`. No data was imported. Approval is still
needed before building that importer.

Calendar handoff: revision `snack-crm-api-00060-kpj` serves 100% of traffic with
the approved Calendar ID and `GOOGLE_CALENDAR_ENABLED=false`. The production
lifecycle test passed access, create, update, delete, and cleanup. The temporary
QA event was removed. A controlled appointment test is still required before
automatic sync can be enabled.

## Confirmed Immediate Safety Fix

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
  for credential setup. The handoff now records the successful production
  lifecycle test. Do not repeat setup or that test unless a later check finds a
  problem. The controlled appointment test is still required before enabling
  automatic sync.
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

- Speak to the user as `you`, not by name. Use very plain English and avoid
  jargon. If a technical term is necessary, explain it immediately.
- Prefer one large, safe pass of related work over many small approval stops.
  Afterward, separate what Codex can continue independently from what truly
  needs the user's decision or participation.
- End every user-facing update with bold `Next step` and `Input needed from you`
  lines so they are easy to find.
- Never reset or clean the dirty worktree.
- Work only in `snack-crm-cloud/`; root Apps Script files are retired.
- Preserve the clean visual rulebook.
- Record every newly approved durable decision in these handoff documents.
- Keep tasks focused and compact.
- Run tests and lint after code changes.
- Do not deploy unless the current change has been verified and you have asked
  for or approved the deployment stage.

## Prompt For The New Task

Use the following prompt verbatim:

> Continue the SNACK Program Manager project from its durable handoff. First
> read `/Users/shannonoddo/Desktop/CRM App/AGENTS.md`,
> `/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/README.md`, and these files:
> `docs/PROJECT-STATE.md`, `docs/PRODUCT-DECISIONS.md`,
> `docs/REMAINING-WORK.md`, `docs/TEST-STATUS.md`,
> `docs/INTEGRATIONS.md`, and `docs/NEXT-SESSION.md`. Treat those files as the
> source of truth and do not reconstruct decisions from the retired task. Begin
> with the first work item in `docs/NEXT-SESSION.md`: repair and test the Admin
> Data Center collection coverage before any cleanup, importer work, or data
> import. The completed QuickBooks proposal is in
> `docs/QUICKBOOKS-PREVIEW-2026-08-01.md` and still needs the user's mapping and
> access approval. Do not reset the dirty worktree, do not touch retired root
> Apps Script files, and do not import or deploy unverified data.
