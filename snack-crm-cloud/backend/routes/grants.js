import express from "express";
import {
  adminSettings,
  cleanGrantOrganizationInfoPayload,
  cleanGrantPayload,
  cleanGrantQuestionPayload,
  fetchAllDocuments,
  grantQuestions,
  grants,
  requireAuth,
  toGrant,
  toGrantOrganizationInfo,
  toGrantQuestion
} from "../lib/core.js";

const router = express.Router();

router.get("/api/grants", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(grants.orderBy("deadlineDate"));

    response.json({
      grants: documents.map(toGrant)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/grants", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanGrantPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.foundationName && !payload.grantName) {
      response.status(400).json({
        error: "Foundation or grant name is required."
      });
      return;
    }

    const docRef = await grants.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      grant: toGrant(created)
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/grants/:grantId", requireAuth, async (request, response, next) => {
  try {
    const grantRef = grants.doc(request.params.grantId);
    const snapshot = await grantRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant not found."
      });
      return;
    }

    const payload = cleanGrantPayload(request.body);

    if (!payload.foundationName && !payload.grantName) {
      response.status(400).json({
        error: "Foundation or grant name is required."
      });
      return;
    }

    await grantRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await grantRef.get();

    response.json({
      grant: toGrant(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/grants/:grantId", requireAuth, async (request, response, next) => {
  try {
    const grantRef = grants.doc(request.params.grantId);
    const snapshot = await grantRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant not found."
      });
      return;
    }

    await grantRef.delete();

    response.json({
      deleted: true
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/grant-questions", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(grantQuestions.orderBy("updatedAt", "desc"));

    response.json({
      questions: documents.map(toGrantQuestion)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/grant-questions", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanGrantQuestionPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.prompt || !payload.answer) {
      response.status(400).json({
        error: "Question and answer are required."
      });
      return;
    }

    const docRef = await grantQuestions.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      question: toGrantQuestion(created)
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/grant-questions/:questionId", requireAuth, async (request, response, next) => {
  try {
    const questionRef = grantQuestions.doc(request.params.questionId);
    const snapshot = await questionRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant question not found."
      });
      return;
    }

    const payload = cleanGrantQuestionPayload(request.body);

    if (!payload.prompt || !payload.answer) {
      response.status(400).json({
        error: "Question and answer are required."
      });
      return;
    }

    await questionRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await questionRef.get();

    response.json({
      question: toGrantQuestion(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/grant-questions/:questionId", requireAuth, async (request, response, next) => {
  try {
    const questionRef = grantQuestions.doc(request.params.questionId);
    const snapshot = await questionRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant question not found."
      });
      return;
    }

    await questionRef.delete();

    response.json({
      deleted: true
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/grant-organization-info", requireAuth, async (_request, response, next) => {
  try {
    const snapshot = await adminSettings.doc("grantOrganizationInfo").get();

    response.json({
      organizationInfo: toGrantOrganizationInfo(snapshot)
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/grant-organization-info", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanGrantOrganizationInfoPayload(request.body);
    const docRef = adminSettings.doc("grantOrganizationInfo");

    await docRef.set({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    }, { merge: true });

    const updated = await docRef.get();

    response.json({
      organizationInfo: toGrantOrganizationInfo(updated)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
