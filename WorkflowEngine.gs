function runAppointmentCreatedWorkflow_(appointment) {
  const contact = findById_(SNACK.SHEETS.CONTACTS, 'ContactID', appointment.ContactID) || {};
  const contactUpdates = {
    Category: contact.Category === 'Referral' ? 'Client' : contact.Category,
    Status: SNACK.CONTACT_STATUS.SCHEDULED,
    'First Appointment Date': appointment.Date,
    'Next Appointment Date': appointment.Date,
    'Current Lesson Number': appointment['Lesson Number'] || contact['Current Lesson Number'],
    'Current Lesson Topic': appointment['Lesson Topic'] || contact['Current Lesson Topic'],
    'Updated At': timestamp_()
  };

  updateContact_(appointment.ContactID, contactUpdates, { onlySetFirstAppointmentDateIfBlank: true });

  createTask({
    'Task Type': 'Administrative',
    Description: `Prepare paperwork and notes for ${appointment['Appointment Type']}`,
    ContactID: appointment.ContactID,
    AppointmentID: appointment.AppointmentID,
    'Assigned Staff': appointment.Staff || SNACK.DEFAULT_STAFF,
    Priority: 'Normal',
    'Due Date': appointment.Date,
    'Created By Automation': true,
    Notes: 'Created when appointment was scheduled.'
  });

  if (String(appointment['Appointment Type']).toLowerCase().indexOf('enrollment') !== -1) {
    createTask({
      'Task Type': 'Form Entry',
      Description: 'Prepare enrollment forms for reception',
      ContactID: appointment.ContactID,
      AppointmentID: appointment.AppointmentID,
      'Assigned Staff': appointment.Staff || SNACK.DEFAULT_STAFF,
      Priority: 'High',
      'Due Date': appointment.Date,
      'Created By Automation': true,
      Notes: 'Enrollment appointment workflow.'
    });
  }
}

function runAppointmentCompletedWorkflow_(appointment) {
  const contact = findById_(SNACK.SHEETS.CONTACTS, 'ContactID', appointment.ContactID) || {};
  const completedCount = Number(contact['Completed Appointment Count'] || 0) + 1;

  updateContact_(appointment.ContactID, {
    Status: SNACK.CONTACT_STATUS.ACTIVE,
    'Last Appointment Date': appointment.Date || today_(),
    'Last Goal': appointment['New Goal'] || appointment.Goal || contact['Last Goal'],
    'Completed Appointment Count': completedCount,
    'Current Lesson Number': appointment['Lesson Number'] || contact['Current Lesson Number'],
    'Current Lesson Topic': appointment['Lesson Topic'] || contact['Current Lesson Topic'],
    'Updated At': timestamp_()
  });

  createTask({
    'Task Type': 'Chart Note',
    Description: 'Complete Athena chart note',
    ContactID: appointment.ContactID,
    AppointmentID: appointment.AppointmentID,
    'Assigned Staff': appointment.Staff || SNACK.DEFAULT_STAFF,
    Priority: 'High',
    'Due Date': today_(),
    'Created By Automation': true,
    Notes: 'Created when appointment was marked complete.'
  });

  if (requiresFormEntry_(appointment)) {
    createTask({
      'Task Type': 'Form Entry',
      Description: `Complete ${appointment['Appointment Type']} paperwork/forms`,
      ContactID: appointment.ContactID,
      AppointmentID: appointment.AppointmentID,
      'Assigned Staff': appointment.Staff || SNACK.DEFAULT_STAFF,
      Priority: 'Normal',
      'Due Date': today_(),
      'Created By Automation': true,
      Notes: 'Created when appointment was marked complete.'
    });
  }

  if (isGraduationAppointment_(appointment)) {
    updateContact_(appointment.ContactID, {
      Status: SNACK.CONTACT_STATUS.GRADUATED,
      'Completion Date': appointment.Date || today_(),
      'Updated At': timestamp_()
    });
    createTask({
      'Task Type': 'Form Entry',
      Description: 'Enter graduation feedback and pre/post questionnaire data',
      ContactID: appointment.ContactID,
      AppointmentID: appointment.AppointmentID,
      'Assigned Staff': appointment.Staff || SNACK.DEFAULT_STAFF,
      Priority: 'High',
      'Due Date': today_(),
      'Created By Automation': true,
      Notes: 'Graduation workflow.'
    });
  }
}

