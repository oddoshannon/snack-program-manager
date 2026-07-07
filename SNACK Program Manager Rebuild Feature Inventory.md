# SNACK Program Manager Rebuild Feature Inventory

This file is the working feature and function list for the clean rebuild on the
`snack-program-manager` branch. The current working app stays intact as the
fallback while this new version is planned and built.

## Rebuild Rules

- Build the new app from the updated visual direction first, not from the old
  V1 styling.
- Keep every visible button honest: if a button is visible, it should work. If
  it is not ready yet, hide it or label the area as Coming soon.
- Reuse working business rules when they are helpful, but do not let old layout
  or visual decisions drive the rebuild.
- Scheduling, CRM, Outreach, Fundraising, Marketing, Operations, and Settings
  should feel like one app with one consistent design system.
- Each module should use the same page structure shown in the module sandbox
  screenshots:
  - Title and short subtitle on the left.
  - View tabs and main action button on the right.
  - One module-colored summary strip directly beneath the header.
  - Search/list panel, profile/summary column, and detail panel below when the
    module needs a working record view.
- Color-code the whole module experience to that module color, including the
  active navigation item, active tabs, primary action button, summary strip, and
  key status accents.
- Put Operations above Settings in the main navigation, and keep Operations in
  the dark blue/indigo color family from the sandbox.
- Kitchen and School scheduling can remain Coming soon.
- Native forms can remain print-packet based until the program KPI and form
  requirements are finalized.
- Public booking should visually resemble the Setmore booking page enough that
  families are not confused by the switch.
- Avoid dark green hover states for profile names, list rows, tabs, and cards.
- Avoid all-caps labels unless they are part of an official name.
- Treat the screenshots as design direction, not pixel-perfect sources. Fix
  sandbox problems during the rebuild, including cut-off content, misaligned
  words/boxes, cramped labels, and tabs that run out of space.
- Keep narrow-window behavior usable: content should resize, the side navigation
  should be collapsible, and key panels should not cut off.

## Shared App Shell

### Must work before review

- Staff sign-in with SNACK-approved Google accounts.
- Main navigation with these modules:
  - Schedule
  - CRM
  - Outreach
  - Fundraising
  - Marketing
  - Operations
  - Settings
- Collapsible left navigation:
  - Default open.
  - Can collapse to a slimmer version for narrow browser windows.
  - Quick actions and user identity remain reachable.
- Shared page header pattern:
  - Page title.
  - Short description when helpful.
  - Module tabs or view buttons.
  - Main action button.
  - Summary strip/cards using each module color.
- Shared list/detail pattern:
  - Left list or board when useful.
  - Main detail panel.
  - Stable spacing and aligned labels.
  - No content cut off at narrow widths.
- Shared interaction rules:
  - Search fields filter without page jumping.
  - Edit buttons should make fields editable in place when possible.
  - Save/cancel should give clear feedback.
  - Status pills should use consistent colors.
  - Rows and cards should have subtle hover states, not dark green.
- Shared activity history:
  - Record important actions such as appointment created, completed, updated,
    no-showed, rescheduled, referral converted, client status changed, task
    completed, and contact added.
- Shared print behavior:
  - Print buttons should open clean print views.
  - Print views should hide app navigation and non-print controls.

### Useful later

- Role-specific access for Admin, staff, interns, and event helpers.
- User-specific dashboards.
- Global search across clients, referrals, providers, donors, events, and tasks.
- Global notification center.

## Schedule Module

### Staff clinic scheduling

Must work before review:

- Page header for Clinic Schedule with Day, Week, and Month views.
- Remove the List view unless a truly different list view is needed later.
- Move Classic out of the primary header or hide it during the rebuild.
- Do not include a Classic view button in the rebuilt scheduling module.
- Date controls:
  - Today button.
  - Previous/next date buttons.
  - Date picker with icon and date aligned on one row.
  - Month picker without tiny appointment-counter numbers inside the date cells.
- Summary strip:
  - Today count.
  - Completed count.
  - No Show count.
  - Reschedule count.
