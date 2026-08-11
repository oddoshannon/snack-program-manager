const importDefinitions = Object.freeze({
  clients: {
    label: "Clients",
    endpoint: "/api/clients/import",
    payloadKey: "clients"
  },
  referrals: {
    label: "Referrals",
    endpoint: "/api/referrals/import",
    payloadKey: "referrals"
  },
  "referral-network": {
    label: "Referral Network",
    endpoint: "/api/referral-network/import",
    payloadKey: "entries"
  },
  appointments: {
    label: "Appointments",
    endpoint: "/api/appointments/import",
    payloadKey: "appointments"
  }
});

let clientStatuses = new Set([
  "Scheduled",
  "Active",
  "Needs Reschedule",
  "Needs Language Support",
  "Waiting on Family",
  "Age Limit",
  "Graduated",
  "Inactive",
  "Closed"
]);

function setAdminClientStatuses(definitions = []) {
  const names = Array.isArray(definitions)
    ? definitions.map((item) => clean(item?.name || item)).filter(Boolean)
    : [];
  if (names.length) clientStatuses = new Set(names);
}
const referralStatuses = new Set([
  "New",
  "Texted",
  "Left Voicemail",
  "Emailed",
  "Requested Call Back",
  "Caregiver Will Call Back",
  "Scheduled",
  "Not Interested",
  "Closed / No Further Outreach"
]);
const referralTypes = new Set([
  "Internal Clinic Referral",
  "External Clinic Referral",
  "Community Org Referral",
  "Nutrition Assessment",
  "Self Referral",
  "Outreach Event Interest",
  "Hosted Event/Class Interest",
  "Other"
]);
const setmoreServices = new Map([
  ["enrollment appointment", "Enrollment"],
  ["sibling enrollment appointment", "Enrollment"],
  ["cita de inscripción en español", "Enrollment"],
  ["nutrition education appointment", "Nutrition Education"],
  ["sibling nutrition education appointment", "Nutrition Education"],
  ["cita de educación nutricional en español", "Nutrition Education"],
  ["virtual nutrition education appointment", "Nutrition Education"]
]);

function clean(value) {
  return String(value ?? "").trim();
}

function normalizedHeader(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseAdminCsv(text) {
  const source = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"') {
      if (quoted && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => clean(value))) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some((value) => clean(value))) rows.push(row);
  if (!rows.length) return { columns: [], rows: [] };

  const columns = rows[0].map((column, index) => clean(column) || `Column ${index + 1}`);
  return {
    columns,
    rows: rows.slice(1).map((values) => Object.fromEntries(
      columns.map((column, index) => [column, clean(values[index])])
    ))
  };
}

function csvValue(row, aliases) {
  const lookup = new Map(Object.entries(row).map(([key, value]) => [normalizedHeader(key), clean(value)]));
  for (const alias of aliases) {
    const value = lookup.get(normalizedHeader(alias));
    if (value) return value;
  }
  return "";
}

function csvBoolean(value) {
  return /^(?:true|yes|y|1)$/i.test(clean(value));
}

function normalizedDate(value) {
  const source = clean(value);
  if (!source) return "";
  const iso = source.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const slash = source.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})/);
  if (slash) {
    const year = slash[3].length === 2 ? `20${slash[3]}` : slash[3];
    return `${year}-${slash[1].padStart(2, "0")}-${slash[2].padStart(2, "0")}`;
  }
  const date = new Date(source);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function normalizedClientStatus(value) {
  const source = clean(value);
  const mapped = ({
    "Appts in Progress": "Active",
    Interpreter: "Needs Language Support",
    "On the Way Out": "Inactive",
    "Parent Will Call When Ready": "Waiting on Family",
    "Priority Reschedule": "Needs Reschedule",
    Reschedule: "Needs Reschedule",
    Sunrise: "Waiting on Family"
  })[source] || source || "Scheduled";
  return clientStatuses.has(mapped) ? mapped : "";
}

function normalizedReferralStatus(value) {
  const source = clean(value);
  const mapped = ({
    new: "New",
    contacted: "Texted",
    scheduled: "Scheduled",
    closed: "Closed / No Further Outreach",
    "Parent Will Call Back": "Caregiver Will Call Back",
    "Parent will Call Back": "Caregiver Will Call Back"
  })[source] || source || "New";
  return referralStatuses.has(mapped) ? mapped : "";
}

