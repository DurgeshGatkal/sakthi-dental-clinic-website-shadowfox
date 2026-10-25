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
- **Showcase decision (2026-10-25)** — the email address and phone numbers on the site are display copy only; no live mailbox or call routing sits behind them. Email notifications are now off by default (`MAIL_ENABLED=false`), so no connection is attempted and no warning is logged per submission. Enquiries still validate and save to MongoDB, which keeps the form honest for review. Setting `MAIL_ENABLED=true` plus real SMTP values switches delivery back on without code changes.
- **Local development (2026-10-25)** — `npm run dev:local` starts a real `mongod` on `127.0.0.1:27017`, seeds `content.json`, then runs API + client against it. No Atlas allow-list, no network dependency, works offline. Data lives in `.local-db/` (git-ignored, ~200 MB of WiredTiger preallocation) and survives restarts — verified by saving an enquiry, force-killing the process tree, restarting, and reading the document back. The mongod binary was already cached for the test suite, so nothing new was downloaded. `npm run dev` still targets Atlas for parity checks and the deployed API.

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
| Contact could hang 2 min on SMTP | nodemailer's 2 min default, send is awaited | 10 s connect/greeting, 20 s socket; mailer tested  |

## Database notes

- Why the Atlas allow-list keeps breaking: home broadband hands out a **dynamic public IP**, so the address changes on router reboots and lease renewals. Atlas checks the source address of every connection, so each change looks like a stranger at the door. It is not a database fault. Observed addresses: `223.238.161.140` (24 Oct) and `27.59.111.52` (25 Oct).
- Fix adopted: day-to-day work uses `npm run dev:local`, so Atlas is never consulted from this machine. Only the deployed API will talk to Atlas, and that host has a stable address to whitelist once. Delete the stale entries in Atlas → Network Access so the live entry is obvious.
- Live verification on 2026-10-24 (before the IP changed): all 9 content endpoints return 200, all 7 pages render against the live API, a real browser submit landed in `contact_messages`, invalid phone returns HTTP 422 with the field message, unknown URL returns HTTP 404. QA rows were deleted afterwards.
- `.env` holds the only copy of the database password; it is gitignored and no credential has ever been committed.

## Warnings / not errors

- Email notifications are deliberately off (`MAIL_ENABLED=false`) — the address on the site has no mailbox behind it. The mailer itself is still covered by `server/test/mail-service.test.js`: a local SMTP stub receives the real message, a refused connection returns `false` instead of throwing, and the showcase path sends nothing at all.
- React Router: `envFile` deprecation and a v8 future-flag warning.
- `mongodb-memory-server` postinstall noise; tests are fine.
- `git commit` prints exit code 1 in PowerShell (stderr warnings only); commits land.

## Remaining

- **Day 7** — responsive pass 360/768/1024/1440, carousel/accordion/sticky bar/scroll motion polish.
- **Day 8** — meta + JSON-LD + sitemap, image pipeline, accessibility fixes, Lighthouse budgets.
- **Day 9** — Playwright on 3 engines, real devices, proofreading. Gate 3: QA sign-off.
- **Day 10** — production deploy, go-live checks, README and handover, demo.

## Waiting on you

- **Email notifications stay off** for the showcase build, as you decided. Nothing to supply now. If the clinic later wants real enquiries by mail: `MAIL_ENABLED=true`, a real `MAIL_TO` inbox, and SMTP credentials.
- The brief's `info@sakthidentalclinic.in` is a **non-existent domain** (DNS: NXDOMAIN). The clinic's live domain is `sakthidental.in` on Hostinger, which publishes `info@sakthidental.in`. Worth correcting the copy at handover — I have not changed brief copy.
- Why Choose intro sentence is missing from the brief (content gap #11) — section ships heading + 4 cards.
- Treatments banner has no intro line in the brief (content gap #12) — banner ships title only.
- The plan asks for a static map image on Contact (content gap #13). There is no map asset and no Google Static Maps key, so the page ships a styled "Open in Google Maps" link instead — no iframe, nothing to load.
- Dr. Anupriya has no portrait, so the founder section uses a monogram; all 9 doctor cards use initials until photos arrive.
- Real Instagram / Facebook / YouTube URLs — the footer renders those links as soon as they are seeded (they are `#` today, so nothing renders rather than a dead link).

## Approved decisions

- Contact links stay clickable (`mailto:` / `tel:`), chosen 2026-10-25 — they only open the visitor's own mail app or dialer, so no enquiry reaches a mailbox or the clinic's phone. The displayed address and numbers are showcase copy.
- `contact_messages` keeps the planned 365-day TTL on `createdAt` — approved 2026-10-24, nothing to change.
