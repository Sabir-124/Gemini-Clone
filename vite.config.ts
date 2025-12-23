import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || "/Gemini-Clone",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "google-genai": ["@google/genai"],
          "ui-vendor": [
            "framer-motion",
            "react-markdown",
            "react-syntax-highlighter",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
