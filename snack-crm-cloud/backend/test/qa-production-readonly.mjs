import assert from "node:assert/strict";

const frontendBaseUrl = String(process.env.SNACK_QA_BASE_URL || "https://snack-crm.web.app").replace(/\/$/, "");
const apiBaseUrl = String(process.env.SNACK_QA_API_BASE_URL || frontendBaseUrl).replace(/\/$/, "");
const timeoutMs = Number(process.env.SNACK_QA_TIMEOUT_MS || 15000);

async function readResponse(baseUrl, pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: "GET",
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs)
  });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  return { response, body };
}

async function check(label, callback) {
  await callback();
  console.log(`PASS ${label}`);
}

async function runReadOnlyQa() {
  await check("API health", async () => {
    const { response, body } = await readResponse(apiBaseUrl, "/health");
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "snack-crm-api");
  });

  await check("public booking landing page", async () => {
    const { response, body } = await readResponse(frontendBaseUrl, "/booking.html");
    assert.equal(response.status, 200);
    assert.match(body, /The SNACK Program/);
    assert.match(body, /book\.html\?service=enrollment/);
  });

  await check("public booking scheduler", async () => {
    const { response, body } = await readResponse(frontendBaseUrl, "/book.html?service=enrollment");
    assert.equal(response.status, 200);
    assert.match(body, /Select a time/);
    assert.match(body, /Family information/);
  });

  await check("public booking styles and script", async () => {
    const assets = ["/booking.css", "/booking.js", "/book.css", "/book.js"];

    for (const asset of assets) {
      const { response } = await readResponse(frontendBaseUrl, asset);
      assert.equal(response.status, 200, `${asset} did not load`);
    }
  });

  let serviceId = "enrollment";
  await check("public booking settings", async () => {
    const { response, body } = await readResponse(apiBaseUrl, "/api/public/booking-options");
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.services));
    assert.ok(body.services.length >= 4);
    assert.ok(Array.isArray(body.scheduling?.weekdays));
    assert.ok(body.scheduling.weekdays.length > 0);
    serviceId = body.services.find((service) => service.id === "enrollment")?.id || body.services[0].id;
  });

  await check("public availability", async () => {
    const { response, body } = await readResponse(
      apiBaseUrl,
      `/api/public/availability?serviceId=${encodeURIComponent(serviceId)}&days=14`
    );
    assert.equal(response.status, 200);
    assert.equal(body.service?.id, serviceId);
    assert.ok(Array.isArray(body.dates));
  });

  await check("staff data remains protected", async () => {
    const { response, body } = await readResponse(apiBaseUrl, "/api/clients");
    assert.equal(response.status, 401);
    assert.match(String(body.error || ""), /sign in/i);
  });

  console.log(`\nRead-only QA passed for ${frontendBaseUrl}`);
}

runReadOnlyQa().catch((error) => {
  console.error("\nRead-only QA failed.");
  console.error(error);
  process.exitCode = 1;
});
