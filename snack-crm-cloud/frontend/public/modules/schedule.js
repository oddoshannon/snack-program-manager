export function scheduleDateFromKey(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function scheduleDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatScheduleDate(dateKey) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(scheduleDateFromKey(dateKey));
}

export function formatAppointmentDate(dateKey) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(scheduleDateFromKey(dateKey));
}

export function offsetScheduleDate(dateKey, dayOffset) {
  const date = scheduleDateFromKey(dateKey);
  date.setDate(date.getDate() + dayOffset);
  return scheduleDateKey(date);
}

export function scheduleWeekDates(dateKey, weekdays = [2, 3, 4]) {
  const selectedDate = scheduleDateFromKey(dateKey);
  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());

  const clinicDays = [...new Set((Array.isArray(weekdays) ? weekdays : [2, 3, 4])
    .map(Number)
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))]
    .sort((first, second) => first - second);

  return (clinicDays.length ? clinicDays : [2, 3, 4]).map((weekday) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + weekday);
    return scheduleDateKey(date);
  });
}

export function formatScheduleWeekRange(dateKeys = []) {
  const dates = dateKeys.map(scheduleDateFromKey).filter((date) => !Number.isNaN(date.getTime()));
  if (!dates.length) {
    return "";
  }

  const first = dates[0];
  const last = dates.at(-1);
  const firstMonth = new Intl.DateTimeFormat("en-US", { month: "short" }).format(first);
  const lastMonth = new Intl.DateTimeFormat("en-US", { month: "short" }).format(last);
  const firstYear = first.getFullYear();
  const lastYear = last.getFullYear();

  if (firstYear === lastYear && first.getMonth() === last.getMonth()) {
    return `${firstMonth} ${first.getDate()} - ${last.getDate()}, ${lastYear}`;
  }
  if (firstYear === lastYear) {
    return `${firstMonth} ${first.getDate()} - ${lastMonth} ${last.getDate()}, ${lastYear}`;
  }
  return `${firstMonth} ${first.getDate()}, ${firstYear} - ${lastMonth} ${last.getDate()}, ${lastYear}`;
}

export function scheduleTimeMinutes(time) {
  const [hour, minute] = String(time || "").split(":").map(Number);
  return Number.isFinite(hour) && Number.isFinite(minute) ? (hour * 60) + minute : null;
}

export function formatScheduleTime(totalMinutes) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export const newAppointmentServices = Object.freeze([
  Object.freeze({
    id: "enrollment",
    label: "Enrollment Appointment",
    appointmentType: "Enrollment",
    durationMinutes: 30
  }),
  Object.freeze({
    id: "nutrition-education",
    label: "Nutrition Education Appointment",
    appointmentType: "Nutrition Education",
    durationMinutes: 30
  }),
  Object.freeze({
    id: "spanish-enrollment",
    label: "Cita de inscripción en español",
    appointmentType: "Enrollment",
    durationMinutes: 30
  }),
  Object.freeze({
    id: "spanish-nutrition-education",
    label: "Cita de educación nutricional en español",
    appointmentType: "Nutrition Education",
    durationMinutes: 30
  })
]);

export function newAppointmentService(serviceId, services = newAppointmentServices) {
  const availableServices = Array.isArray(services) && services.length ? services : newAppointmentServices;
  return availableServices.find((service) => service.id === serviceId) || availableServices[0];
}

