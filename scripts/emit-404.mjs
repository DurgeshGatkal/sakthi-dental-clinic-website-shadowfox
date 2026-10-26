/*
 * Day 9/10 — emit the 404 document every static host expects.
 *
 *   node scripts/emit-404.mjs
 *
 * React Router writes the prerendered twin at build/client/404/index.html.
 * Vercel, Netlify and friends look for build/client/404.html, so copy it to
 * the root after the build. Runs as part of `npm run build -w @sakthi/client`.
 */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const output = join(here, "..", "client", "build", "client");
const source = join(output, "404", "index.html");
const target = join(output, "404.html");

if (!existsSync(source)) {
  console.error("emit-404: 404/index.html is missing — did the client build run?");
  process.exit(1);
}

copyFileSync(source, target);
console.log("emit-404: 404.html written.");
