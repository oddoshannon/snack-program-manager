import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  appointmentActivityItems,
  appointmentEditPayload,
  appointmentLessonAccent,
  appointmentLessonNumber,
  appointmentNotePayload,
  appointmentStatusPayload,
  blockTimeDurationMinutes,
  blockTimeEndOptions,
  blockTimePayload,
  cleanAppointmentType,
  completedAppointmentPayload,
  completedLessonForNextAppointment,
  defaultNextAppointmentDate,
  existingNextAppointment,
  formatAppointmentDate,
  formatScheduleWeekRange,
  formatScheduleTime,
  mapAppointment,
  newAppointmentPayload,
  nextAppointmentLessonNumber,
  nextAppointmentPayload,
  normalizeAppointmentStatus,
  offsetScheduleDate,
  prepForAppointment,
  rescheduleAppointmentPayloads,
  scheduleClientOutcomeUpdates,
  scheduleTimeMinutes,
  scheduleTimeOptions,
  scheduleWeekDates
} from "../../frontend/public/modules/schedule.js";
import {
  appointmentNotePage,
  appointmentNoteType,
  appointmentPrepGroups,
  appointmentPrepPage,
  dailyAppointmentNotePages,
  dailyFormPacketRequests,
  dailyFormsPrintDocumentHtml,
  dailyPrepPages,
  dailyPrintPacketPages,
  dailySchedulePages,
  lessonRetentionPrompts,
  noteRetentionForAppointment,
  printableScheduleItems,
  printDocumentHtml,
  selectedPrintDocumentHtml
} from "../../frontend/public/modules/schedule-print.js";
import { appointmentCompletionValidationError } from "../routes/appointments.js";

const printClients = new Map([
  ["milo", {
    id: "milo",
    firstName: "Milo",
    lastName: "Exampleton Garcia",
    parentName: "Jordan Exampleton",
    preferredLanguage: "Spanish",
    dateOfBirth: "2013-08-14"
  }],
  ["tessa", {
    id: "tessa",
    firstName: "Tessa",
    lastName: "Exampleton Garcia",
    parentName: "Jordan Exampleton",
    preferredLanguage: "Spanish",
    dateOfBirth: "2017-03-02"
  }]
]);

function printAppointment(overrides = {}) {
  return {
    id: "appointment-1",
    date: "2026-07-15",
    time: "14:30",
    duration: 30,
    status: "Scheduled",
    type: "Nutrition Education",
    lesson: "Nutrient Density",
    goal: "Try one new vegetable",
    staff: "Cynthia Esparza",
    clientIds: ["milo", "tessa"],
    clientNames: ["Milo Exampleton Garcia", "Tessa Exampleton Garcia"],
    ...overrides
  };
}

test("schedule date and time helpers preserve the clinic day positions", () => {
  assert.equal(offsetScheduleDate("2026-07-07", -1), "2026-07-06");
  assert.equal(offsetScheduleDate("2026-07-07", 1), "2026-07-08");
  assert.equal(scheduleTimeMinutes("14:30"), 870);
  assert.equal(formatScheduleTime(870), "2:30 PM");
  assert.equal(formatAppointmentDate("2026-07-15"), "Wed, July 15, 2026");
});

test("week view follows the configured clinic weekdays", () => {
  const dates = scheduleWeekDates("2026-07-15", [2, 3, 4]);

  assert.deepEqual(dates, ["2026-07-14", "2026-07-15", "2026-07-16"]);
  assert.equal(formatScheduleWeekRange(dates), "Jul 14 - 16, 2026");
});

test("appointment labels omit the word Appointment", () => {
  assert.equal(cleanAppointmentType("Enrollment Appointment"), "Enrollment");
  assert.equal(cleanAppointmentType("Nutrition Education Appointment"), "Nutrition Education");
  assert.equal(cleanAppointmentType("Cita de inscripción en español"), "Cita de inscripción en español");
});

test("new appointment times follow the adjustable scheduling settings", () => {
  const times = scheduleTimeOptions({
    bookableStartTime: "13:30",
    bookableEndTime: "18:00",
    slotIntervalMinutes: 15
  }, 30);

  assert.equal(times[0], "13:30");
  assert.equal(times.at(-1), "17:30");
  assert.equal(times.length, 17);
});

test("the print center stays accessible without returning it to schedule navigation", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /subpages: \["Clinic", "Kitchen", "School", "Public Booking"\]/);
  assert.match(cleanSource, /quickActions: \["New Appointment", "Block Time", "Print Forms"\]/);
  assert.match(cleanSource, /data-open-schedule-print-center/);
  assert.match(cleanSource, /setScheduleSubpage\(module, "Print Forms"\)/);
  assert.match(cleanSource, /Choose What to Print/);
  assert.match(cleanSource, /data-schedule-print-selection/);
  assert.match(cleanSource, /data-schedule-print-selected/);
  assert.match(cleanSource, /dailyFormsPrintDocumentHtml/);
  assert.match(cleanSource, /data-new-appointment-duration/);
});

test("new appointment action retries a failed schedule load", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /async function openNewAppointmentPanel\(preselectedClientIds = \[\], selectedTime = ""\)/);
  assert.match(cleanSource, /if \(scheduleDataState === "error"\) \{[\s\S]*await loadScheduleData\(scheduleCurrentUser\);/);
  assert.match(cleanSource, /Appointments could not be loaded\. Click New Appointment to try again\./);
});

test("clicking an open Day calendar time starts a new appointment at that time", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );
  const cleanCss = readFileSync(
    new URL("../../frontend/public/clean.css", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /data-schedule-new-time="\$\{escapeHtml\(time\)\}"/);
  assert.match(cleanSource, /openNewAppointmentPanel\(\[\], scheduleOpenSlot\.dataset\.scheduleNewTime\)/);
  assert.match(cleanSource, /renderNewAppointmentTimeOptions\(selectedTime\)/);
  assert.match(cleanCss, /\.schedule-open-slot/);
});

