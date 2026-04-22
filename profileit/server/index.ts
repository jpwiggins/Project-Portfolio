// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { initializeDatabase } from "../init-db.js"; // Import the initializeDatabase function

// ---- Logging ----
const log = (message: string, source = "express") => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
};

// ---- __dirname shim for ESM/TS ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- App ----
const app = express();
app.set("trust proxy", 1);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ---- Paths ----
// Vite build output (your vite.config.ts outDir is dist/public)
const distPath = path.resolve(__dirname, "..", "dist", "public");
// For dev convenience if you haven’t built yet:
const publicPath = path.resolve(__dirname, "..", "client", "public");

// ---- Explicit login.html (must be before static middleware) ----
app.get("/login.html", (_req, res) => {
  const distLoginPath = path.join(distPath, "login.html");
  const publicLoginPath = path.join(publicPath, "login.html");
  
  log(`Attempting to serve login.html from: ${distLoginPath}`);
  
  res.sendFile(distLoginPath, (err) => {
    if (err) {
      log(`Failed to serve from dist, trying public: ${publicLoginPath}`);
      res.sendFile(publicLoginPath, (fallbackErr) => {
        if (fallbackErr) {
          log(`Failed to serve login.html from both locations: ${err.message}, ${fallbackErr.message}`);
          res.status(404).send("Login page not found");
        }
      });
    } else {
      log("Successfully served login.html from dist");
    }
  });
});

// ---- Static ----
app.use(express.static(distPath)); // built files

if (process.env.NODE_ENV !== "production") {
  app.use(express.static(publicPath)); // dev convenience
}


// ---- API ----
app.use("/api", (req: Request, _res: Response, next: NextFunction) => {
  // attach db or auth info here if needed
  next();
});
registerRoutes(app);

// ---- Health ----
app.get("/healthz", (_req, res) => res.json({ ok: true }));



// ---- SPA fallback (must be last) ----
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ---- Start ----
const PORT = Number(process.env.PORT) || 5000;

(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      log(`Server running at http://localhost:${PORT}`);
      log(`Serving client from: ${distPath}`);
    });
  } catch (e: any) {
    log(`Failed to start server: ${e?.message || e}`, "startup");
    process.exit(1);
  }
})();
