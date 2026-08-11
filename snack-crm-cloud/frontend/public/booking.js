const appointmentAvailability = document.querySelector("#appointment-availability");
const englishServiceGroup = document.querySelector("#english-service-group");
const englishServiceList = document.querySelector("#english-service-list");
const spanishServiceGroup = document.querySelector("#spanish-service-group");
const spanishServiceList = document.querySelector("#spanish-service-list");
const publicClassList = document.querySelector("#public-class-list");
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

function publicServiceDescription(service) {
  const isSpanish = String(service.defaultLanguage || "").toLowerCase() === "spanish";
  const isEnrollment = String(service.appointmentType || "").toLowerCase() === "enrollment";

  if (isSpanish) {
    return isEnrollment
      ? "Para familias nuevas en el Programa SNACK."
      : "Para familias que continúan las lecciones de nutrición.";
  }

  return isEnrollment
    ? "For families who are new to the SNACK Program."
    : "For returning families continuing nutrition lessons.";
}

function publicServiceCard(service) {
  const isSpanish = String(service.defaultLanguage || "").toLowerCase() === "spanish";
  const article = document.createElement("article");
  const details = document.createElement("div");
  const title = document.createElement("h4");
  const description = document.createElement("p");
  const duration = document.createElement("span");
  const link = document.createElement("a");

  article.className = "service-item";
  title.textContent = service.label;
  description.textContent = publicServiceDescription(service);
  duration.textContent = `${service.durationMinutes} ${isSpanish ? "minutos · Gratis" : "minutes · Free"}`;
  link.href = `./book.html?service=${encodeURIComponent(service.id)}`;
  link.textContent = isSpanish ? "Reservar" : "Book";
  details.append(title, description, duration);
  article.append(details, link);
  return article;
}

function renderPublicServices(services) {
  const activeServices = Array.isArray(services) ? services : [];
  const englishServices = activeServices.filter((service) => String(service.defaultLanguage || "").toLowerCase() !== "spanish");
  const spanishServices = activeServices.filter((service) => String(service.defaultLanguage || "").toLowerCase() === "spanish");

  if (englishServiceList && englishServiceGroup) {
    englishServiceList.replaceChildren(...englishServices.map(publicServiceCard));
    englishServiceGroup.hidden = englishServices.length === 0;
  }

  if (spanishServiceList && spanishServiceGroup) {
    spanishServiceList.replaceChildren(...spanishServices.map(publicServiceCard));
    spanishServiceGroup.hidden = spanishServices.length === 0;
  }
}

function dateFromString(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

function formatClassDate(value) {
  const date = dateFromString(value);
  return date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }).format(date)
    : value;
}

function classAvailabilityLabel(session) {
  if (session.isFull) {
    return session.waitlistEnabled ? "Waitlist available" : "Class full";
  }

  return `${session.spacesRemaining} of ${session.capacity} spots available`;
}

function renderPublicClasses(classes) {
  if (!publicClassList) {
    return;
  }

  publicClassList.replaceChildren();

  if (!classes.length) {
    const message = document.createElement("p");
    message.className = "class-list-message";
    message.textContent = "No cooking classes are currently open for registration.";
    publicClassList.append(message);
    return;
  }

  classes.forEach((session) => {
    const article = document.createElement("article");
    const details = document.createElement("div");
    const title = document.createElement("h3");
    const schedule = document.createElement("p");
    const availability = document.createElement("span");
    title.textContent = session.title;
    schedule.textContent = `${formatClassDate(session.sessionDate)} · ${session.startTimeLabel} · ${session.durationMinutes} minutes`;
    availability.textContent = classAvailabilityLabel(session);
    details.append(title, schedule, availability);
    article.append(details);

    if (session.canRegister) {
      const link = document.createElement("a");
      link.href = `./book.html?class=${encodeURIComponent(session.id)}`;
      link.textContent = session.nextStatus === "Waitlisted" ? "Join Waitlist" : "Register";
      article.append(link);
    } else {
      const closed = document.createElement("span");
      closed.className = "class-closed-label";
      closed.textContent = "Full";
      article.append(closed);
    }

    publicClassList.append(article);
  });
}

async function loadBookingOptions() {
  try {
    const response = await fetch(`${bookingApiBaseUrl}/api/public/booking-options`);

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    renderPublicServices(data.services);
    renderAppointmentAvailability(data.scheduling);
  } catch {
    // The visual template keeps its approved fallback hours when the API is unavailable.
  }
}

async function loadCookingClasses() {
  try {
    const response = await fetch(`${bookingApiBaseUrl}/api/public/classes`);

    if (!response.ok) {
      throw new Error("Classes could not be loaded.");
    }

    const data = await response.json();
    renderPublicClasses(Array.isArray(data.classes) ? data.classes : []);
  } catch {
    renderPublicClasses([]);
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

loadBookingOptions();
loadCookingClasses();
