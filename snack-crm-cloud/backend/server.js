import express from "express";
import cors from "cors";
import { pathToFileURL } from "node:url";
import { auditStaffRequest, frontendOrigins, port } from "./lib/core.js";
import {
  applyFrontendSecurityHeaders,
  createFrontendHostingConfig,
  mountFrontendFiles
} from "./lib/frontend-hosting.js";
import publicBookingRoutes from "./routes/public-booking.js";
import messageRoutes from "./routes/messages.js";
import adminRoutes from "./routes/admin.js";
import referralRoutes from "./routes/referrals.js";
import clientRoutes from "./routes/clients.js";
import appointmentRoutes from "./routes/appointments.js";
import taskRoutes from "./routes/tasks.js";
import activityLogRoutes from "./routes/activity-logs.js";
import grantRoutes from "./routes/grants.js";
import fundraisingRoutes from "./routes/fundraising.js";
import referralNetworkRoutes from "./routes/referral-network.js";
import outreachRoutes from "./routes/outreach.js";
import volunteerRoutes from "./routes/volunteers.js";
import programScheduleRoutes from "./routes/program-schedule.js";
import marketingRoutes from "./routes/marketing.js";
import operationsRoutes from "./routes/operations.js";
import accessRoutes from "./routes/access.js";
import reminderRoutes from "./routes/reminders.js";
import securityRoutes from "./routes/security.js";

const app = express();
const frontendHosting = createFrontendHostingConfig();

app.disable("x-powered-by");

if ((process.env.K_SERVICE || process.env.NODE_ENV === "production") && !frontendOrigins.length) {
  throw new Error("FRONTEND_ORIGINS must list the approved production web addresses.");
}

if (frontendHosting.enabled) {
  app.use(applyFrontendSecurityHeaders);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || frontendOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
        return;
      }
      const error = new Error("This web address is not allowed to call the SNACK API.");
      error.statusCode = 403;
      callback(error);
    }
  })
);
app.use(express.json({
  verify(request, _response, buffer) {
    request.rawBody = Buffer.from(buffer);
  }
}));
app.use((request, response, next) => {
  response.on("finish", () => auditStaffRequest(request, response));
  next();
});

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "snack-crm-api"
  });
});

app.use(publicBookingRoutes);
app.use(securityRoutes);
app.use(accessRoutes);
app.use(messageRoutes);
app.use(adminRoutes);
app.use(referralRoutes);
app.use(clientRoutes);
app.use(appointmentRoutes);
app.use(taskRoutes);
app.use(activityLogRoutes);
app.use(grantRoutes);
app.use(fundraisingRoutes);
app.use(referralNetworkRoutes);
app.use(outreachRoutes);
app.use(volunteerRoutes);
app.use(programScheduleRoutes);
app.use(marketingRoutes);
app.use(reminderRoutes);
app.use(operationsRoutes);

mountFrontendFiles(app, frontendHosting);

app.use((error, request, response, _next) => {
  console.error("SNACK API request failed.", {
    method: request.method,
    path: String(request.path || "").slice(0, 240),
    statusCode: Number(error?.statusCode) || 500,
    errorCode: typeof error?.code === "string" ? error.code.slice(0, 80) : ""
  });
  response.status(Number(error?.statusCode) || 500).json({
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
