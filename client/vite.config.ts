import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      /* Root-relative, so no Node typings are needed in this config. */
      "~": "/app",
    },
  },
  server: {
    port: 5173,
  },
});