test("blocked time uses the selected date, time, and staff without a client", () => {
  assert.deepEqual(blockTimePayload({
    appointmentDate: "2026-07-22",
    appointmentTime: "2:15 PM",
    endTime: "3:45 PM",
    staffMember: "Cynthia Esparza",
    notes: "Team meeting"
  }), {
    clientId: "",
    clientIds: [],
    clientName: "Blocked Time",
    clientNames: ["Blocked Time"],
    appointmentDate: "2026-07-22",
    appointmentTime: "14:15",
    appointmentType: "Administrative",
    durationMinutes: 90,
    status: "Blocked",
    lesson: "",
    goal: "",
    staffMember: "Cynthia Esparza",
    notes: "Team meeting"
  });
});

test("blocked time end choices follow the scheduling window", () => {
  const options = blockTimeEndOptions("17:15", {
    bookableEndTime: "18:00",
    slotIntervalMinutes: 15
  });

  assert.deepEqual(options, ["17:30", "17:45", "18:00"]);
  assert.equal(blockTimeDurationMinutes("2:00 PM", "3:30 PM"), 90);
  assert.equal(blockTimeDurationMinutes("3:00 PM", "2:30 PM"), 0);
});

test("new appointments use existing client records and preserve the selected service", () => {
  const payload = newAppointmentPayload({
    serviceId: "spanish-nutrition-education",
    appointmentDate: "2026-07-21",
    appointmentTime: "3:30 PM",
    lesson: "Sugar",
    goal: "Compare drinks",
    durationMinutes: "60",
    status: "Completed",
    staffMember: "Cynthia Esparza",
    notes: "Sibling appointment"
  }, [
    { id: "milo", firstName: "Milo", lastName: "Exampleton García" },
    { id: "tessa", firstName: "Tessa", lastName: "Exampleton García" }
  ]);

  assert.deepEqual(payload.clientIds, ["milo", "tessa"]);
  assert.deepEqual(payload.clientNames, ["Milo Exampleton García", "Tessa Exampleton García"]);
  assert.equal(payload.appointmentType, "Nutrition Education");
  assert.equal(payload.publicBookingServiceId, "spanish-nutrition-education");
  assert.equal(payload.publicBookingServiceLabel, "Cita de educación nutricional en español");
  assert.equal(payload.appointmentTime, "15:30");
  assert.equal(payload.durationMinutes, 60);
  assert.equal(payload.status, "Completed");
});

test("schedule uses its limited client and settings endpoints", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );
  const routeSource = readFileSync(
    new URL("../routes/appointments.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /\/api\/schedule\/clients/);
  assert.match(cleanSource, /\/api\/schedule\/settings/);
  assert.match(cleanSource, /\/api\/schedule\/clients\/\$\{encodeURIComponent\(clientId\)\}\/outcome/);
  assert.match(routeSource, /router\.get\("\/api\/schedule\/clients"/);
  assert.match(routeSource, /router\.patch\("\/api\/schedule\/clients\/:clientId\/outcome"/);
});

test("new appointments use the schedule detail panel instead of a popup", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /data-new-appointment-side/);
  assert.match(cleanSource, /data-new-appointment-main/);
  assert.doesNotMatch(cleanSource, /data-new-appointment-dialog/);
});

