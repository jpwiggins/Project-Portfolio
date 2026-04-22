// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// ESM-safe __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Inline manifest to avoid ESM require issues
      manifest: {
        name: "NurseHub",
        short_name: "NurseHub",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        description: "Essential tools for nurses in one platform.",
        icons: [
          { src: "/assets/nursehub-logo.png", sizes: "192x192", type: "image/png" },
          { src: "/assets/nursehub-logo.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: { globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"] }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "client", "src"),
      "@shared": resolve(__dirname, "shared"),
      "@assets": resolve(__dirname, "attached_assets")
    }
  },
  // Client source lives here
  root: resolve(__dirname, "client"),
  // IMPORTANT: build where the server serves from
  build: {
    outDir: resolve(__dirname, "server", "dist", "public"),
    emptyOutDir: true
  },
  server: {
    fs: { strict: true, deny: ["**/.*"] }
  }
});
