const icons = {
  template: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h10"/></svg>`,
  module: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>`
};

const rows = [
  {
    id: "selected",
    title: "List Item Title",
    subtitle: "List item subtitle",
    status: "Status",
    tone: "module"
  },
  {
    id: "highlight",
    title: "List Item Title",
    subtitle: "List item subtitle",
    status: "Status",
    tone: "blue"
  },
  {
    id: "standard",
    title: "Standard Item Title",
    subtitle: "List item subtitle",
    status: "Status",
    tone: "orange"
  }
];

function icon(name) {
  return `<span class="nav-icon">${icons[name] || icons.module}</span>`;
}

function renderNav() {
  const groups = [
    ["Module One", "template", "module", true],
    ["Module Two", "module", "orange", false],
    ["Module Three", "module", "yellow", false],
    ["Module Four", "module", "green", false],
    ["Module Five", "module", "blue", false],
    ["Admin", "module", "purple", false]
  ];

  return groups.map(([label, iconName, tone, active]) => `
    <section class="module-group" data-tone="${tone}">
      <button class="nav-button ${active ? "is-active" : ""}" type="button">
        ${icon(iconName)}
        ${label}
      </button>
      ${active ? `
        <div class="subnav">
          <button class="is-current" type="button">Section One</button>
          <button type="button">Section Two</button>
          <button type="button">Section Three</button>
        </div>
      ` : ""}
    </section>
  `).join("");
}

function renderListRows() {
  return rows.map((row) => `
    <button
      class="list-row"
      data-row-id="${row.id}"
      data-tone="${row.tone}"
      type="button"
    >
      <strong>${row.title}</strong>
      <span class="status-pill">${row.status}</span>
      <span>${row.subtitle}</span>
    </button>
  `).join("");
}

function renderTemplate() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="app-shell" data-shell>
      <aside class="sidebar" aria-label="Main navigation">
        <div class="brand">
          <button class="brand-mark" data-toggle-sidebar type="button" aria-label="Collapse navigation">
            <img src="./favicon.png" alt="">
          </button>
          <div class="brand-copy">
            <strong>SNACK</strong>
            <span>Program Manager</span>
          </div>
        </div>

        <div class="sidebar-scroll">
          <nav class="module-nav" aria-label="Template navigation">
            ${renderNav()}
          </nav>
        </div>

        <section class="quick-actions" aria-label="Quick actions">
          <h2>Quick Actions</h2>
          <button class="quick-button" type="button">${icon("plus")}Quick Action One</button>
          <button class="quick-button" type="button">${icon("plus")}Quick Action Two</button>
          <button class="quick-button" type="button">${icon("plus")}Quick Action Three</button>
        </section>

        <div class="account">
          <span class="avatar">SO</span>
          <strong>Shannon Oddo</strong>
        </div>
      </aside>

      <main class="main">
        <header class="page-header">
          <div class="page-title">
            <h1>Title</h1>
          </div>

          <div class="header-actions">
            <div class="view-switch" role="group" aria-label="Template views">
              <button class="is-active" type="button">Tab One</button>
              <button type="button">Tab Two</button>
              <button type="button">Tab Three</button>
            </div>
            <button class="primary-action" type="button">${icons.plus}Primary Action</button>
          </div>
        </header>

        <section class="summary-strip" aria-label="Template summary">
          <div class="summary-item">
            <strong>12</strong>
            <span>Summary Label</span>
          </div>
          <div class="summary-item">
            <strong>418</strong>
            <span>Summary Label</span>
          </div>
          <div class="summary-item">
            <strong>96</strong>
            <span>Summary Label</span>
          </div>
          <div class="summary-item">
            <strong>0</strong>
            <span>Summary Label</span>
          </div>
        </section>

        <section class="workspace">
          <div class="panel list-panel">
            <div class="panel-header">
              <div>
                <h2>List Header</h2>
              </div>
              <button class="list-search" type="button" aria-label="Search">${icons.search}</button>
            </div>
            <div class="list">
              ${renderListRows()}
            </div>
          </div>

          <article class="panel detail-panel">
            <aside class="detail-side">
              <div class="status-line">
                <span class="status-dot"></span>
                <span data-detail-status>Status</span>
              </div>
              <h2 data-detail-title>Detail Header</h2>
              <div class="meta-list">
                <div class="meta-row">
                  <span>Field Label</span>
                  <strong>Field Value</strong>
                </div>
                <div class="meta-row">
                  <span>Field Label</span>
                  <strong>Field Value</strong>
                </div>
                <div class="meta-row">
                  <span>Field Label</span>
                  <strong>Field Value</strong>
                </div>
              </div>
              <section class="side-section">
                <h3>Side Section</h3>
                <div class="meta-row">
                  <span>Field Label</span>
                  <strong>Field Value</strong>
                </div>
                <button class="text-link" type="button">Link</button>
              </section>
            </aside>

            <div class="detail-main">
              <div class="tabs" role="tablist" aria-label="Template detail tabs">
                <button class="is-active" type="button">Detail Tab</button>
                <button type="button">Detail Tab</button>
                <button type="button">Detail Tab</button>
                <button type="button">Detail Tab</button>
              </div>

              <section class="detail-card">
                <div class="card-heading">
                  <h3>Details</h3>
                  <button class="edit-button" type="button">Edit</button>
                </div>
                <div class="field-grid">
                  <div class="field">
                    <span>Field Label</span>
                    <strong>Field Value</strong>
                  </div>
                  <div class="field">
                    <span>Field Label</span>
                    <strong>Field Value</strong>
                  </div>
                  <div class="field">
                    <span>Field Label</span>
                    <strong>Field Value</strong>
                  </div>
                  <div class="field">
                    <span>Field Label</span>
                    <strong>Field Value</strong>
                  </div>
                </div>
              </section>

              <section class="detail-card">
                <div class="card-heading">
                  <h3>Notes</h3>
                  <button class="edit-button" type="button">Edit</button>
                </div>
                <div class="field-grid">
                  <div class="field">
                    <span>Field Label</span>
                    <strong>Longer field value text wraps inside the same visual pattern.</strong>
                  </div>
                  <div class="field">
                    <span>Field Label</span>
                    <strong>Field Value</strong>
                  </div>
                </div>
              </section>

              <div class="footer-actions">
                <button type="button">Footer Button</button>
                <button type="button">Footer Button</button>
                <button type="button">Footer Button</button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  `;
}

function bindTemplate() {
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle-sidebar]");
    if (toggle) {
      const shell = document.querySelector("[data-shell]");
      const collapsed = shell.classList.toggle("is-collapsed");
      toggle.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
      return;
    }

    const row = event.target.closest("[data-row-id]");
    if (row) {
      document.querySelectorAll(".list-row").forEach((item) => item.classList.remove("is-selected"));
      row.classList.add("is-selected");
      document.querySelector("[data-detail-title]").textContent = row.querySelector("strong").textContent;
      document.querySelector("[data-detail-status]").textContent = row.querySelector(".status-pill").textContent;
      return;
    }

    const viewTab = event.target.closest(".view-switch button");
    if (viewTab) {
      document.querySelectorAll(".view-switch button").forEach((item) => item.classList.remove("is-active"));
      viewTab.classList.add("is-active");
    }
  });
}

renderTemplate();
bindTemplate();
