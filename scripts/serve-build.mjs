/*
 * Serves the prerendered production build for local checks (Lighthouse, Day 10).
 *
 *   node scripts/serve-build.mjs            # http://127.0.0.1:5000
 *   PORT=8080 node scripts/serve-build.mjs
 *
 * No dependencies: maps /about to about/index.html, sets the right MIME types
 * and marks hashed assets immutable.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "client", "build", "client");
const port = Number(process.env.PORT ?? 5000);

const MIME = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

/* Production hosts gzip/Brotli text; mirror that so Lighthouse sees real bytes. */
const COMPRESSIBLE = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);

function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, clean);

  if (!file.startsWith(root)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) return null;
  return file;
}

const server = createServer((req, res) => {
  const file = resolveFile(req.url ?? "/");

  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const immutable =
    file.includes(`${join("build", "client", "assets")}`) || file.includes("/assets/");
  const extension = extname(file).toLowerCase();
  const headers = {
    "Content-Type": MIME[extension] ?? "application/octet-stream",
    "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "no-cache",
  };

  if (COMPRESSIBLE.has(extension) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "")) {
    res.writeHead(200, { ...headers, "Content-Encoding": "gzip", Vary: "Accept-Encoding" });
    createReadStream(file).pipe(createGzip()).pipe(res);
    return;
  }

  res.writeHead(200, headers);
  createReadStream(file).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`build served from ${root} at http://127.0.0.1:${port}`);
});
