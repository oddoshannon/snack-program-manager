const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
const bookingForm = document.querySelector("#public-booking-form");
const serviceSelect = document.querySelector("#public-service-id");
const languageSelect = document.querySelector("#public-preferred-language");
const availabilityEl = document.querySelector("#public-availability");
const statusEl = document.querySelector("#public-booking-status");
const submitButton = document.querySelector("#public-booking-submit");
const confirmationEl = document.querySelector("#booking-confirmation");
const bookingManagementEl = document.querySelector("#booking-management");
const managementSummaryEl = document.querySelector("#booking-management-summary");
const managementAvailabilityEl = document.querySelector("#public-management-availability");
const managementStatusEl = document.querySelector("#public-management-status");
const cancelBookingButton = document.querySelector("#public-cancel-booking");
const rescheduleBookingButton = document.querySelector("#public-reschedule-booking");
const childrenEl = document.querySelector("#public-children");
const addChildButton = document.querySelector("#public-add-child");
const yccoMemberSelect = document.querySelector("#public-ycco-member");
const yccoIdInput = document.querySelector("#public-ycco-id");

let bookingServices = [];
let selectedSlot = null;
let managedBooking = null;
let selectedManagementSlot = null;
let publicChildCount = 0;

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateLabel(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(date);
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function setManagementStatus(message, isError = false) {
  managementStatusEl.textContent = message;
  managementStatusEl.classList.toggle("error", isError);
}

function selectedService() {
  return bookingServices.find((service) => service.id === serviceSelect.value) || bookingServices[0] || null;
}

function formatPublicNameList(names) {
  const visibleNames = names.map((name) => String(name || "").trim()).filter(Boolean);

  if (visibleNames.length <= 1) {
    return visibleNames[0] || "your child";
  }

  if (visibleNames.length === 2) {
    return `${visibleNames[0]} and ${visibleNames[1]}`;
  }

  return `${visibleNames.slice(0, -1).join(", ")}, and ${visibleNames[visibleNames.length - 1]}`;
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

function managementAppointmentId() {
  return new URLSearchParams(window.location.search).get("appointmentId")?.trim() || "";
}

function managementToken() {
  return new URLSearchParams(window.location.search).get("token")?.trim() || "";
}

function hasManagementParams() {
  return Boolean(managementAppointmentId() && managementToken());
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

function bookingSummaryText(booking) {
  if (!booking) {
    return "";
  }

  return `${booking.serviceLabel || "Appointment"} for ${formatPublicNameList(booking.clientNames || [booking.clientName])} on ${formatDateLabel(booking.appointmentDate)} at ${booking.appointmentTimeLabel || booking.appointmentTime}.`;
}

function renderPublicChild(index) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "public-child-card";
  fieldset.dataset.publicChild = String(index);

  const header = document.createElement("div");
  const legend = document.createElement("legend");
  const removeButton = document.createElement("button");

  legend.textContent = `Child ${index + 1}`;
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    fieldset.remove();
    updatePublicChildControls();
  });
  header.append(legend, removeButton);

  const grid = document.createElement("div");
  grid.className = "public-booking-grid";
  grid.innerHTML = `
    <label class="public-field public-field-wide">
      <span>Child name</span>
      <input name="childName" autocomplete="name" required>
    </label>
    <label class="public-field">
      <span>Child DOB</span>
      <input name="childDob" type="date" required>
    </label>
    <label class="public-field">
      <span>Child gender</span>
      <select name="childGender" required>
        <option value="">Choose</option>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Nonbinary">Nonbinary</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
    </label>
  `;

  fieldset.append(header, grid);
  return fieldset;
}

