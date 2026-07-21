import express from "express";
import {
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanString,
  fetchAllDocuments,
  outreachContacts,
  outreachEvents,
  requireAuth,
  tasks,
  toOutreachContact,
  toOutreachEvent
} from "../lib/core.js";

const router = express.Router();

router.get("/api/outreach-events", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(outreachEvents.orderBy("eventDate", "desc"));

    response.json({
      events: documents.map(toOutreachEvent)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/outreach-events", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanOutreachEventPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.name) {
      response.status(400).json({
        error: "Outreach event name is required."
      });
      return;
    }

    const docRef = await outreachEvents.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      event: toOutreachEvent(created)
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/outreach-events/:eventId", requireAuth, async (request, response, next) => {
  try {
    const eventId = cleanString(request.params.eventId);

    if (!eventId) {
      response.status(400).json({
        error: "Outreach event ID is required."
      });
      return;
    }

    const docRef = outreachEvents.doc(eventId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach event was not found."
      });
      return;
    }

    const payload = cleanOutreachEventPayload(request.body);

    if (Object.hasOwn(request.body, "name") && !payload.name) {
      response.status(400).json({
        error: "Outreach event name is required."
      });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      event: toOutreachEvent(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/outreach-events/:eventId", requireAuth, async (request, response, next) => {
  try {
    const eventId = cleanString(request.params.eventId);

    if (!eventId) {
      response.status(400).json({
        error: "Outreach event ID is required."
      });
      return;
    }

    const docRef = outreachEvents.doc(eventId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach event was not found."
      });
      return;
    }

    const [linkedContacts, linkedTasks] = await Promise.all([
      fetchAllDocuments(outreachContacts.where("eventId", "==", eventId)),
      fetchAllDocuments(tasks.where("outreachEventId", "==", eventId))
    ]);

    if (linkedContacts.length || linkedTasks.length) {
      response.status(409).json({
        error: "Move or delete this event's linked contacts and tasks before deleting the event."
      });
      return;
    }

    await docRef.delete();

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/outreach-contacts", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(outreachContacts.orderBy("createdAt", "desc"));

    response.json({
      contacts: documents.map(toOutreachContact)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/outreach-contacts", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanOutreachContactPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.contactName && !payload.childName) {
      response.status(400).json({
        error: "Contact name or child name is required."
      });
      return;
    }

    if (!payload.phone && !payload.email) {
      response.status(400).json({
        error: "Phone or email is required."
      });
      return;
    }

    const docRef = await outreachContacts.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      contact: toOutreachContact(created)
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/outreach-contacts/:contactId", requireAuth, async (request, response, next) => {
  try {
    const contactId = cleanString(request.params.contactId);

    if (!contactId) {
      response.status(400).json({
        error: "Outreach contact ID is required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach contact was not found."
      });
      return;
    }

    const payload = cleanOutreachContactPayload(request.body);

    if (Object.hasOwn(request.body, "contactName") && !payload.contactName && !payload.childName) {
      response.status(400).json({
        error: "Contact name or child name is required."
      });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      contact: toOutreachContact(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/outreach-contacts/:contactId/link-referral", requireAuth, async (request, response, next) => {
  try {
    const contactId = cleanString(request.params.contactId);
    const referralId = cleanString(request.body.referralId);

    if (!contactId || !referralId) {
      response.status(400).json({
        error: "Outreach contact ID and referral ID are required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach contact was not found."
      });
      return;
    }

    await docRef.update({
      referralId,
      status: "Referral Created",
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      contact: toOutreachContact(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/outreach-contacts/:contactId", requireAuth, async (request, response, next) => {
  try {
    const contactId = cleanString(request.params.contactId);

    if (!contactId) {
      response.status(400).json({
        error: "Outreach contact ID is required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach contact was not found."
      });
      return;
    }

    await docRef.delete();

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
