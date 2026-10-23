# Build progress — Sakthi Dental Clinic

Updated 2026-10-23 · Source of truth: `Sakthi Dental Clinic — MERN Website Project Plan.md` (Day 1–10).

## Done

- **Day 1** — repo, npm workspaces (`shared` / `server` / `client`), ESLint 10 + Prettier + Husky/lint-staged, CI skeleton, design tokens, `server/src/seed/content.json` with every line of brief copy (privacy policy verbatim).
- **Day 2** — 8 Mongoose models, shared zod schemas with pinned counts, `npm run seed`; Gate 1 preview in `design/preview.html`.
- **Day 3** — API complete: env validation, AppError, logger, hashIp, rate limit, content/contact/mail services, 3 routers, **33 tests**. Client shell: router, header/footer, mobile menu + action bar, buttons, single `ctaConfig.ts`, 6 routes + 404. All endpoints and the contact POST verified live.
- **Day 4** — Home page: hero + trust strip, assurance banner, why-choose (4), core treatments (6), testimonial carousel (6 s auto-rotate, dots/arrows/pause, stops on hover/focus/reduced motion), amenities (5), CTA band. 16 Pexels photos replace the watermarked collages; credited in `CREDITS.md`.

## Errors found and fixed

| Error                            | Cause                                   | Fix                                         |
| -------------------------------- | --------------------------------------- | ------------------------------------------- |
| 710 px horizontal overflow       | drawer used `translate-x-full`          | `overflow-hidden` on the shell              |
| Drawer stuck inside 80 px header | `backdrop-blur` traps `position: fixed` | portal to `document.body`                   |
| Unknown URLs returned HTTP 200   | SPA fallback                            | loader throws `404 Response`                |
| Seed rejected content            | schema mismatch                         | validate `content.json` before writing      |
| Seed crashed on photos           | hero image had no schema field          | added `hero.image` to schema, model, seed   |
| Screenshot click ignored         | page not hydrated at 3.5 s              | harness timing, not a bug (probe confirmed) |

## Live blocker

- ~~Atlas refused this machine~~ — resolved 2026-10-23: database password rotated, IP whitelisted, cluster re-seeded from `content.json`. All 9 content endpoints and the contact POST verified against the live database.
- `.env` holds the only copy of the new password; it is gitignored and no credential has ever been committed.

## Warnings / not errors

- `SMTP_HOST`/`SMTP_USER` empty → contact messages save to MongoDB, email skipped (`emailNotified: false`).
- React Router: `envFile` deprecation and a v8 future-flag warning.
- `mongodb-memory-server` postinstall noise; tests are fine.
- `git commit` prints exit code 1 in PowerShell (stderr warnings only); commits land.

## Remaining

- **Day 5** — About, Treatments (15 anchored sections).
- **Day 6** — FAQs, Contact (form + API + email), Privacy Policy, 404. Gate 2: all pages on the preview URL.
- **Day 7** — responsive pass 360/768/1024/1440, carousel/accordion/sticky bar/scroll motion polish.
- **Day 8** — meta + JSON-LD + sitemap, image pipeline, accessibility fixes, Lighthouse budgets.
- **Day 9** — Playwright on 3 engines, real devices, proofreading. Gate 3: QA sign-off.
- **Day 10** — production deploy, go-live checks, README and handover, demo.

## Waiting on you

- Approve `concurrently` so one `npm run dev` starts both servers.
- SMTP credentials for clinic email notifications.
- Why Choose intro sentence is missing from the brief (content gap #11) — section ships heading + 4 cards.
- `contact_messages` TTL is 365 days — confirm before go-live.
