# Locked Product Decisions

Last updated: August 4, 2026

These decisions are approved unless you explicitly reopen them.

## Product Structure

- The first staff screen is Home, not a marketing page or a module page.
- Home is compact and does not duplicate the CRM Dashboard queues.
- Main modules are Schedule, CRM, Outreach, Finances, Marketing, Operations,
  and Admin.
- The clean template controls typography, spacing, tabs, colors, navigation,
  counters, hover behavior, and field layout.
- Use `Kitchen`, never `Cooking`, in the interface.
- Program labels are Family Nutrition, Kitchen Classes, School Classes, and
  Outreach Events.
- Page titles match the selected submodule; module dashboards use the module
  name.

Finances navigation order:

1. Financial Activity
2. Grants
3. HRSN Billing
4. Budget
5. Giving

Giving contains Gifts, Donors, and Campaigns as tabs.

Admin contains Settings, Schedule, and Integrations. Settings contains Team,
Access, Forms, and Data. Admin has no Quick Actions panel.

## Access

- Access levels are configurable by an Admin, not hardcoded forever.
- Initial roles are Admin, Staff, and Intern.
- Staff initially has Schedule, CRM, and Outreach.
- Intern initially has Schedule and Outreach.
- Admins can add access levels, change module access, activate accounts, and
  assign additional Admins.
- The protected director account cannot be demoted or deactivated if doing so
  would remove the last owner.
- `consultant@snackprogram.org` may have temporary Admin access only while the
  system contains sample data.
- Ordinary production cleanup never removes protected staff accounts,
  `adminSettings`, or other essential production configuration. Local
  staff/configuration fixtures remain local-reset-only. Any exceptional removal
  requires a separate explicit manual procedure, and the protected director
  account must never be eligible.

## Counting Rules

- A shared sibling appointment is one Appointment Delivered.
- Program Engagements counts one engagement per child on that appointment.
- Goals and Goal Results are stored once per child, even if siblings choose the
  same goal.
- Goal Achievement uses child-level results.
- A Clinic graduation is counted once when the final appointment in the series
  is marked Completed, using the calendar year.
- School participant identifiers are not feasible now. Count the aggregate
  participant total on each completed School class as unique participants.
- Kitchen attendance counts children, not family registrations.
- In-kind gifts never increase revenue.

## Revenue And Finance Rules

- Financial Activity is the revenue ledger; Operations only calculates.
- Total Revenue is automatic and sums dated recognized revenue sources.
- Financial dashboard source groups are Grants, HRSN, Workbook Sales, and Other.
- HRSN approval temporarily counts as recognized revenue on Approval Date.
- HRSN recognized revenue is not the same as cash received or cash on hand.
- Switch HRSN recognition to payment receipt only when reliable accounting data
  is available.
- Budget should show budget versus actual, cash projection, months of cash on
  hand, and later direct cost per participant when source data is reliable.
- Budget categories are editable and must never be hardcoded permanently.
- Do not add shared overhead to participant cost until direct program costs and
  participant denominators are stable.
- Restricted and unrestricted fund handling is deferred until QuickBooks
  conventions are understood.
- QuickBooks monthly report imports are preferred unless API access is later
  approved. Do not require the treasurer to approve an API for launch.
- The confirmed General Ledger is cash-basis, covers January-December 2026 in
  its header, contains transactions through July 31, 2026, uses one worksheet
  with range `A1:J458` and 413 transaction rows, and has no class/location
  column. Do not invent a class mapping from that report.
- Store imported QuickBooks actual spending as monthly totals by expense
  account and SNACK program. Do not place expenses in Financial Activity and do
  not show employee-level payroll rows in the ordinary app.
- QuickBooks expense-account mappings must be editable. Every true expense row
  in a future ledger must receive an expense category and a program assignment
  or remain visibly Unallocated for review. Never force unknown spending into
  General Operations and never count cash, liability, or other balancing rows
  as additional expense.
- In QuickBooks source terminology, `HRSN` maps to the app's `Clinic` program and
  `Kids CAN!` maps to the app's `Kitchen` program. The QuickBooks names remain
  source labels only and are not the display names used by SNACK Program Manager.
- Payroll classification may use employee hours and hourly rates supplied by
  the director. The private review calculates each program's wage amount and
  percentage; related payroll taxes can follow the approved wage allocation.
- Imported QuickBooks actual spending, payroll allocation, and detailed
  classification review are Admin-only.

## Clinic Evaluation And Forms

- Every active survey item must map to a logic-model outcome and a KPI.
- Knowledge Assessment 2026.2 is a retrospective Graduation form: each child
  answers Before SNACK and Now for all 34 approved Yes/No statements.
