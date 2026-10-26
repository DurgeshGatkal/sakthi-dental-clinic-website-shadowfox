import type { Config } from "@react-router/dev/config";

/*
 * Section 7 — React Router v7 in framework mode with prerendering on.
 * Every public route is rendered to HTML at build time. The splat route
 * throws (it must answer with HTTP 404), so /404 is a separate twin that can
 * be prerendered and copied to 404.html by scripts/emit-404.mjs.
 */
export default {
  ssr: true,
  prerender: ["/", "/about", "/treatments", "/faqs", "/contact", "/privacy-policy", "/404"],
  /* Seven routes: ship the whole manifest with the first document instead of
   * fetching /__manifest, which a static host cannot answer. */
  routeDiscovery: { mode: "initial" },
} satisfies Config;
