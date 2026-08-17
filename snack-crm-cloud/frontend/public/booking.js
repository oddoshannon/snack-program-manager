import {
  applyPublicLanguage,
  currentPublicLanguage,
  initializePublicLanguage,
  publicLocale,
  publicText,
  publicUrl
} from "./modules/public-language.js";

const appointmentAvailability = document.querySelector("#appointment-availability");
const englishServiceGroup = document.querySelector("#english-service-group");
const englishServiceList = document.querySelector("#english-service-list");
const spanishServiceGroup = document.querySelector("#spanish-service-group");
const spanishServiceList = document.querySelector("#spanish-service-list");
const publicClassList = document.querySelector("#public-class-list");
const publicReviewSummary = document.querySelector("#public-review-summary");
const publicReviewList = document.querySelector("#public-review-list");
const bookingApiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
const weekdayNames = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
};
let loadedServices = [];
let loadedScheduling = {};
let loadedClasses = [];
let loadedReviews = [];

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

    day.textContent = weekdayNames[currentPublicLanguage()][Number(weekday)] || `${publicText("Day")} ${weekday}`;
    hours.textContent = `${startTime}–${endTime}`;
    row.append(day, hours);
    return row;
  }));
}

function publicServiceDescription(service) {
  const isSpanish = currentPublicLanguage() === "es";
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
  const isSpanish = currentPublicLanguage() === "es";
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
  link.href = publicUrl(`./book.html?service=${encodeURIComponent(service.id)}`);
  link.textContent = isSpanish ? "Reservar" : "Book";
  details.append(title, description, duration);
  article.append(details, link);
  return article;
}

function renderPublicServices(services) {
  const activeServices = Array.isArray(services) ? services : [];
  if (!activeServices.length) {
    englishServiceGroup.hidden = currentPublicLanguage() !== "en";
    spanishServiceGroup.hidden = currentPublicLanguage() !== "es";
    applyPublicLanguage(document.querySelector("#services"));
    return;
  }
  const englishServices = activeServices.filter((service) => String(service.defaultLanguage || "").toLowerCase() !== "spanish");
  const spanishServices = activeServices.filter((service) => String(service.defaultLanguage || "").toLowerCase() === "spanish");

  if (englishServiceList && englishServiceGroup) {
    englishServiceList.replaceChildren(...englishServices.map(publicServiceCard));
    englishServiceGroup.hidden = currentPublicLanguage() !== "en" || englishServices.length === 0;
  }

  if (spanishServiceList && spanishServiceGroup) {
    spanishServiceList.replaceChildren(...spanishServices.map(publicServiceCard));
    spanishServiceGroup.hidden = currentPublicLanguage() !== "es" || spanishServices.length === 0;
  }
  applyPublicLanguage(document.querySelector("#services"));
}