test("schedule detail tabs rearrange instead of overlapping in a narrow detail panel", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );
  const cleanCss = readFileSync(
    new URL("../../frontend/public/clean.css", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /moduleId === "schedule" \? `data-compact-label=/);
  assert.match(cleanCss, /@container \(max-width: 420px\) \{[\s\S]*?data-module-id="schedule"\] \.tabs\.has-icons \{[\s\S]*?grid-template-columns: repeat\(3/);
  assert.match(cleanCss, /@container \(max-width: 270px\) \{[\s\S]*?data-module-id="schedule"\] \.tabs\.has-icons \{[\s\S]*?grid-template-columns: repeat\(2/);
});

test("blocked time uses the schedule detail panel instead of a popup", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /data-block-time-side/);
  assert.match(cleanSource, /data-block-time-main/);
  assert.doesNotMatch(cleanSource, /data-block-time-dialog/);
});

test("blocked time supports editing and a two-step delete confirmation", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /data-edit-block-time/);
  assert.match(cleanSource, /data-delete-block-time/);
  assert.match(cleanSource, /Confirm Delete/);
  assert.match(cleanSource, /method: blockTimeEditingId \? "PATCH" : "POST"/);
  assert.match(cleanSource, /method: "DELETE"/);
  assert.doesNotMatch(cleanSource, /window\.confirm/);
});

test("appointment statuses use the clean schedule labels", () => {
  assert.equal(normalizeAppointmentStatus("Complete"), "Completed");
  assert.equal(normalizeAppointmentStatus("No Show"), "No-show");
  assert.equal(normalizeAppointmentStatus("Needs Reschedule"), "Rescheduled");
  assert.equal(normalizeAppointmentStatus("Cancelled"), "Canceled");
});

test("appointment colors follow lessons instead of appointment status", () => {
  const scheduledSugar = appointmentLessonAccent({
    appointmentType: "Nutrition Education",
    lesson: "Sugar",
    status: "Scheduled"
  });
  const missedSugar = appointmentLessonAccent({
    appointmentType: "Nutrition Education",
    lesson: "2",
    status: "No-show"
  });

  assert.equal(appointmentLessonNumber("Lesson 5"), 5);
  assert.equal(appointmentLessonNumber("Micronutrients"), 5);
  assert.equal(scheduledSugar, missedSugar);
  assert.notEqual(scheduledSugar, appointmentLessonAccent({
    appointmentType: "Nutrition Education",
    lesson: "Nutrient Density",
    status: "Scheduled"
  }));
  assert.equal(
    appointmentLessonAccent({ appointmentType: "Enrollment", status: "Completed" }),
    "#667085"
  );
});

test("enrollment prep uses the approved full forms and supplies wording", () => {
  assert.deepEqual(prepForAppointment("Enrollment"), {
    forms: [
      { key: "formsAtReception", text: "Place forms at reception before the appointment." },
      { key: "enrollmentForm", text: "Enrollment form (file cabinet); siblings can share one form." },
      { key: "questionnaire", text: "Questionnaire for each child (file cabinet); each child needs their own." },
      { key: "markPre", text: "Write client name in the top right corner, initial code on the back, and circle PRE." }
    ],
    supplies: [
      { key: "sticker", text: "SNACK sticker." },
      { key: "penPencil", text: "SNACK pen or pencil." }
    ]
  });
});

test("nutrition education prep uses the prize and food snack checklist", () => {
  assert.deepEqual(prepForAppointment("Nutrition Education"), {
    forms: [{ key: "prize", text: "Prize from the bin." }],
    supplies: [{ key: "foodSnack", text: "Food snack." }]
  });
});

test("multi-client appointments map into the approved schedule details", () => {
  const clientsById = new Map([
    ["milo", {
      firstName: "Milo",
      lastName: "Exampleton García",
      parentName: "Jordan",
      preferredLanguage: "Spanish",
      phone: "9714472646"
    }],
    ["tessa", {
      firstName: "Tessa",
      lastName: "Exampleton García",
      parentName: "Jordan",
      preferredLanguage: "Spanish",
      phone: "9714472646"
    }]
  ]);

  const mapped = mapAppointment({
    id: "appointment-1",
    clientIds: ["milo", "tessa"],
    appointmentDate: "2026-07-07",
    appointmentTime: "2:30 PM",
    appointmentType: "Enrollment Appointment",
    durationMinutes: 30,
    status: "Complete",
    staffMember: "Cynthia Esparza",
    notes: "Legacy appointment note",
    prepChecklist: { enrollmentForm: true }
  }, clientsById);

  assert.equal(mapped.title, "Milo & Tessa");
  assert.equal(mapped.subtitle, "Enrollment");
  assert.equal(mapped.status, "Completed");
  assert.equal(mapped.date, "2026-07-07");
  assert.equal(mapped.time, "14:30");
  assert.equal(mapped.endTime, "15:00");
  assert.equal(mapped.duration, 30);
  assert.equal(mapped.compact, false);
  assert.equal(mapped.caregiver, "Jordan");
  assert.equal(mapped.siblings, "Milo, Tessa");
  assert.equal(mapped.language, "Spanish");
  assert.equal(mapped.phone, "(971) 447-2646");
  assert.equal(mapped.staff, "Cynthia Esparza");
  assert.equal(mapped.notes, "-");
  assert.equal(mapped.appointmentNote, "Legacy appointment note");
  assert.deepEqual(mapped.clientIds, ["milo", "tessa"]);
  assert.deepEqual(mapped.prepChecklist, { enrollmentForm: true });
  assert.equal(mapped.forms.length, 4);
  assert.equal(mapped.supplies.length, 2);
});

test("current appointments keep Details notes separate from the appointment note", () => {
  const mapped = mapAppointment({
    id: "appointment-notes",
    clientNames: ["Milo Exampleton"],
    appointmentDate: "2026-07-15",
    appointmentTime: "14:30",
    appointmentType: "Nutrition Education",
    status: "Completed",
    notes: "Bring workbook",
    appointmentNote: "Discussed nutrient density."
  }, new Map());

  assert.equal(mapped.notes, "Bring workbook");
  assert.equal(mapped.appointmentNote, "Discussed nutrient density.");
});

test("15-minute appointments use the compact Day card", () => {
  const mapped = mapAppointment({
    id: "appointment-15",
    clientNames: ["Aaliya Martinez"],
    appointmentDate: "2026-06-24",
    appointmentTime: "15:15",
    appointmentType: "Nutrition Education",
    durationMinutes: 15,
    lesson: "2",
    status: "Scheduled"
  }, new Map());

  assert.equal(mapped.compact, true);
  assert.equal(mapped.accent, appointmentLessonAccent(mapped.source));
});

test("blocked slots keep the full Blocked Time card title", () => {
  const mapped = mapAppointment({
    id: "blocked-1",
    clientNames: ["Blocked Time"],
    appointmentDate: "2026-07-15",
    appointmentTime: "13:30",
    appointmentType: "Administrative",
    durationMinutes: 30,
    status: "Blocked",
    staffMember: "Cynthia Esparza"
  }, new Map());

  assert.equal(mapped.title, "Blocked Time");
  assert.equal(mapped.status, "Blocked");
  assert.equal(mapped.subtitle, "Administrative");
});

test("appointment outcomes preserve the complete appointment data", () => {
  const item = {
    id: "appointment-1",
    clientIds: ["milo", "tessa"],
    clientNames: ["Milo Exampleton", "Tessa Exampleton"],
    staff: "Cynthia Esparza",
    notes: "Bring workbook",
    source: {
      id: "appointment-1",
      appointmentDate: "2026-07-07",
      appointmentTime: "14:30",
      appointmentType: "Enrollment",
      durationMinutes: 30,
      status: "Scheduled"
    }
  };

  const completed = appointmentStatusPayload(item, "Completed");
  assert.equal(completed.status, "Completed");
  assert.deepEqual(completed.clientIds, ["milo", "tessa"]);
  assert.equal(completed.appointmentDate, "2026-07-07");

  const { original, replacement } = rescheduleAppointmentPayloads(item, {
    appointmentDate: "2026-07-14",
    appointmentTime: "3:30 PM",
    staffMember: "Shannon Oddo",
    notes: "Updated note"
  });
  assert.equal(original.status, "Rescheduled");
  assert.equal(original.appointmentDate, "2026-07-07");
  assert.equal(replacement.status, "Scheduled");
  assert.equal(replacement.appointmentDate, "2026-07-14");
  assert.equal(replacement.appointmentTime, "15:30");
  assert.equal(replacement.staffMember, "Shannon Oddo");
  assert.equal(replacement.notes, "Updated note");
});

test("wrap up advances enrollment and nutrition lessons in order", () => {
  assert.equal(nextAppointmentLessonNumber({ type: "Enrollment" }), 1);
  assert.equal(nextAppointmentLessonNumber({ type: "Nutrition Education", lesson: "Sugar" }), 3);
  assert.equal(nextAppointmentLessonNumber({ type: "Nutrition Education", lesson: "Healthy Habits" }), null);
  assert.equal(defaultNextAppointmentDate({ date: "2026-07-15" }), "2026-07-22");
});

test("wrap up reuses the earliest scheduled appointment for the exact same clients", () => {
  const current = {
    id: "appointment-current",
    date: "2026-08-20",
    time: "13:30",
    status: "Scheduled",
    clientIds: ["client-1"]
  };
  const next = {
    id: "appointment-next",
    date: "2026-09-03",
    time: "15:00",
    status: "Scheduled",
    clientIds: ["client-1"]
  };

  assert.equal(existingNextAppointment(current, [
    current,
    { id: "different-family", date: "2026-08-21", time: "10:00", status: "Scheduled", clientIds: ["client-2"] },
    { id: "canceled", date: "2026-08-22", time: "10:00", status: "Canceled", clientIds: ["client-1"] },
    next,
    { id: "later", date: "2026-09-10", time: "15:00", status: "Scheduled", clientIds: ["client-1"] }
  ])?.id, "appointment-next");
  assert.equal(existingNextAppointment(current, [
    { id: "sibling-combination", date: "2026-08-21", time: "10:00", status: "Scheduled", clientIds: ["client-1", "client-2"] }
  ]), null);
});

test("completing the final Healthy Habits appointment graduates the client", () => {
  const finalLesson = scheduleClientOutcomeUpdates({
    type: "Nutrition Education",
    lesson: "Healthy Habits",
    date: "2026-07-20"
  }, "Completed", { hasFutureAppointment: false });
  const earlierLesson = scheduleClientOutcomeUpdates({
    type: "Nutrition Education",
    lesson: "Mindful Eating",
    date: "2026-07-13"
  }, "Completed", { hasFutureAppointment: true });

  assert.deepEqual(finalLesson, {
    status: "Graduated",
    mostRecentAppointmentDate: "2026-07-20",
    graduationDate: "2026-07-20"
  });
  assert.deepEqual(earlierLesson, {
    status: "Active",
    mostRecentAppointmentDate: "2026-07-13"
  });
});

test("a changed next lesson advances the client through the prior lesson", () => {
  assert.equal(completedLessonForNextAppointment("1"), "enrollment");
  assert.equal(completedLessonForNextAppointment("3"), "lesson-2");
  assert.equal(completedLessonForNextAppointment("Healthy Habits"), "lesson-6");
  assert.equal(completedLessonForNextAppointment(""), "");

  assert.deepEqual(scheduleClientOutcomeUpdates({
    type: "Nutrition Education",
    lesson: "3"
  }, "Scheduled", { currentLesson: "lesson-2" }), {
    status: "Active",
    currentLesson: "lesson-2"
  });
});

test("completion preserves sibling engagement saved from the appointment note", () => {
  const item = {
    id: "appointment-1",
    type: "Enrollment",
    date: "2026-07-15",
    time: "14:30",
    staff: "Cynthia Esparza",
    language: "Spanish",
    clientIds: ["milo", "tessa"],
    clientNames: ["Milo Exampleton", "Tessa Exampleton"],
    source: {
      id: "appointment-1",
      appointmentDate: "2026-07-15",
      appointmentTime: "14:30",
      appointmentType: "Enrollment",
      status: "Scheduled",
      publicBookingServiceId: "spanish-enrollment"
    }
  };

  const completed = completedAppointmentPayload(item, {
    appointmentNote: "Enrollment complete",
    caregiverMood: "Good",
    confidence: "High",
    participation: "Engaged",
    barriers: "None",
    participantGoals: [
      { clientId: "milo", clientName: "Milo Exampleton", goal: "Try one new vegetable", goalResult: "Achieved" },
      { clientId: "tessa", clientName: "Tessa Exampleton", goal: "Drink water with dinner", goalResult: "Partly Achieved" }
    ]
  });
  const next = nextAppointmentPayload(item, {
    lesson: "3",
    appointmentDate: "2026-07-22",
    appointmentTime: "3:30 PM",
    staffMember: "Cynthia Esparza",
    participantGoals: [
      { clientId: "milo", clientName: "Milo Exampleton", goal: "Try one new vegetable" },
      { clientId: "tessa", clientName: "Tessa Exampleton", goal: "Drink water with dinner" }
    ],
    notes: "Bring workbook"
  });

  assert.equal(completed.status, "Completed");
  assert.equal(completed.appointmentNote, "Enrollment complete");
  assert.equal(completed.participation, "Engaged");
  assert.equal(completed.goalResult, "Achieved");
  assert.equal(completed.participantGoals[1].goalResult, "Partly Achieved");
  assert.deepEqual(completed.clientIds, ["milo", "tessa"]);

  assert.equal(next.appointmentType, "Nutrition Education");
  assert.equal(next.publicBookingServiceId, "spanish-nutrition-education");
  assert.equal(next.publicBookingServiceLabel, "Cita de educación nutricional en español");
  assert.equal(next.lesson, "3");
  assert.equal(next.appointmentTime, "15:30");
  assert.deepEqual(next.clientIds, ["milo", "tessa"]);
  assert.deepEqual(next.clientNames, ["Milo Exampleton", "Tessa Exampleton"]);
  assert.deepEqual(next.participantGoals.map((entry) => entry.goal), ["Try one new vegetable", "Drink water with dinner"]);
});

test("completion reuses engagement already saved on the appointment", () => {
  const completed = completedAppointmentPayload({
    id: "appointment-1",
    status: "Scheduled",
    clientIds: ["milo"],
    clientNames: ["Milo Exampleton"],
    source: {
      appointmentDate: "2026-07-15",
      appointmentTime: "14:30",
      appointmentType: "Nutrition Education",
      status: "Scheduled",
      appointmentNote: "Reviewed the family plan.",
      participantGoals: [{
        clientId: "milo",
        clientName: "Milo Exampleton",
        goal: "Try one new vegetable",
        goalResult: "Partly Achieved"
      }],
      caregiverMood: "Okay",
      confidence: "Medium",
      participation: "Somewhat Engaged",
      barriers: "Schedule"
    }
  });

  assert.equal(completed.appointmentNote, "Reviewed the family plan.");
  assert.equal(completed.goalResult, "Partly Achieved");
  assert.equal(completed.caregiverMood, "Okay");
  assert.equal(completed.confidence, "Medium");
  assert.equal(completed.participation, "Somewhat Engaged");
  assert.equal(completed.barriers, "Schedule");
  assert.deepEqual(completed.participantGoals, [{
    clientId: "milo",
    clientName: "Milo Exampleton",
    goal: "Try one new vegetable",
    goalResult: "Partly Achieved"
  }]);
});

test("appointment completion requires one goal result per child", () => {
  const siblingAppointment = {
    appointmentNote: "Completed appointment note.",
    clientIds: ["milo", "tessa"],
    clientNames: ["Milo Exampleton", "Tessa Exampleton"],
    participantGoals: [
      { clientId: "milo", clientName: "Milo Exampleton", goalResult: "Achieved" }
    ]
  };

  assert.match(appointmentCompletionValidationError(siblingAppointment), /Tessa Exampleton/);
  assert.equal(appointmentCompletionValidationError({
    ...siblingAppointment,
    participantGoals: [
      ...siblingAppointment.participantGoals,
      { clientId: "tessa", clientName: "Tessa Exampleton", goalResult: "Not Assessed" }
    ]
  }), "");
  assert.equal(appointmentCompletionValidationError({
    appointmentNote: "Completed appointment note.",
    clientIds: ["milo"],
    clientNames: ["Milo Exampleton"],
    goalResult: "Achieved"
  }), "");
  assert.match(appointmentCompletionValidationError({
    ...siblingAppointment,
    appointmentNote: ""
  }), /appointment note/i);
});

test("Appointment Note completes the visit and Wrap Up only schedules the next visit", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /data-schedule-detail-panel="wrap-up"/);
  assert.match(cleanSource, /data-schedule-wrap-up-form/);
  assert.match(cleanSource, /scheduleParticipantGoalsFromForm\(formData, "nextParticipant"\)/);
  assert.match(cleanSource, /setScheduleDetailTab\(module, "appt-note"\)/);
  assert.match(cleanSource, /Complete Appt/);
  assert.match(cleanSource, /Schedule Next Appt/);
  assert.match(cleanSource, /data-schedule-wrap-up-next>Next: Appt Note/);
  assert.match(cleanSource, /event\.target\.closest\("\[data-schedule-wrap-up-next\]"\)/);
  assert.match(cleanSource, /name="nextAppointmentLesson" required/);
  assert.match(cleanSource, /completedLessonForNextAppointment\(nextPayload\.lesson\)/);
  assert.match(cleanSource, /appointmentNote" rows="8"[^>]*required/);
  assert.match(cleanSource, /completedAppointmentPayload\(item, values\)/);
  assert.match(cleanSource, /updateScheduleClients\(module, item, "Completed"\)/);
  assert.match(cleanSource, /nextAppointmentPayload\(item, nextValues\)/);
  assert.match(cleanSource, /existingNextAppointment\(item, appointments\)/);
  assert.match(cleanSource, /method: existingAppointmentId \? "PATCH" : "POST"/);
  assert.match(cleanSource, /setScheduleAppointmentNoteStatus\(`\$\{existingAppointmentId \? "Next appointment updated" : "Next appointment scheduled"\}/);
  const wrapUpSource = cleanSource.slice(
    cleanSource.indexOf("async function saveScheduleWrapUp"),
    cleanSource.indexOf("async function saveScheduleAppointmentNote")
  );
  assert.doesNotMatch(wrapUpSource, /completedAppointmentPayload/);
  assert.doesNotMatch(wrapUpSource, /status.*Completed/);
});

