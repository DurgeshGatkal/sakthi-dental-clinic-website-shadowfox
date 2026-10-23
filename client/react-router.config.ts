import type { Config } from "@react-router/dev/config";

/*
 * Section 7 — React Router v7 in framework mode with prerendering on.
 * Every public route is rendered to HTML at build time; the 404 is a splat
 * route and cannot be prerendered.
 */
export default {
  ssr: true,
  prerender: ["/", "/about", "/treatments", "/faqs", "/contact", "/privacy-policy"],
} satisfies Config;
