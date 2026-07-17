const appointmentAvailability = document.querySelector("#appointment-availability");
const bookingApiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function renderAppointmentAvailability(scheduling) {
  const weekdays = Array.isArray(scheduling?.weekdays) ? scheduling.weekdays : [];
  const startTime = String(scheduling?.startTime || "").trim();
  const endTime = String(scheduling?.endTime || "").trim();

  if (!appointmentAvailability || !weekdays.length || !startTime || !endTime) {
    return;
  }

  appointmentAvailability.replaceChildren(...weekdays.map((weekday) => {
    const row = document.createElement("div");
    const day = document.createElement("dt");
    const hours = document.createElement("dd");

    day.textContent = weekdayNames[Number(weekday)] || `Day ${weekday}`;
    hours.textContent = `${startTime}–${endTime}`;
    row.append(day, hours);
    return row;
  }));
}

async function loadAppointmentAvailability() {
  try {
    const response = await fetch(`${bookingApiBaseUrl}/api/public/booking-options`);

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    renderAppointmentAvailability(data.scheduling);
  } catch {
    // The visual template keeps its approved fallback hours when the API is unavailable.
  }
}

document.querySelectorAll("[data-dialog-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.dialogOpen || "");

    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  });
});

document.querySelectorAll(".bio-dialog").forEach((dialog) => {
  dialog.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left
      || event.clientX > bounds.right
      || event.clientY < bounds.top
      || event.clientY > bounds.bottom;

    if (outside) {
      dialog.close();
    }
  });
});

loadAppointmentAvailability();
