function installSnackCrmTriggers() {
  const spreadsheet = getSpreadsheet_();
  const managedHandlers = new Set(['handleFormSubmit', 'createReferralFollowUpTasks']);

  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (managedHandlers.has(trigger.getHandlerFunction())) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('handleFormSubmit')
    .forSpreadsheet(spreadsheet)
    .onFormSubmit()
    .create();

  ScriptApp.newTrigger('createReferralFollowUpTasks')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();

  SpreadsheetApp.getUi().alert('SNACK CRM automation triggers installed.');
}

function handleFormSubmit(event) {
  const namedValues = event && event.namedValues ? event.namedValues : {};
  const contact = findOrCreateContactFromForm_(namedValues);
  const formName = getFormNameFromEvent_(event);

  updateContact_(contact.ContactID, {
    'Most Recent Contact Date': today_(),
    Notes: appendNote_(contact.Notes, `Form submitted: ${formName}`),
    'Updated At': timestamp_()
  });

  createTask({
    'Task Type': inferFormTaskType_(formName),
    Description: `Review submitted form: ${formName}`,
    ContactID: contact.ContactID,
    'Assigned Staff': SNACK.DEFAULT_STAFF,
    Priority: 'Normal',
    'Due Date': today_(),
    'Created By Automation': true,
    Notes: 'Generated from Google Form submission.'
  });

  return contact;
}

function findOrCreateContactFromForm_(namedValues) {
  const firstName = firstFormValue_(namedValues, ['First Name', 'First name', 'Client First Name', 'Participant First Name']);
  const lastName = firstFormValue_(namedValues, ['Last Name', 'Last name', 'Client Last Name', 'Participant Last Name']);
  const dob = firstFormValue_(namedValues, ['DOB', 'Date of Birth', 'Birth Date']);
  const email = firstFormValue_(namedValues, ['Email', 'Email Address']);
  const phone = firstFormValue_(namedValues, ['Phone', 'Phone Number', 'Cell Phone']);

  const existing = getRows_(SNACK.SHEETS.CONTACTS).find((contact) => {
    const sameEmail = email && String(contact.Email).toLowerCase() === String(email).toLowerCase();
    const samePhone = phone && String(contact.Phone).replace(/\D/g, '') === String(phone).replace(/\D/g, '');
    const sameNameDob = firstName && lastName && dob &&
      String(contact['First Name']).toLowerCase() === String(firstName).toLowerCase() &&
      String(contact['Last Name']).toLowerCase() === String(lastName).toLowerCase() &&
      String(contact.DOB) === String(dob);
    return sameEmail || samePhone || sameNameDob;
  });

  if (existing) {
    return existing;
  }

  return createContact({
    'First Name': firstName,
    'Last Name': lastName,
    DOB: dob,
    Email: email,
    Phone: phone,
    Address: firstFormValue_(namedValues, ['Address', 'Home Address']),
    Language: firstFormValue_(namedValues, ['Language', 'Preferred Language']),
    'YCCO Status': firstFormValue_(namedValues, ['YCCO Status', 'YCCO']),
    Category: inferContactCategory_(getFormNameFromNamedValues_(namedValues)),
    Status: SNACK.CONTACT_STATUS.ACTIVE,
    'Referral Source': firstFormValue_(namedValues, ['Referral Source', 'How did you hear about us?']),
    Notes: 'Created from Google Form submission.'
  });
}

function firstFormValue_(namedValues, keys) {
  for (let index = 0; index < keys.length; index += 1) {
    const value = namedValues[keys[index]];
    if (value && value.length && value[0]) {
      return value[0];
    }
  }
  return '';
}

function getFormNameFromEvent_(event) {
  if (event && event.range && event.range.getSheet) {
    return event.range.getSheet().getName();
  }
  return getFormNameFromNamedValues_(event && event.namedValues ? event.namedValues : {});
}

function getFormNameFromNamedValues_(namedValues) {
  return firstFormValue_(namedValues, ['Form Name', 'Form Type', 'Submission Type']) || 'Google Form';
}

function inferFormTaskType_(formName) {
  const lower = String(formName).toLowerCase();
  if (lower.indexOf('assessment') !== -1) {
    return 'Assessment Entry';
  }
  if (lower.indexOf('referral') !== -1) {
    return 'Referral Follow-Up';
  }
  return 'Form Entry';
}

function inferContactCategory_(formName) {
  const lower = String(formName).toLowerCase();
  if (lower.indexOf('referral') !== -1) {
    return 'Referral';
  }
  if (lower.indexOf('assessment') !== -1) {
    return 'Assessment Lead';
  }
  return 'Client';
}

function appendNote_(existingNotes, note) {
  return [existingNotes, `[${timestamp_()}] ${note}`].filter(Boolean).join('\n');
}
