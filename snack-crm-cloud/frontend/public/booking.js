const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
const bookingForm = document.querySelector("#public-booking-form");
const serviceSelect = document.querySelector("#public-service-id");
const languageSelect = document.querySelector("#public-preferred-language");
const availabilityEl = document.querySelector("#public-availability");
const statusEl = document.querySelector("#public-booking-status");
const submitButton = document.querySelector("#public-booking-submit");
const confirmationEl = document.querySelector("#booking-confirmation");

let bookingServices = [];
let selectedSlot = null;

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

function selectedService() {
  return bookingServices.find((service) => service.id === serviceSelect.value) || bookingServices[0] || null;
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

  payload.serviceId = serviceSelect.value;
  payload.appointmentDate = selectedSlot.appointmentDate;
  payload.appointmentTime = selectedSlot.appointmentTime;

  setStatus("Booking appointment...");
  submitButton.disabled = true;

  try {
    const data = await publicFetch("/api/public/bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const booking = data.booking || {};

    bookingForm.hidden = true;
    confirmationEl.hidden = false;
    confirmationEl.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Appointment booked";

    const detail = document.createElement("p");
    detail.textContent = `${booking.serviceLabel || "Appointment"} for ${booking.clientName || "your child"} on ${formatDateLabel(booking.appointmentDate)} at ${booking.appointmentTimeLabel || booking.appointmentTime}.`;

    const next = document.createElement("p");
    next.textContent = "Please call or text (971) 202-0232 if you need to change this appointment.";

    confirmationEl.append(heading, detail, next);
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

loadBookingOptions();