- Available appointment days and hours come from Settings, not hard-coded values.
- Cynthia default availability:
  - In office 1:00 PM to 6:00 PM.
  - First appointment start 1:30 PM.
  - Last appointment start 5:30 PM.
- Adjustable Settings should control:
  - Appointment days.
  - Office opens.
  - Office closes.
  - First appointment start.
  - Last appointment start.
  - Default appointment duration.
  - Booking slot size.
  - Staff availability.
- Day view:
  - Time grid starts and ends according to settings.
  - Hour and half-hour labels show on the left, including 1:30, 2:30, 3:30, etc.
  - Appointment blocks start and stop exactly according to time and duration.
  - 45-minute appointments are taller than 30-minute appointments.
  - Appointment blocks should not show the time inside the colored block if it
    causes crowding.
  - Appointment block should show client name, status, lesson/type, and duration
    only if there is enough space.
  - Back-to-back appointments should not overlap or cover text.
  - Clicking an appointment should not reset the schedule scroll position.
- Click-to-book:
  - Open slots should be selectable in 15-minute chunks.
  - Staff scheduler can create appointments from an open slot.
  - Occupied slots should not create double bookings.
- Week view:
  - Only show appointment days from Settings.
  - Show all appointments for each available day.
  - No dark green hover state.
  - Selecting an appointment opens the detail panel.
- Month view:
  - Only show appointment days from Settings.
  - Show enough daily appointment detail to identify more than the first
    appointment.
  - Clicking a day with multiple appointments should let staff select among the
    appointments on that day.
  - Open days should be clear but not visually dominant.
- Unscheduled clients:
  - View unscheduled clients without hiding navigation quick actions.
  - Show client name, status, caregiver, phone, and scheduling action.
  - Schedule from the unscheduled list.
  - Prevent double booking.
  - Drag/drop can come later if the click workflow works first.

### Appointment detail panel

Must work before review:

- Detail panel should stay in place while fields become editable.
- No large modal for normal new/edit/reschedule/complete flows.
- Header shows:
  - Status.
  - Client name or combined multi-client name.
  - Date.
  - Time and duration.
  - Appointment type.
- Family card shows:
  - Caregiver.
  - Siblings as first names only.
  - Sibling names link to their profiles.
  - Language.
  - Phone.
  - Address.
  - View Family Profile link.
- Tabs:
  - Appt Note.
  - Wrap Up.
  - Activity.
  - Forms.
- Appt Note tab:
  - Details card.
  - Lesson on left and staff on right.
  - Goal below lesson/staff.
  - Notes below goal.
  - Enrollment appointments should still show a Notes row.
  - Blank space after Notes is okay so longer notes have room later.
  - Prep checklist.
  - Print prep/notes action.
- Wrap Up tab:
  - Next appointment section.
  - Checkbox to schedule the next lesson.
  - Date, time, staff, goal, and notes for next appointment.
  - Appointment note area.
  - Engagement fields:
    - Caregiver mood.
    - Confidence.
    - Participation.
    - Barriers.
  - Dropdown arrows visible.
  - Complete Appointment button with proper padding.
  - Complete Appointment button actually changes appointment status, saves wrap
    up fields, optionally creates next appointment, and updates the schedule.
- Activity tab:
  - Compact activity log.
  - Proper spacing between tab top and content card.
  - Rows show date, action, and short detail.
- Forms tab:
  - Print-packet links for enrollment and final appointment.
  - Spanish packet links when applicable.
  - Native forms remain later.
- Bottom actions:
  - Mark Complete moves to Wrap Up tab.
  - Complete Appointment saves completion.
  - Reschedule opens inline reschedule editing and Save works.
  - No Show changes status and creates follow-up work as needed.
  - Cancel changes status and preserves notes.

### New appointment

Must work before review:

- New Appointment opens inline in the detail panel.
- Left summary updates live when staff changes client, date, time, status, type,
  and staff.
- Client selection:
  - Type-ahead search.
  - Shows matching clients.
  - Allows adding more than one client to the same appointment.
  - Multi-client appointments save as one appointment.
- Fields:
  - Status.
  - Date.
  - Time.
  - Appointment type.
  - Staff.
  - Lesson when relevant.
  - Goal.
  - Notes.
