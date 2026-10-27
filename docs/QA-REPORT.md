# QA Report — Sakthi Dental Clinic Website

Generated at handover. All numbers come from the last full run of `npm run test:e2e` plus `npm test` and the Lighthouse audit, executed against the prerendered build.

## Summary

| Suite                      | Command                             | Result                                                                                          |
| -------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| API + services             | `npm test`                          | 36 / 36 passing                                                                                 |
| End-to-end + accessibility | `npm run test:e2e`                  | 190 checks — 162 passed, 28 intentionally skipped                                               |
| axe-core                   | part of the E2E run                 | Zero serious or critical violations on 7 documents                                              |
| Lighthouse (mobile, 4G)    | `node scripts/lighthouse-audit.mjs` | Performance 91–95, Accessibility 100, Best Practices 100, SEO 100                               |
| Responsive audit           | `node scripts/responsive-audit.mjs` | No horizontal scroll, no tap target under 48 px, no type under 15 px across 24 page/width pairs |
| Lint / types               | `npm run lint`, `npm run typecheck` | Clean                                                                                           |

## Environment

- Node 24, npm workspaces
- Browsers: Chromium, Firefox, WebKit, Pixel 7, iPhone 14 (Playwright emulation)
- API + DB: disposable `mongod` on 27018, seeded `sakthi_e2e`, API on 4000, static build on 5000 (`scripts/e2e-env.mjs`)
- No physical devices, NVDA or VoiceOver available; mobile coverage is emulation only

## End-to-end coverage

- Every header and footer link, on all six pages
- The "Fix an Appointment" CTA on every page
- "View Full List of Treatments" and card-to-anchor jumps
- All 15 treatment blocks and 15 jump chips
- The 14-question FAQ accordion (single-open, first open by default)
- Contact form: required-field errors, malformed phone, unreachable API fallback, happy path (document verified in `contact_messages`, including lowercased email, normalised phone and 64-character IP hash)
- No `href="#"` anywhere
- Branded 404 with HTTP 404
- No horizontal scroll at 320 / 360 / 768 / 1280 px
- Mobile drawer at 320 px (focus return, `inert` while closed, 48 px action bar clear of the footer)
- axe-core on all six routes plus the 404

## Intentionally skipped checks (28)

The CSS width sweep and the single real database write run once on Chromium instead of five times. This keeps the happy-path submission under the 5-per-15-minute contact rate limit.

## Known, documented misses

- LCP 2.46–2.82 s against a 2.5 s target on four routes (reported, not gated)
- JavaScript per route 122–128 kB gzipped (160 kB on `/contact`) against a 120 kB target (reported, not gated)
- No real device, NVDA or VoiceOver pass
- No doctor or founder portraits (monograms used)

## Security checks

- `.env` is git-ignored; no secret has ever been committed
- `npm audit` not run in this pass; Dependabot is configured in CI
- No third-party trackers; the Privacy Policy's cookie section stays accurate
