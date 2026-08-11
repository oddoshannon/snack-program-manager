import express from "express";
import {
  appointments,
  cleanString,
  cleanTaskPayload,
  clients,
  createGeneratedTaskIfMissing,
  fetchAllDocuments,
  findExistingStartDayTask,
  requireAuth,
  tasks,
  todayDateString,
  toAppointment,
  toClient,
  toTask
} from "../lib/core.js";

const router = express.Router();

function isOutreachTask(task = {}) {
  return task.source === "Outreach" || Boolean(task.outreachEventId);
}

function staleAppointmentWorkflowTask(appointment = {}, now = new Date()) {
  if ((appointment.status || "Scheduled") !== "Scheduled" || !appointment.appointmentDate) {
    return null;
  }

  const today = todayDateString(now);
  if (appointment.appointmentDate >= today) {
    return null;
  }

  const clientNames = Array.isArray(appointment.clientNames)
    ? appointment.clientNames.filter(Boolean)
    : [];
  const displayName = clientNames.join(", ") || appointment.clientName || "scheduled appointment";
  const clientIds = Array.isArray(appointment.clientIds)
    ? appointment.clientIds.filter(Boolean)
    : [];

  return {
    title: `Update outcome for ${displayName}`,
    type: "Task",
    status: "Open",
    priority: "Normal",
    dueDate: today,
    assignedTo: appointment.staffMember || "",
    clientId: clientIds[0] || appointment.clientId || "",
    clientName: displayName,
    appointmentId: appointment.id || "",
    source: "Workflow Automation",
    notes: `Past scheduled appointment from ${appointment.appointmentDate} still needs an outcome: Completed, No-show, Canceled, or Rescheduled.`
  };
}

async function resolveTaskClientName(payload) {
  if (!payload.clientId || payload.clientName) return;
  const clientSnapshot = await clients.doc(payload.clientId).get();
  if (!clientSnapshot.exists) return;
  const client = toClient(clientSnapshot);
  payload.clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim();
}

function registerTaskRoutes(path, { outreachOnly = false } = {}) {
  router.get(path, requireAuth, async (_request, response, next) => {
    try {
      const documents = await fetchAllDocuments(tasks.orderBy("createdAt", "desc"));
      const records = documents.map(toTask).filter((task) => isOutreachTask(task) === outreachOnly);
      response.json({ tasks: records });
    } catch (error) {
      next(error);
    }
  });

  router.post(path, requireAuth, async (request, response, next) => {
    try {
      const payload = cleanTaskPayload({
        ...request.body,
        source: outreachOnly ? "Outreach" : request.body?.source
      });
      const now = new Date().toISOString();

      if (!payload.title) {
        response.status(400).json({ error: "Task title is required." });
        return;
      }
      if (!outreachOnly && isOutreachTask(payload)) {
        response.status(400).json({ error: "Add Outreach tasks from the Outreach module." });
        return;
      }

      await resolveTaskClientName(payload);
      const existingStartDayTask = await findExistingStartDayTask(payload);
      if (existingStartDayTask) {
        response.json({ task: toTask(existingStartDayTask), duplicate: true });
        return;
      }

      const docRef = await tasks.add({
        ...payload,
        completedAt: payload.status === "Done" ? now : "",
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
      response.status(201).json({ task: toTask(await docRef.get()), duplicate: false });
    } catch (error) {
      next(error);
    }
  });

  router.patch(`${path}/:taskId`, requireAuth, async (request, response, next) => {
    try {
      const taskId = cleanString(request.params.taskId);
      if (!taskId) {
        response.status(400).json({ error: "Task ID is required." });
        return;
      }

      const docRef = tasks.doc(taskId);
      const snapshot = await docRef.get();
      if (!snapshot.exists || (outreachOnly && !isOutreachTask(toTask(snapshot)))) {
        response.status(404).json({ error: "Task was not found." });
        return;
      }

      const payload = cleanTaskPayload({
        ...request.body,
        source: outreachOnly ? "Outreach" : request.body?.source
      });
      if (!payload.title) {
        response.status(400).json({ error: "Task title is required." });
        return;
      }
      if (!outreachOnly && isOutreachTask(payload)) {
        response.status(400).json({ error: "Edit Outreach tasks from the Outreach module." });
        return;
      }

      await resolveTaskClientName(payload);
      const existingTask = toTask(snapshot);
      const now = new Date().toISOString();
      await docRef.update({
        ...payload,
        completedAt: payload.status === "Done" ? existingTask.completedAt || now : "",
        updatedAt: now,
        updatedBy: request.user.email
      });
      response.json({ task: toTask(await docRef.get()) });
    } catch (error) {
      next(error);
    }
  });

  router.delete(`${path}/:taskId`, requireAuth, async (request, response, next) => {
    try {
      const taskId = cleanString(request.params.taskId);
      if (!taskId) {
        response.status(400).json({ error: "Task ID is required." });
        return;
      }

      const docRef = tasks.doc(taskId);
      const snapshot = await docRef.get();
      if (!snapshot.exists || (outreachOnly && !isOutreachTask(toTask(snapshot)))) {
        response.status(404).json({ error: "Task was not found." });
        return;
      }

      await docRef.delete();
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });
}

router.post("/api/tasks/reconcile", requireAuth, async (request, response, next) => {
  try {
    const currentTime = new Date();
    const now = currentTime.toISOString();
    const [appointmentDocuments, taskDocuments] = await Promise.all([
      fetchAllDocuments(appointments.orderBy("appointmentDate", "desc")),
      fetchAllDocuments(tasks.orderBy("createdAt", "desc"))
    ]);
    const candidates = appointmentDocuments
      .map(toAppointment)
      .map((appointment) => staleAppointmentWorkflowTask(appointment, currentTime))
      .filter(Boolean);
    let created = 0;

    for (const candidate of candidates) {
      const result = await createGeneratedTaskIfMissing(candidate, request.user.email, now, taskDocuments);
      if (result.created) created += 1;
    }

    response.json({ reviewed: candidates.length, created, existing: candidates.length - created });
  } catch (error) {
    next(error);
  }
});

registerTaskRoutes("/api/tasks");
registerTaskRoutes("/api/outreach-tasks", { outreachOnly: true });

export { isOutreachTask, staleAppointmentWorkflowTask };
export default router;