function commonPersonRow(row, rowNumber) {
  return {
    rowNumber,
    firstName: csvValue(row, ["First Name", "Child First Name"]),
    lastName: csvValue(row, ["Last Name", "Child Last Name"]),
    parentName: csvValue(row, ["Parent Name", "Caregiver Name", "Parent/Caregiver"]),
    phone: csvValue(row, ["Mobile", "Home Phone", "Phone", "Phone Number"]),
    email: csvValue(row, ["Email", "Email Address"]),
    dateOfBirth: normalizedDate(csvValue(row, ["Date of Birth", "DOB"])),
    preferredLanguage: csvValue(row, ["Preferred Language", "Language"]),
    referralSource: csvValue(row, ["Referring Provider", "Referral Source"]),
    referralDate: normalizedDate(csvValue(row, ["Referral Date"])),
    firstContactDate: normalizedDate(csvValue(row, ["First Contact Date"])),
    mostRecentContactDate: normalizedDate(csvValue(row, ["Most Recent Contact Date", "Recent Contact Date"])),
    firstAppointmentDate: normalizedDate(csvValue(row, ["First Appt Date", "First Appointment Date"])),
    lastAppointmentDate: normalizedDate(csvValue(row, ["Last Appt Date", "Last Appointment Date"])),
    gender: csvValue(row, ["Gender"]) || "Unspecified",
    ycco: csvValue(row, ["YCCO"]),
    yccoId: csvValue(row, ["YCCO Number", "YCCO #", "Medicaid #", "Medicaid Number"]),
    hrsn: csvValue(row, ["HRSN"]),
    emailOptOut: csvBoolean(csvValue(row, ["Email Opt Out"])),
    addressStreet: csvValue(row, ["Mailing Street", "Street", "Address"]),
    addressCity: csvValue(row, ["Mailing City", "City"]),
    addressState: csvValue(row, ["Mailing State", "State"]),
    addressZip: csvValue(row, ["Mailing Zip", "Zip Code", "ZIP"]),
    notes: csvValue(row, ["Note", "Notes"]),
    zohoRecordId: csvValue(row, ["Record Id", "Record ID"]),
    siblingZohoRecordIds: [
      csvValue(row, ["Sibling.id", "Sibling ID"]),
      csvValue(row, ["Sibling 2.id", "Sibling 2 ID"])
    ].filter(Boolean)
  };
}

function missingPersonFields(record) {
  return [
    ["firstName", "child first name"],
    ["lastName", "child last name"],
    ["parentName", "caregiver name"],
    ["phone", "phone"],
    ["preferredLanguage", "preferred language"]
  ].filter(([key]) => !record[key]).map(([, label]) => label);
}

function mapClientRow(row, index) {
  const record = commonPersonRow(row, index + 2);
  record.status = normalizedClientStatus(csvValue(row, ["Status"]));
  return record;
}

function mapReferralRow(row, index, columns) {
  const record = commonPersonRow(row, index + 2);
  const isAssessment = columns.some((column) => normalizedHeader(column) === "assessment score")
    && !columns.some((column) => normalizedHeader(column) === "referral status");
  const contacted = csvBoolean(csvValue(row, ["Contacted?"]));
  record.status = isAssessment
    ? (csvValue(row, ["Status"]) === "Not Interested" ? "Not Interested" : contacted ? "Texted" : "New")
    : normalizedReferralStatus(csvValue(row, ["Referral Status", "Status"]));
  const type = csvValue(row, ["Referral Type"]);
  record.referralType = referralTypes.has(type)
    ? type
    : isAssessment ? "Nutrition Assessment" : "Internal Clinic Referral";
  record.importSource = isAssessment ? "Zoho Assessment CSV" : "Zoho Referral CSV";
  return record;
}

function inferredNetworkType(value) {
  const text = clean(value).toLowerCase();
  if (text.includes("school")) return "School";
  if (text.includes("county") || text.includes("government")) return "Government";
  if (text.includes("clinic") || text.includes("medical") || text.includes("health")) return "Healthcare";
  if (text.includes("community") || text.includes("ycco")) return "Community Organization";
  return "Other";
}

function mapNetworkRows(rows) {
  const grouped = new Map();
  rows.forEach((row, index) => {
    const providerName = csvValue(row, ["Provider Name", "Contact Name", "Name"]);
    const name = csvValue(row, ["Referring Organization", "Organization", "Organization Name", "Tag"])
      || providerName;
    if (!name) return;
    const key = name.toLowerCase();
    const current = grouped.get(key) || {
      rowNumber: index + 2,
      name,
      type: inferredNetworkType(name),
      contactName: "",
      phone: csvValue(row, ["Phone", "Phone Number"]),
      email: "",
      website: csvValue(row, ["Website"]),
      notes: "",
      providers: []
    };
    if (providerName) {
      current.providers.push({
        name: providerName,
        email: csvValue(row, ["Email", "Email Address"]),
        phone: csvValue(row, ["Phone", "Phone Number"]),
        notes: csvValue(row, ["Notes", "Tag"])
      });
    }
    grouped.set(key, current);
  });
  return [...grouped.values()];
}

function splitList(value) {
  return clean(value).split(/[;\n]/).map(clean).filter(Boolean);
}

function appointmentTimeParts(value) {
  const range = clean(value).split(/\s+-\s+/);
  return { start: range[0] || "", end: range[1] || "" };
}

function timeMinutes(value) {
  const match = clean(value).match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]m)?$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const meridiem = (match[3] || "").toLowerCase();
  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 ? hour * 60 + minute : null;
}

