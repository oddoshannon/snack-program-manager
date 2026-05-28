import express from "express";
import cors from "cors";
import { Firestore } from "@google-cloud/firestore";
import { createRemoteJWKSet, jwtVerify } from "jose";

const port = Number(process.env.PORT || 8080);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.PROJECT_ID;
const firebaseAuthProjectId = process.env.FIREBASE_AUTH_PROJECT_ID || "snack-crm";
const allowedEmailDomain = process.env.ALLOWED_EMAIL_DOMAIN || "snackprogram.org";

const firestore = projectId ? new Firestore({ projectId }) : new Firestore();
const messages = firestore.collection("messages");
const firebaseJwtKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

const app = express();

app.use(
  cors({
    origin: frontendOrigin === "*" ? true : frontendOrigin
  })
);
app.use(express.json());

async function requireAuth(request, response, next) {
  const authHeader = request.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!token) {
    response.status(401).json({
      error: "Sign in is required."
    });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, firebaseJwtKeys, {
      issuer: `https://securetoken.google.com/${firebaseAuthProjectId}`,
      audience: firebaseAuthProjectId
    });
    const email = payload.email || "";
    const emailVerified = payload.email_verified === true;
    const isAllowedDomain = allowedEmailDomain ? email.endsWith(`@${allowedEmailDomain}`) : true;

    if (!emailVerified || !isAllowedDomain) {
      response.status(403).json({
        error: "This account is not allowed to use SNACK CRM."
      });
      return;
    }

    request.user = {
      uid: payload.sub,
      email
    };
    next();
  } catch (error) {
    console.error(error);
    response.status(401).json({
      error: "Your sign-in session could not be verified."
    });
  }
}

async function ensureHelloMessage() {
  const docRef = messages.doc("hello");
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    await docRef.set({
      text: "Hello from the SNACK CRM database.",
      createdAt: new Date().toISOString()
    });
  }
}

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "snack-crm-api"
  });
});

app.get("/api/message", requireAuth, async (_request, response, next) => {
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

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: "The SNACK CRM API could not read the database message."
  });
});

app.listen(port, () => {
  console.log(`SNACK CRM API listening on port ${port}`);
});
