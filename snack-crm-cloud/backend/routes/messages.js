import express from "express";
import {
  ensureHelloMessage,
  messages,
  requireAuth
} from "../lib/core.js";

const router = express.Router();

router.get("/api/message", requireAuth, async (_request, response, next) => {
  try {
    await ensureHelloMessage();
    const snapshot = await messages.doc("hello").get();
    const data = snapshot.data();

    response.json({
      id: snapshot.id,
      text: data.text,
      source: "Firestore collection: messages"
    });
  } catch (error) {
    next(error);
  }
});

export default router;
