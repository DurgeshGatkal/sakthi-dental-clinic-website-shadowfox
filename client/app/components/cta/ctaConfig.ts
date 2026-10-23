/*
 * Section 10 — the only integration point for the ShadowFox dev team.
 *
 * Replace the two handlers below with the real booking and emergency
 * actions. Every CTA on the site calls through here, so no component
 * needs to change.
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
    // TODO(ShadowFox): open the clinic's booking flow.
  },
  emergency: (_location?: CtaLocation) => {
    // TODO(ShadowFox): dial the emergency line or open WhatsApp.
  },
};
