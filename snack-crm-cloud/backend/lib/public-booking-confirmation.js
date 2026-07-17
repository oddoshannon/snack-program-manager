const confirmationModes = new Set(["disabled", "preview"]);
const defaultBookingPageUrl = "https://snack-crm.web.app/book.html";
const snackPhone = "(971) 202-0232";
const snackAddress = "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128";

function cleanConfirmationValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function publicBookingConfirmationMode(value = process.env.PUBLIC_BOOKING_CONFIRMATION_MODE) {
  const normalized = cleanConfirmationValue(value).toLowerCase();
  return confirmationModes.has(normalized) ? normalized : "disabled";
}

function publicBookingManageUrl({
  appointmentId,
  manageToken,
  bookingPageUrl = process.env.PUBLIC_BOOKING_PAGE_URL || defaultBookingPageUrl
}) {
  if (!cleanConfirmationValue(appointmentId) || !cleanConfirmationValue(manageToken)) {
    return "";
  }

  const url = new URL(bookingPageUrl);
  url.search = "";
  url.hash = "";
  url.searchParams.set("appointmentId", appointmentId);
  url.searchParams.set("token", manageToken);
  return url.toString();
}

function formatConfirmationDate(dateString, language = "English") {
  const [year, month, day] = cleanConfirmationValue(dateString).split("-").map(Number);

  if (!year || !month || !day) {
    return dateString;
  }

  return new Intl.DateTimeFormat(language.toLowerCase().startsWith("span") ? "es-US" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles"
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function formatNameList(names, language = "English") {
  const visibleNames = Array.isArray(names)
    ? names.map(cleanConfirmationValue).filter(Boolean)
    : [];

  if (visibleNames.length <= 1) {
    return visibleNames[0] || (language.toLowerCase().startsWith("span") ? "su hijo(a)" : "your child");
  }

  const conjunction = language.toLowerCase().startsWith("span") ? "y" : "and";
  return `${visibleNames.slice(0, -1).join(", ")} ${conjunction} ${visibleNames.at(-1)}`;
}

function escapeConfirmationHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function confirmationHtmlFromText(text) {
  return text
    .split("\n")
    .map((line) => line ? `<p>${escapeConfirmationHtml(line)}</p>` : "<br>")
    .join("");
}

function buildPublicBookingConfirmation({
  appointmentId,
  manageToken,
  bookingPageUrl,
  caregiverName,
  clientNames,
  serviceLabel,
  appointmentDate,
  appointmentTimeLabel,
  preferredLanguage = "English",
  email,
  phone
}) {
  const isSpanish = preferredLanguage.toLowerCase().startsWith("span");
  const manageUrl = publicBookingManageUrl({ appointmentId, manageToken, bookingPageUrl });
  const children = formatNameList(clientNames, preferredLanguage);
  const dateLabel = formatConfirmationDate(appointmentDate, preferredLanguage);
  const greetingName = cleanConfirmationValue(caregiverName);
  const greeting = isSpanish
    ? `Hola${greetingName ? ` ${greetingName}` : ""},`
    : `Hi${greetingName ? ` ${greetingName}` : ""},`;

  const subject = isSpanish
    ? "Su cita con el Programa SNACK está confirmada"
    : "Your SNACK Program appointment is confirmed";
  const emailText = isSpanish
    ? [
        greeting,
        "",
        "Su cita con el Programa SNACK está confirmada.",
        `Cita: ${serviceLabel}`,
        `Niños: ${children}`,
        `Fecha: ${dateLabel}`,
        `Hora: ${appointmentTimeLabel}`,
        `Lugar: ${snackAddress}`,
        "",
        "Use este enlace privado para cancelar o elegir una nueva hora:",
        manageUrl,
        "",
        `Si necesita ayuda o hará un cambio dentro de las 24 horas de la cita, llame o envíe un mensaje de texto al ${snackPhone}.`
      ].join("\n")
    : [
        greeting,
        "",
        "Your SNACK Program appointment is confirmed.",
        `Appointment: ${serviceLabel}`,
        `Children: ${children}`,
        `Date: ${dateLabel}`,
        `Time: ${appointmentTimeLabel}`,
        `Location: ${snackAddress}`,
        "",
        "Use this private link to cancel or choose a new time:",
        manageUrl,
        "",
        `If you need help or are making a change within 24 hours of the appointment, call or text ${snackPhone}.`
      ].join("\n");
  const textMessage = isSpanish
    ? `SNACK: Cita confirmada para ${children} el ${dateLabel} a las ${appointmentTimeLabel}. Administrar cita: ${manageUrl} Ayuda: ${snackPhone}`
    : `SNACK: Appointment confirmed for ${children} on ${dateLabel} at ${appointmentTimeLabel}. Manage appointment: ${manageUrl} Help: ${snackPhone}`;

  return {
    email: {
      to: cleanConfirmationValue(email),
      subject,
      text: emailText,
      html: confirmationHtmlFromText(emailText)
    },
    text: {
      to: cleanConfirmationValue(phone),
      body: textMessage
    },
    manageUrl
  };
}

function previewPublicBookingConfirmationDelivery(details, mode = publicBookingConfirmationMode()) {
  const normalizedMode = publicBookingConfirmationMode(mode);

  if (normalizedMode === "disabled") {
    return {
      status: "disabled",
      channels: []
    };
  }

  const messages = buildPublicBookingConfirmation(details);
  const channels = [
    messages.email.to ? "email" : "",
    messages.text.to ? "text" : ""
  ].filter(Boolean);

  return {
    status: "preview",
    channels,
    messages
  };
}

function publicBookingConfirmationDeliverySummary(delivery) {
  return {
    status: delivery?.status || "disabled",
    channels: Array.isArray(delivery?.channels) ? delivery.channels : []
  };
}

export {
  buildPublicBookingConfirmation,
  previewPublicBookingConfirmationDelivery,
  publicBookingConfirmationDeliverySummary,
  publicBookingConfirmationMode,
  publicBookingManageUrl
};
