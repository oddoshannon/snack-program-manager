# Next Codex Session

Last updated: August 4, 2026

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

Run the guided full-system test in short batches using the existing sample
records. Do not rebuild, reset, or clean the sample set until the test is
complete and the user explicitly approves cleanup. Avoid one long browser
session because it previously caused severe memory pressure on this Mac.

The QuickBooks no-write review is complete. Its source findings, exclusions,
checks, and proposed monthly actual-spending design are in
`docs/QUICKBOOKS-PREVIEW-2026-08-01.md`. No data was imported. The monthly
summary design, editable categories, HRSN-to-Clinic mapping,
Kids-CAN!-to-Kitchen mapping, payroll-assistance method, and Admin-only access
are approved. Classification work remains before importer development.

Calendar handoff: revision `snack-crm-api-00060-kpj` serves 100% of traffic with
the approved Calendar ID and `GOOGLE_CALENDAR_ENABLED=false`. The production
lifecycle test passed access, create, update, delete, and cleanup. The temporary
QA event was removed. A controlled appointment test is still required before
automatic sync can be enabled.

## Completed Local Safety Fix

The Data Center now includes all 28 application collections in backup. Eligible
Outreach and grant-question fixtures are reachable, while staff accounts, Admin
settings, and connection records are explicitly blocked from cleanup. The safe
local list also includes both implemented evaluation collections. The behavior
test compares application, backup, cleanup, local safety, and fixture lists.

All 270 backend tests pass and lint has 0 errors with the same 64 older warnings.
The full-system guide and future fake-data recipe now use retrospective
Knowledge Assessment 2026.2. No cleanup was run, no sample data was deleted, and
the repair has not been deployed.

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
> with the first work item in `docs/NEXT-SESSION.md`: run the guided full-system
> test in short batches using the existing sample records. Do not rebuild,
> reset, or clean the sample set until the test is complete and the user
> explicitly approves cleanup. The Data Center repair and corrected test guide
> pass locally but are not deployed. The approved QuickBooks proposal is in
> `docs/QUICKBOOKS-PREVIEW-2026-08-01.md`; classification remains before importer
> work. Do not reset the dirty worktree, do not touch retired root Apps Script
> files, and do not import or deploy unverified data.
