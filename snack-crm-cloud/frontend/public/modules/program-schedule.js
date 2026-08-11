const defaultClinicServices = Object.freeze([
  { id: "enrollment", label: "Enrollment Appointment", appointmentType: "Enrollment", durationMinutes: 30, defaultLanguage: "English", staffMember: "Cynthia Esparza", active: true, publiclyBookable: true },
  { id: "nutrition-education", label: "Nutrition Education Appointment", appointmentType: "Nutrition Education", durationMinutes: 30, defaultLanguage: "English", staffMember: "Cynthia Esparza", active: true, publiclyBookable: true },
  { id: "spanish-enrollment", label: "Cita de inscripción en español", appointmentType: "Enrollment", durationMinutes: 30, defaultLanguage: "Spanish", staffMember: "Cynthia Esparza", active: true, publiclyBookable: true },
  { id: "spanish-nutrition-education", label: "Cita de educación nutricional en español", appointmentType: "Nutrition Education", durationMinutes: 30, defaultLanguage: "Spanish", staffMember: "Cynthia Esparza", active: true, publiclyBookable: true }
]);

const defaultKitchenClassTypes = Object.freeze([
  { id: "kids-cooking-ages-6-9", label: "Kids Cooking + Nutrition Class - Ages 6-9", durationMinutes: 120, capacity: 8, active: true, publiclyBookable: true },
  { id: "kids-cooking-ages-8-12", label: "Kids Cooking + Nutrition Class - Ages 8-12", durationMinutes: 120, capacity: 8, active: true, publiclyBookable: true },
  { id: "teen-cooking-ages-13-18", label: "Teen Nutrition & Cooking Class - Ages 13-18", durationMinutes: 120, capacity: 8, active: true, publiclyBookable: true }
]);

function text(value) {
  return String(value ?? "").trim();
}

export function programClientContact(client = {}) {
  return {
    caregiverName: text(client.parentName),
    phone: text(client.phone),
    email: text(client.email)
  };
}

export function programClientSearchResults(clients = [], query = "", selectedIds = [], limit = 8) {
  const normalized = text(query).toLowerCase();
  if (normalized.length < 2) return [];
  const selected = new Set(selectedIds.map(text));
  return clients
    .filter((client) => !selected.has(text(client?.id)))
    .filter((client) => [
      client?.firstName,
      client?.lastName,
      client?.parentName,
      client?.phone,
      client?.email
    ].some((value) => text(value).toLowerCase().includes(normalized)))
    .slice(0, Math.max(1, Number(limit) || 8));
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number) : fallback;
}

function bool(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = typeof value === "string" ? value.toLowerCase() : value;
  return [true, "true", "yes", "1", "on"].includes(normalized);
}