test("appointment notes save separately from scheduling notes", () => {
  const item = {
    id: "appointment-1",
    status: "Scheduled",
    clientIds: ["milo", "tessa"],
    clientNames: ["Milo Exampleton", "Tessa Exampleton"],
    source: {
      appointmentDate: "2026-07-15",
      appointmentTime: "14:30",
      appointmentType: "Nutrition Education",
      durationMinutes: 30,
      status: "Scheduled",
      notes: "Bring workbook"
    }
  };

  const payload = appointmentNotePayload(item, "Discussed nutrient density and practiced bingo.");

  assert.equal(payload.notes, "Bring workbook");
  assert.equal(payload.appointmentNote, "Discussed nutrient density and practiced bingo.");
  assert.deepEqual(payload.clientIds, ["milo", "tessa"]);

  const engagementPayload = appointmentNotePayload(item, {
    appointmentNote: "Family called before the visit.",
    participantGoals: [
      { clientId: "milo", clientName: "Milo Exampleton", goal: "Try fruit", goalResult: "Achieved" },
      { clientId: "tessa", clientName: "Tessa Exampleton", goal: "Drink water", goalResult: "Not Assessed" }
    ],
    interpreterUse: "Yes",
    caregiverMood: "Concerned",
    confidence: "Low",
    participation: "Not Engaged",
    barriers: "Transportation"
  });

  assert.equal(engagementPayload.status, "Scheduled");
  assert.equal(engagementPayload.appointmentNote, "Family called before the visit.");
  assert.equal(engagementPayload.interpreterUse, "Yes");
  assert.equal(engagementPayload.caregiverMood, "Concerned");
  assert.equal(engagementPayload.confidence, "Low");
  assert.equal(engagementPayload.participation, "Not Engaged");
  assert.equal(engagementPayload.barriers, "Transportation");
  assert.deepEqual(engagementPayload.participantGoals, [
    { clientId: "milo", clientName: "Milo Exampleton", goal: "Try fruit", goalResult: "Achieved" },
    { clientId: "tessa", clientName: "Tessa Exampleton", goal: "Drink water", goalResult: "Not Assessed" }
  ]);

  const legacyItem = {
    ...item,
    status: "Completed",
    appointmentNote: "Legacy visit note",
    source: {
      ...item.source,
      status: "Completed",
      notes: "Legacy visit note"
    }
  };
  const migrated = appointmentNotePayload(legacyItem, "Updated visit note");

  assert.equal(migrated.notes, "");
  assert.equal(migrated.appointmentNote, "Updated visit note");
});