function mapAppointmentRow(row, index) {
  const service = csvValue(row, ["Service/class/event", "Service", "Appointment Type", "Type"]);
  const timeRange = appointmentTimeParts(csvValue(row, ["Appointment time", "Appointment Time", "Time", "Scheduled Time"]));
  const startMinutes = timeMinutes(timeRange.start);
  const endMinutes = timeMinutes(timeRange.end);
  const normalizedService = service.toLowerCase();
  const setmore = Boolean(csvValue(row, ["Booking ID", "Booked via", "Customer name", "Meeting Type"]));
  const skipReason = setmore && (
    normalizedService.includes("wellness day")
      ? "Wellness Day rows are not Clinic appointments."
      : normalizedService.includes("cooking class") || csvValue(row, ["Meeting Type"]).toLowerCase() === "class"
        ? "Class rows belong in Kitchen or School scheduling."
        : normalizedService.includes("hold for reschedule")
          ? "Calendar hold rows are not appointments."
          : !setmoreServices.has(normalizedService)
            ? "Setmore service is not mapped to a Clinic appointment."
            : ""
  );
  const clientNames = splitList(csvValue(row, ["Customer name", "Customer Name", "Client Names", "Client Name", "Child Name", "Name"]));
  const clientIds = splitList(csvValue(row, ["Client IDs", "Client ID", "ClientId"]));
  return {
    rowNumber: index + 2,
    clientIds,
    clientId: clientIds[0] || "",
    clientNames,
    clientName: clientNames[0] || "",
    appointmentDate: normalizedDate(csvValue(row, ["Appointment date", "Appointment Date", "Date", "Scheduled Date"])),
    appointmentTime: timeRange.start,
    appointmentType: setmoreServices.get(normalizedService) || service || "Enrollment",
    durationMinutes: startMinutes !== null && endMinutes !== null && endMinutes > startMinutes
      ? endMinutes - startMinutes
      : Number(csvValue(row, ["Duration", "Duration Minutes", "Minutes"])) || undefined,
    status: csvValue(row, ["Status"]) || "Scheduled",
    lesson: csvValue(row, ["Lesson", "Lesson Number"]),
    goal: csvValue(row, ["Goal", "Goals"]),
    staffMember: csvValue(row, ["Team member", "Team Member", "Staff", "Staff Member", "Provider"]),
    notes: csvValue(row, ["Comments", "Notes", "Note"]),
    importSource: setmore ? "Setmore appointment export" : "Appointments CSV",
    skipReason
  };
}

function recordLabel(record, collectionKey) {
  if (collectionKey === "referral-network") return record.name || "Unnamed organization";
  if (collectionKey === "appointments") {
    return `${record.clientNames?.join(", ") || "Unnamed client"} · ${record.appointmentDate || "No date"}`;
  }
  return [record.firstName, record.lastName].filter(Boolean).join(" ") || "Unnamed child";
}

function prepareAdminCsvImport(collectionKey, text, fileName = "") {
  const definition = importDefinitions[collectionKey];
  if (!definition) throw new Error("Choose a supported import type.");
  const parsed = parseAdminCsv(text);
  if (!parsed.columns.length) throw new Error("The CSV does not contain a header row.");

  let mapped = [];
  if (collectionKey === "clients") mapped = parsed.rows.map(mapClientRow);
  if (collectionKey === "referrals") mapped = parsed.rows.map((row, index) => mapReferralRow(row, index, parsed.columns));
  if (collectionKey === "referral-network") mapped = mapNetworkRows(parsed.rows);
  if (collectionKey === "appointments") mapped = parsed.rows.map(mapAppointmentRow);

  const invalidRows = [];
  const warnings = [];
  const records = mapped.filter((record) => {
    const missing = collectionKey === "clients" || collectionKey === "referrals"
      ? missingPersonFields(record)
      : collectionKey === "referral-network"
        ? record.name ? [] : ["organization name"]
        : (!record.clientIds?.length && !record.clientNames?.length ? ["client"] : [])
          .concat(record.appointmentDate ? [] : ["appointment date"])
          .concat(record.appointmentTime ? [] : ["appointment time"]);
    if (collectionKey === "clients" && !record.status) missing.push("valid client status");
    if (collectionKey === "referrals" && !record.status) missing.push("valid referral status");
    if (record.skipReason) {
      warnings.push({ rowNumber: record.rowNumber, label: recordLabel(record, collectionKey), reason: record.skipReason });
      return false;
    }
    if (missing.length) {
      invalidRows.push({ rowNumber: record.rowNumber, label: recordLabel(record, collectionKey), reason: `Missing ${missing.join(", ")}.` });
      return false;
    }
    return true;
  });

  if (collectionKey === "appointments" && records.some((record) => Number(record.durationMinutes) <= 15)) {
    warnings.push({
      rowNumber: 0,
      label: "Sibling visit review",
      reason: "Review adjacent 15-minute Setmore rows before importing; this guarded importer keeps each row separate."
    });
  }

  return {
    collectionKey,
    definition,
    fileName,
    columns: parsed.columns,
    sourceRowCount: parsed.rows.length,
    records,
    invalidRows,
    warnings,
    sample: records.slice(0, 5).map((record) => ({
      rowNumber: record.rowNumber,
      label: recordLabel(record, collectionKey)
    }))
  };
}

export {
  importDefinitions,
  parseAdminCsv,
  prepareAdminCsvImport,
  setAdminClientStatuses
};
