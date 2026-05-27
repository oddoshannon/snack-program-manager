function seedDemoData() {
  setupSnackCrm();

  const existingContacts = getRows_(SNACK.SHEETS.CONTACTS);
  if (existingContacts.some((contact) => String(contact.Notes).indexOf('Demo data') !== -1)) {
    SpreadsheetApp.getUi().alert('Demo data already exists.');
    return;
  }

  const now = timestamp_();
  const today = today_();
  const yesterday = dateDaysFromNow_(-1);
  const tomorrow = dateDaysFromNow_(1);

  appendRow_(SNACK.SHEETS.STAFF, {
    StaffID: makeId_('STF'),
    Name: 'Shannon',
    Role: 'Operations Lead',
    Email: Session.getActiveUser().getEmail(),
    Availability: 'Weekdays',
    'Assigned Programs': 'Nutrition Education',
    Active: true,
    'Created At': now,
    'Updated At': now
  });

  const client = createContact({
    'First Name': 'Maya',
    'Last Name': 'Rivera',
    DOB: '1991-04-12',
    Phone: '555-0101',
    Email: 'maya@example.com',
    Address: '123 Sample St',
    Language: 'English',
    'YCCO Status': 'Active',
    Category: 'Client',
    Status: SNACK.CONTACT_STATUS.SCHEDULED,
    'Referral Source': 'Provider',
    'First Appointment Date': today,
    Notes: 'Demo data client.'
  });

  const referral = createContact({
    'First Name': 'Jordan',
    'Last Name': 'Lee',
    Phone: '555-0102',
    Language: 'Spanish',
    Category: 'Referral',
    Status: SNACK.CONTACT_STATUS.RESCHEDULE,
    'Referral Source': 'Athena SNACK Bucket',
    Notes: 'Demo data referral.'
  });

  appendRow_(SNACK.SHEETS.APPOINTMENTS, {
    AppointmentID: makeId_('APT'),
    ContactID: client.ContactID,
    'Appointment Type': 'Nutrition Lesson',
    Date: today,
    Time: '10:00',
    Staff: 'Shannon',
    Status: SNACK.APPOINTMENT_STATUS.SCHEDULED,
    'Lesson Number': 2,
    Goal: 'Review grocery goals',
    Notes: 'Demo data appointment.',
    'Calendar Event ID': '',
    'Created At': now,
    'Updated At': now
  });

  appendRow_(SNACK.SHEETS.APPOINTMENTS, {
    AppointmentID: makeId_('APT'),
    ContactID: referral.ContactID,
    'Appointment Type': 'Enrollment',
    Date: yesterday,
    Time: '14:00',
    Staff: 'Shannon',
    Status: SNACK.APPOINTMENT_STATUS.NO_SHOW,
    'Lesson Number': 1,
    Goal: 'Initial enrollment',
    Notes: 'Demo data no-show.',
    'Calendar Event ID': '',
    'Created At': now,
    'Updated At': now
  });

  createTask({
    'Task Type': 'Chart Note',
    Description: 'Complete Athena chart note for Maya',
    ContactID: client.ContactID,
    'Assigned Staff': 'Shannon',
    Priority: 'High',
    'Due Date': today,
    'Created By Automation': true,
    Notes: 'Demo data task.'
  });

  createTask({
    'Task Type': 'Client Follow-Up',
    Description: 'Priority reschedule after no-show',
    ContactID: referral.ContactID,
    'Assigned Staff': 'Shannon',
    Priority: 'High',
    'Due Date': yesterday,
    'Created By Automation': true,
    Notes: 'Demo data overdue follow-up.'
  });

  createTask({
    'Task Type': 'Form Entry',
    Description: 'Input enrollment form from paper folder',
    ContactID: client.ContactID,
    'Assigned Staff': 'Shannon',
    Priority: 'Normal',
    'Due Date': tomorrow,
    'Created By Automation': false,
    Notes: 'Demo data manual task.'
  });

  appendRow_(SNACK.SHEETS.PROGRAMS, {
    ProgramID: 'PRG-NUTRITION',
    'Program Name': 'Nutrition Education',
    'Active Status': true,
    'Start Date': today,
    'End Date': '',
    'KPI Definitions': 'attendance, referrals, graduation rate',
    'Created At': now,
    'Updated At': now
  });

  recordKpi({
    ProgramID: 'PRG-NUTRITION',
    'KPI Name': 'appointments',
    'KPI Value': 1,
    Date: today,
    Staff: 'Shannon',
    Notes: 'Demo data KPI.'
  });

  SpreadsheetApp.getUi().alert('Demo data added. Open or refresh the dashboard.');
}
