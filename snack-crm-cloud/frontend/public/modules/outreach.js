function cleanText(value) {
  return String(value ?? "").trim();
}

function cleanCount(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number)) : null;
}

function cleanMoney(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 100) / 100) : null;
}

function formatOutreachDate(value) {
  const text = cleanText(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return text || "-";

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatOutreachMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "$0";
  if (amount >= 1000) {
    const compact = amount / 1000;
    return `$${Number.isInteger(compact) ? compact : compact.toFixed(1)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount);
}

function outreachEventName(event = {}) {
  return cleanText(event.name) || "Unnamed event";
}

function outreachContactName(contact = {}) {
  return cleanText(contact.contactName) || cleanText(contact.childName) || "Unnamed contact";
}

const outreachEventStatusOptions = [
  "Scheduled",
  "Planning",
  "In Progress",
  "Completed",
  "Follow Up",
  "Canceled",
  "Archived"
];

const outreachContactStatusOptions = [
  "New",
  "Contacted",
  "Referral Created",
  "Scheduled",
  "Not Interested",
  "Closed"
];

const outreachTaskStatusOptions = ["Open", "In Progress", "Waiting", "Done", "Canceled"];
const outreachTaskPriorityOptions = ["Low", "Normal", "Urgent"];
const outreachEventTypeOptions = [
  "Outreach Event",
  "Hosted Class",
  "Community Event",
  "School Partnership",
  "Health Fair",
  "Other"
];

const outreachInterestTypeOptions = [
  "Family Nutrition Appointment",
  "Newsletter",
  "Class or Event",
  "Community Partnership",
  "Volunteer",
  "Other"
];

function outreachEventPayload(values = {}) {
  const textFields = [
    "name",
    "type",
    "status",
    "eventDate",
    "repeatPattern",
    "location",
    "contactName",
    "contactRole",
    "phone",
    "email",
    "deadline",
    "registration",
    "setup",
    "mainActivity",
    "giveaways",
    "costNotes",
    "notes"
  ];
  const payload = Object.fromEntries(textFields.map((field) => [field, cleanText(values[field])]));

  for (const field of ["interactionsCount", "referralsCount", "interestListCount", "participantListCount"]) {
    payload[field] = cleanCount(values[field]);
  }
  payload.costAmount = cleanMoney(values.costAmount);
  return payload;
}

function outreachContactPayload(values = {}) {
  return {
    eventId: cleanText(values.eventId),
    contactName: cleanText(values.contactName),
    childName: cleanText(values.childName),
    phone: cleanText(values.phone),
    email: cleanText(values.email),
    preferredLanguage: cleanText(values.preferredLanguage),
    interestType: cleanText(values.interestType),
    status: cleanText(values.status) || "New",
    referralId: cleanText(values.referralId),
    notes: cleanText(values.notes)
  };
}

function outreachTaskPayload(values = {}, event = {}) {
  return {
    title: cleanText(values.title),
    type: "Task",
    status: cleanText(values.status) || "Open",
    priority: cleanText(values.priority) || "Normal",
    dueDate: cleanText(values.dueDate),
    dueTime: cleanText(values.dueTime),
    assignedTo: cleanText(values.assignedTo),
    outreachEventId: cleanText(values.outreachEventId || event.id),
    outreachEventName: cleanText(values.outreachEventName || event.name || event.title),
    source: "Outreach",
    notes: cleanText(values.notes)
  };
}

function mapOutreachEvent(event = {}, options = {}) {
  const contacts = (options.contacts || []).filter((contact) => contact.eventId === event.id);
  const tasks = (options.tasks || []).filter((task) => task.outreachEventId === event.id);
  const date = formatOutreachDate(event.eventDate);
  const location = cleanText(event.location) || "-";
  const cost = formatOutreachMoney(event.costAmount);
  const costNotes = cleanText(event.costNotes);
  const lead = [cleanText(event.contactName), cleanText(event.contactRole)].filter(Boolean).join(" | ") || "-";

  return {
    id: cleanText(event.id),
    kind: "event",
    title: outreachEventName(event),
    subtitle: [date === "-" ? "" : date, location === "-" ? "" : location].filter(Boolean).join(" | ") || "No date or location",
    status: cleanText(event.status) || "Scheduled",
    date,
    eventDate: cleanText(event.eventDate),
    type: cleanText(event.type) || "Outreach Event",
    place: location,
    repeatPattern: cleanText(event.repeatPattern) || "One-time",
    cost: costNotes ? `${cost} | ${costNotes}` : cost,
    costAmount: Number(event.costAmount) || 0,
    costNotes: costNotes || "-",
    contact: lead,
    contactName: cleanText(event.contactName) || "-",
    contactRole: cleanText(event.contactRole) || "-",
    phone: cleanText(event.phone) || "-",
    email: cleanText(event.email) || "-",
    deadline: formatOutreachDate(event.deadline),
    deadlineValue: cleanText(event.deadline),
    registration: cleanText(event.registration) || "-",
    setup: cleanText(event.setup) || "-",
    activity: cleanText(event.mainActivity) || "-",
    giveaways: cleanText(event.giveaways) || "-",
    families: String(cleanCount(event.interactionsCount) ?? 0),
    referrals: String(cleanCount(event.referralsCount) ?? 0),
    interestList: String(cleanCount(event.interestListCount) ?? 0),
    participants: String(cleanCount(event.participantListCount) ?? 0),
    leads: `${cleanCount(event.interestListCount) ?? 0} interest list | ${cleanCount(event.referralsCount) ?? 0} referrals`,
    notes: cleanText(event.notes) || "-",
    contacts,
    tasks,
    source: event
  };
}

function mapOutreachEvents(events = [], options = {}) {
  return events
    .map((event) => mapOutreachEvent(event, options))
    .sort((first, second) => {
      const firstDate = first.eventDate || "9999-12-31";
      const secondDate = second.eventDate || "9999-12-31";
      return firstDate.localeCompare(secondDate) || first.title.localeCompare(second.title);
    });
}

function mapOutreachContact(contact = {}, eventsById = new Map()) {
  const event = eventsById.get(contact.eventId);
  const eventName = event ? outreachEventName(event) : "Not linked";
  const name = outreachContactName(contact);

  return {
    id: cleanText(contact.id),
    kind: "contact",
    title: name,
    subtitle: [eventName, cleanText(contact.interestType)].filter(Boolean).join(" | "),
    status: cleanText(contact.status) || "New",
    event: eventName,
    eventId: cleanText(contact.eventId),
    contactName: cleanText(contact.contactName) || "-",
    childName: cleanText(contact.childName) || "-",
    phone: cleanText(contact.phone) || "-",
    email: cleanText(contact.email) || "-",
    language: cleanText(contact.preferredLanguage) || "-",
    interestType: cleanText(contact.interestType) || "-",
    referralId: cleanText(contact.referralId),
    notes: cleanText(contact.notes) || "-",
    createdDate: formatOutreachDate(contact.createdAt),
    source: contact
  };
}

function mapOutreachContacts(contacts = [], events = []) {
  const eventsById = new Map(events.map((event) => [event.id, event]));
  return contacts
    .map((contact) => mapOutreachContact(contact, eventsById))
    .sort((first, second) => first.title.localeCompare(second.title));
}

function mapOutreachTask(task = {}, eventsById = new Map()) {
  const event = eventsById.get(task.outreachEventId);
  const eventName = cleanText(task.outreachEventName) || (event ? outreachEventName(event) : "Not linked");

  return {
    id: cleanText(task.id),
    kind: "task",
    title: cleanText(task.title) || "Untitled task",
    subtitle: [formatOutreachDate(task.dueDate), eventName].filter((value) => value && value !== "-").join(" | ") || "No due date",
    status: cleanText(task.status) || "Open",
    priority: cleanText(task.priority) || "Normal",
    dueDate: formatOutreachDate(task.dueDate),
    dueDateValue: cleanText(task.dueDate),
    dueTime: cleanText(task.dueTime) || "-",
    assignedTo: cleanText(task.assignedTo) || "-",
    event: eventName,
    eventId: cleanText(task.outreachEventId),
    notes: cleanText(task.notes) || "-",
    source: task
  };
}

function mapOutreachTasks(tasks = [], events = []) {
  const eventsById = new Map(events.map((event) => [event.id, event]));
  return tasks
    .filter((task) => task.source === "Outreach" || task.outreachEventId)
    .map((task) => mapOutreachTask(task, eventsById))
    .sort((first, second) => {
      const firstDate = first.dueDateValue || "9999-12-31";
      const secondDate = second.dueDateValue || "9999-12-31";
      return firstDate.localeCompare(secondDate) || first.title.localeCompare(second.title);
    });
}

function outreachEventMatches(item, query) {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [item.title, item.status, item.type, item.place, item.contact, item.registration, item.activity, item.notes]
    .some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function outreachContactMatches(item, query) {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [item.title, item.status, item.event, item.childName, item.phone, item.email, item.language, item.interestType, item.notes]
    .some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function outreachTaskMatches(item, query) {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [item.title, item.status, item.priority, item.event, item.assignedTo, item.notes]
    .some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function outreachSummary(events = [], contacts = [], year = new Date().getFullYear()) {
  const yearText = String(year);
  const annualEvents = events.filter((event) => cleanText(event.eventDate).startsWith(yearText));
  const annualEventIds = new Set(annualEvents.map((event) => event.id));
  const annualContacts = contacts.filter((contact) =>
    cleanText(contact.createdAt).startsWith(yearText) || annualEventIds.has(contact.eventId));
  const familiesReached = annualEvents.reduce((sum, event) => sum + (cleanCount(event.interactionsCount) ?? 0), 0);
  const eventCosts = annualEvents.reduce((sum, event) => sum + (cleanMoney(event.costAmount) ?? 0), 0);

  return [
    [String(annualEvents.length), "Annual events"],
    [String(familiesReached), "Families reached"],
    [String(annualContacts.length), "New contacts"],
    [formatOutreachMoney(eventCosts), "Event costs"]
  ];
}

function outreachReport(events = [], contacts = [], tasks = [], year = new Date().getFullYear()) {
  const yearText = String(year);
  const annualEvents = events.filter((event) => cleanText(event.eventDate).startsWith(yearText));
  const eventIds = new Set(annualEvents.map((event) => event.id));
  const annualContacts = contacts.filter((contact) =>
    cleanText(contact.createdAt).startsWith(yearText) || eventIds.has(contact.eventId));
  const annualTasks = tasks.filter((task) => {
    if (task.source !== "Outreach" && !task.outreachEventId) return false;
    if (task.outreachEventId) return eventIds.has(task.outreachEventId);
    return cleanText(task.dueDate).startsWith(yearText) || cleanText(task.createdAt).startsWith(yearText);
  });
  const sum = (field) => annualEvents.reduce((total, event) => total + (cleanCount(event[field]) ?? 0), 0);

  return {
    year,
    events: annualEvents.length,
    completedEvents: annualEvents.filter((event) => cleanText(event.status) === "Completed").length,
    interactions: sum("interactionsCount"),
    participants: sum("participantListCount"),
    referrals: sum("referralsCount"),
    interestList: sum("interestListCount"),
    contacts: annualContacts.length,
    openTasks: annualTasks.filter((task) => !["Done", "Canceled"].includes(cleanText(task.status))).length,
    cost: annualEvents.reduce((total, event) => total + (cleanMoney(event.costAmount) ?? 0), 0)
  };
}

export {
  cleanCount,
  cleanMoney,
  formatOutreachDate,
  formatOutreachMoney,
  mapOutreachContact,
  mapOutreachContacts,
  mapOutreachEvent,
  mapOutreachEvents,
  mapOutreachTask,
  mapOutreachTasks,
  outreachContactMatches,
  outreachContactName,
  outreachContactPayload,
  outreachContactStatusOptions,
  outreachEventMatches,
  outreachEventName,
  outreachEventPayload,
  outreachEventStatusOptions,
  outreachEventTypeOptions,
  outreachInterestTypeOptions,
  outreachReport,
  outreachSummary,
  outreachTaskMatches,
  outreachTaskPayload,
  outreachTaskPriorityOptions,
  outreachTaskStatusOptions
};
