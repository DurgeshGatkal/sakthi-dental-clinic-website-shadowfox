import type { Config } from "@react-router/dev/config";

/*
 * Section 7 — React Router v7 in framework mode with prerendering on.
 * Every public route is rendered to HTML at build time; the 404 is a splat
 * route and cannot be prerendered.
 */
export default {
  ssr: true,
  prerender: ["/", "/about", "/treatments", "/faqs", "/contact", "/privacy-policy"],
  /* Seven routes: ship the whole manifest with the first document instead of
   * fetching /__manifest, which a static host cannot answer. */
  routeDiscovery: { mode: "initial" },
} satisfies Config;
