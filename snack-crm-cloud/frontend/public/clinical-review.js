import {
  clinicalReviewActionState,
  clinicalReviewCounts,
  clinicalReviewDemoRecords,
  clinicalReviewDisplayRole,
  clinicalReviewLatestClarification,
  clinicalReviewQueue,
  clinicalReviewStatuses
} from "./modules/clinical-review.js?v=20260817-clinical-review4";

const icons = {
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/></svg>`,
  schedule: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>`,
  crm: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="8" r="2.4"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M14.8 16.4A4.8 4.8 0 0 1 21 20"/></svg>`,
  outreach: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14h4l9 5V5l-9 5H4zM20 9.5a4 4 0 0 1 0 5"/></svg>`,
  fundraising: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  marketing: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-7-7 18-3-8-8-3zM11 14l10-10"/></svg>`,
  operations: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15v-4M12 15V7M16 15v-6"/></svg>`,
  clinical: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v5a6 6 0 0 0 12 0V3M4 3h4M16 3h4M12 14v3a4 4 0 0 0 8 0v-2"/><circle cx="20" cy="13" r="2"/></svg>`,
  admin: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`
};

const moduleDefinitions = {
  schedule: ["Schedule", "./schedule.html", "schedule", "red"],
  crm: ["CRM", "./crm.html", "crm", "orange"],
  outreach: ["Outreach", "./outreach.html", "outreach", "yellow"],
  fundraising: ["Finances", "./finances.html", "fundraising", "green"],
  marketing: ["Marketing", "./marketing.html", "marketing", "blue"],
  operations: ["Operations", "./operations.html", "operations", "navy"],
  clinical: ["Clinical Review", "./clinical-review.html", "clinical", "purple"],
  admin: ["Admin", "./admin.html", "admin", "purple"]
};
const moduleOrder = Object.keys(moduleDefinitions);
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let auth;
let authApi;
let signInProvider;
let currentUser;
let access = null;
let role = {};
let settings = {};
let reviews = [];
let selectedId = new URLSearchParams(location.search).get("appointment") || "";
let busy = false;
let assignedOnly = false;
let advisorPreview = false;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function icon(name) {
  return `<span class="nav-icon">${icons[name] || icons.clinical}</span>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function formatDate(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  if (!year || !month || !day) return "Date not recorded";
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" })
    .format(new Date(year, month - 1, day));
}

function formatTime(value) {
  const [hours, minutes] = String(value || "").split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "";
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })
    .format(new Date(2000, 0, 1, hours, minutes));
}

function statusTone(status) {
  if (status === clinicalReviewStatuses.reviewed) return "green";
  if (status === clinicalReviewStatuses.clarification) return "orange";
  return "purple";
}

function renderNav() {
  const visibleModules = advisorPreview ? ["clinical"] : access?.modules || [];
  return moduleOrder.filter((id) => visibleModules.includes(id)).map((id) => {
    const [label, href, iconName, tone] = moduleDefinitions[id];
    return `
      <section class="module-group" data-tone="${tone}">
        <a class="nav-button ${id === "clinical" ? "is-active" : ""}" href="${href}">
          ${icon(iconName)}${escapeHtml(label)}
        </a>
      </section>`;
  }).join("");
}

function displayedReviews() {
  return advisorPreview ? clinicalReviewDemoRecords() : reviews;
}

function selectedReview(source = displayedReviews()) {
  return source.find((item) => item.id === selectedId) || source[0] || null;
}

function renderClarificationHistory(review) {
  const history = Array.isArray(review.clarifications) ? review.clarifications : [];
  if (!history.length) return "";
  return `
    <section class="clinical-history" aria-labelledby="clinical-history-title">
      <h3 id="clinical-history-title">Clarification</h3>
      ${history.map((item) => `
        <article>
          <span>Question</span>
          <p>${escapeHtml(item.question)}</p>
          ${item.answer ? `<span>Answer from ${escapeHtml(item.answeredByName || item.assignedTo || "SNACK staff")}</span><p>${escapeHtml(item.answer)}</p>` : `<strong>Waiting for ${escapeHtml(item.assignedTo || "SNACK staff")}</strong>`}
        </article>
      `).join("")}
    </section>`;
}