function updatePublicChildControls() {
  const childCards = [...childrenEl.querySelectorAll("[data-public-child]")];

  childCards.forEach((card, index) => {
    card.dataset.publicChild = String(index);
    card.querySelector("legend").textContent = `Child ${index + 1}`;
    card.querySelector("button").hidden = childCards.length === 1;
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

function renderServices() {
  serviceSelect.innerHTML = "";

  for (const service of bookingServices) {
    const option = document.createElement("option");
    option.value = service.id;
    option.textContent = `${service.label} (${service.durationMinutes} min)`;
    option.dataset.defaultLanguage = service.defaultLanguage || "";
    serviceSelect.append(option);
  }

  const service = selectedService();

  if (service?.defaultLanguage) {
    languageSelect.value = service.defaultLanguage;
  }
}

function renderAvailability(dates) {
  selectedSlot = null;
  availabilityEl.innerHTML = "";

  const datesWithSlots = dates.filter((date) => Array.isArray(date.slots) && date.slots.length);

  if (!datesWithSlots.length) {
    const empty = document.createElement("p");
    empty.className = "public-empty";
    empty.textContent = "No open appointment times are available right now. Please call or text (971) 202-0232.";
    availabilityEl.append(empty);
    return;
  }

  for (const date of datesWithSlots) {
    const group = document.createElement("section");
    group.className = "public-availability-day";

    const heading = document.createElement("h3");
    heading.textContent = formatDateLabel(date.date);
    group.append(heading);

    const slots = document.createElement("div");
    slots.className = "public-slot-grid";

    for (const slot of date.slots) {
      const label = document.createElement("label");
      label.className = "public-slot";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "appointmentSlot";
      input.value = `${date.date}|${slot.value}`;
      input.required = true;
      input.addEventListener("change", () => {
        selectedSlot = {
          appointmentDate: date.date,
          appointmentTime: slot.value,
          label: `${formatDateLabel(date.date)} at ${slot.label}`
        };
        setStatus("");
      });

      const span = document.createElement("span");
      span.textContent = slot.label;

      label.append(input, span);
      slots.append(label);
    }

    group.append(slots);
    availabilityEl.append(group);
  }
}

function renderManagementAvailability(dates) {
  selectedManagementSlot = null;
  managementAvailabilityEl.innerHTML = "";

  if (!managedBooking?.canReschedule) {
    const empty = document.createElement("p");
    empty.className = "public-empty";
    empty.textContent = "This appointment can no longer be rescheduled online. Please call or text (971) 202-0232.";
    managementAvailabilityEl.append(empty);
    rescheduleBookingButton.disabled = true;
    return;
  }

  const datesWithSlots = dates
    .map((date) => ({
      ...date,
      slots: (Array.isArray(date.slots) ? date.slots : []).filter(
        (slot) => !(
          date.date === managedBooking.appointmentDate
          && (slot.value === managedBooking.appointmentTime || slot.label === managedBooking.appointmentTimeLabel)
        )
      )
    }))
    .filter((date) => date.slots.length);

  if (!datesWithSlots.length) {
    const empty = document.createElement("p");
    empty.className = "public-empty";
    empty.textContent = "No open appointment times are available right now. Please call or text (971) 202-0232.";
    managementAvailabilityEl.append(empty);
    rescheduleBookingButton.disabled = true;
    return;
  }

  rescheduleBookingButton.disabled = false;

  for (const date of datesWithSlots) {
    const group = document.createElement("section");
    group.className = "public-availability-day";

    const heading = document.createElement("h3");
    heading.textContent = formatDateLabel(date.date);
    group.append(heading);

    const slots = document.createElement("div");
    slots.className = "public-slot-grid";

    for (const slot of date.slots) {
      const label = document.createElement("label");
      label.className = "public-slot";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "managementAppointmentSlot";
      input.value = `${date.date}|${slot.value}`;
      input.addEventListener("change", () => {
        selectedManagementSlot = {
          appointmentDate: date.date,
          appointmentTime: slot.value,
          label: `${formatDateLabel(date.date)} at ${slot.label}`
        };
        setManagementStatus("");
      });

      const span = document.createElement("span");
      span.textContent = slot.label;

      label.append(input, span);
      slots.append(label);
    }

    group.append(slots);
    managementAvailabilityEl.append(group);
  }
}

async function loadAvailability() {
  const service = selectedService();

  if (!service) {
    return;
  }

  selectedSlot = null;
  availabilityEl.innerHTML = '<p class="public-empty">Loading available times...</p>';

  try {
    const data = await publicFetch(
      `/api/public/availability?serviceId=${encodeURIComponent(service.id)}&startDate=${todayDateString()}&days=28`
    );
    renderAvailability(data.dates || []);
  } catch (error) {
    availabilityEl.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "public-empty";
    empty.textContent = error.message || "Could not load available times.";
    availabilityEl.append(empty);
  }
}

function renderManagedBooking() {
  managementSummaryEl.textContent = bookingSummaryText(managedBooking);
  cancelBookingButton.disabled = !managedBooking?.canCancel;
  rescheduleBookingButton.disabled = !managedBooking?.canReschedule;

  if (managedBooking?.status && managedBooking.status !== "Scheduled") {
    setManagementStatus(`This appointment is ${managedBooking.status.toLowerCase()}.`);
  } else {
    setManagementStatus("");
  }
}

async function loadManagementAvailability() {
  if (!managedBooking?.serviceId) {
    return;
  }

  managementAvailabilityEl.innerHTML = '<p class="public-empty">Loading available times...</p>';

  try {
    const data = await publicFetch(
      `/api/public/availability?serviceId=${encodeURIComponent(managedBooking.serviceId)}&startDate=${todayDateString()}&days=45`
    );
    renderManagementAvailability(data.dates || []);
  } catch (error) {
    managementAvailabilityEl.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "public-empty";
    empty.textContent = error.message || "Could not load available times.";
    managementAvailabilityEl.append(empty);
    rescheduleBookingButton.disabled = true;
  }
}

async function loadManagedBooking() {
  bookingForm.hidden = true;
  confirmationEl.hidden = true;
  bookingManagementEl.hidden = false;
  managementSummaryEl.textContent = "Loading appointment...";
  managementAvailabilityEl.innerHTML = "";
  setManagementStatus("");

  try {
    const data = await publicFetch(
      `/api/public/bookings/${encodeURIComponent(managementAppointmentId())}?token=${encodeURIComponent(managementToken())}`
    );
    managedBooking = data.booking || null;
    renderManagedBooking();
    await loadManagementAvailability();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    managedBooking = null;
    managementSummaryEl.textContent = error.message || "We could not load that appointment.";
    cancelBookingButton.disabled = true;
    rescheduleBookingButton.disabled = true;
  }
}

async function loadBookingOptions() {
  try {
    const data = await publicFetch("/api/public/booking-options");
    bookingServices = Array.isArray(data.services) ? data.services : [];
    renderServices();
    await loadAvailability();
  } catch (error) {
    availabilityEl.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "public-empty";
    empty.textContent = error.message || "Could not load booking options.";
    availabilityEl.append(empty);
  }
}

async function cancelManagedBooking() {
  if (!managedBooking?.id) {
    return;
  }

  const confirmed = window.confirm("Cancel this appointment?");

  if (!confirmed) {
    return;
  }

  setManagementStatus("Canceling appointment...");
  cancelBookingButton.disabled = true;
  rescheduleBookingButton.disabled = true;

  try {
    const data = await publicFetch(`/api/public/bookings/${encodeURIComponent(managedBooking.id)}/cancel`, {
      method: "POST",
      body: JSON.stringify({
        token: managementToken()
      })
    });
    managedBooking = data.booking || { ...managedBooking, status: "Canceled", canCancel: false, canReschedule: false };
    renderManagedBooking();
    managementAvailabilityEl.innerHTML = "";
    setManagementStatus("Appointment canceled.");
  } catch (error) {
    renderManagedBooking();
    setManagementStatus(error.message || "Could not cancel the appointment yet.", true);
  }
}

async function rescheduleManagedBooking() {
  if (!managedBooking?.id) {
    return;
  }

  if (!selectedManagementSlot) {
    setManagementStatus("Choose a new appointment time.", true);
    return;
  }

  setManagementStatus("Rescheduling appointment...");
  cancelBookingButton.disabled = true;
  rescheduleBookingButton.disabled = true;

  try {
    const data = await publicFetch(`/api/public/bookings/${encodeURIComponent(managedBooking.id)}/reschedule`, {
      method: "POST",
      body: JSON.stringify({
        token: managementToken(),
        appointmentDate: selectedManagementSlot.appointmentDate,
        appointmentTime: selectedManagementSlot.appointmentTime
      })
    });
    managedBooking = data.booking || managedBooking;
    renderManagedBooking();
    setManagementStatus(`Appointment rescheduled to ${selectedManagementSlot.label}.`);
    await loadManagementAvailability();
  } catch (error) {
    renderManagedBooking();
    setManagementStatus(error.message || "Could not reschedule the appointment yet.", true);
    await loadManagementAvailability();
  }
}

function serviceChanged() {
  const service = selectedService();

  if (service?.defaultLanguage) {
    languageSelect.value = service.defaultLanguage;
  }

  setStatus("");
  loadAvailability();
}

async function submitBooking(event) {
  event.preventDefault();

  if (!selectedSlot) {
    setStatus("Choose an appointment time.", true);
    return;
  }

  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());
  const children = publicBookingChildrenFromForm();

  payload.serviceId = serviceSelect.value;
  payload.appointmentDate = selectedSlot.appointmentDate;
  payload.appointmentTime = selectedSlot.appointmentTime;
  payload.children = children;
  payload.phone = payload.mobilePhone;
  payload.parentName = payload.caregiverName;
  payload.consentReminders = Boolean(formData.get("consentReminders"));

  setStatus("Booking appointment...");
  submitButton.disabled = true;

  try {
    const data = await publicFetch("/api/public/bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const booking = data.booking || {};
    const childNames = Array.isArray(booking.clientNames) && booking.clientNames.length
      ? booking.clientNames
      : children.map((child) => child.childName);

    bookingForm.hidden = true;
    confirmationEl.hidden = false;
    confirmationEl.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Appointment booked";

    const detail = document.createElement("p");
    detail.textContent = `${booking.serviceLabel || "Appointment"} for ${formatPublicNameList(childNames)} on ${formatDateLabel(booking.appointmentDate)} at ${booking.appointmentTimeLabel || booking.appointmentTime}.`;

    const next = document.createElement("p");
    const manageUrl = bookingManageUrl(booking);

    if (manageUrl) {
      next.textContent = "Save this private link if you need to cancel or reschedule.";
    } else {
      next.textContent = "Please call or text (971) 202-0232 if you need to change this appointment.";
    }

    confirmationEl.append(heading, detail, next);

    if (manageUrl) {
      const manageLink = document.createElement("a");
      manageLink.className = "public-management-link";
      manageLink.href = manageUrl;
      manageLink.textContent = "Manage this appointment online";
      confirmationEl.append(manageLink);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    setStatus(error.message || "Could not book the appointment yet.", true);
    await loadAvailability();
  } finally {
    submitButton.disabled = false;
  }
}

serviceSelect.addEventListener("change", serviceChanged);
bookingForm.addEventListener("submit", submitBooking);
addChildButton.addEventListener("click", addPublicChild);
yccoMemberSelect.addEventListener("change", updateYccoIdState);
cancelBookingButton.addEventListener("click", cancelManagedBooking);
rescheduleBookingButton.addEventListener("click", rescheduleManagedBooking);

addPublicChild();
updateYccoIdState();

if (hasManagementParams()) {
  loadManagedBooking();
} else {
  loadBookingOptions();
}
