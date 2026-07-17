import express from "express";
import cors from "cors";
import { pathToFileURL } from "node:url";
import { frontendOrigin, port } from "./lib/core.js";
import publicBookingRoutes from "./routes/public-booking.js";
import messageRoutes from "./routes/messages.js";
import adminRoutes from "./routes/admin.js";
import referralRoutes from "./routes/referrals.js";
import clientRoutes from "./routes/clients.js";
import appointmentRoutes from "./routes/appointments.js";
import taskRoutes from "./routes/tasks.js";
import activityLogRoutes from "./routes/activity-logs.js";
import grantRoutes from "./routes/grants.js";
import referralNetworkRoutes from "./routes/referral-network.js";
import outreachRoutes from "./routes/outreach.js";

const app = express();

app.use(
  cors({
    origin: frontendOrigin === "*" ? true : frontendOrigin
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "snack-crm-api"
  });
});

app.use(publicBookingRoutes);
app.use(messageRoutes);
app.use(adminRoutes);
app.use(referralRoutes);
app.use(clientRoutes);
app.use(appointmentRoutes);
app.use(taskRoutes);
app.use(activityLogRoutes);
app.use(grantRoutes);
app.use(referralNetworkRoutes);
app.use(outreachRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: "The SNACK CRM API could not complete the request."
  });
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(port, () => {
    console.log(`SNACK CRM API listening on port ${port}`);
  });
}

export * from "./lib/core.js";
export * from "./lib/public-booking-confirmation.js";
export { app };