function renderDetail(review) {
  if (!review) {
    return `<div class="clinical-empty"><h2>${assignedOnly ? "No clarification requests" : "No appointment notes are waiting"}</h2><p>${assignedOnly ? "Assigned questions will appear here." : "Completed appointment notes will appear here automatically."}</p></div>`;
  }
  const displayReview = advisorPreview ? { ...review, canRespond: false } : review;
  const actions = clinicalReviewActionState(displayReview, clinicalReviewDisplayRole(role, advisorPreview));
  const latestClarification = clinicalReviewLatestClarification(review);
  return `
    <article class="clinical-detail" data-clinical-detail>
      <header>
        <div><h2>${escapeHtml(review.clients.join(" + "))}</h2><p>Completed ${escapeHtml(formatDate(review.appointmentDate))}${review.appointmentTime ? ` at ${escapeHtml(formatTime(review.appointmentTime))}` : ""}</p></div>
        <span class="status-pill" data-status-tone="${statusTone(review.status)}">${escapeHtml(review.status)}</span>
      </header>
      <dl class="clinical-facts">
        <div><dt>Staff Member</dt><dd>${escapeHtml(review.staffMember || "Not recorded")}</dd></div>
        <div><dt>Appointment Type</dt><dd>${escapeHtml(review.appointmentType || "Not recorded")}</dd></div>
        <div><dt>Lesson</dt><dd>${escapeHtml(review.lesson || "Not recorded")}</dd></div>
        <div><dt>Clinical Review</dt><dd>${escapeHtml(review.referralUpdateLabel || review.status)}</dd></div>
      </dl>
      <section class="clinical-note">
        <h3>Appointment Note</h3>
        <p>${escapeHtml(review.appointmentNote)}</p>
      </section>
      <section class="clinical-goals">
        <h3>${review.participantGoals.length > 1 ? "Goals" : "Goal"}</h3>
        ${review.participantGoals.map((item) => `
          <div><strong>${escapeHtml(item.client)}</strong><span>${escapeHtml(item.goal || "No goal recorded")}</span><small>${escapeHtml(item.goalResult || "Goal result not recorded")}</small></div>
        `).join("")}
      </section>
      ${renderClarificationHistory(review)}
      ${actions.responseVisible ? `
        <form class="clinical-response-form" data-clinical-response-form>
          <label><span>Your Answer</span><textarea name="answer" rows="5" required placeholder="Answer the question, then return the note for review."></textarea></label>
          <button class="primary-action" type="submit">Return to Review Queue</button>
        </form>` : ""}
      ${actions.requestVisible && !actions.requestDisabled ? `
        <form class="clinical-question-form" data-clinical-question-form hidden>
          <label><span>Clarification Question</span><textarea name="question" rows="4" required placeholder="Add a short question for SNACK staff."></textarea></label>
          <div><button data-cancel-clinical-question type="button">Cancel</button><button class="is-primary" type="submit">Send Request</button></div>
        </form>` : ""}
      <p class="schedule-action-status" data-clinical-action-status role="status" aria-live="polite"></p>
      ${actions.requestVisible || actions.reviewVisible ? `
        <footer class="clinical-actions">
          ${actions.requestVisible ? `<button data-request-clarification type="button" ${actions.requestDisabled ? "disabled" : ""}>${escapeHtml(actions.requestLabel)}</button>` : ""}
          ${actions.reviewVisible ? `<button class="is-primary" data-mark-clinical-reviewed type="button" ${actions.reviewDisabled ? "disabled" : ""}>${escapeHtml(actions.reviewLabel)}</button>` : ""}
        </footer>` : ""}
      ${latestClarification?.answer && review.status === clinicalReviewStatuses.ready ? `<p class="clinical-returned-note">The clarification was answered and this note has returned to the review queue.</p>` : ""}
    </article>`;
}

