const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
const form = document.querySelector("#volunteer-application-form");
const status = document.querySelector("#volunteer-application-status");
const submitButton = document.querySelector("#submit-volunteer-application");
const confirmation = document.querySelector("#volunteer-application-confirmation");

function formPayload() {
  const data = new FormData(form);
  return {
    ...Object.fromEntries(data.entries()),
    interests: data.getAll("interests"),
    permissionToContact: data.get("permissionToContact") === "on"
  };
}

async function submitApplication(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;
  submitButton.disabled = true;
  status.textContent = "Submitting application...";
  try {
    const response = await fetch(`${apiBaseUrl}/api/public/volunteer-applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formPayload())
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "The application could not be submitted.");
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.querySelector("h2")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    status.textContent = error.message || "The application could not be submitted.";
  } finally {
    submitButton.disabled = false;
  }
}

form.addEventListener("submit", submitApplication);