- Time menu includes every available slot from Settings, not just times that
  already have appointments.
- Save creates the appointment and updates the schedule without page reload.

### Appointment data rules

Must work before review:

- Appointment statuses:
  - Scheduled.
  - Completed.
  - No Show.
  - Reschedule.
  - Canceled.
- Status wording should use "Reschedule", not "Needs Reschedule".
- Preserve notes when appointments are canceled, no-showed, or rescheduled.
- Multi-client appointment should display first names together when useful.
- Sibling Setmore imports should merge into one multi-client appointment where
  appropriate.
- Public booking and staff scheduling should use the same availability and
  duration rules.

### Print behavior

Must work before review:

- Print daily schedule.
- Print prep sheets.
- Print appointment note sheets.
- Print form packet links from appointment/profile.
- Print output should be clean, readable, and free of navigation clutter.

## Public Booking

### Public services

Must work before review:

- Public service choices are exactly:
  - Enrollment Appointment, 30 min.
  - Nutrition Education Appointment, 30 min.
  - Cita de inscripción en español, 30 min.
  - Cita de educación nutricional en español, 30 min.
- Spanish service types should create Spanish-language internal defaults.
- Language preference does not need to steer the service list because families
  choose the service before filling out their info.

### Public booking flow

Must work before review:

- Standalone SNACK-branded booking page.
- Visual style close enough to Setmore that families recognize the experience.
- Families choose appointment type.
- Families choose date and time from real availability.
- Families can add multiple children to one appointment.
- Public booking fields:
  - Child name.
  - Child date of birth.
  - Child gender.
  - Add another child.
  - Caregiver name.
  - Mobile phone, required.
  - Email, required.
  - Address.
  - Preferred language.
  - Preferred contact method: email, text, or phone call.
  - YCCO member yes/no.
  - YCCO ID number, optional if yes.
  - Consent to email/text reminders.
- Confirmation screen after booking.
- Confirmation should not expose staff-only data.
- Booking creates:
  - Appointment.
  - Client or client-review record.
  - Activity entry.
  - Staff review task if needed.

### Public manage booking

Launch blocker:

- Caregivers can reschedule online.
- Caregivers can cancel online.
- Management link should be secure enough that private app data is not exposed.
- Cancel/reschedule must be browser-tested before replacing Setmore.

### Public booking safety

Must work before review:

- Prevent double booking.
- Respect lead time and scheduling window.
- Respect staff availability.
- Store reminder consent.
- Basic spam protection.
- Clear error messages if a slot is no longer available.

Useful later:

- Native reminder engine.
- Calendar invite emails.
- Google Calendar sync.
- Embedded version for Squarespace if the website plan changes later.

## CRM Module

### CRM navigation

Must work before review:

- CRM module tabs:
  - Clients.
  - Referrals.
  - Referral Network.
  - Tasks if kept inside CRM.
  - Forms or print packets.
- Use list view only for clients unless a board becomes truly functional.
- Remove non-working client board view.
- Client status pill goes on the left side of the name.
- Client status wording uses "Reschedule", not "Needs Reschedule".
- Search and filters work without changing the profile unexpectedly.

### Client list

Must work before review:

- Simple name list for large client counts.
- Status pill next to each name on the left.
- Enough secondary detail to distinguish clients without making rows tall.
- Select a client to open profile.
- Status filter.
- Search by child, caregiver, phone, language, and status.

### Client profile

Must work before review:

- Wider profile layout from the sandbox direction.
- Header:
  - Status.
  - Client name.
  - First appointment.
  - Recent contact.
  - Caregiver.
- Family section:
  - Caregiver.
  - Siblings.
  - Sibling names link to sibling profiles.
  - Language.
  - Phone.
  - Address.
  - View Family Profile link.
- Program section:
  - Current stage.
  - Provider profiles.
  - Provider names link to provider profiles.
- Tabs:
  - Overview.
  - Notes.
  - Activity.
  - Appointments.
  - Forms.
- Overview cards:
  - Snapshot.
  - Lesson Progression.
  - Referral.
- Lesson Progression:
  - Eight program lessons.
  - Clicking a lesson can advance/update current progression.
  - Shows done/next/not started states.
