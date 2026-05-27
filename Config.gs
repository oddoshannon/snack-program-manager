const SNACK = {
  APP_NAME: 'SNACK CRM',
  TIMEZONE: 'America/Los_Angeles',
  SHEETS: {
    CONTACTS: 'Contacts',
    APPOINTMENTS: 'Appointments',
    TASKS: 'Tasks',
    PROGRAMS: 'Programs',
    KPI_DATA: 'KPI Data',
    OUTREACH: 'Outreach',
    STAFF: 'Staff',
    SETTINGS: 'Settings'
  },
  TASK_STATUS: {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    DEFERRED: 'Deferred'
  },
  APPOINTMENT_STATUS: {
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    NO_SHOW: 'No Show',
    CANCELLED: 'Cancelled'
  },
  CONTACT_STATUS: {
    SCHEDULED: 'Scheduled',
    RESCHEDULE: 'Reschedule',
    PRIORITY_RESCHEDULE: 'Priority Reschedule',
    GRADUATED: 'Graduated',
    ACTIVE: 'Active'
  },
  DEFAULT_STAFF: 'Unassigned'
};

const HEADERS = {
  Contacts: [
    'ContactID',
    'First Name',
    'Last Name',
    'DOB',
    'Phone',
    'Email',
    'Address',
    'Language',
    'YCCO Status',
    'Category',
    'Status',
    'Referral Source',
    'First Appointment Date',
    'Most Recent Contact Date',
    'Notes',
    'Tags',
    'Created At',
    'Updated At'
  ],
  Appointments: [
    'AppointmentID',
    'ContactID',
    'Appointment Type',
    'Date',
    'Time',
    'Staff',
    'Status',
    'Lesson Number',
    'Goal',
    'Notes',
    'Calendar Event ID',
    'Created At',
    'Updated At'
  ],
  Tasks: [
    'TaskID',
    'Task Type',
    'Description',
    'ContactID',
    'AppointmentID',
    'Assigned Staff',
    'Priority',
    'Due Date',
    'Status',
    'Created By Automation',
    'Notes',
    'Created At',
    'Updated At',
    'Completed At'
  ],
  Programs: [
    'ProgramID',
    'Program Name',
    'Active Status',
    'Start Date',
    'End Date',
    'KPI Definitions',
    'Created At',
    'Updated At'
  ],
  'KPI Data': [
    'EntryID',
    'ProgramID',
    'KPI Name',
    'KPI Value',
    'Date',
    'Staff',
    'Notes',
    'Created At',
    'Updated At'
  ],
  Outreach: [
    'OutreachID',
    'Event Name',
    'Outreach Type',
    'Date',
    'Leads Generated',
    'Conversions',
    'Partner Organization',
    'Notes',
    'Created At',
    'Updated At'
  ],
  Staff: [
    'StaffID',
    'Name',
    'Role',
    'Email',
    'Availability',
    'Assigned Programs',
    'Active',
    'Created At',
    'Updated At'
  ],
  Settings: [
    'SettingID',
    'Setting Type',
    'Name',
    'Value',
    'Active',
    'Notes',
    'Updated At'
  ]
};

const DEFAULT_SETTINGS = [
  ['appointment_type', 'Enrollment', 'Enrollment', true, 'Creates intake/form prep workflow.'],
  ['appointment_type', 'Nutrition Lesson', 'Nutrition Lesson', true, 'Standard client lesson.'],
  ['appointment_type', 'Graduation', 'Graduation', true, 'Creates graduation/form workflow.'],
  ['task_type', 'Chart Note', 'Chart Note', true, 'Athena charting task.'],
  ['task_type', 'Form Entry', 'Form Entry', true, 'Google Form or paper form entry.'],
  ['task_type', 'Assessment Entry', 'Assessment Entry', true, 'Assessment entry workflow.'],
  ['task_type', 'Referral Follow-Up', 'Referral Follow-Up', true, 'Referral outreach follow-up.'],
  ['task_type', 'Client Follow-Up', 'Client Follow-Up', true, 'Client outreach follow-up.'],
  ['task_type', 'Outreach Follow-Up', 'Outreach Follow-Up', true, 'Public/professional outreach follow-up.'],
  ['task_type', 'Scheduling', 'Scheduling', true, 'Appointment scheduling task.'],
  ['task_type', 'Administrative', 'Administrative', true, 'Internal admin task.'],
  ['priority', 'High', 'High', true, 'Important or time-sensitive.'],
  ['priority', 'Normal', 'Normal', true, 'Default priority.'],
  ['priority', 'Low', 'Low', true, 'Lower urgency.'],
  ['workflow_rule', 'Referral follow-up days', '14', true, 'Create follow-up if not contacted in two weeks.']
];