test("clean schedule renders Details and Appointment Note as separate tabs", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /detailTabs: \["Details", "Wrap Up", "Appt Note", "Activity", "Forms"\]/);
  assert.match(cleanSource, /data-schedule-detail-panel="details"/);
  assert.match(cleanSource, /data-schedule-appointment-note-form/);
  const wrapUpSource = cleanSource.slice(
    cleanSource.indexOf("function renderScheduleWrapUp"),
    cleanSource.indexOf("function renderScheduleAppointmentNote")
  );
  const appointmentNoteSource = cleanSource.slice(
    cleanSource.indexOf("function renderScheduleAppointmentNote"),
    cleanSource.indexOf("function formatScheduleActivityDate")
  );
  assert.doesNotMatch(wrapUpSource, /<h3>Engagement<\/h3>/);
  assert.match(appointmentNoteSource, /<h3>Engagement<\/h3>/);
  assert.match(appointmentNoteSource, /renderScheduleParticipantGoals\(item, "participant", \{ includeResult: true \}\)/);
  assert.match(cleanSource, /scheduleParticipantGoalsFromForm\(formData, "participant"\)/);
  assert.match(appointmentNoteSource, /Complete Appt/);
  assert.match(cleanSource, /saveScheduleAppointmentNote\(module, event\.target\)/);
  assert.match(cleanSource, /Appointment completed\./);
});

