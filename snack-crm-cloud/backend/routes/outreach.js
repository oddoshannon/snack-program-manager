import express from "express";
import {
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanReferralNetworkPayload,
  cleanString,
  fetchAllDocuments,
  normalizedLookupKey,
  outreachContacts,
  outreachEvents,
  referralNetwork,
  requireAuth,
  tasks,
  toOutreachContact,
  toOutreachEvent,
  toReferralNetworkEntry
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
        error: "Lead name or child name is required."
      });
      return;
    }

    if (!payload.phone && !payload.email) {
      response.status(400).json({
        error: "A phone number or email address is required for the lead."
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
      lead: toOutreachContact(created),
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
        error: "Outreach lead ID is required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach lead was not found."
      });
      return;
    }

    const payload = cleanOutreachContactPayload(request.body);

    if (Object.hasOwn(request.body, "contactName") && !payload.contactName && !payload.childName) {
      response.status(400).json({
        error: "Lead name or child name is required."
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
      lead: toOutreachContact(updated),
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
        error: "Outreach lead ID and referral ID are required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach lead was not found."
      });
      return;
    }

    await docRef.update({
      referralId,
      status: "Referral Created",
      conversionType: "Referral",
      convertedAt: new Date().toISOString(),
      convertedRecordId: referralId,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      lead: toOutreachContact(updated),
      contact: toOutreachContact(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/outreach-contacts/:contactId/convert", requireAuth, async (request, response, next) => {
  try {
    const contactId = cleanString(request.params.contactId);
    const conversionType = cleanString(request.body.conversionType);
    const allowedConversions = new Set(["Audience Only", "Community Partner", "Closed"]);

    if (!contactId || !allowedConversions.has(conversionType)) {
      response.status(400).json({
        error: "Choose Audience Only, Community Partner, or Closed for this lead."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Outreach lead was not found." });
      return;
    }

    const lead = toOutreachContact(snapshot);
    const now = new Date().toISOString();
    let convertedRecordId = "";
    let networkEntry = null;

    if (conversionType === "Community Partner") {
      const organizationName = cleanString(request.body.organizationName || lead.organizationName || lead.contactName);
      if (!organizationName) {
        response.status(400).json({ error: "Enter an organization name before creating a Community Partner." });
        return;
      }

      const networkDocuments = await fetchAllDocuments(referralNetwork);
      const existing = networkDocuments.find((document) =>
        normalizedLookupKey(document.data()?.name) === normalizedLookupKey(organizationName));
      const networkPayload = cleanReferralNetworkPayload({
        name: organizationName,
        type: "Community Organization",
        contactName: lead.contactName,
        phone: lead.phone,
        email: lead.email,
        notes: [lead.notes, "Created from Outreach Leads."].map(cleanString).filter(Boolean).join("\n")
      });

      if (existing) {
        convertedRecordId = existing.id;
        const existingData = existing.data();
        await existing.ref.update({
          contactName: cleanString(existingData.contactName) || networkPayload.contactName,
          phone: cleanString(existingData.phone) || networkPayload.phone,
          email: cleanString(existingData.email) || networkPayload.email,
          updatedAt: now,
          updatedBy: request.user.email
        });
        networkEntry = toReferralNetworkEntry(await existing.ref.get());
      } else {
        const networkRef = await referralNetwork.add({
          ...networkPayload,
          createdAt: now,
          updatedAt: now,
          createdBy: request.user.email
        });
        convertedRecordId = networkRef.id;
        networkEntry = toReferralNetworkEntry(await networkRef.get());
      }
    }

    const conversionUpdate = {
      status: conversionType,
      conversionType,
      convertedAt: now,
      convertedRecordId,
      updatedAt: now,
      updatedBy: request.user.email
    };
    if (conversionType === "Community Partner") {
      conversionUpdate.audienceGroups = [...new Set([
        ...(Array.isArray(lead.audienceGroups) ? lead.audienceGroups : []),
        "Community Partners"
      ])];
    }

    await docRef.update(conversionUpdate);
    const convertedLead = toOutreachContact(await docRef.get());
    response.json({ lead: convertedLead, contact: convertedLead, networkEntry });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/outreach-contacts/:contactId", requireAuth, async (request, response, next) => {
  try {
    const contactId = cleanString(request.params.contactId);

    if (!contactId) {
      response.status(400).json({
        error: "Outreach lead ID is required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach lead was not found."
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
