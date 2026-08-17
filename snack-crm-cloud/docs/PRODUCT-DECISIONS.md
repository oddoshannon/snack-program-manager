# Locked Product Decisions

Last updated: August 5, 2026

These decisions are approved unless you explicitly reopen them.

## Product Structure

- The first staff screen is Home, not a marketing page or a module page.
- Home is the combined daily dashboard. It keeps Today's Schedule and Tasks and
  also shows the four CRM Workflow queues: New Referrals, Reschedule, No Next
  Appointment, and Waiting on Family.
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
Access, CRM, Forms, and Data. Admin has no Quick Actions panel.

## Access

- Access levels are configurable by an Admin, not hardcoded forever.
- Initial roles are Admin, Manager, Staff, and Intern.
- Manager has Schedule, CRM, Outreach, and Finances. Inside Finances, Manager can
  use only Grants and Giving.
- Finance section access is editable for reusable access levels and must be
  enforced by both the screen and server.
- Staff initially has Schedule, CRM, and Outreach.
- Intern initially has Schedule and Outreach.
- Admins can add access levels, change module access, activate accounts, and
  assign additional Admins.
- The protected director account cannot be demoted or deactivated if doing so
  would remove the last owner.
- Admin may remove a temporary staff account from SNACK Program Manager with a
  two-step confirmation. This removes the app profile and access only, never the
  person's Google account. The protected director account and the account
  currently in use cannot be removed.
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
- `General operating` maps to `General Operations`. The main system allocation
  choices are Clinic, Kitchen, School, Community Programs, and General
  Operations. Unresolved items remain Unallocated. HRSN billing is Clinic work;
  Outreach and events normally belong to Community Programs unless they support
  a specific program; organization-wide administration and marketing belong to
  General Operations unless they support a specific program.
- `Commit To Be Fit` and `Monster Mania` map to `Community Programs`.
  `Dayton Nutrition Education` maps to `School`. `SMCF - Spirit Mt Community
  Fund` and `SNACK pass` map to `Clinic`.
- QuickBooks `Printing` and `Member benefit` costs follow the linked class or
  recipient program. Dayton printing is School nutrition workbooks, and Dayton
  member benefits are student incentives. Do not hardcode either account to one
  program because those accounts also contain costs for other classes.
- Payroll classification may use employee hours and hourly rates supplied by
  the director. The private review calculates each program's wage amount and
  percentage; related payroll taxes can follow the approved wage allocation.
- Cynthia's monthly planning rule is 4 Kitchen hours and 2 fewer Clinic hours in
  the Kitchen-class week. Use actual paid hours when available instead of the
  average-month estimate.
- The Executive Director planning estimate is 8 Clinic hours, 8 Kitchen hours,
  and 15 Community Program hours per month. School is seasonal: plan 40 School
  hours in each of two fall months, or 80 hours total. General Operations gets
  the remaining paid hours: about 142.34 in a normal month and 102.34 in a
  40-hour School month. Replace these estimates with tracked monthly hours when
  available.
- Imported QuickBooks actual spending, payroll allocation, and detailed
  classification review are Admin-only.
- The private payroll and expense review workbook is a planning aid, not an
  import file. Uncertain staff time, class aliases, and program assignments stay
  visibly unresolved until the user confirms them.

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
- A completed retrospective Knowledge Assessment shows Before SNACK, Now, and
  the percentage-point gain together on the client's Forms tab.
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
- HRSN Screener uses the exact original reimbursement explanation. Prefill name,
  date, birthdate, and YCCO number when available; remove primary care provider
  phone and hide Program Point in client, staff, and print views.
- Child and Caregiver Feedback use a four-choice scale: 1 = Not at all, 2 = A
  little, 3 = Mostly, and 4 = Completely. Show the meaning once in the
  instructions, keep all four choices on one line when space allows, and do not
  repeat the helper under every printed question.
- Preserve retired 0-5 feedback forms and their scoring for older responses.
- Add satisfaction and confidence to feedback forms.
- Retain `How did you hear about SNACK?` on Enrollment.
- Replace broad `My health improved` feedback wording with focused quality-of-life
  questions.
- Record who answered only when it supports interpretation; do not add workflow
  burden without a defined use.
- On the client Forms tab, show Program Enrollment first, followed by
  Questionnaire, HRSN Screener, Knowledge Assessment, Child Feedback, and
  Caregiver Feedback. Show the program point and action buttons, but hide the
  internal version, effective date, and description.
- Schedule > Print Forms uses one checklist so staff can print only the daily
  schedule, prep lists, client forms, and appointment notes they choose. Keep
  every selected form as its own document. When double-sided printing would put
  two different forms on opposite sides of one sheet, insert a blank back page.
- The printable family referral is a separate handwriting form with checkboxes,
  writing lines, and room for three children. It does not replace the online
  referral form.
- The appointment note keeps the participant goal and goal result used for
  performance reporting, the completed lesson, narrative notes, and whether an
  interpreter was used. Preferred language comes from the client profile,
  timestamps remain automatic, and whether a next visit exists is derived from
  the actual schedule rather than re-entered on the note.

## CRM And Schedule Settings

- Client statuses and their colors are editable in Admin > Settings > CRM.
- Age Limit is a standard status for children outside SNACK's 6-18 age range.
- Scheduled cannot be removed because new client records start there.
- Default appointment length is editable in Admin > Schedule.
- The public and staff page name is Finances. The old Fundraising address may
  exist only as a safe forward to Finances.
- Group the CRM client list by status. Reschedule, Scheduled, and Active begin
  open; Waiting on Family, Graduated, and Inactive begin closed. Include Expand
  All and Collapse All controls.