- Action buttons:
  - Log Call.
  - New Appointment.
  - Close Client.
- Edit behavior:
  - Edit profile fields in place where possible.
  - Save/cancel clearly.
  - Do not lose links to siblings/providers.

### Client statuses

Must work before review:

- Active.
- Scheduled.
- Reschedule.
- Priority Reschedule if still wanted.
- Needs Language Support if still wanted.
- Waiting on Family.
- Graduated.
- Inactive or Closed.

### Referrals

Must work before review:

- Referral list with search, filters, and status counters.
- Referral profile view.
- Referral fields:
  - Referral type.
  - Referral source.
  - Caregiver.
  - Child.
  - Preferred contact method.
  - Phone.
  - Email.
  - Language.
  - Address.
  - Notes.
  - Referral date.
  - Contact dates.
- Referral status flow:
  - New.
  - Contacted.
  - Scheduled.
  - Converted.
  - Closed or inactive.
- When referral changes to Scheduled, offer conversion to Client.
- Converted referrals no longer crowd active referral list.
- Conversion preserves referral history.
- Staff can create, edit, close, and convert referrals.
- Activity logging works from referral profile.

### Referral Network

Must work before review:

- Provider/organization list.
- Provider profile.
- Inline provider editing.
- Referral source list can use provider records where appropriate.
- Provider links from client/referral profiles.
- Search by organization, contact, type, and notes.

### CRM activity and notes

Must work before review:

- Log call.
- Log text.
- Log email or general note.
- Show activity timeline for client/referral.
- Appointment activity appears in client profile.
- Status changes appear in timeline.

### CRM forms and print packets

Launch scope:

- Keep print forms instead of native data entry for now.
- Enrollment appointment uses forms 1, 2, and 3.
- Final appointment uses forms 2, 4, and 5.
- SP files are Spanish versions.
- Forms tab links to the correct packet.

Useful later:

- Native intake forms.
- iPad form mode.
- QR check-in.
- Digital enrollment paperwork.
- Digital questionnaire.
- Digital graduation questionnaire.
- Child feedback form.
- Caregiver feedback form.

## Tasks

Must work before review if visible:

- Task list.
- New task.
- Complete task.
- Due date.
- Priority.
- Assigned staff.
- Link task to client, referral, appointment, event, donor, grant, or campaign.
- Search/filter by status, due date, assigned staff, and linked record.

Workflow-generated tasks:

- No-show creates follow-up task.
- Completed appointment without next appointment creates scheduling task.
- Completed appointment can create chart note task if needed.
- Public booking can create review task.
- Referral conversion can create first appointment task if not scheduled.

Useful later:

- Board view for tasks.
- Snooze/postpone.
- Recurring tasks.
- Staff-specific task dashboard.

## Outreach Module

### Purpose

Track community outreach events SNACK attends annually, the logistics needed to
attend them, event outcomes, and contacts generated from those events.

### Outreach overview

Must work before review:

- Redesigned page matching the new module visual standard.
- Summary strip:
  - Annual events.
  - Families reached.
  - New contacts.
  - Event costs.
- Tabs or sections:
  - Overview.
  - Events.
  - Contacts.
  - Tasks.
  - Reports.
- No all-caps labels unless official names require them.
- Layout should align cleanly at normal and narrow widths.

### Event records

Must work before review:

- Event name.
- Date.
- Place.
- Contact person.
- Contact phone/email.
- Registration instructions.
- Registration deadline.
- Cost.
- Setup needs.
- Parking/electricity/table/insurance notes.
- Supplies needed.
- Staff/volunteers assigned.
- Status:
  - Planning.
  - Registered.
  - Prep Needed.
  - Ready.
  - Complete.
  - Follow Up.
- Attach notes/tasks to event.

### Event outcomes

Must work before review:

- Number of families interacted with.
- Main activity:
  - Prize wheel.
  - Bingo card.
  - Raffle.
  - Other.
- Giveaways handed out.
- Number of leads generated.
- Follow-up notes.
- Outcome summary for reports.

### Contacts from events

Must work before review:

