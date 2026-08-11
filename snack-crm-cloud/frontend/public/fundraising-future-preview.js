const icons = {
  schedule: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>',
  crm: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="8" r="2.4"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M14.8 16.4A4.8 4.8 0 0 1 21 20"/></svg>',
  outreach: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14h4l9 5V5l-9 5H4zM20 9.5a4 4 0 0 1 0 5"/></svg>',
  fundraising: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
  marketing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-7-7 18-3-8-8-3zM11 14l10-10"/></svg>',
  operations: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15v-4M12 15V7M16 15v-6"/></svg>',
  admin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.47.52.82 1 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  columns: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v16H4zM14 4h6v16h-6z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>',
  note: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/></svg>',
  building: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5l8-3 8 3v16M8 8h1M8 12h1M8 16h1M15 8h1M15 12h1M15 16h1M10 21v-3h4v3"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 2v5h5"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  "chevron-left": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  "chevron-right": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>'
};

const actionLabels = {
  pipeline: "New Grant",
  deadlines: "Add Deadline",
  answers: "New Answer",
  organization: "Edit Information",
  documents: "Upload Document"
};

function insertIcons() {
  document.querySelectorAll("[data-icon]").forEach((host) => {
    host.innerHTML = icons[host.dataset.icon] || "";
  });
}

function setView(view) {
  if (!actionLabels[view]) return;
  document.querySelectorAll("[data-preview-view]").forEach((button) => {
    const active = button.dataset.previewView === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-preview-panel]").forEach((panel) => {
    const active = panel.dataset.previewPanel === view;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  const label = document.querySelector("[data-primary-action-label]");
  if (label) label.textContent = actionLabels[view];
}

function updateColumnCounts() {
  document.querySelectorAll(".grant-column").forEach((column) => {
    const count = column.querySelectorAll("[data-grant-card]").length;
    const counter = column.querySelector("header strong");
    if (counter) counter.textContent = String(count);
  });
}

function bindBoard() {
  let draggedCard = null;
  const status = document.querySelector("[data-drag-status]");

  document.querySelectorAll("[data-grant-card]").forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedCard = card;
      card.classList.add("is-dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
      document.querySelectorAll("[data-drop-zone]").forEach((zone) => zone.classList.remove("is-drag-over"));
      draggedCard = null;
    });
  });

  document.querySelectorAll("[data-drop-zone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("is-drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-drag-over"));
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("is-drag-over");
      if (!draggedCard) return;
      zone.append(draggedCard);
      updateColumnCounts();
      if (status) {
        const title = draggedCard.querySelector("strong")?.textContent || "Grant";
        const stage = zone.closest("[data-stage]")?.dataset.stage || "new stage";
        status.textContent = `${title} moved to ${stage}. Preview only; no record was changed.`;
      }
    });
  });
}

document.querySelectorAll("[data-preview-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.previewView));
});

document.querySelectorAll("[data-preview-view-target]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.previewViewTarget));
});

document.querySelector("[data-toggle-sidebar]")?.addEventListener("click", () => {
  const shell = document.querySelector("[data-shell]");
  const collapsed = shell?.classList.toggle("is-collapsed") || false;
  const control = document.querySelector("[data-toggle-sidebar]");
  control?.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
});

insertIcons();
bindBoard();
