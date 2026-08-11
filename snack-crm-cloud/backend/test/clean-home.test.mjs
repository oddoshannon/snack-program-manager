import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  homeDashboardData,
  localDateKey
} from "../../frontend/public/modules/home.js";

const indexHtml = await readFile(new URL("../../frontend/public/index.html", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const cleanCss = await readFile(new URL("../../frontend/public/clean.css", import.meta.url), "utf8");

test("Home dashboard keeps daily work compact and correctly ordered", () => {
  const referenceDate = new Date(2026, 6, 29, 10, 0, 0);
  const dashboard = homeDashboardData({
    appointments: [
      { id: "later", appointmentDate: "2026-07-29", appointmentTime: "15:00", clientNames: ["Avery Rivera"], status: "Scheduled" },
      { id: "first", appointmentDate: "2026-07-29", appointmentTime: "13:30", clientNames: ["Remy Chen", "Sky Chen"], status: "Scheduled" },
      { id: "canceled", appointmentDate: "2026-07-29", appointmentTime: "14:00", status: "Canceled" },
      { id: "tomorrow", appointmentDate: "2026-07-30", appointmentTime: "13:00", status: "Scheduled" }
    ],
    tasks: [
      { id: "future", title: "Prepare forms", dueDate: "2026-08-01", status: "Open" },
      { id: "today", title: "Call family", dueDate: "2026-07-29", status: "Open" },
      { id: "overdue", title: "Confirm referral", dueDate: "2026-07-28", status: "In Progress" },
      { id: "done", title: "Finished", dueDate: "2026-07-27", status: "Done" }
    ],
    sessions: [
      { id: "kitchen", program: "Kitchen", title: "Kids Cooking", sessionDate: "2026-07-30", startTime: "13:00", status: "Scheduled" },
      { id: "school", program: "School", title: "School Class", sessionDate: "2026-07-31", startTime: "10:00", status: "Scheduled" }
    ],
    events: [
      { id: "event", name: "Community Fair", eventDate: "2026-08-01", status: "Planning" },
      { id: "far", name: "Later Event", eventDate: "2026-09-01", status: "Planning" }
    ]
  }, referenceDate);

  assert.equal(localDateKey(referenceDate), "2026-07-29");
  assert.deepEqual(dashboard.todayAppointments.map((item) => item.id), ["first", "later"]);
  assert.equal(dashboard.todayAppointments[0].title, "Remy Chen, Sky Chen");
  assert.deepEqual(dashboard.activeTasks.map((item) => item.id), ["overdue", "today", "future"]);
  assert.equal(dashboard.overdueTaskCount, 1);
  assert.equal(dashboard.dueTodayTaskCount, 1);
  assert.deepEqual(dashboard.upcoming.map((item) => item.id), ["kitchen", "school", "event"]);
});

test("the root page and logo route staff to a dedicated compact Home screen", () => {
  assert.match(indexHtml, /SNACK_MODULE_ID\s*=\s*"home"/);
  assert.match(indexHtml, /SNACK Program Hub Home/);
  assert.match(cleanSource, /href="\.\/index\.html"[^>]*aria-label="Home"/);
  assert.match(cleanSource, /data-home-dashboard/);
  assert.match(cleanSource, /todayAppointments\.slice\(0, 4\)/);
  assert.match(cleanSource, /activeTasks\.slice\(0, 4\)/);
  assert.match(cleanSource, /id="home-tasks"/);
  assert.match(cleanSource, /task\.referralId[\s\S]*task\.clientId[\s\S]*task\.appointmentId/);
  assert.doesNotMatch(cleanSource, /href="\.\/crm\.html\?section=Tasks"/);
  assert.match(cleanSource, /upcoming\.slice\(0, 4\)/);
  assert.match(cleanSource, /homeAuthedFetch\(user, "\/api\/tasks\/reconcile", \{ method: "POST" \}\)/);
  assert.match(cleanSource, /data-home-print-daily/);
  assert.match(cleanSource, /Print Daily Forms/);
  assert.match(cleanSource, /My Tasks \+ Shared/);
  assert.match(cleanSource, /data-home-task-filter/);
  assert.match(cleanSource, /data-home-new-task/);
  assert.match(cleanSource, /\/api\/staff-directory/);
  assert.match(cleanSource, /\["crm", "home"\]\.includes\(moduleId\) \? renderCrmTaskDialog\(\)/);
  assert.match(cleanSource, /homeAppointments\.map\(\(appointment\) => mapAppointment\(appointment, clientsById\)\)/);
  assert.match(cleanSource, /dailyFormPacketRequests/);
  assert.match(cleanSource, /dailyFormsPrintDocumentHtml/);
  assert.match(cleanCss, /\.home-dashboard/);
  assert.match(cleanCss, /\.home-primary-grid/);
  assert.match(cleanCss, /\.home-panel-actions/);
  assert.match(cleanCss, /\.home-task-filter/);
});

test("embedded native packets announce when they are ready for the combined daily print window", async () => {
  const clientFormSource = await readFile(new URL("../../frontend/public/client-form.js", import.meta.url), "utf8");

  assert.match(clientFormSource, /params\.get\("embed"\) === "1"/);
  assert.match(clientFormSource, /dataset\.packetReady = "true"/);
  assert.match(clientFormSource, /dataset\.packetError/);
  assert.match(cleanSource, /window\.open\("\.\/print-shell\.html", "_blank"\)/);
});
