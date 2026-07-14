// Pure formatting, date, and string helpers shared across the app.
// No DOM access and no app state may be added to this module.

function formatDateOnly(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  }).format(date);
}

function formatDayPickerDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return formatDateOnly(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatFullDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return formatDateOnly(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatListDate(value) {
  return value ? formatDateOnly(value) : "";
}

function formatAppointmentTime(value) {
  const normalized = normalizeAppointmentTime(value);

  if (!normalized) {
    return "";
  }

  const [hourText, minuteText] = normalized.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function normalizeAppointmentTime(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  const militaryMatch = raw.match(/^(\d{1,2}):(\d{2})$/);

  if (militaryMatch) {
    const hour = Number(militaryMatch[1]);
    const minute = Number(militaryMatch[2]);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  const standardMatch = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)$/i);

  if (standardMatch) {
    let hour = Number(standardMatch[1]);
    const minute = Number(standardMatch[2] || "00");
    const period = standardMatch[3].toLowerCase();

    if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
      if (period.startsWith("p") && hour !== 12) {
        hour += 12;
      }

      if (period.startsWith("a") && hour === 12) {
        hour = 0;
      }

      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  return raw;
}

function appointmentTimeValue(value) {
  return appointmentTimeMinutes(value) ?? 0;
}

function appointmentTimeMinutes(value) {
  const normalized = normalizeAppointmentTime(value);
  const match = normalized.match(/^(\d{2}):(\d{2})$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function formatDuration(minutes) {
  return `${minutes} min`;
}

function formatShortDate(value) {
  if (!value) {
    return "";
  }

  const normalized = String(value).includes("T") ? String(value).slice(0, 10) : value;
  const date = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  }).format(date);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateString(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function formatWeekdayDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric"
  }).format(date);
}

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalized.length !== 10) {
    return value || "";
  }

  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
}

function normalizePhoneKey(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

function normalizedLookupKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function displayBoolean(value) {
  return value ? "✓" : "-";
}

function hasDisplayValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function validValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function todayDateString() {
  const date = new Date();
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function dateValue(value, emptyPlacement = 1) {
  if (!value) {
    return emptyPlacement * Number.MAX_SAFE_INTEGER;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? emptyPlacement * Number.MAX_SAFE_INTEGER : date.getTime();
}

function dateTimeValue(value, emptyPlacement = 1) {
  if (!value) {
    return emptyPlacement * Number.MAX_SAFE_INTEGER;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? emptyPlacement * Number.MAX_SAFE_INTEGER : date.getTime();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

export {
  addDays,
  appointmentTimeMinutes,
  appointmentTimeValue,
  dateTimeValue,
  dateValue,
  displayBoolean,
  displayValue,
  escapeHtml,
  formatAppointmentTime,
  formatDateOnly,
  formatDayPickerDate,
  formatDuration,
  formatFullDate,
  formatListDate,
  formatPhone,
  formatShortDate,
  formatWeekdayDate,
  hasDisplayValue,
  normalizeAppointmentTime,
  normalizePhoneKey,
  normalizedLookupKey,
  toDateString,
  todayDateString,
  validValue
};
