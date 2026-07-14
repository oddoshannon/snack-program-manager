import express from "express";
import {
  cleanString,
  cleanTaskPayload,
  clients,
  fetchAllDocuments,
  findExistingStartDayTask,
  requireAuth,
  tasks,
  toClient,
  toTask
} from "../lib/core.js";

const router = express.Router();

router.get("/api/tasks", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(tasks.orderBy("createdAt", "desc"));

    response.json({
      tasks: documents.map(toTask)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/tasks", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanTaskPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.title) {
      response.status(400).json({
        error: "Task title is required."
      });
      return;
    }

    if (payload.clientId && !payload.clientName) {
      const clientSnapshot = await clients.doc(payload.clientId).get();
      if (clientSnapshot.exists) {
        const client = toClient(clientSnapshot);
        payload.clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim();
      }
    }

    const existingStartDayTask = await findExistingStartDayTask(payload);

    if (existingStartDayTask) {
      response.json({
        task: toTask(existingStartDayTask),
        duplicate: true
      });
      return;
    }

    const docRef = await tasks.add({
      ...payload,
      completedAt: payload.status === "Done" ? now : "",
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      task: toTask(created),
      duplicate: false
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/tasks/:taskId", requireAuth, async (request, response, next) => {
  try {
    const taskId = cleanString(request.params.taskId);

    if (!taskId) {
      response.status(400).json({
        error: "Task ID is required."
      });
      return;
    }

    const docRef = tasks.doc(taskId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Task was not found."
      });
      return;
    }

    const payload = cleanTaskPayload(request.body);

    if (!payload.title) {
      response.status(400).json({
        error: "Task title is required."
      });
      return;
    }

    if (payload.clientId && !payload.clientName) {
      const clientSnapshot = await clients.doc(payload.clientId).get();
      if (clientSnapshot.exists) {
        const client = toClient(clientSnapshot);
        payload.clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim();
      }
    }

    const existingTask = toTask(snapshot);
    const now = new Date().toISOString();

    await docRef.update({
      ...payload,
      completedAt: payload.status === "Done" ? existingTask.completedAt || now : "",
      updatedAt: now,
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      task: toTask(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/tasks/:taskId", requireAuth, async (request, response, next) => {
  try {
    const taskId = cleanString(request.params.taskId);

    if (!taskId) {
      response.status(400).json({
        error: "Task ID is required."
      });
      return;
    }

    const docRef = tasks.doc(taskId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Task was not found."
      });
      return;
    }

    await docRef.delete();

    response.json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
});

export default router;