test("appointment Activity combines client contact history with appointment history", () => {
  const items = appointmentActivityItems({
    id: "appointment-1",
    status: "Completed",
    date: "2026-08-12",
    time: "14:00",
    type: "Enrollment",
    lesson: "Enrollment",
    staff: "Cynthia Esparza",
    clientIds: ["milo", "tessa"],
    source: {
      appointmentDate: "2026-08-12",
      appointmentTime: "14:00",
      status: "Completed",
      createdAt: "2026-08-01T18:00:00.000Z",
      updatedAt: "2026-08-12T22:30:00.000Z"
    }
  }, [
    {
      relatedType: "client",
      relatedId: "milo",
      title: "Outbound call to Jordan",
      result: "Reached",
      description: "Confirmed appointment",
      activityDate: "2026-08-11",
      activityTime: "10:30",
      occurredAt: "2026-08-11T10:30:00.000Z"
    },
    {
      relatedType: "client",
      relatedId: "another-client",
      title: "Unrelated call",
      activityDate: "2026-08-13",
      occurredAt: "2026-08-13T10:30:00.000Z"
    }
  ]);

  assert.deepEqual(items.map((item) => item.title), [
    "Last updated",
    "Completed",
    "Outbound call to Jordan",
    "Appointment created"
  ]);
  assert.equal(items[1].detail, "Enrollment | Cynthia Esparza");
  assert.equal(items[2].detail, "Reached | Confirmed appointment");
  assert.equal(items.some((item) => item.title === "Unrelated call"), false);
});

test("clean schedule loads and renders the Activity tab", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /fetch\(`\$\{apiBaseUrl\}\/api\/schedule\/activity-logs`/);
  assert.match(cleanSource, /appointmentActivityItems\(item, scheduleActivityLogs\)/);
  assert.match(cleanSource, /data-schedule-detail-panel='activity'/);
  assert.match(cleanSource, /schedule-activity-list/);
});

test("appointment Forms link the native forms to the selected appointment", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );
  const cleanCss = readFileSync(
    new URL("../../frontend/public/clean.css", import.meta.url),
    "utf8"
  );
  assert.match(cleanSource, /Appointment Forms/);
  assert.match(cleanSource, /appointmentId: item\.id/);
  assert.match(cleanSource, /Program Enrollment/);
  assert.match(cleanSource, /Caregiver Feedback/);
  assert.match(cleanSource, /api\/evaluation-instruments\?status=Active/);
  assert.match(cleanSource, /data-appointment-third-icon>\$\{icons\.check\}/);
  assert.match(cleanSource, /schedule-appointment-form-clients/);
  assert.match(cleanCss, /\.schedule-appointment-forms-card \{\s*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(cleanCss, /\.schedule-appointment-form-clients \{[\s\S]*display: grid;[\s\S]*gap: 18px;/);
});

test("appointment edits preserve identifying data and update editable details", () => {
  const item = {
    id: "appointment-1",
    type: "Nutrition Education",
    staff: "Cynthia Esparza",
    notes: "Original note",
    clientIds: ["milo", "tessa"],
    clientNames: ["Milo Exampleton", "Tessa Exampleton"],
    source: {
      id: "appointment-1",
      appointmentDate: "2026-07-15",
      appointmentTime: "14:30",
      appointmentType: "Nutrition Education",
      durationMinutes: 30,
      status: "Scheduled"
    }
  };

  const payload = appointmentEditPayload(item, {
    appointmentType: "Nutrition Education",
    staffMember: "Shannon Oddo",
    durationMinutes: "45",
    lesson: "Sugar",
    goal: "Compare drinks",
    notes: "Updated note"
  });

  assert.equal(payload.id, "appointment-1");
  assert.equal(payload.appointmentDate, "2026-07-15");
  assert.equal(payload.appointmentTime, "14:30");
  assert.equal(payload.status, "Scheduled");
  assert.deepEqual(payload.clientIds, ["milo", "tessa"]);
  assert.equal(payload.staffMember, "Shannon Oddo");
  assert.equal(payload.durationMinutes, 45);
  assert.equal(payload.lesson, "Sugar");
  assert.equal(payload.goal, "Compare drinks");
  assert.equal(payload.notes, "Updated note");
});

test("appointment cancellation is protected inside Edit and keeps history", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );
  const canceled = appointmentStatusPayload({
    source: { id: "appointment-1", status: "Scheduled" },
    clientIds: ["milo"],
    clientNames: ["Milo Exampleton"]
  }, "Canceled");

  assert.equal(canceled.status, "Canceled");
  assert.match(cleanSource, /data-edit-appointment/);
  assert.match(cleanSource, /data-cancel-appointment/);
  assert.match(cleanSource, /Confirm Cancellation/);
  assert.match(cleanSource, /appointmentStatusPayload\(item, "Canceled"\)/);
  assert.doesNotMatch(cleanSource, /window\.confirm/);
});