export function scheduleTimeOptions(settings = {}, durationMinutes = 30) {
  const start = scheduleTimeMinutes(settings.bookableStartTime) ?? (13 * 60 + 30);
  const end = scheduleTimeMinutes(settings.bookableEndTime) ?? (18 * 60);
  const interval = [5, 10, 15, 30].includes(Number(settings.slotIntervalMinutes))
    ? Number(settings.slotIntervalMinutes)
    : 15;
  const duration = Math.max(1, Number(durationMinutes) || 30);
  const latestStart = end - duration;
  const times = [];

  for (let minutes = start; minutes <= latestStart; minutes += interval) {
    times.push(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
  }

  return times;
}

export function scheduleTimeKey(totalMinutes) {
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

export function blockTimeEndOptions(startTime, settings = {}) {
  if (!String(startTime || "").trim()) {
    return [];
  }

  const start = scheduleTimeMinutes(normalizeAppointmentTime(startTime));
  const end = scheduleTimeMinutes(settings.bookableEndTime) ?? (18 * 60);
  const interval = [5, 10, 15, 30].includes(Number(settings.slotIntervalMinutes))
    ? Number(settings.slotIntervalMinutes)
    : 15;
  const times = [];

  for (let minutes = start + interval; minutes <= end; minutes += interval) {
    times.push(scheduleTimeKey(minutes));
  }

  return times;
}

export function blockTimeDurationMinutes(startTime, endTime) {
  if (!String(startTime || "").trim() || !String(endTime || "").trim()) {
    return 0;
  }

  const start = scheduleTimeMinutes(normalizeAppointmentTime(startTime));
  const end = scheduleTimeMinutes(normalizeAppointmentTime(endTime));
  return end > start ? end - start : 0;
}

export function cleanAppointmentType(value, lesson) {
  const fallback = lesson ? "Nutrition Education" : "Enrollment";
  return String(value || fallback).replace(/\s+Appointment$/i, "").trim() || fallback;
}

export function normalizeAppointmentTime(value) {
  const raw = String(value || "").trim();
  const twentyFourHour = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHour) {
    return `${String(Number(twentyFourHour[1])).padStart(2, "0")}:${twentyFourHour[2]}`;
  }

  const twelveHour = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!twelveHour) {
    return "13:00";
  }

  let hour = Number(twelveHour[1]) % 12;
  if (twelveHour[3].toUpperCase() === "PM") {
    hour += 12;
  }
  return `${String(hour).padStart(2, "0")}:${twelveHour[2]}`;
}

export function clientFullName(client) {
  return [client?.firstName, client?.lastName].filter(Boolean).join(" ").trim();
}

export function newAppointmentPayload(values = {}, selectedClients = [], services = newAppointmentServices) {
  const service = newAppointmentService(values.serviceId, services);
  const requestedDuration = Number(values.durationMinutes);
  const clients = selectedClients.filter((client, index, items) => client?.id
    && items.findIndex((candidate) => candidate?.id === client.id) === index);
  const clientIds = clients.map((client) => client.id);
  const clientNames = clients.map(clientFullName).filter(Boolean);
  const isNutritionEducation = service.appointmentType === "Nutrition Education";
  const allowedStatuses = new Set(["Scheduled", "Completed", "No-show", "Rescheduled"]);
  const status = allowedStatuses.has(values.status) ? values.status : "Scheduled";

  return {
    clientId: clientIds[0] || "",
    clientIds,
    clientName: clientNames[0] || "",
    clientNames,
    appointmentDate: String(values.appointmentDate || "").trim(),
    appointmentTime: values.appointmentTime ? normalizeAppointmentTime(values.appointmentTime) : "",
    appointmentType: service.appointmentType,
    publicBookingServiceId: service.id,
    publicBookingServiceLabel: service.label,
    durationMinutes: requestedDuration > 0 ? requestedDuration : service.durationMinutes,
    status,
    lesson: isNutritionEducation ? String(values.lesson || "").trim() : "",
    goal: isNutritionEducation ? String(values.goal || "").trim() : "",
    staffMember: String(values.staffMember || "").trim(),
    notes: String(values.notes || "").trim()
  };
}

export function blockTimePayload(values = {}) {
  const selectedDuration = blockTimeDurationMinutes(values.appointmentTime, values.endTime);

  return {
    clientId: "",
    clientIds: [],
    clientName: "Blocked Time",
    clientNames: ["Blocked Time"],
    appointmentDate: String(values.appointmentDate || "").trim(),
    appointmentTime: values.appointmentTime ? normalizeAppointmentTime(values.appointmentTime) : "",
    appointmentType: "Administrative",
    durationMinutes: selectedDuration || Math.max(1, Number(values.durationMinutes) || 30),
    status: "Blocked",
    lesson: "",
    goal: "",
    staffMember: String(values.staffMember || "").trim(),
    notes: String(values.notes || "Blocked time").trim() || "Blocked time"
  };
}

export function firstName(value) {
  return String(value || "").trim().split(/\s+/)[0] || "";
}

export function formatFirstNames(names) {
  const values = names.map(firstName).filter(Boolean);
  if (values.length < 2) {
    return values[0] || "Unknown client";
  }
  if (values.length === 2) {
    return `${values[0]} & ${values[1]}`;
  }
  return `${values.slice(0, -1).join(", ")} & ${values.at(-1)}`;
}

