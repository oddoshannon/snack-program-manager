import { sendGmailMessage } from "../lib/gmail-sender.js";

const recipient = String(process.argv[2] || "").trim().toLowerCase();
const confirmation = String(process.argv[3] || "");
if (!recipient.endsWith("@snackprogram.org")) {
  throw new Error("The controlled test recipient must use a snackprogram.org address.");
}
if (confirmation !== "SEND SAFE WORKSPACE TEST") {
  throw new Error("Pass the exact controlled-test confirmation phrase.");
}

const sent = await sendGmailMessage({
  to: recipient,
  subject: "SNACK Program Hub email connection test",
  text: "This is a controlled test from appointments@snackprogram.org. No client information is included, and automatic email delivery remains off. Replies should go to director@snackprogram.org.",
  html: "<p>This is a controlled test from <strong>appointments@snackprogram.org</strong>.</p><p>No client information is included, and automatic email delivery remains off.</p><p>Replies should go to <strong>director@snackprogram.org</strong>.</p>"
}, {
  serviceAccountEmail: "snack-hub-mailer@snack-crm.iam.gserviceaccount.com",
  senderEmail: "appointments@snackprogram.org",
  senderName: "SNACK Program",
  replyTo: "director@snackprogram.org",
  automaticDeliveryEnabled: false,
  allowWhenDisabled: true,
  signerAccessToken: process.env.GMAIL_SIGNER_ACCESS_TOKEN
});

console.log(JSON.stringify({
  sent: Boolean(sent.id),
  from: sent.from,
  to: sent.to,
  replyTo: sent.replyTo,
  automaticDeliveryEnabled: sent.automaticDeliveryEnabled
}, null, 2));
