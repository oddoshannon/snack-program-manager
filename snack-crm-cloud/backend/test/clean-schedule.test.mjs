import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cleanAppointmentType,
  formatScheduleTime,
  mapAppointment,
  normalizeAppointmentStatus,
  offsetScheduleDate,
  prepForAppointment,
  scheduleTimeMinutes
} from "../../frontend/public/modules/schedule.js";

test("schedule date and time helpers preserve the clinic day positions", () => {
  assert.equal(offsetScheduleDate("2026-07-07", -1), "2026-07-06");
  assert.equal(offsetScheduleDate("2026-07-07", 1), "2026-07-08");
  assert.equal(scheduleTimeMinutes("14:30"), 870);
  assert.equal(formatScheduleTime(870), "2:30 PM");
});

test("appointment labels omit the word Appointment", () => {
  assert.equal(cleanAppointmentType("Enrollment Appointment"), "Enrollment");
  assert.equal(cleanAppointmentType("Nutrition Education Appointment"), "Nutrition Education");
  assert.equal(cleanAppointmentType("Cita de inscripción en español"), "Cita de inscripción en español");
});

test("appointment statuses use the clean schedule labels", () => {
  assert.equal(normalizeAppointmentStatus("Complete"), "Completed");
  assert.equal(normalizeAppointmentStatus("No Show"), "No-show");
  assert.equal(normalizeAppointmentStatus("Needs Reschedule"), "Rescheduled");
  assert.equal(normalizeAppointmentStatus("Cancelled"), "Canceled");
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
    ["rafael", {
      firstName: "Rafael",
      lastName: "Hernández García",
      parentName: "Neiva",
      preferredLanguage: "Spanish",
      phone: "9714472646"
    }],
    ["janney", {
      firstName: "Janney",
      lastName: "Hernández García",
      parentName: "Neiva",
      preferredLanguage: "Spanish",
      phone: "9714472646"
    }]
  ]);

  const mapped = mapAppointment({
    id: "appointment-1",
    clientIds: ["rafael", "janney"],
    appointmentDate: "2026-07-07",
    appointmentTime: "2:30 PM",
    appointmentType: "Enrollment Appointment",
    durationMinutes: 30,
    status: "Complete",
    staffMember: "Cynthia Esparza",
    prepChecklist: { enrollmentForm: true }
  }, clientsById);

  assert.equal(mapped.title, "Rafael & Janney");
  assert.equal(mapped.subtitle, "Enrollment");
  assert.equal(mapped.status, "Completed");
  assert.equal(mapped.date, "2026-07-07");
  assert.equal(mapped.time, "14:30");
  assert.equal(mapped.duration, 30);
  assert.equal(mapped.caregiver, "Neiva");
  assert.equal(mapped.siblings, "Rafael, Janney");
  assert.equal(mapped.language, "Spanish");
  assert.equal(mapped.phone, "(971) 447-2646");
  assert.equal(mapped.staff, "Cynthia Esparza");
  assert.deepEqual(mapped.prepChecklist, { enrollmentForm: true });
  assert.equal(mapped.forms.length, 4);
  assert.equal(mapped.supplies.length, 2);
});