function renderSettingsDialog() {
  if (!role.administrator || advisorPreview) return "";
  return `
    <dialog class="schedule-dialog" data-clinical-settings-dialog>
      <form class="schedule-dialog-form" data-clinical-settings-form>
        <div class="schedule-dialog-heading"><div><span>Clinical Review</span><h2>Clarification Routing</h2></div><button class="schedule-dialog-close" data-close-clinical-settings type="button" aria-label="Close">&times;</button></div>
        <div class="schedule-dialog-fields">
          <label class="is-full-width"><span>Send New Questions To</span><select name="clarificationRouting"><option value="director" ${settings.clarificationRouting === "director" ? "selected" : ""}>Shannon Oddo (Director)</option><option value="appointment-staff" ${settings.clarificationRouting === "appointment-staff" ? "selected" : ""}>Staff Member Listed on the Appointment</option></select></label>
          <p class="clinical-settings-help">This changes new clarification requests only. Existing requests stay with their current assignee.</p>
        </div>
        <p class="schedule-dialog-status" data-clinical-settings-status role="status" aria-live="polite"></p>
        <div class="schedule-dialog-actions"><button data-close-clinical-settings type="button">Cancel</button><button class="is-primary" type="submit">Save Setting</button></div>
      </form>
    </dialog>`;
}

function render() {
  const ordered = clinicalReviewQueue(displayedReviews());
  const counts = clinicalReviewCounts(ordered);
  const review = selectedReview(ordered);
  if (review) selectedId = review.id;
  app.innerHTML = `
    <div class="app-shell" data-shell data-module-id="clinical" style="--module: var(--purple); --module-soft: var(--purple-soft); --module-line: #c8b7f0;">
      <aside class="sidebar" aria-label="Main navigation">
        <div class="brand"><a class="brand-mark" href="./index.html" aria-label="Home"><img src="./favicon.png" alt=""></a><a class="brand-copy" href="./index.html"><strong>SNACK</strong><span>Program Hub</span></a><button class="sidebar-collapse-button" data-toggle-sidebar type="button" aria-label="Collapse navigation">${icons.chevronLeft}</button></div>
        <div class="sidebar-scroll"><nav class="module-nav" aria-label="Clinical Review navigation">${renderNav()}</nav></div>
        <div class="account"><button class="account-trigger" data-account-menu-toggle type="button" aria-haspopup="menu" aria-expanded="false"><span class="avatar">${escapeHtml((advisorPreview ? "AP" : access.displayName || access.email || "SN").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase())}</span><span><strong>${escapeHtml(advisorPreview ? "Advisor Preview" : access.displayName || access.email)}</strong><small>${escapeHtml(advisorPreview ? settings.roleTitle : access.accessLevelName || settings.roleTitle)}</small></span><span class="account-chevron">${icons.chevronRight}</span></button><div class="account-menu" data-account-menu role="menu" hidden><button data-sign-out role="menuitem" type="button">Sign Out</button></div></div>
      </aside>
      <main class="main clinical-review-main">
        <header class="page-header"><div class="page-title"><h1>${assignedOnly ? "Clinical Clarification" : "Clinical Review"}</h1><p>${assignedOnly ? "Answer the question and return the note to the advisor." : "Review recently completed appointment notes."}</p></div>${role.administrator && !assignedOnly ? `<div class="clinical-header-actions"><button class="header-link-action" data-toggle-advisor-preview type="button">${advisorPreview ? "Exit Advisor Preview" : "Preview Advisor View"}</button>${advisorPreview ? "" : `<button class="header-link-action" data-open-clinical-settings type="button">Clarification Routing</button>`}</div>` : ""}</header>
        ${advisorPreview ? `<p class="clinical-preview-notice" role="status">Advisor Preview uses fictional demo records and is read-only. No review or clarification will be saved.</p>` : ""}
        <section class="summary-strip clinical-summary" aria-label="Clinical review summary"><div class="summary-item"><strong>${counts.ready}</strong><span>Ready for Review</span></div><div class="summary-item"><strong>${counts.clarification}</strong><span>Clarification Requested</span></div><div class="summary-item"><strong>${counts.reviewed}</strong><span>Reviewed</span></div></section>
        <section class="clinical-workspace">
          <div class="panel clinical-list-panel"><div class="panel-header"><div><h2>${assignedOnly ? "Assigned Questions" : "Recently Completed"}</h2><p>Newest notes appear first</p></div></div><div class="list">${ordered.length ? ordered.map((item) => `<button class="list-row ${item.id === selectedId ? "is-selected" : ""}" data-clinical-review-id="${escapeHtml(item.id)}" data-tone="module" type="button"><strong>${escapeHtml(item.clients.join(" + "))}</strong><span class="status-pill" data-status-tone="${statusTone(item.status)}">${escapeHtml(item.status)}</span><span>${escapeHtml(formatDate(item.appointmentDate))} · ${escapeHtml(item.lesson || item.appointmentType || "Appointment")}</span></button>`).join("") : `<p class="list-empty">${assignedOnly ? "No clarification requests are assigned to you." : "No completed appointment notes are available."}</p>`}</div></div>
          <div class="panel clinical-detail-panel">${renderDetail(review)}</div>
        </section>
      </main>
      ${renderSettingsDialog()}
    </div>`;
  bindRenderedEvents();
}

