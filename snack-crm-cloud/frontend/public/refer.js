const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
const form = document.querySelector("#public-referral-form");
const referralType = document.querySelector("#referral-type");
const providerFields = document.querySelector("#provider-fields");
const status = document.querySelector("#referral-status");
const submitButton = document.querySelector("#submit-referral");
const confirmation = document.querySelector("#referral-confirmation");
const childrenContainer = document.querySelector("#referral-children");

function providerReferralSelected() {
  return ["External Clinic Referral", "Community Org Referral"].includes(referralType.value);
}

function updateProviderFields() {
  const visible = providerReferralSelected();
  providerFields.hidden = !visible;
  providerFields.querySelectorAll("input").forEach((input) => {
    input.required = visible && ["referralOrganization", "referrerName"].includes(input.name);
  });
}

function formPayload() {
  const data = new FormData(form);
  return {
    ...Object.fromEntries(data.entries()),
    children: [...childrenContainer.querySelectorAll("[data-referral-child]")].map((row) => ({
      firstName: row.querySelector('[data-child-field="firstName"]')?.value || "",
      lastName: row.querySelector('[data-child-field="lastName"]')?.value || "",
      dateOfBirth: row.querySelector('[data-child-field="dateOfBirth"]')?.value || ""
    }))
  };
}

function renumberChildren() {
  [...childrenContainer.querySelectorAll("[data-referral-child]")].forEach((row, index) => {
    const title = row.querySelector(".referral-child-heading strong");
    if (title) title.textContent = `Child ${index + 1}`;
    const remove = row.querySelector("[data-remove-child]");
    if (remove) remove.hidden = index === 0;
  });
}

function addChild() {
  const row = document.createElement("div");
  row.className = "referral-child";
  row.dataset.referralChild = "";
  row.innerHTML = `
    <div class="referral-child-heading"><strong>Child</strong><button data-remove-child type="button">Remove</button></div>
    <div class="field-grid">
      <label><span>First Name</span><input data-child-field="firstName" type="text" autocomplete="off" required></label>
      <label><span>Last Name</span><input data-child-field="lastName" type="text" autocomplete="off" required></label>
      <label><span>Date of Birth <small>Optional</small></span><input data-child-field="dateOfBirth" type="date"></label>
    </div>
  `;
  childrenContainer.append(row);
  renumberChildren();
  row.querySelector("input")?.focus();
}

async function submitReferral(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;
  submitButton.disabled = true;
  status.textContent = "Submitting referral...";
  try {
    const response = await fetch(`${apiBaseUrl}/api/public/referrals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formPayload())
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "The referral could not be submitted.");
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.querySelector("h2")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    status.textContent = error.message || "The referral could not be submitted.";
  } finally {
    submitButton.disabled = false;
  }
}

referralType.addEventListener("change", updateProviderFields);
form.querySelector("[data-add-child]")?.addEventListener("click", addChild);
childrenContainer.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-child]");
  if (!remove) return;
  remove.closest("[data-referral-child]")?.remove();
  renumberChildren();
});
form.addEventListener("submit", submitReferral);
confirmation.querySelector("[data-new-referral]")?.addEventListener("click", () => {
  form.reset();
  [...childrenContainer.querySelectorAll("[data-referral-child]")].slice(1).forEach((row) => row.remove());
  renumberChildren();
  status.textContent = "";
  confirmation.hidden = true;
  form.hidden = false;
  updateProviderFields();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateProviderFields();
renumberChildren();
