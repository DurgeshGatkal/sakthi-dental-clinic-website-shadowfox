/*
 * Section 14 — writes robots.txt and sitemap.xml from the route list.
 *
 *   node scripts/seo-files.mjs
 *
 * Runs before dev and build so the files always exist. Honours SITE_URL so a
 * preview deployment advertises its own origin instead of production.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../shared/src/site.js";

const ROUTES = ["/", "/about", "/treatments", "/faqs", "/contact", "/privacy-policy"];

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "client", "public");
const base = (process.env.SITE_URL ?? SITE_URL).replace(/\/+$/, "");

const urls = ROUTES.map((path) => `  <url>\n    <loc>${base}${path}</loc>\n  </url>`).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;

writeFileSync(join(publicDir, "sitemap.xml"), sitemap);
writeFileSync(join(publicDir, "robots.txt"), robots);

console.log(`seo-files: ${ROUTES.length} routes -> ${base}/sitemap.xml`);
