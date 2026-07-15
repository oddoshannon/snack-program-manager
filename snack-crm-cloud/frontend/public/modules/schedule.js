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
    weekday: "long",
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

export function appointmentAccent(status) {
  if (status === "Completed") return "#6b7b7f";
  if (status === "No-show") return "#0891b2";
  if (status === "Rescheduled") return "#c98608";
  return "#e94b55";
}

export function normalizeAppointmentStatus(value) {
  const status = String(value || "Scheduled").trim();
  if (/^complete$/i.test(status)) return "Completed";
  if (/^no[ -]?show$/i.test(status)) return "No-show";
  if (/^(needs )?reschedule(d)?$/i.test(status)) return "Rescheduled";
  if (/^cancel(l)?ed$/i.test(status)) return "Canceled";
  return status || "Scheduled";
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

  return {
    id: appointment.id,
    title: formatFirstNames(displayNames),
    subtitle: type,
    status,
    date: appointment.appointmentDate,
    time: normalizeAppointmentTime(appointment.appointmentTime),
    duration: Number(appointment.durationMinutes) || 30,
    type,
    accent: appointmentAccent(status),
    caregiver: primaryClient?.parentName || "-",
    siblings: displayNames.map(firstName).filter(Boolean).join(", ") || "-",
    language: primaryClient?.preferredLanguage || "-",
    phone: formatPhone(primaryClient?.phone),
    lesson: appointment.lesson || type,
    staff: appointment.staffMember || "-",
    goal: appointment.goal || "-",
    notes: appointment.notes || "-",
    prepChecklist: appointment.prepChecklist || {},
    forms: prep.forms,
    supplies: prep.supplies
  };
}