- Contact name.
- Caregiver/child relationship if relevant.
- Phone.
- Email.
- Preferred language.
- Preferred contact method.
- Interest area:
  - Clinic appointments.
  - Cooking classes.
  - Newsletter.
  - Volunteer.
  - Partner.
  - Other.
- Source event.
- Consent/permission to contact.
- Convert to referral or newsletter contact.

Useful later:

- Event email list segment.
- QR signup form for events.
- Import event contacts from CSV.
- Event calendar view.
- Volunteer assignments.

## Fundraising Module

### Purpose

Track grants, individual giving, business sponsors, campaigns, and earned
income in one fundraising area.

### Fundraising overview

Must work before review:

- Redesigned page matching the new module visual standard.
- Summary strip:
  - Grant pipeline.
  - Awarded.
  - Donors.
  - Earned income.
- Tabs:
  - Grants.
  - Individual Giving.
  - Campaigns.
  - Business Sponsors.
  - Earned Income.
  - Reports.

### Grants tracker

Must work before review:

- Grant list with search and filters.
- Grant status flow:
  - Prospect.
  - Researching.
  - Drafting.
  - Submitted.
  - Awarded.
  - Declined.
  - Reporting.
  - Closed.
- Upcoming deadline view.
- Grant detail profile:
  - Foundation/funder.
  - Grant name.
  - Status.
  - Open date.
  - Deadline.
  - Award date.
  - Requested amount.
  - Awarded amount.
  - Recurrence.
  - Contact person.
  - Portal URL.
  - Login notes.
  - Funding focus.
  - Reporting requirements.
  - Notes.
- Organization information:
  - Reusable answers.
  - Boilerplate language.
  - Program descriptions.
  - Budget notes.
- Documents:
  - Attach grant documents.
  - Track which files were submitted.
  - Store reporting documents.
- Questions/answers:
  - Reusable grant answers.
  - Searchable answer bank.

### Individual giving

Must work before review if visible:

- Donor profiles.
- Donation history.
- Contact preferences.
- Notes.
- Acknowledgment status.
- Follow-up tasks.
- Donor segments.

### Campaigns

Must work before review if visible:

- Campaign name.
- Goal amount.
- Raised amount.
- Date range.
- Donor list.
- Marketing/email plan link.
- Tasks.
- Outcome report.

### Business sponsors

Must work before review if visible:

- Business profile.
- Contact person.
- Sponsorship level.
- Amount.
- In-kind support.
- Renewal date.
- Recognition promised.
- Recognition completed.
- Follow-up tasks.

### Earned income

Must work before review if visible:

- Workbook sales.
- HRSN reimbursement.
- Class/event income if applicable.
- Other earned income.
- Revenue by month.
- Notes and reconciliation status.

Useful later:

- Kindle Direct Publishing sales connection if available and practical.
- Donation platform connection if selected.
- Sponsor invoice/thank-you letter generation.
- Board-ready fundraising reports.

## Marketing Module

### Purpose

Plan communications, send segmented email through an outside email tool, and
bring key audience and ad data into one place.

### Must work before review if visible

- Redesigned page matching the new module visual standard.
- Summary strip:
  - Subscribers.
  - Campaigns.
  - Open rate.
  - Leads.
- Tabs:
  - Email Campaigns.
  - Contacts/Segments.
  - Content Calendar.
  - Google Ad Grants.
  - Website Analytics.
- Email campaign builder:
  - Campaign name.
  - Audience/segment.
  - Subject line.
  - Draft content.
  - Send status.
  - Scheduled date.
  - Delivery through MailerLite or selected provider later.
- Segments:
  - Clients.
  - Referrals.
  - Event contacts.
  - Cooking class interest.
  - Newsletter subscribers.
  - Donors/sponsors if appropriate.
- Consent and opt-out tracking.
- Campaign performance placeholders:
  - Sent.
  - Opens.
  - Clicks.
  - Unsubscribes.

Useful later:

- MailerLite connection.
- Google Ad Grants dashboard.
- Google Analytics connection.
- Search Console connection.
- Social/content calendar.
- Email templates.
- Website conversion tracking.

## Operations Module

