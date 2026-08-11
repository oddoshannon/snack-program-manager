import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  applyFrontendSecurityHeaders,
  createFrontendHostingConfig,
  frontendHostingEnabled,
  frontendSecurityHeaders,
  isSameOriginPrintEmbed,
  mountFrontendFiles
} from "../lib/frontend-hosting.js";

const publicDirectory = fileURLToPath(new URL("../../frontend/public", import.meta.url));

test("frontend hosting is enabled only by an explicit setting", () => {
  assert.equal(frontendHostingEnabled({}), false);
  assert.equal(frontendHostingEnabled({ SERVE_FRONTEND: "false" }), false);
  assert.equal(frontendHostingEnabled({ SERVE_FRONTEND: "TRUE" }), true);
});

test("frontend hosting refuses to start without the built staff pages", () => {
  assert.throws(
    () => createFrontendHostingConfig({
      env: { SERVE_FRONTEND: "true" },
      publicDirectory: "/definitely/not/the/snack/frontend"
    }),
    /index\.html was not found/
  );
});

test("Cloud Run frontend registers pages, aliases, and matching security headers", async () => {
  const config = createFrontendHostingConfig({
    env: { SERVE_FRONTEND: "true" },
    publicDirectory
  });

  const savedHeaders = new Map();
  applyFrontendSecurityHeaders({}, {
    setHeader(name, value) {
      savedHeaders.set(name.toLowerCase(), value);
    }
  }, () => savedHeaders.set("continued", true));
  for (const [name, value] of Object.entries(frontendSecurityHeaders())) {
    assert.equal(savedHeaders.get(name.toLowerCase()), value, name);
  }
  assert.equal(savedHeaders.get("continued"), true);

  const routes = new Map();
  const middleware = [];
  mountFrontendFiles({
    get(route, handler) {
      routes.set(route, handler);
    },
    use(handler) {
      middleware.push(handler);
    }
  }, config);

  assert.deepEqual([...routes.keys()], ["/booking", "/book"]);
  assert.equal(middleware.length, 1);

  for (const [route, filename] of [["/booking", "booking.html"], ["/book", "book.html"]]) {
    let sentFile = "";
    routes.get(route)({}, { sendFile(value) { sentFile = value; } });
    assert.equal(sentFile, path.join(publicDirectory, filename));
  }

  for (const filename of ["index.html", "booking.html", "book.html", "refer.html", "refer-print.html", "print-shell.html"]) {
    assert.match(await readFile(path.join(publicDirectory, filename), "utf8"), /SNACK/i);
  }
});

test("only the same-origin client form print view may be embedded", () => {
  assert.equal(isSameOriginPrintEmbed({
    path: "/client-form.html",
    query: { embed: "1", mode: "print" }
  }), true);
  assert.equal(isSameOriginPrintEmbed({
    path: "/client-form.html",
    query: { embed: "1" }
  }), false);
  assert.equal(isSameOriginPrintEmbed({
    path: "/schedule.html",
    query: { embed: "1", mode: "print" }
  }), false);

  const headersFor = (request) => {
    const savedHeaders = new Map();
    applyFrontendSecurityHeaders(request, {
      setHeader(name, value) {
        savedHeaders.set(name.toLowerCase(), value);
      },
      removeHeader(name) {
        savedHeaders.delete(name.toLowerCase());
      }
    }, () => {});
    return savedHeaders;
  };

  const embeddedHeaders = headersFor({
    path: "/client-form.html",
    query: { embed: "1", mode: "print" }
  });
  assert.equal(embeddedHeaders.has("x-frame-options"), false);
  assert.equal(embeddedHeaders.get("content-security-policy"), "frame-ancestors 'self'");
  assert.equal(headersFor({
    path: "/client-form.html",
    query: { embed: "1" }
  }).get("x-frame-options"), "DENY");
  assert.equal(headersFor({
    path: "/schedule.html",
    query: { embed: "1", mode: "print" }
  }).get("x-frame-options"), "DENY");
});