- The Knowledge Assessment is child-focused. A child may answer directly or a
  caregiver may answer about the child's knowledge; the current workflow does
  not collect or exclude by a separate respondent type.
- Knowledge statements cover all approved learning objectives; do not shorten
  only for brevity.
- The assessment is self-reported knowledge, not an objective quiz. Accessibility
  and avoiding a school/test feeling are priorities.
- No/Yes is displayed left to right in that order.
- Lessons retain their approved CRM lesson colors: red, orange, yellow, green,
  teal, blue, and purple. There is no pink lesson.
- Remove the hyphen from `nutrient dense` everywhere in client-facing wording.
- Each lesson contributes equally to the overall knowledge score.
- Calculate each child's Before SNACK and Now scores by averaging the seven
  lesson percentages, then average each completed child's percentage-point
  change for the program KPI. Keep lesson- and item-level results visible.
- Report absolute score movement carefully; final public wording for a 57.1
  point change can be workshopped later.
- Questionnaire 2026.1 is used at Enrollment and Graduation.
- `I don't know` is missing, never zero. It remains selectable and does not skip
  or auto-mark a following question as not applicable.
- Do not automatically skip frequency follow-ups after a response of 0 or
  `I don't know`; staff retains control over entered answers.
- Behavior domains are normalized to 0-100 so questions with larger raw ranges
  do not receive extra weight.
- Guideline-aligned food behavior requires all four approved food domains.
- Broader Behavior Change requires at least five of seven behavior domains.
- Pair Enrollment and Graduation Questionnaire responses from the same version
  whenever possible. If versions differ, flag the result and calculate only
  unchanged items until a formal cross-version rule is approved.
- Use 2020 Dietary Guidelines as the curriculum foundation.
- Use AHA/AAP support for the universal under-25-grams-per-day added-sugar limit
  because the program avoids calorie counting.
- Physical activity wording: `I know how much physical activity is recommended
  each day.`
- Screen wording: `I know the recommended limits of screen time for fun each
  day.`
- Sleep is the only Healthy Habits recommendation that changes by age for the
  served population ages 6-18.
- Questionnaire and knowledge assessment are approved enough for system testing;
  further edits belong in the test findings.

## Form Workflow

- Native forms support Staff Entry, minimal one-section-at-a-time Client View,
  print, draft, completion, later viewing, and editing.
- Forms opened for entry from a client profile should open in a separate window
  when the page has no staff navigation.
- Print forms prefill child, completion date, and program point and preserve a
  consistent question-column width.
- Packet buttons belong with appointment details after every form is redesigned.
- Active English forms are finalized before Spanish versions to avoid duplicate
  editing.
- Preserve every historical response under its original instrument version and
  scoring rules.
- Historical imports are duplicate-checked and preserve source metadata. Exact
  and strong person matches still require the specified review; anonymous
  responses remain aggregate-only and are never guessed onto a client profile.
- Program Enrollment may update linked client data, including YCCO number.
- Leave HRSN Screener wording unchanged; prefill name, date, birthdate, and YCCO
  number when available.
- Add satisfaction and confidence to feedback forms.
- Retain `How did you hear about SNACK?` on Enrollment.
- Replace broad `My health improved` feedback wording with focused quality-of-life
  questions.
- Record who answered only when it supports interpretation; do not add workflow
  burden without a defined use.

## HRSN Billing

- HRSN records link to a CRM client profile so name, DOB, address, Medicaid/YCCO
  number, and other available data can prefill.
- Description and Outcome are multi-select.
- Submitted and Approved remain separate, visible fields in display mode.
- Staff can select and approve many submitted records at once.
- Medicaid identifiers never appear in list subtitles or summary counters.

## Workflow Automation

- A No-show creates one same-day call task per linked child needing rescheduling.
- A completed or canceled appointment creates one next-appointment task when the
  child remains in Needs Reschedule.
- On a later calendar day, opening Home or CRM Dashboard creates one outcome
  review task for an appointment still marked Scheduled.
- Reopening a dashboard must not duplicate tasks.
- Recording an outcome closes the review task.
- Scheduling a replacement closes active scheduling/rescheduling tasks.
- Google Voice remains separate; do not build partial calling or texting inside
  the app.

## External Connections

- SNACK Program Manager becomes the appointment source of truth after cutover.
- Setmore remains available until the final controlled booking and Calendar
  tests pass; disable it when SNACK takes over new booking.
- Google Calendar is one-way Clinic synchronization with private-safe event text.
- Kitchen and School Calendar synchronization are future work.
- MailerLite syncing must honor consent source/date and opt-outs. Sending remains
  disabled until Marketing workflows pass testing.
- English messages and forms are locked before Spanish versions.
