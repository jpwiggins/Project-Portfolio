// server/index.ts
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var log = (message, source = "server") => {
  const t = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  console.log(`${t} [${source}] ${message}`);
};
async function setupVite(app, _server) {
  const vite = await createViteServer({
    root: path.resolve(__dirname, "..", "client"),
    server: { middlewareMode: true }
  });
  app.use(vite.middlewares);
  app.get("/login.html", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "public", "login.html"));
  });
}
function serveStatic(app) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  const publicPath = path.resolve(__dirname, "..", "client", "public");
  app.use(express.static(distPath));
  if (process.env.NODE_ENV !== "production") {
    app.use(express.static(publicPath));
  }
  app.get("/login.html", (_req, res) => {
    res.sendFile(path.join(distPath, "login.html"), (err) => {
      if (err) res.sendFile(path.join(publicPath, "login.html"));
    });
  });
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
export {
  log,
  serveStatic,
  setupVite
};