function typeId(value, label, prefix, index) {
  return text(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    || text(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    || `${prefix}-${index + 1}`;
}

function normalizeKitchenClassLabel(value) {
  return text(value).replace(/^Kids Nutrition & Cooking Class\b/i, "Kids Cooking + Nutrition Class");
}

export function normalizeClinicServices(value) {
  const source = Array.isArray(value) && value.length ? value : defaultClinicServices;
  return source.map((service, index) => {
    const fallback = defaultClinicServices[index] || defaultClinicServices[0];
    const label = text(service?.label) || fallback.label;
    return {
      id: typeId(service?.id, label, "clinic-service", index),
      label,
      appointmentType: text(service?.appointmentType) || fallback.appointmentType,
      durationMinutes: positiveInteger(service?.durationMinutes, fallback.durationMinutes),
      defaultLanguage: text(service?.defaultLanguage) || fallback.defaultLanguage,
      staffMember: text(service?.staffMember) || fallback.staffMember,
      active: bool(service?.active, true),
      publiclyBookable: bool(service?.publiclyBookable, true)
    };
  });
}

export function normalizeKitchenClassTypes(value) {
  const source = Array.isArray(value) && value.length ? value : defaultKitchenClassTypes;
  return source.map((classType, index) => {
    const fallback = defaultKitchenClassTypes[index] || defaultKitchenClassTypes[0];
    const label = normalizeKitchenClassLabel(classType?.label) || fallback.label;
    return {
      id: typeId(classType?.id, label, "kitchen-class", index),
      label,
      durationMinutes: positiveInteger(classType?.durationMinutes, fallback.durationMinutes),
      capacity: positiveInteger(classType?.capacity, fallback.capacity),
      active: bool(classType?.active, true),
      publiclyBookable: bool(classType?.publiclyBookable, true)
    };
  });
}

export function normalizeProgramScheduleSettings(settings = {}) {
  return {
    ...settings,
    clinicLocation: text(settings.clinicLocation) || "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128",
    clinicServices: normalizeClinicServices(settings.clinicServices),
    kitchenClassTypes: normalizeKitchenClassTypes(settings.kitchenClassTypes),
    kitchen: {
      startTime: text(settings.kitchen?.startTime) || text(settings.bookableStartTime) || "13:00",
      endTime: text(settings.kitchen?.endTime) || text(settings.bookableEndTime) || "18:00",
      weekdays: Array.isArray(settings.kitchen?.weekdays) ? settings.kitchen.weekdays.map(Number) : [2, 3, 4],
      defaultCapacity: positiveInteger(settings.kitchen?.defaultCapacity, 8),
      waitlistEnabled: bool(settings.kitchen?.waitlistEnabled, true),
      registrationMode: text(settings.kitchen?.registrationMode) || "Family",
      location: text(settings.kitchen?.location) || "1317 NE Dustin Ct, McMinnville, OR 97128"
    }
  };
}

export function formatProgramDate(value) {
  const match = text(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text(value) || "-";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function formatProgramTime(value) {
  const match = text(value).match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return text(value) || "-";
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? "PM" : "AM"}`;
}

export function mapProgramSessions(sessions = [], registrations = [], program = "Kitchen") {
  return sessions
    .filter((session) => session.program === program)
    .map((session) => {
      const sessionRegistrations = registrations.filter((registration) => registration.sessionId === session.id);
      const registered = sessionRegistrations.filter((registration) => ["Registered", "Attended"].includes(registration.status));
      const waitlisted = sessionRegistrations.filter((registration) => registration.status === "Waitlisted");
      const registeredChildren = registered.reduce((total, registration) => total + positiveInteger(registration.attendeeCount, 1), 0);
      return {
        ...session,
        title: program === "Kitchen" ? normalizeKitchenClassLabel(session.title) : session.title,
        classTypeLabel: program === "Kitchen" ? normalizeKitchenClassLabel(session.classTypeLabel) : session.classTypeLabel,
        dateLabel: formatProgramDate(session.sessionDate),
        timeLabel: formatProgramTime(session.startTime),
        durationMinutes: positiveInteger(session.durationMinutes, program === "Kitchen" ? 120 : 60),
        capacity: session.capacity ? positiveInteger(session.capacity, 8) : null,
        registeredChildren,
        waitlistedFamilies: waitlisted.length,
        registrations: sessionRegistrations
      };
    })
    .sort((first, second) => `${first.sessionDate}T${first.startTime}`.localeCompare(`${second.sessionDate}T${second.startTime}`));
}

export function programScheduleSummary(sessions = [], program = "Kitchen", today = new Date().toISOString().slice(0, 10)) {
  const upcoming = sessions.filter((session) => session.status !== "Canceled" && session.sessionDate >= today);
  const completed = sessions.filter((session) => session.status === "Completed");

  if (program === "Kitchen") {
    return [
      [String(upcoming.length), "Upcoming Classes"],
      [String(upcoming.reduce((total, session) => total + session.registeredChildren, 0)), "Registered Children"],
      [String(upcoming.reduce((total, session) => total + session.waitlistedFamilies, 0)), "Waitlisted Families"],
      [String(completed.length), "Completed Classes"]
    ];
  }

  const schools = new Set(sessions.map((session) => text(session.schoolName)).filter(Boolean));
  return [
    [String(upcoming.length), "Upcoming Classes"],
    [String(sessions.reduce((total, session) => total + positiveInteger(session.participantCount, 0), 0)), "Participants"],
    [String(schools.size), "Schools / Sites"],
    [String(completed.length), "Completed Classes"]
  ];
}

export function programSessionPayload(values = {}, program = "Kitchen", classTypes = []) {
  const classType = normalizeKitchenClassTypes(classTypes).find((item) => item.id === values.classTypeId);
  return {
    program,
    title: program === "Kitchen" ? normalizeKitchenClassLabel(values.title) || classType?.label || "" : text(values.title),
    classTypeId: program === "Kitchen" ? text(values.classTypeId) : "",
    classTypeLabel: program === "Kitchen" ? classType?.label || text(values.classTypeLabel) : "",
    sessionDate: text(values.sessionDate),
    startTime: text(values.startTime),
    durationMinutes: positiveInteger(values.durationMinutes, classType?.durationMinutes || 60),
    capacity: program === "Kitchen" ? positiveInteger(values.capacity, classType?.capacity || 8) : null,
    status: text(values.status) || "Scheduled",
    location: text(values.location),
    staffMember: text(values.staffMember),
    schoolName: program === "School" ? text(values.schoolName) : "",
    gradeGroup: program === "School" ? text(values.gradeGroup) : "",
    participantCount: program === "School" ? positiveInteger(values.participantCount, 0) : 0,
    notes: text(values.notes)
  };
}

export function programRegistrationPayload(values = {}, session = {}, selectedClients = []) {
  const clients = selectedClients.filter((client, index, items) => client?.id && items.findIndex((item) => item.id === client.id) === index);
  return {
    sessionId: text(session.id),
    program: text(session.program),
    caregiverName: text(values.caregiverName),
    clientIds: clients.map((client) => client.id),
    clientNames: clients.map((client) => [client.firstName, client.lastName].filter(Boolean).join(" ").trim()).filter(Boolean),
    attendeeCount: Math.max(clients.length, positiveInteger(values.attendeeCount, 1)),
    phone: text(values.phone),
    email: text(values.email),
    foodRestrictions: text(values.foodRestrictions),
    status: text(values.status),
    notes: text(values.notes)
  };
}

export { defaultClinicServices, defaultKitchenClassTypes };
