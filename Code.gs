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
    priorities: getSettingsByType_('priority').map((row) => row.Name),
    contactStatuses: getSettingsByType_('contact_status').map((row) => row.Name),
    referralTypes: getSettingsByType_('referral_type').map((row) => row.Name),
    contactMethods: getSettingsByType_('contact_method').map((row) => row.Name)
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

function createReferral(referral) {
  const record = Object.assign({
    Category: 'Referral',
    Status: 'New Referral',
    'Referral Type': 'Internal provider referral',
    'Preferred Contact Method': 'Text',
    'SMS Consent': true,
    'Email Consent': true
  }, referral || {});

  const created = createContact(record);
  createTask({
    'Task Type': 'Referral Follow-Up',
    Description: `Contact ${contactDisplayName_(created)} about SNACK referral`,
    ContactID: created.ContactID,
    'Assigned Staff': created['Contact Owner'] || SNACK.DEFAULT_STAFF,
    Priority: 'Normal',
    'Due Date': today_(),
    'Created By Automation': true,
    Notes: `Referral type: ${created['Referral Type'] || ''}`
  });
  return created;
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

function completeAppointment(appointmentId, completionDetails) {
  const appointment = findById_(SNACK.SHEETS.APPOINTMENTS, 'AppointmentID', appointmentId);
  if (!appointment) {
    throw new Error(`Appointment not found: ${appointmentId}`);
  }

  const updates = {
    Status: SNACK.APPOINTMENT_STATUS.COMPLETED,
    'New Goal': completionDetails && completionDetails['New Goal'] ? completionDetails['New Goal'] : appointment['New Goal'],
    'Next Appointment Scheduled': completionDetails && completionDetails['Next Appointment Scheduled'] !== undefined ? completionDetails['Next Appointment Scheduled'] : appointment['Next Appointment Scheduled'],
    'Chart Note Complete': completionDetails && completionDetails['Chart Note Complete'] !== undefined ? completionDetails['Chart Note Complete'] : appointment['Chart Note Complete'],
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
      ContactName: contactDisplayName_(contact),
      ParentName: contact['Parent/Guardian Name'] || '',
      PreferredLanguage: contact.Language || '',
      PreferredContactMethod: contact['Preferred Contact Method'] || '',
      CurrentLesson: contact['Current Lesson Number'] || record['Lesson Number'] || '',
      CurrentLessonTopic: contact['Current Lesson Topic'] || record['Lesson Topic'] || '',
      LastGoal: contact['Last Goal'] || record['Previous Goal'] || '',
      DaysSinceLastAppointment: daysSince_(contact['Last Appointment Date'])
    });
  };

  const referrals = contacts.filter((contact) => contact.Category === 'Referral');
  const clients = contacts.filter((contact) => contact.Category === 'Client');
  const activeClients = clients.filter((contact) => ['Active', 'Scheduled'].indexOf(String(contact.Status)) !== -1);
  const needsReschedule = clients.filter((contact) => String(contact.Status) === SNACK.CONTACT_STATUS.NEEDS_RESCHEDULE);
  const graduatedThisYear = clients.filter((contact) => String(contact.Status) === SNACK.CONTACT_STATUS.GRADUATED && String(contact['Completion Date'] || '').slice(0, 4) === today.slice(0, 4));

  return {
    today,
    counts: {
      todayAppointments: appointments.filter((appointment) => appointment.Date === today).length,
      overdueTasks: openTasks.filter((task) => task['Due Date'] && task['Due Date'] < today).length,
      dueTodayTasks: openTasks.filter((task) => task['Due Date'] === today).length,
      noShows: appointments.filter((appointment) => appointment.Status === SNACK.APPOINTMENT_STATUS.NO_SHOW).length,
      openTasks: openTasks.length,
      activeClients: activeClients.length,
      openReferrals: referrals.length,
      needsReschedule: needsReschedule.length,
      graduatedYtd: graduatedThisYear.length
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

function getCrmModuleData() {
  const contacts = getRows_(SNACK.SHEETS.CONTACTS);
  const appointments = getRows_(SNACK.SHEETS.APPOINTMENTS);
  const tasks = getRows_(SNACK.SHEETS.TASKS).filter((task) => task.Status !== SNACK.TASK_STATUS.COMPLETED);
  const latestAppointmentByContact = {};
  const nextAppointmentByContact = {};
  const today = today_();

  appointments.forEach((appointment) => {
    const contactId = appointment.ContactID;
    if (!contactId) {
      return;
    }
    if (appointment.Date && appointment.Date <= today) {
      const current = latestAppointmentByContact[contactId];
      if (!current || String(appointment.Date).localeCompare(String(current.Date)) > 0) {
        latestAppointmentByContact[contactId] = appointment;
      }
    }
    if (appointment.Date && appointment.Date >= today && appointment.Status === SNACK.APPOINTMENT_STATUS.SCHEDULED) {
      const current = nextAppointmentByContact[contactId];
      if (!current || String(appointment.Date).localeCompare(String(current.Date)) < 0) {
        nextAppointmentByContact[contactId] = appointment;
      }
    }
  });

  const taskCountsByContact = {};
  tasks.forEach((task) => {
    if (task.ContactID) {
      taskCountsByContact[task.ContactID] = (taskCountsByContact[task.ContactID] || 0) + 1;
    }
  });

  const enrich = (contact) => Object.assign({}, contact, {
    DisplayName: contactDisplayName_(contact),
    LatestAppointment: latestAppointmentByContact[contact.ContactID] || null,
    NextAppointment: nextAppointmentByContact[contact.ContactID] || null,
    OpenTaskCount: taskCountsByContact[contact.ContactID] || 0,
    ProgramProgress: programProgress_(contact)
  });

  return {
    clients: contacts
      .filter((contact) => contact.Category === 'Client')
      .map(enrich)
      .sort((a, b) => String(a.DisplayName).localeCompare(String(b.DisplayName))),
    referrals: contacts
      .filter((contact) => contact.Category === 'Referral')
      .map(enrich)
      .sort((a, b) => String(a['Created At'] || '').localeCompare(String(b['Created At'] || '')) * -1),
    providers: contacts
      .filter((contact) => contact.Category === 'Provider')
      .map(enrich)
      .sort((a, b) => String(a.DisplayName).localeCompare(String(b.DisplayName)))
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

function contactDisplayName_(contact) {
  if (!contact) {
    return '';
  }
  return [contact['First Name'], contact['Last Name']].filter(Boolean).join(' ') || contact.ContactID || '';
}

function daysSince_(dateString) {
  if (!dateString) {
    return '';
  }
  const start = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    return '';
  }
  const today = new Date(`${today_()}T00:00:00`);
  return Math.max(0, Math.round((today.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)));
}

function programProgress_(contact) {
  const completed = Number(contact['Completed Appointment Count'] || 0);
  if (completed > 0) {
    return Math.min(completed, 8);
  }
  const currentLesson = Number(contact['Current Lesson Number'] || 0);
  if (currentLesson > 0) {
    return Math.max(0, Math.min(currentLesson - 1, 8));
  }
  return 0;
}