async function authedFetch(path, options = {}) {
  const token = await currentUser.getIdToken();
  const response = await fetch(`${window.SNACK_CONFIG?.API_BASE_URL || ""}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers, Authorization: `Bearer ${token}` }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The clinical review action could not be completed.");
  return result;
}

async function loadReviews() {
  const path = assignedOnly ? "/api/clinical-clarifications/assigned" : "/api/clinical-reviews";
  const result = await authedFetch(path);
  reviews = result.reviews || [];
  settings = result.settings || {};
  role = result.role || {};
  advisorPreview = role.administrator
    && !assignedOnly
    && new URLSearchParams(location.search).get("preview") === "advisor";
  if (!reviews.some((item) => item.id === selectedId)) selectedId = reviews[0]?.id || "";
  render();
}

function setBusy(nextBusy) {
  busy = nextBusy;
  document.querySelectorAll("button, textarea, select").forEach((control) => { control.disabled = nextBusy || control.hasAttribute("data-permanently-disabled"); });
}

function bindRenderedEvents() {
  document.querySelectorAll("[data-clinical-review-id]").forEach((button) => button.addEventListener("click", () => {
    if (busy) return;
    selectedId = button.dataset.clinicalReviewId;
    render();
  }));
  document.querySelector("[data-toggle-sidebar]")?.addEventListener("click", () => document.querySelector("[data-shell]")?.classList.toggle("is-collapsed"));
  document.querySelector("[data-account-menu-toggle]")?.addEventListener("click", (event) => {
    const menu = document.querySelector("[data-account-menu]");
    const open = menu.hidden;
    menu.hidden = !open;
    event.currentTarget.setAttribute("aria-expanded", String(open));
  });
  document.querySelector("[data-sign-out]")?.addEventListener("click", () => authApi.signOut(auth).then(() => location.replace("./index.html")));
  document.querySelector("[data-toggle-advisor-preview]")?.addEventListener("click", () => {
    const url = new URL(location.href);
    if (advisorPreview) url.searchParams.delete("preview");
    else url.searchParams.set("preview", "advisor");
    history.replaceState({}, "", url);
    advisorPreview = !advisorPreview;
    render();
  });
  document.querySelector("[data-request-clarification]")?.addEventListener("click", () => {
    const form = document.querySelector("[data-clinical-question-form]");
    if (form) { form.hidden = false; form.elements.question.focus(); }
  });
  document.querySelector("[data-cancel-clinical-question]")?.addEventListener("click", () => {
    const form = document.querySelector("[data-clinical-question-form]");
    if (form) form.hidden = true;
  });
  document.querySelector("[data-clinical-question-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (advisorPreview) {
      showToast("Advisor Preview Only — Nothing Was Saved");
      return;
    }
    const question = new FormData(event.currentTarget).get("question");
    setBusy(true);
    try {
      await authedFetch(`/api/clinical-reviews/${encodeURIComponent(selectedId)}/clarification`, { method: "POST", body: JSON.stringify({ question }) });
      await loadReviews();
      showToast("Clarification Requested");
    } catch (error) {
      setBusy(false);
      document.querySelector("[data-clinical-action-status]").textContent = error.message;
    }
  });
  document.querySelector("[data-mark-clinical-reviewed]")?.addEventListener("click", async () => {
    if (advisorPreview) {
      showToast("Advisor Preview Only — Nothing Was Saved");
      return;
    }
    setBusy(true);
    try {
      await authedFetch(`/api/clinical-reviews/${encodeURIComponent(selectedId)}/review`, { method: "POST", body: "{}" });
      await loadReviews();
      showToast("Reviewed");
    } catch (error) {
      setBusy(false);
      document.querySelector("[data-clinical-action-status]").textContent = error.message;
    }
  });
  document.querySelector("[data-clinical-response-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const answer = new FormData(event.currentTarget).get("answer");
    setBusy(true);
    try {
      await authedFetch(`/api/clinical-clarifications/${encodeURIComponent(selectedId)}/response`, { method: "POST", body: JSON.stringify({ answer }) });
      await loadReviews();
      showToast("Returned to Review Queue");
    } catch (error) {
      setBusy(false);
      document.querySelector("[data-clinical-action-status]").textContent = error.message;
    }
  });
  const settingsDialog = document.querySelector("[data-clinical-settings-dialog]");
  document.querySelector("[data-open-clinical-settings]")?.addEventListener("click", () => settingsDialog?.showModal());
  document.querySelectorAll("[data-close-clinical-settings]").forEach((button) => button.addEventListener("click", () => settingsDialog?.close()));
  document.querySelector("[data-clinical-settings-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const clarificationRouting = new FormData(event.currentTarget).get("clarificationRouting");
    setBusy(true);
    try {
      const result = await authedFetch("/api/clinical-reviews/settings", { method: "PUT", body: JSON.stringify({ clarificationRouting }) });
      settings = result.settings;
      settingsDialog.close();
      render();
      showToast("Clarification Routing Saved");
    } catch (error) {
      setBusy(false);
      document.querySelector("[data-clinical-settings-status]").textContent = error.message;
    }
  });
}

function renderLoading(message = "Loading Clinical Review...") {
  app.innerHTML = `<main class="secure-gate"><section><img src="./favicon.png" alt=""><h1>SNACK Program Hub</h1><p>${escapeHtml(message)}</p></section></main>`;
}

function renderSignIn(message = "Sign in with your SNACK Google account to continue.") {
  app.innerHTML = `
    <main class="secure-gate">
      <section>
        <img src="./favicon.png" alt="">
        <h1>Clinical Review</h1>
        <p>${escapeHtml(message)}</p>
        <button class="is-primary" data-clinical-sign-in type="button">Sign In with Google</button>
        <small>Use your @snackprogram.org account.</small>
      </section>
    </main>`;
  document.querySelector("[data-clinical-sign-in]")?.addEventListener("click", async (event) => {
    event.currentTarget.disabled = true;
    try {
      await authApi.signInWithPopup(auth, signInProvider);
    } catch (error) {
      console.error(error);
      renderSignIn("Google sign-in did not finish. Please try again.");
    }
  });
}

async function initialize() {
  renderLoading();
  const [{ initializeApp }, firebaseAuth] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
  ]);
  authApi = firebaseAuth;
  auth = firebaseAuth.getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
  signInProvider = new firebaseAuth.GoogleAuthProvider();
  signInProvider.setCustomParameters({ hd: "snackprogram.org" });
  await firebaseAuth.setPersistence(auth, firebaseAuth.browserSessionPersistence);
  firebaseAuth.onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (!user) {
      renderSignIn();
      return;
    }
    try {
      const accessResult = await authedFetch("/api/access/me");
      access = accessResult.access;
      assignedOnly = !access.modules.includes("clinical") && access.modules.includes("crm")
        && new URLSearchParams(location.search).has("clarification");
      if (!access.modules.includes("clinical") && !assignedOnly) {
        location.replace("./index.html");
        return;
      }
      await loadReviews();
    } catch (error) {
      renderLoading(error.message || "Clinical Review could not be loaded.");
    }
  });
}

initialize().catch((error) => renderLoading(error.message || "Clinical Review could not be started."));