function runNoShowWorkflow_(appointment) {
  const contact = findById_(SNACK.SHEETS.CONTACTS, 'ContactID', appointment.ContactID);
  const newClient = isNewClientNoShow_(appointment, contact);
  const nextStatus = SNACK.CONTACT_STATUS.NEEDS_RESCHEDULE;
  const reason = newClient ? 'Missed first appointment' : 'Returning client no-show';
  const noShowCount = Number(contact && contact['No Show Count'] ? contact['No Show Count'] : 0) + 1;

  updateContact_(appointment.ContactID, {
    Status: nextStatus,
    'Reschedule Reason': reason,
    'No Show Count': noShowCount,
    'Updated At': timestamp_()
  });

  createTask({
    'Task Type': 'Client Follow-Up',
    Description: newClient ? 'Reschedule client after missed first appointment' : 'Priority reschedule returning client after no-show',
    ContactID: appointment.ContactID,
    AppointmentID: appointment.AppointmentID,
    'Assigned Staff': appointment.Staff || SNACK.DEFAULT_STAFF,
    Priority: newClient ? 'Normal' : 'High',
    'Due Date': today_(),
    'Created By Automation': true,
    Notes: `Contact status set to ${nextStatus}. Reason: ${reason}.`
  });
}

function createReferralFollowUpTasks() {
  const contacts = getRows_(SNACK.SHEETS.CONTACTS);
  const openTasks = getRows_(SNACK.SHEETS.TASKS)
    .filter((task) => task.Status !== SNACK.TASK_STATUS.COMPLETED);
  const existingByContact = new Set(openTasks
    .filter((task) => task['Task Type'] === 'Referral Follow-Up')
    .map((task) => task.ContactID));

  contacts
    .filter((contact) => String(contact.Category).indexOf('Referral') !== -1)
    .filter((contact) => !existingByContact.has(contact.ContactID))
    .forEach((contact) => {
      createTask({
        'Task Type': 'Referral Follow-Up',
        Description: 'Contact referral after two-week follow-up window',
        ContactID: contact.ContactID,
        'Assigned Staff': SNACK.DEFAULT_STAFF,
        Priority: 'Normal',
        'Due Date': dateDaysFromNow_(14),
        'Created By Automation': true,
        Notes: 'Generated by referral follow-up task sweep.'
      });
    });
}

function updateContact_(contactId, updates, options) {
  const contact = findById_(SNACK.SHEETS.CONTACTS, 'ContactID', contactId);
  if (!contact) {
    return null;
  }

  const safeUpdates = Object.assign({}, updates);
  if (options && options.onlySetFirstAppointmentDateIfBlank && contact['First Appointment Date']) {
    delete safeUpdates['First Appointment Date'];
  }

  updateRow_(SNACK.SHEETS.CONTACTS, contact._rowNumber, safeUpdates);
  return Object.assign({}, contact, safeUpdates);
}

function createCalendarEvent_(appointment) {
  if (!appointment.Date || !appointment.Time) {
    return '';
  }

  try {
    const contact = findById_(SNACK.SHEETS.CONTACTS, 'ContactID', appointment.ContactID) || {};
    const title = `${appointment['Appointment Type'] || 'SNACK Appointment'} - ${contact['First Name'] || ''} ${contact['Last Name'] || ''}`.trim();
    const start = new Date(`${appointment.Date}T${appointment.Time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const event = CalendarApp.getDefaultCalendar().createEvent(title, start, end, {
      description: `ContactID: ${appointment.ContactID}\nAppointmentID: ${appointment.AppointmentID}\nGoal: ${appointment.Goal || ''}`
    });
    return event.getId();
  } catch (error) {
    return `CALENDAR_ERROR: ${error.message}`;
  }
}

function requiresFormEntry_(appointment) {
  const type = String(appointment['Appointment Type'] || '').toLowerCase();
  return type.indexOf('enrollment') !== -1 || type.indexOf('graduation') !== -1 || type.indexOf('assessment') !== -1;
}

function isGraduationAppointment_(appointment) {
  return String(appointment['Appointment Type'] || '').toLowerCase().indexOf('graduation') !== -1;
}

function isNewClientNoShow_(appointment, contact) {
  if (Number(appointment['Lesson Number']) <= 1) {
    return true;
  }
  if (contact && contact['First Appointment Date'] && contact['First Appointment Date'] === appointment.Date) {
    return true;
  }
  return false;
}
