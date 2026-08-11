import assert from "node:assert/strict";
import test from "node:test";

import {
  clientMessageDeliveryPolicy,
  clientMessageTemplates,
  clinicAddress,
  defaultClientMessageTemplateRecords,
  kitchenAddress,
  kitchenParkingMapUrl
} from "../lib/client-messages.js";
import {
  datePlusDays,
  isUnansweredContactResult,
  unansweredContactTask
} from "../routes/activity-logs.js";

test("client message policy keeps approved reminder timing and delivery off", () => {
  assert.equal(clientMessageDeliveryPolicy.appointmentEmailReminderHoursBefore, 48);
  assert.equal(clientMessageDeliveryPolicy.appointmentTextReminderHoursBefore, 6);
  assert.equal(clientMessageDeliveryPolicy.earliestTextHourLocal, 8);
  assert.equal(clientMessageDeliveryPolicy.nextClassEarlyAccessHours, 48);
  assert.equal(clientMessageDeliveryPolicy.automaticDeliveryEnabled, false);
});

test("editable message-template records include English and Spanish drafts with safe placeholders", () => {
  const templates = defaultClientMessageTemplateRecords();
  assert.equal(templates.length, 17);
  assert.deepEqual(templates.filter(({ language }) => language === "English").map(({ id }) => id), [
    "referralReceived",
    "referralConvertedWelcome",
    "appointmentBooked",
    "appointmentRescheduled",
    "appointmentReminder",
    "kitchenWaitlistOffer",
    "kitchenRegistrationConfirmation",
    "kitchenClassReminder",
    "staffDeliveryFailure"
  ]);
  assert.equal(templates.filter((template) => template.language === "English").length, 9);
  assert.equal(templates.filter((template) => template.language === "Spanish").length, 8);
  assert.equal(templates.every((template) => template.status === "Draft" && template.version === 1), true);
  assert.match(templates[0].emailBody, /Hello \[Caregiver First Name\],/);
  assert.match(templates.find(({ id }) => id === "appointmentBooked").emailBody, /\[Weekday, Month Day\]/);
  assert.match(templates.find(({ id }) => id === "appointmentBooked").smsBody, /\[Short Date\]/);
  assert.doesNotMatch(templates.find(({ id }) => id === "appointmentBooked").smsBody, /Year/);
  assert.equal(templates.find(({ id }) => id === "staffDeliveryFailure").smsBody, "");
  assert.match(templates.find(({ id }) => id === "appointmentReminder-es").emailBody, /Fecha: \[Weekday, Month Day\]/);
  assert.equal(templates.some(({ id }) => id === "staffDeliveryFailure-es"), false);
});

test("clinic and Kitchen templates use the correct distinct locations", () => {
  const templates = clientMessageTemplates({
    caregiverName: "Morgan",
    clientNames: "Avery",
    className: "Kids Cooking Class",
    dateLabel: "Thursday, August 13, 2026",
    startTimeLabel: "5:30 PM",
    endTimeLabel: "7:30 PM",
    manageUrl: "https://hub.snackprogram.org/book.html#private"
  });

  assert.equal(templates.appointmentBooked.text.includes(clinicAddress), true);
  assert.equal(templates.appointmentBooked.text.includes("Dustin"), false);
  assert.equal(templates.kitchenRegistrationConfirmation.text.includes(kitchenAddress), true);
  assert.match(templates.kitchenRegistrationConfirmation.text, /follow the signs in the parking lot to the Training Room/i);
  assert.match(templates.kitchenClassReminder.text, /follow the signs in the parking lot to the Training Room/i);
  assert.equal(templates.kitchenRegistrationConfirmation.html.includes(kitchenParkingMapUrl), true);
  assert.match(templates.appointmentBooked.html, /<strong>Date:<\/strong>/);
  assert.match(templates.appointmentBooked.html, /<strong>Time:<\/strong>/);
  assert.match(templates.appointmentBooked.html, /<strong>Location:<\/strong>/);
  assert.match(templates.kitchenRegistrationConfirmation.html, /<strong>Class location:<\/strong>/);
  assert.match(templates.kitchenRegistrationConfirmation.text, /from 5:30 PM to 7:30 PM/);
  assert.match(templates.kitchenWaitlistOffer.text, /\[Private Offer Link\]/);
  assert.doesNotMatch(templates.referralReceived.text, /\[Response Window\]/);
  assert.match(templates.referralReceived.text, /within one week/i);
  assert.doesNotMatch(templates.referralConvertedWelcome.text, /Community Wellness Day/);
});

test("unanswered contact creates staff tasks one week apart without sending messages", () => {
  assert.equal(isUnansweredContactResult("Left Voicemail"), true);
  assert.equal(isUnansweredContactResult("No Voicemail — Call Back"), true);
  assert.equal(isUnansweredContactResult("No Response to Text"), true);
  assert.equal(isUnansweredContactResult("Invalid Number"), true);
  assert.equal(isUnansweredContactResult("Scheduled"), false);
  assert.equal(datePlusDays("2026-08-10", 7), "2026-08-17");

  const payload = {
    activityDate: "2026-08-10",
    relatedId: "referral-1",
    relatedType: "referral",
    result: "Left Voicemail"
  };
  const secondAttempt = unansweredContactTask({ payload, relatedName: "Avery Rivera", priorAttemptCount: 0, assignedTo: "staff@snackprogram.org" });
  assert.equal(secondAttempt.dueDate, "2026-08-17");
  assert.match(secondAttempt.title, /Contact attempt 2/);
  assert.match(secondAttempt.notes, /staff follow-up task/);
  assert.match(secondAttempt.notes, /no automatic email or text/i);

  const thirdAttempt = unansweredContactTask({ payload: { ...payload, activityDate: "2026-08-17" }, relatedName: "Avery Rivera", priorAttemptCount: 1, assignedTo: "staff@snackprogram.org" });
  assert.equal(thirdAttempt.dueDate, "2026-08-24");
  assert.match(thirdAttempt.title, /Contact attempt 3/);

  const review = unansweredContactTask({ payload: { ...payload, activityDate: "2026-08-24" }, relatedName: "Avery Rivera", priorAttemptCount: 2, assignedTo: "staff@snackprogram.org" });
  assert.match(review.title, /Review unanswered contact attempts/);
  assert.match(review.notes, /Waiting on Family/);
  assert.match(review.notes, /will not change the status automatically/);
});

test("invalid numbers create verification work before another staff attempt", () => {
  const task = unansweredContactTask({
    payload: { activityDate: "2026-08-10", relatedId: "client-1", relatedType: "client", result: "Invalid Number" },
    relatedName: "Avery Rivera",
    priorAttemptCount: 0,
    assignedTo: "staff@snackprogram.org"
  });
  assert.match(task.title, /Verify contact information/);
  assert.match(task.notes, /approved alternate contact method/);
  assert.equal(task.dueDate, "2026-08-17");
});
