import { normalizeMailingAddress } from "./modules/public-booking.js";

const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
const timeScreen = document.querySelector("#time-screen");
const detailsScreen = document.querySelector("#details-screen");
const reviewScreen = document.querySelector("#review-screen");
const confirmationScreen = document.querySelector("#confirmation-screen");
const managementScreen = document.querySelector("#management-screen");
const bookingTitle = document.querySelector("#booking-step-title");
const bookingBack = document.querySelector("#booking-back");
const selectedServiceTitle = document.querySelector("#selected-service-title");
const selectedServiceDuration = document.querySelector("#selected-service-duration");
const summaryService = document.querySelector("#summary-service");
const summaryDuration = document.querySelector("#summary-duration");
const summaryDateRow = document.querySelector("#summary-date-row");
const summaryTimeRow = document.querySelector("#summary-time-row");
const summaryDate = document.querySelector("#summary-date");
const summaryTime = document.querySelector("#summary-time");
const summaryLocationRow = document.querySelector("#summary-location-row");
const summaryLocation = document.querySelector("#summary-location");
const summaryKindLabel = document.querySelector("#summary-kind-label");
const summaryAvailabilityRow = document.querySelector("#summary-availability-row");
const summaryAvailability = document.querySelector("#summary-availability");
const bookingHelp = document.querySelector("#booking-help");
const calendarTitle = document.querySelector("#calendar-title");
const calendarDays = document.querySelector("#calendar-days");
const previousMonthButton = document.querySelector("#previous-month");
const nextMonthButton = document.querySelector("#next-month");
const timesTitle = document.querySelector("#times-title");
const timeOptions = document.querySelector("#time-options");
const timeStatus = document.querySelector("#time-status");
const continueButton = document.querySelector("#continue-to-details");
const bookingForm = document.querySelector("#public-booking-form");
const addressInput = bookingForm.elements.address;
const childrenEl = document.querySelector("#public-children");
const addChildButton = document.querySelector("#public-add-child");
const preferredLanguageSelect = document.querySelector("#public-preferred-language");
const yccoMemberSelect = document.querySelector("#public-ycco-member");
const yccoIdInput = document.querySelector("#public-ycco-id");
const foodRestrictionsField = document.querySelector("#food-restrictions-field");
const familyInformationCopy = document.querySelector("#family-information-copy");
const returnToTime = document.querySelector("#return-to-time");
const returnToDetails = document.querySelector("#return-to-details");
const reviewAppointmentButton = document.querySelector("#review-appointment");
const reviewTitle = document.querySelector("#review-title");
const reviewCopy = document.querySelector("#review-copy");
const reviewDetails = document.querySelector("#review-details");
const bookingStatus = document.querySelector("#booking-status");
const submitButton = document.querySelector("#public-booking-submit");
const confirmationDetails = document.querySelector("#confirmation-details");
const confirmationTitle = document.querySelector("#confirmation-title");
const confirmationHelp = document.querySelector("#confirmation-help");
const manageAppointmentLink = document.querySelector("#manage-appointment-link");
const managementSummary = document.querySelector("#management-summary");
const managementStatus = document.querySelector("#management-status");
const startRescheduleButton = document.querySelector("#start-reschedule");
const cancelAppointmentButton = document.querySelector("#cancel-appointment");

const screens = [timeScreen, detailsScreen, reviewScreen, confirmationScreen, managementScreen];
const serviceAliases = {
  nutrition: "nutrition-education",
  "enrollment-es": "spanish-enrollment",
  "nutrition-es": "spanish-nutrition-education"
};

let bookingServices = [];
let bookingScheduling = {};
let activeService = null;
let activeClassSession = null;
let availabilityDates = [];
let selectedDate = "";
let selectedSlot = null;
let calendarMonth = new Date();
let publicChildCount = 0;
let managedBooking = null;
let isRescheduling = false;

function todayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromString(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

function dateStringFromParts(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDateLabel(value, includeYear = false) {
  const date = dateFromString(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {})
  }).format(date);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function monthKeyFromDate(date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function currentRequestedServiceId() {
  const requested = new URLSearchParams(window.location.search).get("service") || "enrollment";
  return serviceAliases[requested] || requested;
}

function currentRequestedClassId() {
  return new URLSearchParams(window.location.search).get("class")?.trim() || "";
}

function isClassRegistrationMode() {
  return Boolean(activeClassSession);
}

function managementAppointmentId() {
  return new URLSearchParams(window.location.search).get("appointmentId")?.trim() || "";
}

function managementToken() {
  const appointmentId = managementAppointmentId();
  const storageKey = `snack-booking-token:${appointmentId}`;
  const query = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const suppliedToken = fragment.get("token")?.trim() || query.get("token")?.trim() || "";
  if (suppliedToken) {
    sessionStorage.setItem(storageKey, suppliedToken);
    query.delete("token");
    const cleanUrl = `${window.location.pathname}${query.size ? `?${query}` : ""}`;
    history.replaceState({}, "", cleanUrl);
  }
  return suppliedToken || sessionStorage.getItem(storageKey) || "";
}

function hasManagementParams() {
  return Boolean(managementAppointmentId() && managementToken());
}

async function publicFetch(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with ${response.status}`);
  }

  return response.json();
}

function showScreen(screen, title) {
  screens.forEach((candidate) => {
    candidate.hidden = candidate !== screen;
  });
  bookingTitle.textContent = title;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setBookingStatus(message, isError = false) {
  bookingStatus.textContent = message;
  bookingStatus.classList.toggle("error", isError);
}

function setManagementStatus(message, isError = false) {
  managementStatus.textContent = message;
  managementStatus.classList.toggle("error", isError);
}

function setTimeStatus(message, isError = false) {
  timeStatus.textContent = message;
  timeStatus.classList.toggle("error", isError);
}

function formatPublicNameList(names) {
  const visibleNames = names.map((name) => String(name || "").trim()).filter(Boolean);

  if (visibleNames.length <= 1) {
    return visibleNames[0] || "your child";
  }

  if (visibleNames.length === 2) {
    return `${visibleNames[0]} and ${visibleNames[1]}`;
  }

  return `${visibleNames.slice(0, -1).join(", ")}, and ${visibleNames.at(-1)}`;
}

function setBookingLocation(value) {
  const location = String(value || "").trim();
  summaryLocationRow.hidden = !location;
  summaryLocation.textContent = location;
}

function bookingManageUrl(booking) {
  const appointmentId = booking.appointmentId || booking.id;
  const token = booking.manageToken;

  if (!appointmentId || !token) {
    return "";
  }

  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("appointmentId", appointmentId);
  url.searchParams.set("token", token);
  return url.toString();
}

function selectService(serviceId) {
  activeService = bookingServices.find((service) => service.id === serviceId) || bookingServices[0] || null;

  if (!activeService) {
    return;
  }

  selectedServiceTitle.textContent = activeService.label;
  selectedServiceDuration.textContent = `${activeService.durationMinutes} min`;
  summaryService.textContent = activeService.label;
  summaryDuration.textContent = `${activeService.durationMinutes} minutes`;
  setBookingLocation(bookingScheduling.clinicLocation);
  bookingHelp.textContent = bookingScheduling.clinicLocation
    ? `Appointments are free and held at ${bookingScheduling.clinicLocation}.`
    : "Appointments are free and held at the SNACK Program office.";

  if (activeService.defaultLanguage) {
    preferredLanguageSelect.value = activeService.defaultLanguage;
  }
}

function configureClassRegistration(session) {
  activeClassSession = session;
  activeService = {
    id: `class:${session.id}`,
    label: session.title,
    durationMinutes: session.durationMinutes
  };
  selectedDate = session.sessionDate;
  selectedSlot = {
    appointmentDate: session.sessionDate,
    appointmentTime: session.startTime,
    timeLabel: session.startTimeLabel
  };

  document.title = "Register for a Cooking Class | The SNACK Program";
  summaryKindLabel.textContent = "Class";
  summaryService.textContent = session.title;
  summaryDuration.textContent = `${session.durationMinutes} minutes`;
  summaryDate.textContent = formatDateLabel(session.sessionDate, true);
  summaryTime.textContent = session.startTimeLabel;
  setBookingLocation(session.location);
  summaryDateRow.hidden = false;
  summaryTimeRow.hidden = false;
  summaryAvailabilityRow.hidden = false;
  summaryAvailability.textContent = session.isFull
    ? (session.waitlistEnabled ? "Waitlist available" : "Class full")
    : `${session.spacesRemaining} of ${session.capacity} spots available`;
  bookingHelp.textContent = session.location && session.location !== "Location to be confirmed"
    ? `Cooking classes are free and held at ${session.location}.`
    : "Cooking classes are free. The location will be confirmed before class.";
  familyInformationCopy.textContent = "Add each child who will attend this class.";
  foodRestrictionsField.hidden = false;
  reviewAppointmentButton.textContent = "Review Registration";
  reviewAppointmentButton.disabled = !session.canRegister;
  reviewTitle.textContent = "Confirm Your Registration";
  reviewCopy.textContent = "Check the details below before registering.";
  submitButton.textContent = session.nextStatus === "Waitlisted" ? "Join Waitlist" : "Register Family";
  submitButton.disabled = !session.canRegister;
  returnToTime.textContent = "Back";
}

function openDates() {
  return availabilityDates.filter((date) => Array.isArray(date.slots) && date.slots.length);
}

function slotsForDate(dateString) {
  return availabilityDates.find((date) => date.date === dateString)?.slots || [];
}

function monthHasOpenDates(monthDate) {
  const targetKey = monthKeyFromDate(monthDate);
  return openDates().some((date) => monthKeyFromDate(dateFromString(date.date)) === targetKey);
}

function renderCalendar() {
  calendarDays.replaceChildren();
  calendarTitle.textContent = formatMonthLabel(calendarMonth);

  const year = calendarMonth.getFullYear();
  const monthIndex = calendarMonth.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let index = 0; index < firstWeekday; index += 1) {
    calendarDays.append(document.createElement("span"));
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateString = dateStringFromParts(year, monthIndex, day);
    const button = document.createElement("button");
    const hasSlots = slotsForDate(dateString).length > 0;
    button.type = "button";
    button.textContent = String(day);
    button.disabled = !hasSlots;
    button.classList.toggle("is-selected", dateString === selectedDate);
    button.setAttribute("aria-label", formatDateLabel(dateString, true));
    button.setAttribute("aria-pressed", String(dateString === selectedDate));
    button.addEventListener("click", () => {
      selectedDate = dateString;
      selectedSlot = null;
      continueButton.disabled = true;
      summaryDateRow.hidden = true;
      summaryTimeRow.hidden = true;
      renderCalendar();
      renderTimes();
    });
    calendarDays.append(button);
  }

  const previousMonth = new Date(year, monthIndex - 1, 1);
  const nextMonth = new Date(year, monthIndex + 1, 1);
  previousMonthButton.disabled = !monthHasOpenDates(previousMonth);
  nextMonthButton.disabled = !monthHasOpenDates(nextMonth);
}

function renderTimes() {
  timeOptions.replaceChildren();
  timesTitle.textContent = selectedDate ? formatDateLabel(selectedDate) : "Choose a Date";
  const slots = slotsForDate(selectedDate).filter((slot) => !(
    isRescheduling
    && selectedDate === managedBooking?.appointmentDate
    && (slot.value === managedBooking.appointmentTime || slot.label === managedBooking.appointmentTimeLabel)
  ));

  if (!slots.length) {
    const empty = document.createElement("p");
    empty.className = "booking-empty";
    empty.textContent = selectedDate
      ? "No open times remain on this date."
      : "Choose an available date from the calendar.";
    timeOptions.append(empty);
    return;
  }

  slots.forEach((slot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "time-option";
    button.textContent = slot.label;
    button.classList.toggle("is-selected", selectedSlot?.appointmentTime === slot.value);
    button.setAttribute("aria-pressed", String(selectedSlot?.appointmentTime === slot.value));
    button.addEventListener("click", () => {
      selectedSlot = {
        appointmentDate: selectedDate,
        appointmentTime: slot.value,
        timeLabel: slot.label
      };
      continueButton.disabled = false;
      summaryDate.textContent = formatDateLabel(selectedDate, true);
      summaryTime.textContent = slot.label;
      summaryDateRow.hidden = false;
      summaryTimeRow.hidden = false;
      setTimeStatus("");
      renderTimes();
    });
    timeOptions.append(button);
  });
}

async function loadAvailability() {
  if (!activeService) {
    return;
  }

  calendarTitle.textContent = "Loading Dates...";
  timeOptions.innerHTML = '<p class="booking-empty">Loading available times...</p>';
  setTimeStatus("");

  try {
    const data = await publicFetch(
      `/api/public/availability?serviceId=${encodeURIComponent(activeService.id)}&startDate=${todayDateString()}&days=93`
    );
    availabilityDates = Array.isArray(data.dates) ? data.dates : [];
    const datesWithSlots = openDates();

    if (!datesWithSlots.length) {
      selectedDate = "";
      selectedSlot = null;
      calendarMonth = new Date();
      renderCalendar();
      renderTimes();
      setTimeStatus("No open appointment times are available right now. Please call or text (971) 202-0232.", true);
      return;
    }

    selectedDate = datesWithSlots[0].date;
    selectedSlot = null;
    calendarMonth = dateFromString(selectedDate);
    continueButton.disabled = true;
    summaryDateRow.hidden = true;
    summaryTimeRow.hidden = true;
    renderCalendar();
    renderTimes();
  } catch (error) {
    availabilityDates = [];
    timeOptions.innerHTML = '<p class="booking-empty">Available times could not be loaded.</p>';
    setTimeStatus(error.message || "Available times could not be loaded.", true);
  }
}

function renderPublicChild(index) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "child-fields";
  fieldset.dataset.publicChild = String(index);
  fieldset.innerHTML = `
    <legend>Child ${index + 1}</legend>
    <button class="remove-child-button" type="button">Remove</button>
    <label class="wide-field">
      <span>Child Name</span>
      <input name="childName" type="text" autocomplete="name" placeholder="First and Last Name" required>
    </label>
    <label>
      <span>Date of Birth</span>
      <input name="childDob" type="date" required>
    </label>
    <label>
      <span>Gender</span>
      <select name="childGender" required>
        <option value="">Choose</option>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Nonbinary">Nonbinary</option>
        <option value="Prefer not to say">Prefer Not to Say</option>
      </select>
    </label>
  `;
  fieldset.querySelector(".remove-child-button").addEventListener("click", () => {
    fieldset.remove();
    updatePublicChildControls();
  });
  return fieldset;
}

function updatePublicChildControls() {
  const childCards = [...childrenEl.querySelectorAll("[data-public-child]")];
  childCards.forEach((card, index) => {
    card.dataset.publicChild = String(index);
    card.querySelector("legend").textContent = `Child ${index + 1}`;
    card.querySelector(".remove-child-button").hidden = childCards.length === 1;
  });
}

function addPublicChild() {
  childrenEl.append(renderPublicChild(publicChildCount));
  publicChildCount += 1;
  updatePublicChildControls();
}

function publicBookingChildrenFromForm() {
  return [...childrenEl.querySelectorAll("[data-public-child]")].map((card) => ({
    childName: card.querySelector('[name="childName"]')?.value || "",
    dateOfBirth: card.querySelector('[name="childDob"]')?.value || "",
    gender: card.querySelector('[name="childGender"]')?.value || ""
  }));
}

function updateYccoIdState() {
  const enabled = yccoMemberSelect.value === "Yes";
  yccoIdInput.disabled = !enabled;
  if (!enabled) {
    yccoIdInput.value = "";
  }
}

function showTimeScreen() {
  continueButton.textContent = isRescheduling ? "Reschedule Appointment" : "Continue";
  showScreen(timeScreen, isRescheduling ? "Choose a New Time" : "Select a Time");
}

function showDetailsScreen() {
  if (!selectedSlot) {
    setTimeStatus("Choose an appointment time.", true);
    return;
  }
  showScreen(detailsScreen, "Your Details");
}

function appendReviewRow(list, label, value) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const detail = document.createElement("dd");
  term.textContent = label;
  detail.textContent = value;
  row.append(term, detail);
  list.append(row);
}

function showReviewScreen() {
  const formData = new FormData(bookingForm);
  const children = publicBookingChildrenFromForm();
  const list = document.createElement("dl");
  appendReviewRow(list, isClassRegistrationMode() ? "Class" : "Appointment", activeService?.label || "Appointment");
  appendReviewRow(list, "Date", formatDateLabel(selectedSlot.appointmentDate, true));
  appendReviewRow(list, "Time", `${selectedSlot.timeLabel} · ${activeService?.durationMinutes || 30} minutes`);
  appendReviewRow(list, "Children", formatPublicNameList(children.map((child) => child.childName)));
  appendReviewRow(list, "Caregiver", formData.get("caregiverName"));
  appendReviewRow(list, "Contact", `${formData.get("mobilePhone")} · ${formData.get("email")}`);
  if (isClassRegistrationMode()) {
    appendReviewRow(list, "Food Restrictions", formData.get("foodRestrictions") || "None shared");
  }
  reviewDetails.replaceChildren(list);
  setBookingStatus("");
  showScreen(reviewScreen, isClassRegistrationMode() ? "Review Registration" : "Review Appointment");
}

function bookingPayload() {
  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());
  if (isClassRegistrationMode()) {
    payload.sessionId = activeClassSession.id;
  } else {
    payload.serviceId = activeService.id;
    payload.appointmentDate = selectedSlot.appointmentDate;
    payload.appointmentTime = selectedSlot.appointmentTime;
  }
  payload.children = publicBookingChildrenFromForm();
  payload.phone = payload.mobilePhone;
  payload.parentName = payload.caregiverName;
  payload.address = normalizeMailingAddress(payload.address);
  payload.serviceEmailConsent = Boolean(formData.get("serviceEmailConsent"));
  payload.serviceTextConsent = Boolean(formData.get("serviceTextConsent"));
  payload.marketingConsent = Boolean(formData.get("marketingConsent"));
  payload.consentReminders = payload.serviceEmailConsent || payload.serviceTextConsent;
  return payload;
}

async function submitBooking() {
  if (!selectedSlot || !activeService) {
    setBookingStatus("Choose an appointment time.", true);
    return;
  }

  setBookingStatus(isClassRegistrationMode() ? "Saving registration..." : "Booking appointment...");
  submitButton.disabled = true;

  try {
    const payload = bookingPayload();
    const data = await publicFetch(isClassRegistrationMode() ? "/api/public/class-registrations" : "/api/public/bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (isClassRegistrationMode()) {
      const registration = data.registration || {};
      const childNames = Array.isArray(registration.clientNames) && registration.clientNames.length
        ? registration.clientNames
        : payload.children.map((child) => child.childName);
      const waitlisted = registration.status === "Waitlisted";
      const familyVerb = childNames.length === 1 ? "is" : "are";
      confirmationTitle.textContent = waitlisted ? "Added to the Waitlist" : "Registration Confirmed";
      confirmationDetails.textContent = `${formatPublicNameList(childNames)} ${waitlisted ? `${familyVerb} on the waitlist for` : `${familyVerb} registered for`} ${activeClassSession.title} on ${formatDateLabel(activeClassSession.sessionDate, true)} at ${activeClassSession.startTimeLabel}${activeClassSession.location && activeClassSession.location !== "Location to be confirmed" ? ` at ${activeClassSession.location}` : ""}.`;
      confirmationHelp.textContent = waitlisted
        ? "The SNACK Program will contact you if space becomes available."
        : "The SNACK Program will contact you if any class details change.";
      manageAppointmentLink.hidden = true;
      showScreen(confirmationScreen, waitlisted ? "Waitlist Confirmed" : "Registration Confirmed");
      return;
    }

    const booking = data.booking || {};
    const childNames = Array.isArray(booking.clientNames) && booking.clientNames.length
      ? booking.clientNames
      : payload.children.map((child) => child.childName);
    confirmationDetails.textContent = `${booking.serviceLabel || activeService.label} for ${formatPublicNameList(childNames)} on ${formatDateLabel(booking.appointmentDate, true)} at ${booking.appointmentTimeLabel || selectedSlot.timeLabel}${booking.location ? ` at ${booking.location}` : ""}.`;
    const manageUrl = bookingManageUrl(booking);
    manageAppointmentLink.hidden = !manageUrl;
    if (manageUrl) {
      manageAppointmentLink.href = manageUrl;
    }
    confirmationTitle.textContent = "Appointment Booked";
    confirmationHelp.textContent = "Save the private link below if you need to cancel or choose a new time.";
    showScreen(confirmationScreen, "Appointment Confirmed");
  } catch (error) {
    setBookingStatus(error.message || (isClassRegistrationMode()
      ? "Could not save the registration yet."
      : "Could not book the appointment yet."), true);
    if (!isClassRegistrationMode()) {
      await loadAvailability();
    }
  } finally {
    submitButton.disabled = false;
  }
}

function renderManagementSummary() {
  const names = managedBooking?.clientNames || [managedBooking?.clientName];
  managementSummary.textContent = managedBooking
    ? `${managedBooking.serviceLabel} for ${formatPublicNameList(names)} on ${formatDateLabel(managedBooking.appointmentDate, true)} at ${managedBooking.appointmentTimeLabel || managedBooking.appointmentTime}${managedBooking.location ? ` at ${managedBooking.location}` : ""}.`
    : "We could not load this appointment.";
  cancelAppointmentButton.disabled = !managedBooking?.canCancel;
  startRescheduleButton.disabled = !managedBooking?.canReschedule;
}

async function loadManagedBooking() {
  showScreen(managementScreen, "Manage Appointment");
  setManagementStatus("Loading appointment...");

  try {
    const data = await publicFetch(
      `/api/public/bookings/${encodeURIComponent(managementAppointmentId())}?token=${encodeURIComponent(managementToken())}`
    );
    managedBooking = data.booking || null;
    selectService(managedBooking?.serviceId);
    renderManagementSummary();
    setManagementStatus(managedBooking?.status === "Scheduled" ? "" : `This appointment is ${String(managedBooking?.status || "unavailable").toLowerCase()}.`);
  } catch (error) {
    managedBooking = null;
    renderManagementSummary();
    setManagementStatus(error.message || "We could not load that appointment.", true);
  }
}

async function startReschedule() {
  if (!managedBooking?.canReschedule) {
    return;
  }
  isRescheduling = true;
  selectService(managedBooking.serviceId);
  await loadAvailability();
  showTimeScreen();
}

async function rescheduleManagedBooking() {
  if (!managedBooking?.id || !selectedSlot) {
    setTimeStatus("Choose a new appointment time.", true);
    return;
  }

  continueButton.disabled = true;
  setTimeStatus("Rescheduling appointment...");

  try {
    const data = await publicFetch(`/api/public/bookings/${encodeURIComponent(managedBooking.id)}/reschedule`, {
      method: "POST",
      body: JSON.stringify({
        token: managementToken(),
        appointmentDate: selectedSlot.appointmentDate,
        appointmentTime: selectedSlot.appointmentTime
      })
    });
    managedBooking = data.booking || managedBooking;
    isRescheduling = false;
    renderManagementSummary();
    setManagementStatus(`Appointment rescheduled to ${formatDateLabel(managedBooking.appointmentDate, true)} at ${managedBooking.appointmentTimeLabel}.`);
    showScreen(managementScreen, "Manage Appointment");
  } catch (error) {
    setTimeStatus(error.message || "Could not reschedule the appointment yet.", true);
    continueButton.disabled = false;
    await loadAvailability();
  }
}

async function cancelManagedBooking() {
  if (!managedBooking?.id || !window.confirm("Cancel this appointment?")) {
    return;
  }

  cancelAppointmentButton.disabled = true;
  startRescheduleButton.disabled = true;
  setManagementStatus("Canceling appointment...");

  try {
    const data = await publicFetch(`/api/public/bookings/${encodeURIComponent(managedBooking.id)}/cancel`, {
      method: "POST",
      body: JSON.stringify({ token: managementToken() })
    });
    managedBooking = data.booking || { ...managedBooking, status: "Canceled", canCancel: false, canReschedule: false };
    renderManagementSummary();
    setManagementStatus("Appointment canceled.");
  } catch (error) {
    renderManagementSummary();
    setManagementStatus(error.message || "Could not cancel the appointment yet.", true);
  }
}

async function initialize() {
  addPublicChild();
  updateYccoIdState();

  const classSessionId = currentRequestedClassId();
  if (classSessionId && !hasManagementParams()) {
    try {
      const data = await publicFetch(`/api/public/classes/${encodeURIComponent(classSessionId)}`);
      configureClassRegistration(data.class);
      showDetailsScreen();
    } catch (error) {
      selectedServiceTitle.textContent = "Cooking Class";
      selectedServiceDuration.textContent = "";
      setTimeStatus(error.message || "That cooking class could not be loaded.", true);
      showScreen(timeScreen, "Class Registration");
    }
    return;
  }

  try {
    const data = await publicFetch("/api/public/booking-options");
    bookingServices = Array.isArray(data.services) ? data.services : [];
    bookingScheduling = data.scheduling || {};
  } catch (error) {
    setTimeStatus(error.message || "Booking options could not be loaded.", true);
    return;
  }

  if (hasManagementParams()) {
    await loadManagedBooking();
    return;
  }

  selectService(currentRequestedServiceId());
  await loadAvailability();
}

previousMonthButton.addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
  renderCalendar();
});
nextMonthButton.addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  renderCalendar();
});
continueButton.addEventListener("click", () => {
  if (isRescheduling) {
    rescheduleManagedBooking();
  } else {
    showDetailsScreen();
  }
});
returnToTime.addEventListener("click", () => {
  if (isClassRegistrationMode()) {
    window.location.href = "./booking.html#classes";
  } else {
    showTimeScreen();
  }
});
returnToDetails.addEventListener("click", () => showScreen(detailsScreen, "Your Details"));
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const serviceEmailConsent = bookingForm.elements.serviceEmailConsent;
  const serviceTextConsent = bookingForm.elements.serviceTextConsent;
  const hasServiceConsent = serviceEmailConsent.checked || serviceTextConsent.checked;
  serviceEmailConsent.setCustomValidity(hasServiceConsent ? "" : "Choose email reminders, text reminders, or both.");
  if (bookingForm.reportValidity()) {
    showReviewScreen();
  }
});
[bookingForm.elements.serviceEmailConsent, bookingForm.elements.serviceTextConsent].forEach((input) => {
  input.addEventListener("change", () => {
    bookingForm.elements.serviceEmailConsent.setCustomValidity("");
  });
});
submitButton.addEventListener("click", submitBooking);
addChildButton.addEventListener("click", addPublicChild);
addressInput.addEventListener("blur", () => {
  addressInput.value = normalizeMailingAddress(addressInput.value);
});
yccoMemberSelect.addEventListener("change", updateYccoIdState);
startRescheduleButton.addEventListener("click", startReschedule);
cancelAppointmentButton.addEventListener("click", cancelManagedBooking);
bookingBack.addEventListener("click", () => {
  if (!reviewScreen.hidden) {
    showScreen(detailsScreen, "Your Details");
  } else if (!detailsScreen.hidden) {
    if (isClassRegistrationMode()) {
      window.location.href = "./booking.html#classes";
    } else {
      showTimeScreen();
    }
  } else if (!timeScreen.hidden && isRescheduling) {
    isRescheduling = false;
    renderManagementSummary();
    showScreen(managementScreen, "Manage Appointment");
  } else {
    window.location.href = "./booking.html";
  }
});

initialize();
