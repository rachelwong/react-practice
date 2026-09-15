import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Local proxy for Neds API
      "/neds-api": {
        target: "https://api.neds.com.au",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/neds-api/, ""),
      },
      // Local proxy for Email Verifier API
      "/email-api": {
        target: "https://rapid-email-verifier.fly.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/email-api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
