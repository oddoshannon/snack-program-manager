import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";

const FRONTEND_SECURITY_HEADERS = Object.freeze({
  "Cache-Control": "no-cache",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
});

function frontendHostingEnabled(env = process.env) {
  return String(env.SERVE_FRONTEND || "").trim().toLowerCase() === "true";
}

function frontendSecurityHeaders() {
  return { ...FRONTEND_SECURITY_HEADERS };
}

function createFrontendHostingConfig({ env = process.env, publicDirectory } = {}) {
  const enabled = frontendHostingEnabled(env);
  if (!enabled) {
    return { enabled: false };
  }

  const resolvedPublicDirectory = path.resolve(
    publicDirectory || env.FRONTEND_PUBLIC_DIR || "/app/frontend/public"
  );
  const indexFile = path.join(resolvedPublicDirectory, "index.html");

  if (!existsSync(indexFile)) {
    throw new Error(`Frontend hosting is enabled, but index.html was not found in ${resolvedPublicDirectory}.`);
  }

  return {
    enabled: true,
    publicDirectory: resolvedPublicDirectory,
    indexFile
  };
}

function isSameOriginPrintEmbed(request = {}) {
  const requestPath = String(request.path || request.url || "").split("?")[0];
  const query = request.query || {};
  return requestPath === "/client-form.html"
    && String(query.embed || "") === "1"
    && String(query.mode || "") === "print";
}

function applyFrontendSecurityHeaders(request, response, next) {
  for (const [name, value] of Object.entries(FRONTEND_SECURITY_HEADERS)) {
    response.setHeader(name, value);
  }
  if (isSameOriginPrintEmbed(request)) {
    response.removeHeader("X-Frame-Options");
    response.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
  }
  next();
}

function mountFrontendFiles(app, config) {
  if (!config?.enabled) return;

  app.get("/booking", (_request, response) => {
    response.sendFile(path.join(config.publicDirectory, "booking.html"));
  });
  app.get("/book", (_request, response) => {
    response.sendFile(path.join(config.publicDirectory, "book.html"));
  });
  app.use(express.static(config.publicDirectory, {
    dotfiles: "deny",
    fallthrough: true,
    index: "index.html"
  }));
}

export {
  applyFrontendSecurityHeaders,
  createFrontendHostingConfig,
  frontendHostingEnabled,
  frontendSecurityHeaders,
  isSameOriginPrintEmbed,
  mountFrontendFiles
};