### Purpose

Give Shannon one place to monitor launch readiness, data quality, key metrics,
and outside-system health without hunting across many tools.

### Must work before review if visible

- Redesigned page matching the new module visual standard.
- Summary strip:
  - Launch blockers.
  - KPI progress.
  - Data quality issues.
  - Connector health.
- Sections:
  - Launch Readiness.
  - KPI Command Center.
  - Data Quality.
  - Connector Health.
  - Reports.
- Launch Readiness:
  - Scheduling review status.
  - CRM review status.
  - Settings review status.
  - Public booking review status.
  - Data backup status.
  - Pilot status.
- KPI Command Center:
  - Clinic clients.
  - Appointments.
  - Graduates.
  - No-show rate.
  - Completion rate.
  - Referral conversion.
  - Workbook royalties.
  - HRSN reimbursement.
  - Grant/reporting metrics.
- Data Quality:
  - Duplicate clients.
  - Missing phone/email.
  - Missing DOB.
  - Missing language.
  - Clients without next appointment.
  - Referrals without follow-up.
- Connector Health:
  - Google Analytics.
  - Search Console.
  - Google Ad Grants.
  - MailerLite.
  - Kindle Direct Publishing if possible.
  - Google Drive/print forms.

Useful later:

- Automated weekly report.
- Data cleanup task creation.
- Connector warning emails.
- Board dashboard export.

## Settings Module

### Purpose

Control app-wide choices in one place so availability, statuses, service names,
staff, and data tools are not hard-coded.

### Must work before review

- Redesigned page matching the new module visual standard.
- Settings sections:
  - Organization.
  - Staff.
  - Scheduling.
  - Public Booking.
  - CRM.
  - Lessons.
  - Print Forms.
  - Data Tools.
  - Integrations.
  - Security.
- Organization:
  - Program name.
  - Address.
  - Phone.
  - Email.
  - Website.
  - Logo/brand references.
- Staff:
  - Staff list.
  - Add staff.
  - Remove or deactivate staff.
  - Role/permission.
  - Staff shown in public booking.
  - Staff availability.
- Scheduling:
  - Appointment days.
  - Office opens.
  - Office closes.
  - First appointment start.
  - Last appointment start.
  - Default duration.
  - Booking slot size.
  - Appointment status labels.
- Public Booking:
  - Public service names.
  - Public service durations.
  - Required public fields.
  - Reminder consent wording.
  - Lead time.
  - Scheduling window.
  - Allow public cancellation.
  - Allow public reschedule.
- CRM:
  - Client status labels.
  - Referral status labels.
  - Referral source list behavior.
  - Provider categories.
- Lessons:
  - Enrollment.
  - Nutrient Density.
  - Sugar.
  - Food Groups.
  - Macronutrients.
  - Micronutrients.
  - Mindful Eating.
  - Healthy Habits.
  - Default next lesson rules.
- Print Forms:
  - Enrollment packet links.
  - Final appointment packet links.
  - Spanish packet links.
- Data Tools:
  - JSON export.
  - Restore from JSON as a guarded later feature.
  - CSV imports.
  - Bulk delete disabled in production unless explicitly enabled.
  - Backup reminder before imports.
- Integrations:
  - Google Analytics.
  - Search Console.
  - Google Ad Grants.
  - MailerLite or email provider.
  - Kindle Direct Publishing if practical.
  - Google Calendar later.
  - SMS/email reminders later.
- Security:
  - Staff domain restriction.
  - Role access.
  - Public route safety.

## Kitchen Scheduling

Coming soon for this rebuild phase:

- Cooking class schedule.
- Monthly class events.
- Public class signup.
- Class capacity.
- Participant list.
- Waitlist.
- Reminders.
- Attendance.
- Class outcomes.

Keep visible only as Coming soon unless a working slice is built.

## School Scheduling

Coming soon for this rebuild phase:

- Seasonal school program.
- Weekly sessions for 8 weeks.
- School/site profiles.
- Class rosters.
- Session schedule.
- Attendance.
- Outcomes.
- Staff assignments.

Keep visible only as Coming soon unless a working slice is built.

## Data, Import, Backup, And Recovery