function dateFromString(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

function formatClassDate(value) {
  const date = dateFromString(value);
  return date
    ? new Intl.DateTimeFormat(publicLocale(), {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }).format(date)
    : value;
}

function classAvailabilityLabel(session) {
  if (session.isFull) {
    return publicText(session.waitlistEnabled ? "Waitlist available" : "Class full");
  }

  return currentPublicLanguage() === "es"
    ? `${session.spacesRemaining} de ${session.capacity} lugares disponibles`
    : `${session.spacesRemaining} of ${session.capacity} spots available`;
}

function localizedClassTitle(value) {
  const title = String(value || "");
  if (currentPublicLanguage() !== "es") return title;
  return title
    .replace(/^Kids Cooking \+ Nutrition Class/i, "Clase de cocina + nutrición para niños")
    .replace(/^Teen Cooking \+ Nutrition Class/i, "Clase de cocina + nutrición para adolescentes")
    .replace(/^Cooking Class/i, "Clase de cocina");
}

function renderPublicClasses(classes) {
  if (!publicClassList) {
    return;
  }

  publicClassList.replaceChildren();

  if (!classes.length) {
    const message = document.createElement("p");
    message.className = "class-list-message";
    message.textContent = publicText("No cooking classes are currently open for registration.");
    publicClassList.append(message);
    return;
  }

  classes.forEach((session) => {
    const article = document.createElement("article");
    const details = document.createElement("div");
    const title = document.createElement("h3");
    const schedule = document.createElement("p");
    const availability = document.createElement("span");
    title.textContent = localizedClassTitle(session.title);
    schedule.textContent = `${formatClassDate(session.sessionDate)} · ${session.startTimeLabel} · ${session.durationMinutes} ${currentPublicLanguage() === "es" ? "minutos" : "minutes"}`;
    availability.textContent = classAvailabilityLabel(session);
    details.append(title, schedule, availability);
    article.append(details);

    if (session.canRegister) {
      const link = document.createElement("a");
      link.href = publicUrl(`./book.html?class=${encodeURIComponent(session.id)}`);
      link.textContent = publicText(session.nextStatus === "Waitlisted" ? "Join Waitlist" : "Register");
      article.append(link);
    } else {
      const closed = document.createElement("span");
      closed.className = "class-closed-label";
      closed.textContent = publicText("Full");
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
    loadedServices = Array.isArray(data.services) ? data.services : [];
    loadedScheduling = data.scheduling || {};
    renderPublicServices(loadedServices);
    renderAppointmentAvailability(loadedScheduling);
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
    loadedClasses = Array.isArray(data.classes) ? data.classes : [];
    renderPublicClasses(loadedClasses);
  } catch {
    renderPublicClasses([]);
  }
}

function reviewDateLabel(value) {
  const date = dateFromString(String(value || "").slice(0, 10));
  return date
    ? new Intl.DateTimeFormat(publicLocale(), { month: "long", day: "numeric", year: "numeric" }).format(date)
    : "";
}

function renderPublicReviews(reviews) {
  if (!publicReviewList || !publicReviewSummary) return;
  const visibleReviews = Array.isArray(reviews) ? reviews : [];
  publicReviewList.replaceChildren();
  if (!visibleReviews.length) {
    const message = document.createElement("p");
    message.className = "review-list-message";
    message.textContent = publicText("No reviews have been shared yet.");
    publicReviewList.append(message);
    publicReviewSummary.textContent = "";
    return;
  }
  const average = visibleReviews.reduce((total, review) => total + Number(review.rating || 0), 0) / visibleReviews.length;
  const averageText = document.createElement("strong");
  const stars = document.createElement("span");
  const count = document.createElement("span");
  averageText.textContent = average.toFixed(1);
  stars.className = "review-stars";
  stars.textContent = "★★★★★";
  stars.setAttribute("aria-label", `${average.toFixed(1)} ${currentPublicLanguage() === "es" ? "de 5 estrellas" : "out of 5 stars"}`);
  count.textContent = currentPublicLanguage() === "es"
    ? `${visibleReviews.length} ${visibleReviews.length === 1 ? "reseña" : "reseñas"}`
    : `${visibleReviews.length} ${visibleReviews.length === 1 ? "review" : "reviews"}`;
  publicReviewSummary.replaceChildren(averageText, stars, count);

  visibleReviews.forEach((review) => {
    const article = document.createElement("article");
    const header = document.createElement("header");
    const name = document.createElement("h3");
    const time = document.createElement("time");
    const rating = document.createElement("span");
    const comment = document.createElement("p");
    article.className = "public-review-card";
    name.textContent = review.displayName;
    time.dateTime = String(review.reviewDate || "").slice(0, 10);
    time.textContent = reviewDateLabel(review.reviewDate);
    rating.className = "review-stars";
    rating.textContent = `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`;
    rating.setAttribute("aria-label", `${review.rating} ${currentPublicLanguage() === "es" ? "de 5 estrellas" : "out of 5 stars"}`);
    comment.textContent = review.comment;
    header.append(name, time);
    article.append(header, rating, comment);
    publicReviewList.append(article);
  });
}

async function loadPublicReviews() {
  try {
    const response = await fetch(`${bookingApiBaseUrl}/api/public/reviews`);
    if (!response.ok) throw new Error("Reviews could not be loaded.");
    const data = await response.json();
    loadedReviews = Array.isArray(data.reviews) ? data.reviews : [];
    renderPublicReviews(loadedReviews);
  } catch {
    renderPublicReviews([]);
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

document.title = currentPublicLanguage() === "es" ? "Reserve con El Programa SNACK" : "Book with The SNACK Program";
initializePublicLanguage({
  onChange(language) {
    document.title = language === "es" ? "Reserve con El Programa SNACK" : "Book with The SNACK Program";
    renderPublicServices(loadedServices);
    renderAppointmentAvailability(loadedScheduling);
    renderPublicClasses(loadedClasses);
    renderPublicReviews(loadedReviews);
  }
});
loadBookingOptions().then(() => {
  document.querySelectorAll("a[href^='./book.html']").forEach((link) => {
    link.href = publicUrl(link.getAttribute("href"));
  });
});
loadCookingClasses();
loadPublicReviews();
