import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";

const publicDir = new URL("../../frontend/public/", import.meta.url);
const readPublicFile = (name) => readFile(new URL(name, publicDir), "utf8");

function localReferences(source) {
  return Array.from(source.matchAll(/(?:href|src)="(\.\/[^"#]+)"/g), (match) => match[1])
    .map((reference) => reference.slice(2).split(/[?#]/)[0])
    .filter(Boolean);
}

test("public booking landing template contains the approved program profile", async () => {
  const html = await readPublicFile("booking-landing-template.html");

  assert.match(html, /Choose an appointment type/);
  assert.match(html, /Shannon Oddo/);
  assert.match(html, /Cynthia Esparza/);
  assert.doesNotMatch(html, /Paige/);
  assert.match(html, /Our mission is simple: improve the health and wellness/);
  assert.match(html, /Nuestra misión es simple: mejorar la salud y el bienestar/);
  assert.match(html, /Reception A/);
  assert.match(html, /within 24 hours/);
  assert.match(html, /La confirmación de su cita incluye un enlace privado/);
  assert.match(html, /2435 NE Cumulus Ave, Suite A/);
  assert.match(html, /director@snackprogram\.org/);
  assert.match(html, /facebook\.com\/thesnackprogram/);
  assert.match(html, /instagram\.com\/thesnackprogram/);
});

test("public booking landing availability comes from scheduling settings", async () => {
  const script = await readPublicFile("booking-landing-template.js");

  assert.match(script, /\/api\/public\/booking-options/);
  assert.match(script, /scheduling\.weekdays/);
  assert.match(script, /scheduling\?\.startTime/);
  assert.match(script, /scheduling\?\.endTime/);
});

test("public booking landing template includes the approved photo assets and bios", async () => {
  const html = await readPublicFile("booking-landing-template.html");
  const styles = await readPublicFile("booking-landing-template.css");
  const script = await readPublicFile("booking-landing-template.js");

  assert.match(styles, /booking-hero\.png/);

  for (const asset of [
    "gallery-1.webp",
    "gallery-2.webp",
    "gallery-3.webp",
    "gallery-4.webp",
    "nutrition-workbook-cover.jpg",
    "shannon.jpeg",
    "cynthia.jpeg"
  ]) {
    assert.match(html, new RegExp(asset.replace(".", "\\.")));
  }

  assert.match(html, /id="shannon-bio"/);
  assert.match(html, /id="cynthia-bio"/);
  assert.match(script, /showModal\(\)/);
});

test("public booking scheduler connects the approved template to the booking API", async () => {
  const html = await readPublicFile("booking-template.html");
  const script = await readPublicFile("booking-template.js");

  assert.match(html, /id="public-booking-form"/);
  assert.match(html, /id="review-screen"/);
  assert.match(html, /id="confirmation-screen"/);
  assert.match(html, /id="management-screen"/);
  assert.match(html, /id="cancel-appointment"/);
  assert.match(html, /app-config\.js/);

  assert.match(script, /\/api\/public\/booking-options/);
  assert.match(script, /\/api\/public\/availability/);
  assert.match(script, /\/api\/public\/bookings/);
  assert.match(script, /\/cancel/);
  assert.match(script, /\/reschedule/);
  assert.match(script, /manageToken/);
  assert.doesNotMatch(script, /const\s+times\s*=/);
  assert.match(html, /YCCO Insurance\?/);
  assert.match(html, /insurance reimbursement for YCCO members/);
  assert.match(html, /Suite A<br>McMinnville, OR 97128/);
});

test("approved public booking pages are connected at their real launch URLs", async () => {
  const landingHtml = await readPublicFile("booking.html");
  const landingScript = await readPublicFile("booking.js");
  const schedulerHtml = await readPublicFile("book.html");
  const schedulerScript = await readPublicFile("book.js");

  assert.match(landingHtml, /booking\.css/);
  assert.match(landingHtml, /booking\.js/);
  assert.match(landingHtml, /book\.html\?service=enrollment/);
  assert.match(landingHtml, /book\.html\?service=nutrition-education/);
  assert.match(landingHtml, /book\.html\?service=spanish-enrollment/);
  assert.match(landingHtml, /book\.html\?service=spanish-nutrition-education/);
  assert.doesNotMatch(landingHtml, /booking-(?:landing-)?template/);
  assert.match(landingScript, /\/api\/public\/booking-options/);

  assert.match(schedulerHtml, /book\.css/);
  assert.match(schedulerHtml, /book\.js/);
  assert.match(schedulerHtml, /href="\.\/booking\.html"/);
  assert.match(schedulerScript, /\.\/booking\.html/);
  assert.match(schedulerScript, /\/api\/public\/bookings/);
  assert.match(schedulerScript, /\/cancel/);
  assert.match(schedulerScript, /\/reschedule/);
  assert.doesNotMatch(schedulerHtml, /booking-(?:landing-)?template/);
});

test("approved public booking pages have complete local links, images, and dialog labels", async () => {
  const landingHtml = await readPublicFile("booking.html");
  const schedulerHtml = await readPublicFile("book.html");

  for (const reference of new Set([...localReferences(landingHtml), ...localReferences(schedulerHtml)])) {
    await access(new URL(reference, publicDir));
  }

  for (const html of [landingHtml, schedulerHtml]) {
    const images = Array.from(html.matchAll(/<img\b[^>]*>/g), (match) => match[0]);
    assert.ok(images.length > 0);
    images.forEach((image) => assert.match(image, /\balt="[^"]*"/));
  }

  assert.match(landingHtml, /lang="es"/);
  assert.match(landingHtml, /La confirmación de su cita incluye un enlace privado/);
  assert.match(landingHtml, /<dialog[^>]+aria-labelledby="shannon-bio-title"/);
  assert.match(landingHtml, /<dialog[^>]+aria-labelledby="cynthia-bio-title"/);
  assert.match(schedulerHtml, /aria-live="polite"/);
  assert.match(schedulerHtml, /aria-label="Choose a date"/);
  assert.match(schedulerHtml, /aria-label="Choose an appointment time"/);
});

test("Spanish appointment choices carry Spanish preference into the scheduler", async () => {
  const landingHtml = await readPublicFile("booking.html");
  const schedulerScript = await readPublicFile("book.js");

  assert.match(landingHtml, /service=spanish-enrollment/);
  assert.match(landingHtml, /service=spanish-nutrition-education/);
  assert.match(schedulerScript, /preferredLanguageSelect\.value = activeService\.defaultLanguage/);
});

test("production booking verification is read-only", async () => {
  const script = await readFile(new URL("./qa-production-readonly.mjs", import.meta.url), "utf8");

  assert.match(script, /method: "GET"/);
  assert.doesNotMatch(script, /method: "(?:POST|PUT|PATCH|DELETE)"/);
  assert.doesNotMatch(script, /\/api\/public\/bookings(?:["`/])/);
});