Must work before review:

- Import referrals from CSV.
- Import clients from CSV.
- Import referral network/providers from CSV.
- Import appointments from Setmore-style export if still needed.
- Merge sibling appointment imports into multi-client appointments where
  appropriate.
- Skip Setmore class/wellness day rows from clinic appointment imports.
- Export JSON backup for:
  - Referrals.
  - Clients.
  - Referral network.
  - Appointments.
  - Tasks.
  - Activity logs.
  - Outreach events.
  - Outreach contacts.
  - Grants and fundraising records once live.
- Show counts before export/import where possible.
- Bulk delete stays disabled in production unless intentionally enabled.

Useful later:

- Restore from JSON:
  - Upload export file.
  - Preview changes.
  - Validate file shape.
  - Choose restore mode.
  - Type confirmation.
  - Automatically export a fresh backup before restore.
  - Clear success/failure report.

## Reporting And KPI

Must work before review if visible:

- Clinic snapshot.
- 2026 KPI progress.
- Program KPI drafts.
- Organization KPI table.
- Revenue KPI table.
- Work plan tracker.
- Date-range reports.
- Referral source reports.
- Appointment volume.
- No-show percentage.
- Retention/completion rate.
- Graduation count.
- Program completion within 4 to 6 month target.
- Average time from referral to first contact.
- Average time from referral to first appointment.
- Average time between appointments.
- Average time to complete program.
- Export or print report summaries.

Useful later:

- Google Analytics dashboard.
- Search Console dashboard.
- Google Ad Grants dashboard.
- Automated grant/board reporting.
- Visual charts after KPI definitions are stable.

## Build Order Recommendation

1. Define the shared visual rules and app shell.
2. Build Schedule as a working vertical slice:
   - Settings-driven availability.
   - Day/week/month views.
   - New/edit/reschedule/complete/no-show/cancel.
   - Multi-client appointment.
   - Print behavior.
3. Build Public Booking:
   - Four services.
   - Multiple children.
   - Real availability.
   - Cancel/reschedule.
4. Build CRM:
   - Client list/profile.
   - Referral list/profile/conversion.
   - Referral Network.
   - Activity logs.
   - Print-form links.
5. Build Settings:
   - Staff.
   - Scheduling.
   - Public booking.
   - CRM statuses.
   - Data tools.
6. Build Outreach.
7. Build Fundraising.
8. Build Marketing.
9. Build Operations.
10. Add Kitchen and School as Coming soon unless the core launch scope is done.
11. Final browser review:
   - Every visible button works.
   - Narrow window review.
   - Print review.
   - Public booking review.
   - Staff scheduling review.
   - CRM review.

## Screenshot List For Shannon

Highest priority:

- Current Schedule Day view.
- Current Schedule Week view.
- Current Schedule Month view.
- Current New Appointment panel.
- Current Wrap Up/Complete Appointment panel.
- Current public Setmore booking page:
  - Main page.
  - Service selection.
  - Date/time selection.
  - Public information form.
  - Confirmation/manage booking if available.
- CRM sandbox client list and profile.
- CRM sandbox referral profile if different from client profile.
- Remaining modules sandbox:
  - Outreach overview and detail.
  - Fundraising overview and grant tracker.
  - Marketing.
  - Operations.
  - Settings.

Helpful later:

- Print packet folder view if file names need confirmation.
- Any Setmore settings that are not already captured.
- Examples of pages where narrow width currently cuts content off.
- Any page where a button is visible but currently does nothing.

## Open Decisions

- Should public bookings immediately create full client records or enter a staff
  review queue first? Current direction can support appointment plus review task.
- Which client/referral statuses should be final for launch?
- Final reminder consent wording.
- Final staff list for launch: Cynthia and Shannon, with Paige removed.
- Final appointment days and staff-specific availability.
- Whether any task board view is needed before launch.
- Whether Marketing and Operations should be fully active modules or reviewable
  dashboards first.
- Which integrations are first after launch:
  - MailerLite.
  - Google Analytics.
  - Search Console.
  - Google Ad Grants.
  - Kindle Direct Publishing.
  - Google Calendar.
