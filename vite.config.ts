import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // 8000 is the port this page has always been previewed on
  server: { port: 8000, strictPort: false },
  preview: { port: 8000 },
  build: {
    // the page is one route with one stylesheet; no point splitting it
    assetsInlineLimit: 0,
  },
});
