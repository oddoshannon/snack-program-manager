function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu(SNACK.APP_NAME)
    .addItem('Setup / Repair Sheets', 'setupSnackCrm')
    .addItem('Add Demo Data', 'seedDemoData')
    .addItem('Install Automation Triggers', 'installSnackCrmTriggers')
    .addItem('Open Dashboard', 'showDashboard')
    .addSeparator()
    .addItem('Create Daily Recap Draft', 'createDailyRecapDraft')
    .addToUi();
}

function doGet() {
  return HtmlService.createTemplateFromFile('WebApp')
    .evaluate()
    .setTitle('SNACK CRM Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function showDashboard() {
  const html = HtmlService.createTemplateFromFile('WebApp')
    .evaluate()
    .setWidth(1200)
    .setHeight(760);
  SpreadsheetApp.getUi().showModalDialog(html, 'SNACK CRM Dashboard');
}

function getBootstrapData() {
  return {
    today: today_(),
    staff: getRows_(SNACK.SHEETS.STAFF).filter((row) => row.Active !== false && row.Active !== 'FALSE'),
    taskTypes: getSettingsByType_('task_type').map((row) => row.Name),
    appointmentTypes: getSettingsByType_('appointment_type').map((row) => row.Name),
    priorities: getSettingsByType_('priority').map((row) => row.Name)
  };
}

function createContact(contact) {
  const now = timestamp_();
  const record = Object.assign({
    ContactID: makeId_('CON'),
    Status: SNACK.CONTACT_STATUS.ACTIVE,
    Category: 'Client',
    Tags: '',
    'Created At': now,
    'Updated At': now
  }, contact || {});

  appendRow_(SNACK.SHEETS.CONTACTS, record);
  return record;
}

function createAppointment(appointment) {
  const now = timestamp_();
  const record = Object.assign({
    AppointmentID: makeId_('APT'),
    Staff: SNACK.DEFAULT_STAFF,
    Status: SNACK.APPOINTMENT_STATUS.SCHEDULED,
    'Created At': now,
    'Updated At': now
  }, appointment || {});

  if (!record.ContactID) {
    throw new Error('ContactID is required to create an appointment.');
  }

  record['Calendar Event ID'] = createCalendarEvent_(record);
  appendRow_(SNACK.SHEETS.APPOINTMENTS, record);
  runAppointmentCreatedWorkflow_(record);
  return record;
}

function completeAppointment(appointmentId) {
  const appointment = findById_(SNACK.SHEETS.APPOINTMENTS, 'AppointmentID', appointmentId);
  if (!appointment) {
    throw new Error(`Appointment not found: ${appointmentId}`);
  }

  const updates = {
    Status: SNACK.APPOINTMENT_STATUS.COMPLETED,
    'Updated At': timestamp_()
  };
  updateRow_(SNACK.SHEETS.APPOINTMENTS, appointment._rowNumber, updates);
  const completedAppointment = Object.assign({}, appointment, updates);
  runAppointmentCompletedWorkflow_(completedAppointment);
  return completedAppointment;
}

function markAppointmentNoShow(appointmentId) {
  const appointment = findById_(SNACK.SHEETS.APPOINTMENTS, 'AppointmentID', appointmentId);
  if (!appointment) {
    throw new Error(`Appointment not found: ${appointmentId}`);
  }

  const updates = {
    Status: SNACK.APPOINTMENT_STATUS.NO_SHOW,
    'Updated At': timestamp_()
  };
  updateRow_(SNACK.SHEETS.APPOINTMENTS, appointment._rowNumber, updates);
  const noShowAppointment = Object.assign({}, appointment, updates);
  runNoShowWorkflow_(noShowAppointment);
  return noShowAppointment;
}

function createTask(task) {
  const now = timestamp_();
  const record = Object.assign({
    TaskID: makeId_('TSK'),
    'Assigned Staff': SNACK.DEFAULT_STAFF,
    Priority: 'Normal',
    'Due Date': today_(),
    Status: SNACK.TASK_STATUS.NOT_STARTED,
    'Created By Automation': false,
    'Created At': now,
    'Updated At': now
  }, task || {});

  appendRow_(SNACK.SHEETS.TASKS, record);
  return record;
}

function updateTaskStatus(taskId, status) {
  const task = findById_(SNACK.SHEETS.TASKS, 'TaskID', taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const updates = {
    Status: status,
    'Updated At': timestamp_(),
    'Completed At': status === SNACK.TASK_STATUS.COMPLETED ? timestamp_() : ''
  };
  updateRow_(SNACK.SHEETS.TASKS, task._rowNumber, updates);
  return Object.assign({}, task, updates);
}

function getDashboardData(filters) {
  const safeFilters = filters || {};
  const today = today_();
  const tasks = getRows_(SNACK.SHEETS.TASKS);
  const appointments = getRows_(SNACK.SHEETS.APPOINTMENTS);
  const contacts = getRows_(SNACK.SHEETS.CONTACTS);
  const contactById = {};

  contacts.forEach((contact) => {
    contactById[contact.ContactID] = contact;
  });

  const openTasks = tasks.filter((task) => {
    if (task.Status === SNACK.TASK_STATUS.COMPLETED) {
      return false;
    }
    if (safeFilters.staff && task['Assigned Staff'] !== safeFilters.staff) {
      return false;
    }
    return true;
  });

  const withContactName = (record) => {
    const contact = contactById[record.ContactID] || {};
    return Object.assign({}, record, {
      ContactName: [contact['First Name'], contact['Last Name']].filter(Boolean).join(' ')
    });
  };

  return {
    today,
    counts: {
      todayAppointments: appointments.filter((appointment) => appointment.Date === today).length,
      overdueTasks: openTasks.filter((task) => task['Due Date'] && task['Due Date'] < today).length,
      dueTodayTasks: openTasks.filter((task) => task['Due Date'] === today).length,
      noShows: appointments.filter((appointment) => appointment.Status === SNACK.APPOINTMENT_STATUS.NO_SHOW).length,
      openTasks: openTasks.length
    },
    todayAppointments: appointments
      .filter((appointment) => appointment.Date === today)
      .map(withContactName)
      .sort((a, b) => String(a.Time).localeCompare(String(b.Time))),
    overdueTasks: openTasks
      .filter((task) => task['Due Date'] && task['Due Date'] < today)
      .map(withContactName)
      .sort((a, b) => String(a['Due Date']).localeCompare(String(b['Due Date']))),
    dueTodayTasks: openTasks
      .filter((task) => task['Due Date'] === today)
      .map(withContactName),
    followUps: openTasks
      .filter((task) => String(task['Task Type']).indexOf('Follow-Up') !== -1)
      .map(withContactName)
  };
}

function createDailyRecapDraft() {
  const data = getDashboardData();
  const noShows = getRows_(SNACK.SHEETS.APPOINTMENTS)
    .filter((appointment) => appointment.Date === today_() && appointment.Status === SNACK.APPOINTMENT_STATUS.NO_SHOW);

  const lines = [
    `SNACK Daily Recap - ${today_()}`,
    '',
    `Appointments today: ${data.counts.todayAppointments}`,
    `Open tasks: ${data.counts.openTasks}`,
    `Overdue tasks: ${data.counts.overdueTasks}`,
    `No-show appointments: ${noShows.length}`,
    '',
    'No-shows:',
    noShows.length ? noShows.map((appointment) => `- ${appointment.ContactID} at ${appointment.Time}`).join('\n') : '- None',
    '',
    'Progress / projects:',
    '- ',
    '',
    'Issues / questions:',
    '- ',
    '',
    'Reminders:',
    '- '
  ];

  GmailApp.createDraft('', `SNACK Daily Recap - ${today_()}`, lines.join('\n'));
  SpreadsheetApp.getUi().alert('Daily recap draft created in Gmail.');
}
