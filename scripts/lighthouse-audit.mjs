/*
 * Section 14 — Lighthouse budget gate.
 *
 *   npm run build -w @sakthi/client
 *   node scripts/serve-build.mjs
 *   node scripts/lighthouse-audit.mjs
 *
 * Audits every prerendered route on the mobile 4G profile and fails when a
 * budget is missed. JSON reports land in .lighthouseci/ (git-ignored).
 */
import { mkdir, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = (process.env.LIGHTHOUSE_BASE ?? "http://127.0.0.1:5000").replace(/\/$/, "");
const ROUTES = ["/", "/about", "/treatments", "/faqs", "/contact", "/privacy-policy"];

/* Section 14 budgets: 90 performance, 100 everywhere else. */
const BUDGETS = {
  performance: 90,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
};

const CATEGORIES = Object.keys(BUDGETS);
const MAX_LCP_MS = 2500;
const MAX_CLS = 0.1;
const MAX_TBT_MS = 200;
const MAX_TOTAL_BYTES = 1024 * 1024;
const MAX_JS_BYTES = 120 * 1024;

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

let failed = false;

try {
  await mkdir(".lighthouseci", { recursive: true });

  for (const route of ROUTES) {
    const result = await lighthouse(`${BASE}${route}`, {
      port: chrome.port,
      output: "json",
      onlyCategories: CATEGORIES,
      throttlingMethod: "simulate",
      formFactor: "mobile",
      logLevel: "error",
    });

    if (!result) throw new Error(`Lighthouse returned nothing for ${route}`);
    const { lhr, report } = result;
    const name = route === "/" ? "home" : route.slice(1);
    await writeFile(`.lighthouseci/${name}.json`, report);

    const scores = Object.fromEntries(
      CATEGORIES.map((key) => [key, Math.round(lhr.categories[key].score * 100)]),
    );
    const lcp = lhr.audits["largest-contentful-paint"].numericValue;
    const cls = lhr.audits["cumulative-layout-shift"].numericValue;
    const tbt = lhr.audits["total-blocking-time"].numericValue;
    const requests = lhr.audits["network-requests"].details.items;
    const totalBytes = requests.reduce((sum, item) => sum + (item.transferSize ?? 0), 0);
    const jsBytes = requests
      .filter((item) => item.resourceType === "Script")
      .reduce((sum, item) => sum + (item.transferSize ?? 0), 0);

    const problems = [];
    for (const [key, minimum] of Object.entries(BUDGETS)) {
      if (scores[key] < minimum) problems.push(`${key} ${scores[key]} < ${minimum}`);
    }
    if (lcp > MAX_LCP_MS) problems.push(`LCP ${Math.round(lcp)} ms > ${MAX_LCP_MS} ms`);
    if (cls > MAX_CLS) problems.push(`CLS ${cls.toFixed(3)} > ${MAX_CLS}`);
    if (tbt > MAX_TBT_MS) problems.push(`TBT ${Math.round(tbt)} ms > ${MAX_TBT_MS} ms`);
    if (totalBytes > MAX_TOTAL_BYTES) problems.push(`weight ${kb(totalBytes)} > 1 MB`);
    if (jsBytes > MAX_JS_BYTES) problems.push(`JS ${kb(jsBytes)} > 120 KB`);

    if (problems.length > 0) failed = true;

    console.log(
      `${route.padEnd(16)} perf ${String(scores.performance).padStart(3)}  ` +
        `a11y ${String(scores.accessibility).padStart(3)}  ` +
        `bp ${String(scores["best-practices"]).padStart(3)}  seo ${String(scores.seo).padStart(3)}  ` +
        `LCP ${Math.round(lcp)} ms  CLS ${cls.toFixed(3)}  TBT ${Math.round(tbt)} ms  ` +
        `total ${kb(totalBytes)}  JS ${kb(jsBytes)}` +
        (problems.length > 0 ? `\n  FAIL: ${problems.join("; ")}` : ""),
    );
  }
} finally {
  await chrome.kill();
}

if (failed) {
  console.error("\nLighthouse budgets missed (see .lighthouseci/*.json).");
  process.exit(1);
}

console.log("\nAll routes meet the section 14 budgets.");
