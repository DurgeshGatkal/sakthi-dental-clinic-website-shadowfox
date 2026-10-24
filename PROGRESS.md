# Build progress — Sakthi Dental Clinic

Updated 2026-10-24 · Source of truth: `Sakthi Dental Clinic — MERN Website Project Plan.md` (Day 1–10).

## Done

- **Day 1** — repo, npm workspaces (`shared` / `server` / `client`), ESLint 10 + Prettier + Husky/lint-staged, CI skeleton, design tokens, `server/src/seed/content.json` with every line of brief copy (privacy policy verbatim).
- **Day 2** — 8 Mongoose models, shared zod schemas with pinned counts, `npm run seed`; Gate 1 preview in `design/preview.html`.
- **Day 3** — API complete: env validation, AppError, logger, hashIp, rate limit, content/contact/mail services, 3 routers, **33 tests**. Client shell: router, header/footer, mobile menu + action bar, buttons, single `ctaConfig.ts`, 6 routes + 404. All endpoints and the contact POST verified live.
- **Day 4** — Home page: hero + trust strip, assurance banner, why-choose (4), core treatments (6), testimonial carousel (6 s auto-rotate, dots/arrows/pause, stops on hover/focus/reduced motion), amenities (5), CTA band. 16 Pexels photos replace the watermarked collages; credited in `CREDITS.md`.
- **Day 5** — About page: banner, founder story with credential panel (neutral monogram — no stock face under a real doctor's name), mission + vision cards, 9-doctor grid. Treatments page: banner, 15-chip jump list (sideways scroll on phones), 15 anchored blocks in brief order with alternating image sides and a per-treatment CTA. `clinic_info` gained `founder` and `visionMission` so the About copy comes from the seed, not from markup.
- **Day 6** — FAQs page: 14-question accordion (one open at a time, first open, real `aria-expanded`/`aria-controls`) plus the "Still have questions?" card. Contact page: form validated by the shared zod schema, server 422 field messages written back onto the inputs, success card, honeypot, phone fallback on failure; Reach us panel with tappable email, both phones and hours; Google Maps link. Privacy Policy rendered from the stored markdown into 9 sections in a 720 px column with a "Last updated" line. 404 was already complete on Day 3. All 7 routes now exist (Gate 2 scope); layout checked at 320/390/768/1280 and the form exercised end to end.
- **Day 6 fixes** — one `npm run dev` now starts both servers (`concurrently`, colour-coded, `-k` so one Ctrl-C stops both). Contact inputs carry `aria-required`; the form is the positioning context for the honeypot. Footer gained social links that render only when real profile URLs are seeded. Live re-check after the Atlas allow-list change: seed, all 9 endpoints, all 7 pages, real browser submit saved to `contact_messages`, 404 returns HTTP 404.

## Errors found and fixed

| Error                            | Cause                                       | Fix                                                |
| -------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| 710 px horizontal overflow       | drawer used `translate-x-full`              | `overflow-hidden` on the shell                     |
| Drawer stuck inside 80 px header | `backdrop-blur` traps `position: fixed`     | portal to `document.body`                          |
| Unknown URLs returned HTTP 200   | SPA fallback                                | loader throws `404 Response`                       |
| Seed rejected content            | schema mismatch                             | validate `content.json` before writing             |
| Seed crashed on photos           | hero image had no schema field              | added `hero.image` to schema, model, seed          |
| About copy had no home           | founder text was in the brief, not the seed | added `founder` + `visionMission` to `clinic_info` |
| Screenshot click ignored         | page not hydrated at 3.5 s                  | harness timing, not a bug (probe confirmed)        |
| Footer had no social links       | lucide no longer ships brand icons          | labelled links, rendered only for real URLs        |

## Database notes

- Atlas has accepted this machine twice now. The 2026-10-23 refusal (rotated password + IP allow-list) and the 2026-10-24 repeat (add `223.238.161.140` to Network Access) are both cleared. Cluster re-seeded from `content.json`: 15 treatments / 14 FAQs / 9 doctors / 5 amenities / 4 why-choose / 3 testimonials / 1 clinic record.
- Live verification on 2026-10-24: all 9 content endpoints return 200, all 7 pages render against the live API, a real browser submit landed in `contact_messages`, invalid phone returns HTTP 422 with the field message, unknown URL returns HTTP 404. QA rows were deleted afterwards.
- `.env` holds the only copy of the database password; it is gitignored and no credential has ever been committed.

## Warnings / not errors

- `SMTP_HOST`/`SMTP_USER` empty → contact messages save to MongoDB, email skipped (`emailNotified: false`). Day 6 sends still need one live check after SMTP is configured.
- React Router: `envFile` deprecation and a v8 future-flag warning.
- `mongodb-memory-server` postinstall noise; tests are fine.
- `git commit` prints exit code 1 in PowerShell (stderr warnings only); commits land.

## Remaining

- **Day 7** — responsive pass 360/768/1024/1440, carousel/accordion/sticky bar/scroll motion polish.
- **Day 8** — meta + JSON-LD + sitemap, image pipeline, accessibility fixes, Lighthouse budgets.
- **Day 9** — Playwright on 3 engines, real devices, proofreading. Gate 3: QA sign-off.
- **Day 10** — production deploy, go-live checks, README and handover, demo.

## Waiting on you

- SMTP credentials for clinic email notifications (`SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `MAIL_TO`). Until they are in `.env`, the form still saves the message but `emailNotified` stays `false` and the clinic gets no mail.
- Why Choose intro sentence is missing from the brief (content gap #11) — section ships heading + 4 cards.
- Treatments banner has no intro line in the brief (content gap #12) — banner ships title only.
- The plan asks for a static map image on Contact (content gap #13). There is no map asset and no Google Static Maps key, so the page ships a styled "Open in Google Maps" link instead — no iframe, nothing to load.
- Dr. Anupriya has no portrait, so the founder section uses a monogram; all 9 doctor cards use initials until photos arrive.
- Real Instagram / Facebook / YouTube URLs — the footer renders those links as soon as they are seeded (they are `#` today, so nothing renders rather than a dead link).

## Approved decisions

- `contact_messages` keeps the planned 365-day TTL on `createdAt` — approved 2026-10-24, nothing to change.
