import { index, route, type RouteConfig } from "@react-router/dev/routes";

/* Section 5 — the seven routes. The last one is the 404. */
export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("treatments", "routes/treatments.tsx"),
  route("faqs", "routes/faqs.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
