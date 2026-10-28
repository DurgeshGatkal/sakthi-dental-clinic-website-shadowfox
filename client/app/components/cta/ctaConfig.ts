/*
 * Section 10 — integration point for the clinic's booking and emergency
 * actions. Every CTA on the site calls through here, so no component needs
 * to change: edit only these two functions.
 *
 * Defaults (wired 2026-10-28):
 *   - appointment: take the visitor to the enquiry form on /contact
 *   - emergency:   dial the clinic's primary number
 * Replace with a real booking flow (booking page, WhatsApp, Calendly, ...)
 * when the clinic is ready.
 */
export type CtaLocation =
  | "header"
  | "mobile-menu"
  | "mobile-bar"
  | "hero"
  | "assurance"
  | "page-cta"
  | "home-treatments"
  | `treatment:${string}`;

export const ctaHandlers = {
  appointment: (_location?: CtaLocation) => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/contact") {
      document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.assign("/contact#enquiry");
  },
  emergency: (_location?: CtaLocation) => {
    if (typeof window === "undefined") return;
    window.location.href = "tel:+919862890897";
  },
};

// Backwards-compatible alias used by some components.
export const ctaConfig = ctaHandlers;