export function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return local.length === 10
    ? `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
    : String(value || "-");
}

export function prepForAppointment(type) {
  if (/enrollment|inscripci[oó]n/i.test(type)) {
    return {
      forms: [
        { key: "formsAtReception", text: "Place forms at reception before the appointment." },
        { key: "enrollmentForm", text: "Enrollment form (file cabinet); siblings can share one form." },
        { key: "questionnaire", text: "Questionnaire for each child (file cabinet); each child needs their own." },
        { key: "markPre", text: "Write client name in the top right corner, initial code on the back, and circle PRE." }
      ],
      supplies: [
        { key: "sticker", text: "SNACK sticker." },
        { key: "penPencil", text: "SNACK pen or pencil." }
      ]
    };
  }

  return {
    forms: [{ key: "prize", text: "Prize from the bin." }],
    supplies: [{ key: "foodSnack", text: "Food snack." }]
  };
}

const appointmentLessonAccents = [
  "#667085",
  "#e23a4d",
  "#d27354",
  "#f4c753",
  "#078b4d",
  "#039cbb",
  "#004aad",
  "#7a33c2"
];

const appointmentLessonNames = new Map([
  ["nutrient density", 1],
  ["nutrient dense", 1],
  ["nd", 1],
  ["sugar", 2],
  ["food group", 3],
  ["food groups", 3],
  ["fg", 3],
  ["macronutrient", 4],
  ["macronutrients", 4],
  ["macro", 4],
  ["macros", 4],
  ["micronutrient", 5],
  ["micronutrients", 5],
  ["micro", 5],
  ["micros", 5],
  ["mindful eating", 6],
  ["me", 6],
  ["healthy habit", 7],
  ["healthy habits", 7],
  ["hh", 7]
]);

export function appointmentLessonNumber(value) {
  const lesson = String(value || "").trim().toLowerCase();
  const numeric = Number.parseInt(lesson.replace(/\D/g, ""), 10);

  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 7) {
    return numeric;
  }

  return appointmentLessonNames.get(lesson) || 0;
}

export const appointmentLessonTitles = Object.freeze({
  1: "Nutrient Density",
  2: "Sugar",
  3: "Food Groups",
  4: "Macronutrients",
  5: "Micronutrients",
  6: "Mindful Eating",
  7: "Healthy Habits"
});

export function scheduleClientOutcomeUpdates(item = {}, status = "", options = {}) {
  const appointmentType = item.type || item.source?.appointmentType || "";
  const appointmentDate = item.date || item.source?.appointmentDate || "";
  const isFinalLesson = /nutrition education|educaci[oó]n nutricional/i.test(appointmentType)
    && appointmentLessonNumber(item.lesson || item.source?.lesson) === 7;
  const updates = {};

  if (status === "Completed") {
    updates.status = isFinalLesson ? "Graduated" : options.hasFutureAppointment ? "Active" : "Needs Reschedule";
    updates.mostRecentAppointmentDate = appointmentDate;
    if (isFinalLesson) updates.graduationDate = appointmentDate;
  }

  if (status === "No-show") {
    updates.status = "Needs Reschedule";
    updates.mostRecentAppointmentDate = options.mostRecentCompletedDate || "";
  }

  if (status === "Scheduled") {
    updates.status = /enrollment|inscripci[oó]n/i.test(appointmentType) ? "Scheduled" : "Active";
    if (options.currentLesson) updates.currentLesson = options.currentLesson;
  }

  if (status === "Canceled") {
    updates.status = options.hasFutureAppointment ? "Active" : "Needs Reschedule";
  }

  return updates;
}

export const appointmentWrapUpDefaults = Object.freeze({
  caregiverMood: "Good",
  confidence: "High",
  participation: "Engaged",
  barriers: "None"
});

export const appointmentWrapUpOptions = Object.freeze({
  goalResult: Object.freeze(["Achieved", "Partly Achieved", "Not Achieved", "Not Assessed"]),
  interpreterUse: Object.freeze(["Not needed", "Yes", "No"]),
  caregiverMood: Object.freeze(["Good", "Okay", "Stressed", "Concerned"]),
  confidence: Object.freeze(["High", "Medium", "Low"]),
  participation: Object.freeze(["Engaged", "Somewhat Engaged", "Quiet", "Not Engaged"]),
  barriers: Object.freeze(["None", "Transportation", "Schedule", "Food access", "Language", "Caregiver capacity", "Other"])
});

export function nextAppointmentLessonNumber(item = {}) {
  const type = cleanAppointmentType(item.type || item.source?.appointmentType, item.lesson || item.source?.lesson);

  if (type === "Administrative") {
    return null;
  }

  if (type === "Enrollment") {
    return 1;
  }

  const currentLesson = appointmentLessonNumber(item.lesson || item.source?.lesson);
  if (!currentLesson) {
    return 1;
  }

  return currentLesson < 7 ? currentLesson + 1 : null;
}

export function defaultNextAppointmentDate(item = {}) {
  const appointmentDate = item.date || item.source?.appointmentDate;
  return appointmentDate ? offsetScheduleDate(appointmentDate, 7) : "";
}

export function completedLessonForNextAppointment(lessonValue) {
  const nextLesson = appointmentLessonNumber(lessonValue);
  if (!nextLesson) return "";
  return nextLesson === 1 ? "enrollment" : `lesson-${nextLesson - 1}`;
}

export function completedAppointmentPayload(item, values = {}) {
  const storedParticipantGoals = Array.isArray(item?.source?.participantGoals)
    ? item.source.participantGoals
    : [];
  const participantGoalsSource = Array.isArray(values.participantGoals)
    ? values.participantGoals
    : storedParticipantGoals;
  const participantGoals = participantGoalsSource.map((entry) => ({
      clientId: String(entry.clientId || "").trim(),
      clientName: String(entry.clientName || "").trim(),
      goal: String(entry.goal || "").trim(),
      goalResult: String(entry.goalResult || "").trim()
    }));
  const firstParticipantGoal = participantGoals[0];
  const payload = {
    ...appointmentStatusPayload(item, "Completed"),
    appointmentNote: String(values.appointmentNote ?? item?.source?.appointmentNote ?? "").trim(),
    goal: firstParticipantGoal?.goal || String(item?.source?.goal || "").trim(),
    goalResult: firstParticipantGoal?.goalResult || String(values.goalResult || item?.source?.goalResult || "").trim(),
    interpreterUse: String(values.interpreterUse || item?.source?.interpreterUse || "Not needed").trim(),
    caregiverMood: String(values.caregiverMood || item?.source?.caregiverMood || appointmentWrapUpDefaults.caregiverMood).trim(),
    confidence: String(values.confidence || item?.source?.confidence || appointmentWrapUpDefaults.confidence).trim(),
    participation: String(values.participation || item?.source?.participation || appointmentWrapUpDefaults.participation).trim(),
    barriers: String(values.barriers || item?.source?.barriers || appointmentWrapUpDefaults.barriers).trim()
  };
  if (participantGoals.length) payload.participantGoals = participantGoals;
  return payload;
}

export function appointmentNotePayload(item, values = {}) {
  const fields = typeof values === "string" ? { appointmentNote: values } : values;
  const participantGoals = Array.isArray(fields.participantGoals)
    ? fields.participantGoals.map((entry) => ({
      clientId: String(entry.clientId || "").trim(),
      clientName: String(entry.clientName || "").trim(),
      goal: String(entry.goal || "").trim(),
      goalResult: String(entry.goalResult || "").trim()
    }))
    : [];
  const firstParticipantGoal = participantGoals[0];
  const payload = {
    ...appointmentStatusPayload(item, item?.source?.status || item?.status || "Scheduled"),
    appointmentNote: String(fields.appointmentNote || "").trim(),
    goal: firstParticipantGoal?.goal || String(item?.source?.goal || "").trim(),
    goalResult: firstParticipantGoal?.goalResult || String(item?.source?.goalResult || "").trim(),
    interpreterUse: String(fields.interpreterUse || item?.source?.interpreterUse || "Not needed").trim(),
    caregiverMood: String(fields.caregiverMood || item?.source?.caregiverMood || appointmentWrapUpDefaults.caregiverMood).trim(),
    confidence: String(fields.confidence || item?.source?.confidence || appointmentWrapUpDefaults.confidence).trim(),
    participation: String(fields.participation || item?.source?.participation || appointmentWrapUpDefaults.participation).trim(),
    barriers: String(fields.barriers || item?.source?.barriers || appointmentWrapUpDefaults.barriers).trim()
  };
  if (participantGoals.length) payload.participantGoals = participantGoals;
  const sourceNote = String(item?.source?.notes || "").trim();
  const usesLegacyAppointmentNote = item?.status === "Completed"
    && !String(item?.source?.appointmentNote || "").trim()
    && String(item?.appointmentNote || "").trim() === sourceNote;

  if (usesLegacyAppointmentNote) {
    payload.notes = "";
  }

  return payload;
}

export function nextAppointmentPayload(item, values = {}) {
  const defaultNextLesson = nextAppointmentLessonNumber(item);
  const selectedNextLesson = appointmentLessonNumber(values.lesson);
  const nextLesson = selectedNextLesson || defaultNextLesson;
  if (!nextLesson) {
    return null;
  }

  const clientIds = item?.clientIds || item?.source?.clientIds || [];
  const clientNames = item?.clientNames || item?.source?.clientNames || [];
  const sourceServiceId = String(item?.source?.publicBookingServiceId || "");
  const useSpanishService = sourceServiceId.startsWith("spanish-") || /^spanish$/i.test(String(item?.language || ""));
  const service = newAppointmentService(useSpanishService ? "spanish-nutrition-education" : "nutrition-education");
  const participantGoals = Array.isArray(values.participantGoals)
    ? values.participantGoals.map((entry) => ({
      clientId: String(entry.clientId || "").trim(),
      clientName: String(entry.clientName || "").trim(),
      goal: String(entry.goal || "").trim(),
      goalResult: ""
    }))
    : [];

  return {
    clientId: clientIds[0] || item?.source?.clientId || "",
    clientIds,
    clientName: clientNames[0] || item?.source?.clientName || "",
    clientNames,
    appointmentDate: String(values.appointmentDate || defaultNextAppointmentDate(item)).trim(),
    appointmentTime: normalizeAppointmentTime(values.appointmentTime || item?.time || item?.source?.appointmentTime),
    appointmentType: service.appointmentType,
    publicBookingServiceId: service.id,
    publicBookingServiceLabel: service.label,
    durationMinutes: service.durationMinutes,
    status: "Scheduled",
    lesson: String(nextLesson),
    goal: participantGoals[0]?.goal || String(values.goal || "").trim(),
    participantGoals,
    staffMember: String(values.staffMember || item?.staff || item?.source?.staffMember || "").trim(),
    notes: String(values.notes || "").trim()
  };
}

export function appointmentActivityItems(item = {}, activityLogs = []) {
  const clientIds = new Set(item.clientIds || item.source?.clientIds || []);
  const clientActivity = activityLogs
    .filter((log) => log.relatedType === "client" && clientIds.has(log.relatedId))
    .map((log) => ({
      title: log.title || `${log.direction || "Outbound"} ${log.type || "Activity"}`,
      detail: [log.result, log.description].filter(Boolean).join(" | ") || log.type || "Activity",
      date: log.activityDate || String(log.occurredAt || "").slice(0, 10),
      sortKey: log.occurredAt || `${log.activityDate || ""}T${normalizeAppointmentTime(log.activityTime || "00:00")}`
    }));
  const lessonNumber = appointmentLessonNumber(item.lesson || item.source?.lesson);
  const lessonTitle = appointmentLessonTitles[lessonNumber] || item.lesson || item.type || "Appointment";
  const source = item.source || {};
  const appointmentActivity = [
    {
      title: item.status || normalizeAppointmentStatus(source.status),
      detail: [lessonTitle, item.staff || source.staffMember].filter(Boolean).join(" | "),
      date: item.date || source.appointmentDate,
      sortKey: `${item.date || source.appointmentDate || ""}T${item.time || normalizeAppointmentTime(source.appointmentTime)}`
    },
    source.createdAt ? {
      title: "Appointment created",
      detail: formatScheduleTime(scheduleTimeMinutes(item.time || normalizeAppointmentTime(source.appointmentTime))),
      date: String(source.createdAt).slice(0, 10),
      sortKey: source.createdAt
    } : null,
    source.updatedAt ? {
      title: "Last updated",
      detail: item.status || normalizeAppointmentStatus(source.status),
      date: String(source.updatedAt).slice(0, 10),
      sortKey: source.updatedAt
    } : null
  ].filter(Boolean);

  return [...clientActivity, ...appointmentActivity]
    .sort((first, second) => String(second.sortKey || "").localeCompare(String(first.sortKey || "")))
    .slice(0, 8);
}

export function appointmentLessonAccent(appointment = {}) {
  const type = cleanAppointmentType(appointment.appointmentType || appointment.type, appointment.lesson);

  if (type !== "Nutrition Education") {
    return appointmentLessonAccents[0];
  }

  const lessonNumber = appointmentLessonNumber(appointment.lesson);
  return appointmentLessonAccents[lessonNumber || 1];
}

export function normalizeAppointmentStatus(value) {
  const status = String(value || "Scheduled").trim();
  if (/^complete$/i.test(status)) return "Completed";
  if (/^no[ -]?show$/i.test(status)) return "No-show";
  if (/^(needs )?reschedule(d)?$/i.test(status)) return "Rescheduled";
  if (/^cancel(l)?ed$/i.test(status)) return "Canceled";
  return status || "Scheduled";
}

export function appointmentStatusPayload(item, status) {
  return {
    ...(item?.source || {}),
    clientId: item?.clientIds?.[0] || item?.source?.clientId || "",
    clientIds: item?.clientIds || item?.source?.clientIds || [],
    clientName: item?.clientNames?.[0] || item?.source?.clientName || "",
    clientNames: item?.clientNames || item?.source?.clientNames || [],
    status
  };
}

export function appointmentEditPayload(item, values = {}) {
  const appointmentType = cleanAppointmentType(values.appointmentType || item?.type);
  const isNutritionEducation = appointmentType === "Nutrition Education";
  const requestedDuration = Number(values.durationMinutes);

  return {
    ...appointmentStatusPayload(item, item?.source?.status || item?.status || "Scheduled"),
    appointmentType,
    durationMinutes: requestedDuration > 0
      ? requestedDuration
      : Number(item?.duration || item?.source?.durationMinutes) || 30,
    staffMember: String(values.staffMember || item?.staff || "").trim(),
    lesson: isNutritionEducation ? String(values.lesson || "").trim() : "",
    goal: isNutritionEducation ? String(values.goal || "").trim() : "",
    notes: String(values.notes ?? item?.notes ?? "").trim()
  };
}

export function rescheduleAppointmentPayloads(item, values) {
  const original = appointmentStatusPayload(item, "Rescheduled");
  const replacement = appointmentStatusPayload(item, "Scheduled");

  delete replacement.id;
  replacement.appointmentDate = values.appointmentDate;
  replacement.appointmentTime = normalizeAppointmentTime(values.appointmentTime);
  replacement.staffMember = String(values.staffMember || item?.staff || "").trim();
  replacement.notes = String(values.notes ?? item?.notes ?? "").trim();

  return { original, replacement };
}

export function mapAppointment(appointment, clientsById) {
  const clientIds = Array.isArray(appointment.clientIds) && appointment.clientIds.length
    ? appointment.clientIds
    : appointment.clientId ? [appointment.clientId] : [];
  const clientRecords = clientIds.map((id) => clientsById.get(id)).filter(Boolean);
  const storedNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
    ? appointment.clientNames
    : appointment.clientName ? [appointment.clientName] : [];
  const names = clientRecords.map(clientFullName).filter(Boolean);
  const displayNames = names.length ? names : storedNames;
  const primaryClient = clientRecords[0];
  const type = cleanAppointmentType(appointment.appointmentType, appointment.lesson);
  const prep = prepForAppointment(type);
  const status = normalizeAppointmentStatus(appointment.status);
  const storedAppointmentNote = String(appointment.appointmentNote || "").trim();
  const legacyAppointmentNote = !storedAppointmentNote && status === "Completed"
    ? String(appointment.notes || "").trim()
    : "";
  const detailsNote = status === "Completed" && (legacyAppointmentNote || storedAppointmentNote === String(appointment.notes || "").trim())
    ? ""
    : String(appointment.notes || "").trim();
  const isBlockedTime = status === "Blocked";
  const appointmentTime = normalizeAppointmentTime(appointment.appointmentTime);
  const duration = Number(appointment.durationMinutes) || 30;
  const startMinutes = scheduleTimeMinutes(appointmentTime);

  return {
    id: appointment.id,
    source: { ...appointment },
    clientIds,
    clientNames: displayNames,
    title: isBlockedTime ? "Blocked Time" : formatFirstNames(displayNames),
    subtitle: type,
    status,
    date: appointment.appointmentDate,
    time: appointmentTime,
    endTime: scheduleTimeKey(startMinutes + duration),
    duration,
    type,
    accent: appointmentLessonAccent(appointment),
    compact: duration <= 15,
    caregiver: primaryClient?.parentName || "-",
    siblings: displayNames.map(firstName).filter(Boolean).join(", ") || "-",
    language: primaryClient?.preferredLanguage || "-",
    phone: formatPhone(primaryClient?.phone),
    lesson: appointment.lesson || type,
    staff: appointment.staffMember || "-",
    goal: appointment.goal || "-",
    notes: detailsNote || "-",
    appointmentNote: storedAppointmentNote || legacyAppointmentNote,
    prepChecklist: appointment.prepChecklist || {},
    forms: prep.forms,
    supplies: prep.supplies
  };
}