test("week and calendar controls are connected to the schedule", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /data-schedule-view="\$\{view\.toLowerCase\(\)\}"/);
  assert.match(cleanSource, /renderScheduleWeekPanel/);
  assert.match(cleanSource, /data-open-schedule-date-picker/);
  assert.match(cleanSource, /input\.showPicker\(\)/);
  assert.match(cleanSource, /item\.compact \? "is-compact"/);
  assert.match(cleanSource, /item\.compact \? "" : `<span>/);
  assert.match(cleanSource, /Math\.max\(0\.5, item\.duration \/ intervalMinutes\)/);
});

test("print retention lists match the approved lesson progression", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(lessonRetentionPrompts).map(([lesson, prompts]) => [lesson, prompts.length])),
    { 1: 0, 2: 1, 3: 3, 4: 6, 5: 8, 6: 10, 7: 12 }
  );
  assert.deepEqual(lessonRetentionPrompts[7], [
    "Mindful Eating & How to Do It",
    "Hunger & Fullness Cues",
    "2 Micro (Small) Nutrients",
    "Why Eat the Rainbow",
    "3 Macro (Big) Nutrients",
    "Fiber, Protein, Fat Foods",
    "5 Food Groups",
    "Whole vs. White Grains",
    "# Food Groups Each Meal / Day",
    "Natural Sugar & Added Sugar",
    "Find Added Sugar on Label & # Grams",
    "Nutrient Dense / Sometimes Foods"
  ]);
  assert.equal(noteRetentionForAppointment(printAppointment({ lesson: "Sugar" })).length, 1);
  assert.equal(noteRetentionForAppointment(printAppointment({ lesson: "Healthy Habits" })).length, 12);
});

test("print preparation follows the approved forms and supplies rules", () => {
  assert.deepEqual(appointmentPrepGroups(printAppointment({ type: "Enrollment", lesson: "Enrollment" })), {
    forms: [
      "Enrollment form (file cabinet); siblings can share one form.",
      "Questionnaire for each child (file cabinet); each child needs their own.",
      "Write client name in the top right corner, initial code on the back, and circle PRE.",
      "Place forms at reception before the appointment."
    ],
    supplies: ["SNACK sticker.", "SNACK pen or pencil."]
  });
  assert.deepEqual(appointmentPrepGroups(printAppointment({ lesson: "Nutrient Density" })), {
    forms: [],
    supplies: ["Workbook.", "Prize from the bin.", "Food snack."]
  });
  assert.deepEqual(appointmentPrepGroups(printAppointment({ lesson: "Sugar" })), {
    forms: [],
    supplies: ["Prize from the bin.", "Food snack."]
  });
  assert.equal(appointmentPrepGroups(printAppointment({ lesson: "Healthy Habits" })).forms.at(-1), "Place forms at reception before the appointment.");
  assert.deepEqual(appointmentPrepGroups(printAppointment({ status: "Blocked", type: "Administrative" })), { forms: [], supplies: [] });
});

test("print lists exclude canceled and rescheduled appointments but keep blocked time", () => {
  const items = [
    printAppointment({ id: "later", time: "15:00" }),
    printAppointment({ id: "canceled", status: "Canceled", time: "13:00" }),
    printAppointment({ id: "rescheduled", status: "Rescheduled", time: "13:30" }),
    printAppointment({ id: "blocked", status: "Blocked", type: "Administrative", time: "14:00", clientIds: [], clientNames: ["Blocked Time"] })
  ];

  assert.deepEqual(printableScheduleItems(items, "2026-07-15").map((item) => item.id), ["blocked", "later"]);
  assert.equal(dailySchedulePages(items, "2026-07-15", printClients).length, 1);
  assert.equal(dailyPrepPages(items, "2026-07-15", printClients).length, 1);
  assert.equal(dailyAppointmentNotePages(items, "2026-07-15", printClients).length, 1);
});

test("appointment note pages use full sibling names, stacked birthdates, and caregiver first names", () => {
  const html = appointmentNotePage(printAppointment(), printClients, []);

  assert.match(html, /Milo Exampleton Garcia &amp; Tessa Exampleton Garcia/);
  assert.match(html, /Milo: 8\/14\/2013/);
  assert.match(html, /Tessa: 3\/2\/2017/);
  assert.match(html, /<dd>Jordan<\/dd>/);
  assert.doesNotMatch(html, /Jordan Exampleton/);
  assert.match(html, /Previous Goal/);
  assert.match(html, /Previous Goal:<\/strong>/);
  assert.match(html, /Try one new vegetable/);
  assert.match(html, /<i aria-hidden="true"><\/i><strong>Next Appointment Scheduled<\/strong>/);
  assert.match(html, /Next Lesson/);
});

test("lesson, enrollment, and check-in print the correct note layouts", () => {
  assert.equal(appointmentNoteType(printAppointment()), "lesson");
  assert.equal(appointmentNoteType(printAppointment({ type: "Enrollment", lesson: "Enrollment" })), "enrollment");
  assert.equal(appointmentNoteType(printAppointment({ lesson: "Check In" })), "check-in");
  assert.match(appointmentNotePage(printAppointment({ lesson: "Healthy Habits" }), printClients, []), /knowledge-list is-variable is-two-column/);
  assert.match(appointmentNotePage(printAppointment({ type: "Enrollment", lesson: "Enrollment" }), printClients, []), /Enrollment Conversation/);
  assert.match(appointmentNotePage(printAppointment({ lesson: "Check In" }), printClients, []), /Today’s Conversation/);
  assert.match(appointmentNotePage(printAppointment({ lesson: "Sugar" }), printClients, []), /next-steps-writing-grid/);
  assert.match(appointmentNotePage(printAppointment({ lesson: "Check In" }), printClients, []), /Next Lesson/);
});

test("individual prep prints None for empty forms and workbook as a supply", () => {
  const html = appointmentPrepPage(printAppointment({ lesson: "Nutrient Density" }), printClients);

  assert.match(html, /<h3>Forms<\/h3><p class="empty-prep">None\.<\/p>/);
  assert.match(html, /<h3>Supplies<\/h3>/);
  assert.match(html, /Workbook\./);
});

test("daily packets keep schedule, prep, and appointment notes in that order", () => {
  const items = [printAppointment()];
  const pages = dailyPrintPacketPages(items, "2026-07-15", printClients);

  assert.equal(pages.length, 3);
  assert.match(pages[0], /SNACK Daily Schedule/);
  assert.match(pages[1], /Daily Prep List/);
  assert.match(pages[2], /Nutrient Density Appointment Note/);
  assert.deepEqual(dailyPrintPacketPages(items, "2026-07-16", printClients), []);
});

test("daily form requests include Enrollment and Graduation packets for every linked child", () => {
  const items = [
    printAppointment({ id: "enrollment", type: "Enrollment", lesson: "Enrollment" }),
    printAppointment({ id: "graduation", type: "Nutrition Education", lesson: "Healthy Habits", time: "15:00" }),
    printAppointment({ id: "ordinary", lesson: "Nutrient Density", time: "15:30" }),
    printAppointment({ id: "canceled", type: "Enrollment", lesson: "Enrollment", status: "Canceled", time: "16:00" })
  ];

  assert.deepEqual(dailyFormPacketRequests(items, "2026-07-15", printClients), [
    { appointmentId: "enrollment", clientId: "milo", clientName: "Milo Exampleton Garcia", packet: "enrollment" },
    { appointmentId: "enrollment", clientId: "tessa", clientName: "Tessa Exampleton Garcia", packet: "enrollment" },
    { appointmentId: "graduation", clientId: "milo", clientName: "Milo Exampleton Garcia", packet: "graduation" },
    { appointmentId: "graduation", clientId: "tessa", clientName: "Tessa Exampleton Garcia", packet: "graduation" }
  ]);
});

test("combined daily forms document loads native packets and appointment notes before printing", () => {
  const html = dailyFormsPrintDocumentHtml({
    title: "Daily Forms - July 15, 2026",
    packetRequests: [{ appointmentId: "enrollment", clientId: "milo", clientName: "Milo", packet: "enrollment" }],
    notePages: ["<article class=\"print-page\">Appointment note</article>"],
    baseHref: "http://localhost:4191/"
  });

  assert.match(html, /client-form\.html\?/);
  assert.match(html, /embed:\s*"1"/);
  assert.match(html, /client-form-paper-packet/);
  assert.match(html, /Appointment note/);
  assert.match(html, /window\.print\(\)/);
  assert.match(html, /status\.textContent = "Preparing " \+ selection\.label/);
  assert.match(html, /print-duplex-spacer/);
  assert.match(html, /dataset\.printPageCount/);
  assert.match(html, /Appointment Note/);
});

test("selected print documents keep checked items separate for double-sided printing", () => {
  const html = selectedPrintDocumentHtml({
    title: "Selected Forms",
    selections: [
      { kind: "static", label: "Daily Schedule", pageCount: 1, pages: ["<article>Schedule</article>"] },
      { kind: "static", label: "Appointment Note", pageCount: 1, pages: ["<article>Note</article>"] }
    ],
    baseHref: "http://localhost:4191/"
  });

  assert.match(html, /selected-print-document/);
  assert.match(html, /Blank page for double-sided printing/);
  assert.match(html, /printButton\.addEventListener\("click", \(\) => window\.print\(\)\)/);
  assert.match(html, /Date\.now\(\) - startedAt < 60000/);
  assert.match(html, /const failure = await loadPacket\(selection, marker\)/);
  assert.doesNotMatch(html, /Promise\.all\(packetLoads\)/);
});

test("print documents stay open and include a reliable Print button", () => {
  const html = printDocumentHtml({
    title: "Daily Print Packet",
    pages: ["<article>Page</article>"],
    baseHref: "http://localhost:4191/",
    autoPrint: true
  });

  assert.match(html, /onclick="window\.print\(\)"/);
  assert.match(html, /document\.fonts\.ready/);
  assert.doesNotMatch(html, /window\.close/);
});

test("clean schedule exposes print center and individual appointment print actions", () => {
  const cleanSource = readFileSync(
    new URL("../../frontend/public/clean.js", import.meta.url),
    "utf8"
  );

  assert.match(cleanSource, /data-schedule-subpage="\$\{escapeHtml\(label\)\}"/);
  assert.match(cleanSource, /data-schedule-print-center/);
  assert.match(cleanSource, /data-schedule-print-action="appointment-prep"/);
  assert.match(cleanSource, /data-schedule-print-action="appointment-note"/);
  assert.match(cleanSource, /data-schedule-print-select-all/);
  assert.match(cleanSource, /data-schedule-print-clear-all/);
  assert.match(cleanSource, /dailyPrintPacketPages/);
});