- Display Oregon as `OR` in addresses throughout the application.
- Kitchen class registration begins with a client search. Do not show an
  initial alphabetic checkbox list. Selecting an existing child fills stored
  caregiver, phone, and email details when available.
- An automatic Kitchen registration status applies to the whole selected
  family: register everyone when every child fits, otherwise waitlist everyone.
- Public appointment booking and public Kitchen registration reuse an existing
  CRM client only when exactly one safe match exists: child name plus birthdate,
  or, when birthdate is missing, child name plus caregiver phone or email.
  Never guess between multiple matches; create a separate reviewable record and
  a high-priority staff task instead. The CRM profile must show the possible
  match and let staff mark the review complete.
- The public family referral form creates one New referral per child and links
  children submitted together as siblings. It does not create client records.
- Public referral details may link to one existing referral-network provider
  only when the organization and provider identify exactly one record. Unknown
  or unclear providers remain on the referral, create a high-priority staff
  task, and show a prefilled Add to Referral Network action. They never create a
  trusted network entry automatically. Adding or linking the provider closes
  the review task.
- Client and referral sibling fields begin with a search and do not show a long
  checkbox list. Client and referral lists group records by status and include
  Expand All and Collapse All controls.
- Referral status order places Scheduled above Caregiver Will Call Back.
  Caregiver Will Call Back, Not Interested, and Closed/No Further Outreach begin
  collapsed; every other referral status begins expanded.
- Staff may permanently remove an incomplete native-form draft through two
  deliberate clicks: Delete Draft, then Confirm Delete. Completed forms are not
  deletable through this control.

## HRSN Billing

- HRSN records link to a CRM client profile so name, DOB, address, Medicaid/YCCO
  number, and other available data can prefill.
- Description and Outcome are multi-select.
- Submitted and Approved remain separate, visible fields in display mode.
- Staff can select and approve many submitted records at once.
- Medicaid identifiers never appear in list subtitles or summary counters.

## Workflow Automation

- New staff-entered and public referrals create one shared first-call task. A
  logged referral call completes that task.
- A referral may change to Not Interested only after staff explicitly confirms
  the closing result. Confirmed closure also completes its remaining open tasks.
- A No-show creates one same-day call task per linked child needing rescheduling.
- A completed or canceled appointment creates one next-appointment task when the
  child remains in Needs Reschedule.
- On a later calendar day, opening Home or CRM Dashboard creates one outcome
  review task for an appointment still marked Scheduled.
- Reopening a dashboard must not duplicate tasks.
- Recording an outcome closes the review task.
- Scheduling a replacement closes active scheduling/rescheduling tasks.
- Completing an Enrollment appointment without a completed Program Enrollment
  form creates one missing-form task. Completing that form closes the task.
- Tasks are shared across staff who have CRM access. `Assigned to` identifies an
  owner, but it does not create a separate private task list. The default Intern
  level cannot see CRM tasks because it has no CRM access.
- Schedule appointment Forms show the native CRM forms that belong to that
  appointment. Enrollment appointments show Program Enrollment, Questionnaire
  Enrollment, and HRSN. Final Healthy Habits/Lesson 7 appointments show
  Questionnaire Graduation, Knowledge Assessment, Child Feedback, and Caregiver
  Feedback. Saved responses keep the appointment link.
- Real provider connection failures may create one shared Admin task without
  including secrets or client message content. Intentionally paused or
  unconfigured providers do not create failure tasks.
- Google Voice remains separate until a complete Azure phone-number, calling,
  texting, consent, and logging plan is approved. Do not build a partial live
  communication workflow.

## External Connections

- SNACK Program Manager becomes the appointment source of truth after cutover.
- Setmore remains available until the August 5, 1:00 PM cutover. The final
  controlled staff and public booking tests passed; reconcile every future
  Setmore appointment before SNACK takes over new booking.
- Google Calendar is one-way Clinic synchronization with private-safe event text.
- Kitchen and School Calendar synchronization are future work.
- MailerLite syncing must honor consent source/date and opt-outs. Sending remains
  disabled until Marketing workflows pass testing.
- MailerLite connection status means MailerLite accepted the stored token in a
  read-only request; the presence of a token alone is not a successful check.
- The MailerLite token is stored in Google Secret Manager, attached to the
  production service, and passed the signed-in read-only connection check on
  August 5. Contact writes and email sending remain disabled.
- General Squarespace contacts may be copied through a read-only Contacts API
  connection while preserving the Squarespace marketing-permission value.
  Contacts without clear permission are not eligible for marketing email.
- The sticker-request form needs a form-specific connection because an ordinary
  contact record does not identify which website form was submitted. Its first
  approved action is to create or update the Marketing contact and create a
  shared staff task to send the sticker email; it must not send automatically
  until the template and sending rules are approved. Zapier and a Google Sheet
  connection remain the two implementation choices.
- Azure Communication Services is the selected text and calling provider. Real
  texts remain disabled until the phone number, 10DLC brand and campaign,
  consent, bilingual wording, timing, incoming events, calling, and logging are
  approved and controlled live tests pass.
- Never store or paste an Azure connection string in the repository or chat.
  Production credentials must be stored in Google Secret Manager and attached
  only to the Cloud Run service.
- The existing Google Voice number may be moved to Azure later. If the transfer
  succeeds, the public phone number stays the same; old Google Voice history does
  not move with it. Do not start the transfer until the Azure calling/texting
  plan, registration, record export, and cutover checks are ready. Browser
  calling remains an optional later feature. MailerLite remains the approved
  marketing-email service unless a separate change is approved.
- English messages and forms are locked before Spanish versions.
