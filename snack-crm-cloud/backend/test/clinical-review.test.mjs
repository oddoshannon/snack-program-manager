import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  clinicalClientLabel,
  clinicalContentVersion,
  clinicalReviewStatuses,
  clinicalReviewStatus,
  clinicalReviewSummary,
  normalizeClinicalReviewSettings,
  userMatchesAssignment
} from "../lib/clinical-review.js";
import {
  clinicalReviewActionState,
  clinicalReviewCounts,
  clinicalReviewQueue
} from "../../frontend/public/modules/clinical-review.js";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(testDirectory, "../..");

function completedAppointment(overrides = {}) {
  return {
    id: "appt-1",
    status: "Completed",
    clientNames: ["Maya Rivera"],
    appointmentDate: "2026-08-17",
    appointmentTime: "15:30",
    appointmentType: "Nutrition Education",
    lesson: "Sugar",
    goal: "Use the veggie tracker.",
    goalResult: "New goal established",
    participantGoals: [],
    appointmentNote: "Reviewed added sugars and practiced reading labels.",
    staffMember: "Shannon Oddo",
    clinicalReview: {},
    ...overrides
  };
}

test("clinical review uses first name and last initial", () => {
  assert.equal(clinicalClientLabel("Maya Rivera"), "Maya R.");
  assert.equal(clinicalClientLabel("Jose Reyes Canchola"), "Jose C.");
  assert.equal(clinicalClientLabel("Cher"), "Cher");
});

test("reviewed status stays valid only for the reviewed note content", () => {
  const appointment = completedAppointment();
  const contentVersion = clinicalContentVersion(appointment);
  const reviewed = completedAppointment({
    clinicalReview: { reviewedAt: "2026-08-17T22:00:00.000Z", contentVersion }
  });
  assert.equal(clinicalReviewStatus(reviewed), clinicalReviewStatuses.reviewed);
  assert.equal(clinicalReviewStatus({ ...reviewed, appointmentNote: "The note was corrected." }), clinicalReviewStatuses.ready);
});

test("an unanswered question keeps the note in Clarification Requested", () => {
  const appointment = completedAppointment({
    clinicalReview: {
      clarifications: [{ id: "q-1", question: "Please clarify the goal.", assignedTo: "Shannon Oddo" }]
    }
  });
  assert.equal(clinicalReviewStatus(appointment), clinicalReviewStatuses.clarification);
});

test("an answered question returns the note to Ready for Review and preserves the exchange", () => {
  const appointment = completedAppointment({
    clinicalReview: {
      clarifications: [{
        id: "q-1",
        question: "Please clarify the goal.",
        answer: "The family chose the veggie tracker.",
        answeredAt: "2026-08-17T23:00:00.000Z"
      }]
    }
  });
  assert.equal(clinicalReviewStatus(appointment), clinicalReviewStatuses.ready);
  assert.equal(appointment.clinicalReview.clarifications[0].question, "Please clarify the goal.");
  assert.equal(appointment.clinicalReview.clarifications[0].answer, "The family chose the veggie tracker.");
});

test("review summary is reusable in a future referring-provider update", () => {
  const appointment = completedAppointment();
  const reviewed = completedAppointment({
    clinicalReview: {
      reviewedAt: "2026-08-17T22:00:00.000Z",
      reviewedByName: "William Koenig",
      reviewedByTitle: "Clinical Physician Advisor",
      contentVersion: clinicalContentVersion(appointment)
    }
  });
  assert.deepEqual(clinicalReviewSummary(reviewed), {
    status: "Reviewed",
    reviewedAt: "2026-08-17T22:00:00.000Z",
    reviewedByName: "William Koenig",
    reviewedByTitle: "Clinical Physician Advisor",
    referralUpdateLabel: "Reviewed by Clinical Physician Advisor"
  });
});

test("clarification routing supports the director and appointment staff", () => {
  assert.equal(normalizeClinicalReviewSettings({ clarificationRouting: "director" }).clarificationRouting, "director");
  assert.equal(normalizeClinicalReviewSettings({ clarificationRouting: "appointment-staff" }).clarificationRouting, "appointment-staff");
  assert.equal(normalizeClinicalReviewSettings({ clarificationRouting: "anything else" }).clarificationRouting, "director");
});

test("assigned clarification access matches either email or staff name", () => {
  const clarification = { assignedTo: "Cynthia Esparza", assignedToEmail: "cynthia@snackprogram.org" };
  assert.equal(userMatchesAssignment({ email: "cynthia@snackprogram.org" }, clarification), true);
  assert.equal(userMatchesAssignment({ displayName: "Cynthia Esparza" }, clarification), true);
  assert.equal(userMatchesAssignment({ email: "other@snackprogram.org" }, clarification), false);
});

test("clinical review queue and buttons keep approved capitalization", () => {
  const reviews = [
    { id: "reviewed", status: "Reviewed", appointmentDate: "2026-08-17" },
    { id: "ready", status: "Ready for Review", appointmentDate: "2026-08-16" },
    { id: "question", status: "Clarification Requested", appointmentDate: "2026-08-15" }
  ];
  assert.deepEqual(clinicalReviewQueue(reviews).map((item) => item.id), ["question", "ready", "reviewed"]);
  assert.deepEqual(clinicalReviewCounts(reviews), { ready: 1, clarification: 1, reviewed: 1 });
  assert.deepEqual(clinicalReviewActionState(reviews[2], { reviewer: true }), {
    requestVisible: true,
    requestDisabled: true,
    requestLabel: "Clarification Requested",
    reviewVisible: true,
    reviewDisabled: true,
    reviewLabel: "Mark Reviewed",
    responseVisible: false
  });
});

test("clinical review is mounted as a protected clean-interface feature", () => {
  const serverSource = fs.readFileSync(path.join(projectDirectory, "backend/server.js"), "utf8");
  const coreSource = fs.readFileSync(path.join(projectDirectory, "backend/lib/core.js"), "utf8");
  const html = fs.readFileSync(path.join(projectDirectory, "frontend/public/clinical-review.html"), "utf8");
  assert.match(serverSource, /app\.use\(clinicalReviewRoutes\)/);
  assert.match(coreSource, /clinical-reviews/);
  assert.match(coreSource, /id: "ClinicalAdvisor"/);
  assert.match(html, /clean\.css/);
  assert.match(html, /clinical-review\.js/);
});
