import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  mapOutreachContacts,
  mapOutreachEvents,
  mapOutreachTasks,
  outreachContactMatches,
  outreachContactPayload,
  outreachEventMatches,
  outreachEventPayload,
  outreachReport,
  outreachSummary,
  outreachTaskMatches,
  outreachTaskPayload
} from "../../frontend/public/modules/outreach.js";

const outreachHtml = await readFile(new URL("../../frontend/public/outreach.html", import.meta.url), "utf8");
const operationsHtml = await readFile(new URL("../../frontend/public/operations.html", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");

const events = [
  {
    id: "event-1",
    name: "Yamhill County Fair",
    type: "Community Event",
    status: "Planning",
    eventDate: "2026-08-01",
    location: "Yamhill County Fairgrounds",
    contactName: "Jordan Kim",
    contactRole: "Event Lead",
    costAmount: 1800,
    interactionsCount: 180,
    referralsCount: 8,
    interestListCount: 14,
    participantListCount: 62,
    registration: "Vendor portal",
    mainActivity: "Prize wheel"
  },
  {
    id: "event-2",
    name: "Family Resource Night",
    status: "Completed",
    eventDate: "2025-05-20",
    interactionsCount: 75,
    costAmount: 45
  }
];

const contacts = [
  {
    id: "contact-1",
    eventId: "event-1",
    contactName: "Maria Lopez",
    childName: "Sofia Lopez",
    phone: "971-555-0101",
    preferredLanguage: "Spanish",
    interestType: "Family Nutrition Appointment",
    status: "New",
    createdAt: "2026-08-01T20:00:00.000Z"
  }
];

const tasks = [
  {
    id: "task-1",
    title: "Confirm booth supplies",
    status: "Open",
    priority: "Urgent",
    dueDate: "2026-07-15",
    source: "Outreach",
    outreachEventId: "event-1",
    outreachEventName: "Yamhill County Fair"
  },
  {
    id: "task-2",
    title: "Unrelated admin task",
    status: "Open",
    source: "Manual"
  }
];

test("clean Outreach maps linked events, contacts, and tasks", () => {
  const eventItems = mapOutreachEvents(events, { contacts, tasks });
  const contactItems = mapOutreachContacts(contacts, events);
  const taskItems = mapOutreachTasks(tasks, events);

  assert.equal(eventItems[1].title, "Yamhill County Fair");
  assert.equal(eventItems[1].subtitle, "Aug 1, 2026 | Yamhill County Fairgrounds");
  assert.equal(eventItems[1].cost, "$1.8k");
  assert.equal(eventItems[1].contacts.length, 1);
  assert.equal(eventItems[1].tasks.length, 1);
  assert.equal(contactItems[0].event, "Yamhill County Fair");
  assert.deepEqual(taskItems.map((item) => item.title), ["Confirm booth supplies"]);
});

test("clean Outreach calculates the annual rulebook counters from real records", () => {
  assert.deepEqual(outreachSummary(events, contacts, 2026), [
    ["1", "Annual events"],
    ["180", "Families reached"],
    ["1", "New contacts"],
    ["$1.8k", "Event costs"]
  ]);

  assert.deepEqual(outreachReport(events, contacts, tasks, 2026), {
    year: 2026,
    events: 1,
    completedEvents: 0,
    interactions: 180,
    participants: 62,
    referrals: 8,
    interestList: 14,
    contacts: 1,
    openTasks: 1,
    cost: 1800
  });
});

test("clean Outreach payloads trim text and preserve linked records", () => {
  assert.deepEqual(outreachEventPayload({
    name: "  County Fair  ",
    status: " Planning ",
    interactionsCount: "18.4",
    costAmount: "24.567"
  }), {
    name: "County Fair",
    type: "",
    status: "Planning",
    eventDate: "",
    repeatPattern: "",
    location: "",
    contactName: "",
    contactRole: "",
    phone: "",
    email: "",
    deadline: "",
    registration: "",
    setup: "",
    mainActivity: "",
    giveaways: "",
    costNotes: "",
    notes: "",
    interactionsCount: 18,
    referralsCount: null,
    interestListCount: null,
    participantListCount: null,
    costAmount: 24.57
  });

  assert.equal(outreachContactPayload({ contactName: " Maria ", eventId: " event-1 " }).contactName, "Maria");
  assert.deepEqual(outreachTaskPayload({ title: " Follow up ", dueDate: "2026-08-04" }, events[0]), {
    title: "Follow up",
    type: "Task",
    status: "Open",
    priority: "Normal",
    dueDate: "2026-08-04",
    dueTime: "",
    assignedTo: "",
    outreachEventId: "event-1",
    outreachEventName: "Yamhill County Fair",
    source: "Outreach",
    notes: ""
  });
});

test("clean Outreach search covers event, contact, and task context", () => {
  const event = mapOutreachEvents(events)[1];
  const contact = mapOutreachContacts(contacts, events)[0];
  const task = mapOutreachTasks(tasks, events)[0];

  assert.equal(outreachEventMatches(event, "prize wheel"), true);
  assert.equal(outreachContactMatches(contact, "spanish"), true);
  assert.equal(outreachTaskMatches(task, "county fair"), true);
  assert.equal(outreachTaskMatches(task, "newsletter"), false);
});

test("clean Outreach page loads configuration before its interface code", () => {
  assert.match(outreachHtml, /<script src="\.\/app-config\.js[^"]*"><\/script>/);
  assert.match(outreachHtml, /<script type="module" src="\.\/clean\.js[^"]*"><\/script>/);
  assert.ok(outreachHtml.indexOf("app-config.js") < outreachHtml.indexOf("clean.js"));
  assert.match(cleanSource, /from "\.\/modules\/outreach\.js/);
  assert.match(cleanSource, /initializeOutreachData\(\)/);
});

test("clean Outreach navigation stays focused while Operations hosts its report", () => {
  const outreachConfig = cleanSource.slice(
    cleanSource.indexOf("  outreach: {"),
    cleanSource.indexOf("  fundraising: {")
  );
  const operationsConfig = cleanSource.slice(
    cleanSource.indexOf("  operations: {"),
    cleanSource.indexOf("  admin: {")
  );

  assert.match(outreachConfig, /subpages: \["Events", "Contacts"\]/);
  assert.match(outreachConfig, /views: \["Events", "Contacts"\]/);
  assert.doesNotMatch(outreachConfig, /subpages: \[[^\]]*"Tasks"/);
  assert.doesNotMatch(outreachConfig, /subpages: \[[^\]]*"Reports"/);
  assert.match(operationsConfig, /subpages: \[[^\]]*"Reports"\]/);
  assert.match(cleanSource, /function isOperationsOutreachReport\(\)/);
  assert.match(cleanSource, /\.\/operations\.html\?section=Reports/);
  assert.ok(operationsHtml.indexOf("app-config.js") < operationsHtml.indexOf("clean.js"));
});
