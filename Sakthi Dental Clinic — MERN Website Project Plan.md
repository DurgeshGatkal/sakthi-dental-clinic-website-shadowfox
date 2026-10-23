# Sakthi Dental Clinic — MERN Website Project Plan

Oct 23, 2026 · @Mahajan Sarthak Dileep

Step-by-step build instructions for a coding agent live in Implementation Runbook.

## 1. Understanding the project

We are building a 7-page, mobile-first marketing website for Sakthi Dental Clinic, Hosur, on the MERN stack, delivered in 10 working days. The site's job is to make a first-time visitor trust the clinic within seconds and then either press **Fix an Appointment**, call, or send a message.

**Who the client is.** A Hosur clinic founded in 2004 by Dr. Anupriya, known for dental care for women and children, offering everything from consultations to implants and orthodontics. The brand must read as professional, warm and credible.

**Who the users are.** Patients of all ages, parents and guardians booking for children, and senior citizens. Most arrive on a phone. This drives three non-negotiables: large readable text, obvious navigation, and a CTA that is never more than one tap away.

**What the site must do.**

- Introduce the clinic's specialization and build trust (doctor credentials, 20+ years, 9-doctor team, testimonials).
- Showcase treatments: 6 on Home, all 15 on a dedicated Treatments page.
- Show amenities: parking, wheelchair access, pickup and drop-off, central location, daily doctor availability.
- Answer 14 common questions on an FAQs page.
- Capture enquiries through a validated contact form, stored in MongoDB.
- Publish the Privacy Policy verbatim.

**Scope boundaries (mandatory from the brief).**

- **CTA buttons only.** "Fix an Appointment" and the optional "Emergency Dental Support" are built as styled buttons with a single integration hook. The ShadowFox web development team wires their action, so we build **no booking system**.
- Only copyright-free images and icons, plus the assets in the client's Drive folder.
- Content is used as supplied; the Privacy Policy is copied exactly.
- Out of scope: online booking, payments, patient login, admin dashboard, blog, multilingual content. These are listed so nobody silently adds them inside a 10-day window.

**Why MERN fits.** MongoDB holds clinic content (treatments, doctors, FAQs, testimonials, amenities, clinic info) and contact submissions. Express exposes a small versioned REST API. React renders the pages, prerendered at build time so search engines see full HTML. Node runs the API. Content changes later need a database edit, not a code release.

## 2. Requirements traceability matrix

All 52 requirements in the brief map to a build location and a check; the final review (section 19) walks this table row by row.

| ID  | Requirement from the brief                                                                                     | Where it is built                                                                                      | Verified by                          |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| G1  | Copyright-free images and icons only                                                                           | `/client/public/images`, lucide-react icons, Drive assets; `CREDITS.md` lists every source and licence | Asset audit before release           |
| G2  | Reflect professionalism, warmth, credibility                                                                   | Design system (section 6), trust strip, doctor credentials                                             | Coordinator design review            |
| G3  | Diverse audience incl. seniors: clarity, easy navigation                                                       | 18 px body text, 48 px tap targets, max 5 nav items, plain labels                                      | Accessibility checklist (section 13) |
| G4  | "Fix an Appointment" CTA prominent; button only                                                                | `AppointmentButton` in header, hero, mobile sticky bar, section ends                                   | E2E: button visible on every page    |
| G5  | Design for mobile first                                                                                        | Mobile-first Tailwind breakpoints from 360 px                                                          | Playwright mobile viewports          |
| C1  | Clean, modern, minimalistic design                                                                             | Whitespace scale, 2 typefaces, soft palette                                                            | Design review                        |
| C2  | Smooth content flow, clear navigation                                                                          | Section order per page (section 5), sticky header, anchor links                                        | Usability walk-through               |
| C3  | Emphasis on Treatments, Amenities, Testimonials, Contact                                                       | Dedicated Home sections + Treatments and Contact pages                                                 | Content checklist                    |
| C4  | Highlight doctor credentials and clinic specialties                                                            | About page founder bio, 9-doctor grid with specialties, Why Choose cards                               | Content checklist                    |
| F1  | Prominent hero with specialization in women and children                                                       | `Hero` component, Home                                                                                 | Visual review                        |
| F2  | Quick nav: About Us, Treatments, FAQs, Contact                                                                 | `Navbar` (desktop) + `MobileMenu` drawer                                                               | E2E nav test                         |
| F3  | Visually engaging treatments showcase                                                                          | `TreatmentCard` grid, icons + images                                                                   | Visual review                        |
| F4  | Amenities: parking, wheelchair access, transport                                                               | `Amenities` section, Home                                                                              | Content checklist                    |
| F5  | Testimonials in attractive cards                                                                               | `TestimonialCarousel`                                                                                  | Visual review                        |
| F6  | Footer: contact details, nav shortcuts, services list                                                          | `Footer` on every page                                                                                 | E2E footer test                      |
| H1  | Hero headline, subtext, Fix an Appointment, optional Emergency CTA                                             | `Hero` with exact copy; `EmergencyButton` included                                                     | Copy proofread                       |
| H2  | Assurance banner "You are always in safe hands..." with Drive banner images                                    | `AssuranceBanner`                                                                                      | Visual review                        |
| H3  | Why Choose: 4 points with exact copy                                                                           | `WhyChoose` 4 cards                                                                                    | Copy proofread                       |
| H4  | Explore Our Services: 2 or 3 columns, icons/images, 6 treatments                                               | `CoreTreatments` 1/2/3 columns by breakpoint                                                           | Responsive test                      |
| H5  | CTA "View Full List of Treatments" redirects to Treatments page                                                | Link to `/treatments`                                                                                  | E2E link test                        |
| H6  | "What Our Patients Say", rotating quotes, 3 testimonials                                                       | `TestimonialCarousel` with auto-rotate + pause                                                         | E2E + axe                            |
| H7  | Clinic Facilities: 5 items with small icons                                                                    | `Amenities` icon list                                                                                  | Content checklist                    |
| H8  | Footer: address/contact, Home, About, Treatments, Privacy Policy, key treatments, Instagram, Facebook, YouTube | `Footer`                                                                                               | E2E footer test                      |
| A1  | "Get to Know Dr. Anupriya" + subtitle + 4 bio paragraphs                                                       | `/about` founder section                                                                               | Copy proofread                       |
| A2  | Our Vision & Mission                                                                                           | `/about` section                                                                                       | Copy proofread                       |
| A3  | Team of 9 doctors with roles                                                                                   | `/about` `DoctorGrid`                                                                                  | Count = 9                            |
| T1  | Separate Treatments page with all 15 treatments                                                                | `/treatments`, anchor per treatment                                                                    | Count = 15                           |
| I1  | Use Drive images (banners, icons)                                                                              | Downloaded, optimized to WebP/AVIF                                                                     | Asset audit                          |
| Q1  | 14 FAQs                                                                                                        | `/faqs` accordion                                                                                      | Count = 14                           |
| K1  | Contact title "We would love to hear from you", form on left                                                   | `/contact` two-column layout                                                                           | Visual review                        |
| K2  | Fields: Name, Email, Phone (required), Message (optional)                                                      | `ContactForm`                                                                                          | Unit + E2E                           |
| K3  | Validation for required fields                                                                                 | zod schema shared by client and server                                                                 | Unit + API tests                     |
| K4  | Email format verification                                                                                      | zod `email()` client and server                                                                        | Unit + API tests                     |
| K5  | Stacked fields on mobile                                                                                       | Single-column form under 768 px                                                                        | Mobile viewport test                 |
| K6  | Submit button labelled "Submit", primary accent colour                                                         | `Button variant="primary"`                                                                             | Visual review                        |
| K7  | "Reach us" on right: address + pin, email + mail, phone + phone, timings + clock, timing bold                  | `ReachUs` with lucide icons                                                                            | Visual review                        |
| K8  | Contact page clean, professional, fully responsive                                                             | Layout + tests                                                                                         | Responsive test                      |
| P1  | Privacy Policy copied exactly                                                                                  | `/privacy-policy`, text stored verbatim                                                                | Diff against brief                   |
| N1  | Mobile responsive, cross-browser                                                                               | Breakpoints + browserslist                                                                             | Playwright Chromium, Firefox, WebKit |
| N2  | SEO-optimized structure, clean code                                                                            | Prerender, meta, JSON-LD, sitemap; ESLint + Prettier                                                   | Lighthouse SEO 100                   |
| N3  | Fast-loading assets, optimized images                                                                          | sharp pipeline, lazy loading, code splitting                                                           | Lighthouse performance 90+           |
| V1  | Professional but friendly tone                                                                                 | Copy + illustration style                                                                              | Design review                        |
| V2  | Trust-building and informative                                                                                 | Credentials, FAQs, testimonials                                                                        | Design review                        |
| V3  | Whitespace, soft lavender/white/pastel tones, clean typography                                                 | Design tokens (section 6)                                                                              | Design review                        |
| M1  | Finish in 7 to 10 days                                                                                         | 10-day plan (section 18)                                                                               | Daily coordinator update             |
| M2  | Split work into UI mockups, responsiveness, interactivity, testing                                             | Timeline phases                                                                                        | Timeline review                      |
| M3  | Update coordinator regularly                                                                                   | End-of-day update template                                                                             | Sent daily                           |
| S1  | MERN stack (your condition)                                                                                    | MongoDB, Express, React, Node (section 7)                                                              | Architecture review                  |
| S2  | Contact submissions persisted                                                                                  | `contact_messages` collection                                                                          | API test                             |
| S3  | Content served from database                                                                                   | Content collections + seed script                                                                      | API test                             |
| S4  | No booking logic built (dev team owns CTA action)                                                              | Single `onAction` hook, no-op by default                                                               | Code review                          |
| S5  | Privacy Policy claims stay true (no selling data, cookies disclosed)                                           | No third-party trackers by default                                                                     | Network audit                        |

## 3. Content gaps and conflicts to confirm

The brief has 10 gaps or contradictions; send this list to the coordinator on Day 1 and build with the default shown until they answer.

| #   | Issue                        | What the brief says                                                                                                                                      | Default until confirmed                                                                              |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | Hours conflict               | Amenities: doctors available daily 9 AM to 9 PM. Contact: Sunday to Saturday 9am to 7pm                                                                  | Show both exactly as written; store both in `clinic_info` so one edit fixes it                       |
| 2   | Doctor name typo             | "Dr. Ajay Jumar (Oral & Maxillofacial Surgeon)"                                                                                                          | Keep as given; ask if it should be "Kumar"                                                           |
| 3   | Founder timeline             | Graduated 2000, six years at Mathura Clinic, founded clinic in 2004                                                                                      | Keep verbatim; flag the overlap                                                                      |
| 4   | Doctor credentials           | Brief asks to highlight credentials but gives only names and specialties                                                                                 | Show name + specialty; ask for degrees (BDS/MDS), registration numbers and photos. Never invent them |
| 5   | Social media links           | Instagram, Facebook, YouTube icons requested, no URLs given                                                                                              | Icons link to `#` with `aria-disabled`; URLs live in `clinic_info.socials`                           |
| 6   | Drive assets                 | Banner images and icons are in a Google Drive folder                                                                                                     | Download on Day 1; if access fails, use Unsplash/Pexels placeholders and swap later                  |
| 7   | Treatment naming             | Home lists "Bleaching", "Orthodontic Treatment", "Artificial Complete Denture"; Treatments page uses "Teeth Whitening (Bleaching)", "Orthodontic Braces" | Store `homeTitle` and `title` separately; Home card links to the matching anchor                     |
| 8   | Testimonial ratings          | Only Manisha M has a rating (5/5)                                                                                                                        | Show stars only for her; no invented ratings                                                         |
| 9   | Accent colour                | Submit button "blue/pink"                                                                                                                                | Pink accent for CTAs (section 6); one token, easy to switch                                          |
| 10  | Privacy Policy law reference | Policy cites COPPA (US); clinic is in India                                                                                                              | Copy exactly as instructed; mention to coordinator that India's DPDP Act may be more relevant        |

Two small text fixes are safe without asking: the stray line break inside the Teeth Whitening paragraph ("several / shades"), and inconsistent testimonial name formatting ("Mr. _Arun Kumar_").

## 4. Sitemap and navigation

The site has 6 content routes plus a 404, all one level deep so no page is more than one tap from the header.

| Route             | Page                                                                        | Header nav | Footer quick links | Prerendered |
| ----------------- | --------------------------------------------------------------------------- | ---------- | ------------------ | ----------- |
| `/`               | Home                                                                        | Logo link  | Home               | Yes         |
| `/about`          | About Us                                                                    | About Us   | About              | Yes         |
| `/treatments`     | Treatments (all 14, anchor per item, e.g. `/treatments#root-canal-therapy`) | Treatments | Treatments         | Yes         |
| `/faqs`           | FAQs                                                                        | FAQs       | -                  | Yes         |
| `/contact`        | Contact Us                                                                  | Contact    | -                  | Yes         |
| `/privacy-policy` | Privacy Policy                                                              | -          | Privacy Policy     | Yes         |
| `*`               | 404 with links home and to Contact                                          | -          | -                  | Static      |

**Header (desktop, 1024 px and up).** Logo left; About Us, Treatments, FAQs, Contact centre; "Fix an Appointment" button right. Sticky, shrinks from 80 px to 64 px on scroll, active link underlined.

**Header (mobile).** Logo, a call icon (`tel:+919862890897`) and a hamburger. The drawer lists the same four links at 20 px with 56 px rows and closes on Escape or route change.

**Mobile sticky action bar.** Under 768 px, a bottom bar holds "Fix an Appointment" and "Call". It hides on `/contact` while the form is focused so it never covers the keyboard.

**Footer (every page).** Four columns that stack on mobile: clinic address and contact; quick links (Home, About, Treatments, Privacy Policy); key treatments (the 6 core ones, each linking to its anchor); social icons (Instagram, Facebook, YouTube). Bottom row: copyright line with the current year.

**Breadcrumbs.** Not needed for a one-level site; each page shows a page-title banner instead.

## 5. Page-by-page blueprint

Each page below lists its sections top to bottom, with layout per breakpoint; all copy comes from the brief via the seed data, never hard-coded in components.

### Home `/`

1. **Hero** (`Hero`). Left: eyebrow "Sakthi Dental Clinic, Hosur", H1 "Specialized Dental Care for Women, Children & Families", subtext as given, two buttons: "Fix an Appointment" (primary) and "Emergency Dental Support" (outline). Right: warm photo of a dentist with a mother and child. Under it, a trust strip: "Since 2004", "20+ years of expertise", "9 specialist doctors", "Open daily". Mobile: text first, image below at 4:3.
2. **Assurance banner** (`AssuranceBanner`). Full-width Drive banner image with a lavender overlay and the line "You are always in safe hands. We are ready to help, anytime." plus a call link. Height 280 px desktop, 200 px mobile.
3. **Why Choose Sakthi Dental Clinic?** (`WhyChoose`). One intro sentence on the clinic's philosophy, then 4 icon cards: All-in-One Care, Experienced Doctors, Patient-Centric Approach, Technology-Driven Services. 4 columns desktop, 2 tablet, 1 mobile.
4. **Explore Our Services** (`CoreTreatments`). 6 cards (Tooth Extraction, Artificial Complete Denture, Tooth Filling, Teeth Cleaning or Scaling, Bleaching, Orthodontic Treatment), each with icon, title, one-line description and "Learn more" to its anchor. 3 columns desktop, 2 tablet, 1 mobile. Centered button "View Full List of Treatments" to `/treatments`.
5. **What Our Patients Say** (`TestimonialCarousel`). 3 quote cards with name; star row only for Manisha M. Desktop shows all 3 side by side; tablet and mobile show 1 card that auto-rotates every 6 s, with dots, previous/next buttons and a pause button. Auto-rotate stops on hover, focus, or `prefers-reduced-motion`.
6. **Clinic Facilities** (`Amenities`). 5 items with icons: Convenient central location (MapPin), Hassle-free parking (ParkingSquare), Doctors available daily 9 AM to 9 PM (Clock), Pickup & drop-off support (Car), Wheelchair access (Accessibility). 5 across desktop, 2 columns mobile.
7. **Closing CTA band** (`CtaBand`). "Ready for a healthier smile?" with Fix an Appointment and Call buttons.
8. **Footer**.

### About Us `/about`

1. **Page banner**: "About Us".
2. **Get to Know Dr. Anupriya** (`FounderProfile`). Photo left, text right: subtitle "Your Trusted Partner in Dental Care" and the 4 paragraphs as given. A credential panel beside the photo: Graduated 2000; 6 years at Mathura Clinic; Founded Sakthi Dental Clinic, 2004; Dental consultant, Primary Health Center at Chandara Hospital, 10+ years.
3. **Our Vision & Mission** (`VisionMission`). Two cards side by side (stacked on mobile), Mission first as in the brief.
4. **Our Team of Doctors** (`DoctorGrid`). 9 cards: avatar (neutral placeholder until photos arrive), name, specialty; founder card highlighted. 3 columns desktop, 2 tablet, 1 mobile.
5. **CTA band** + Footer.

### Treatments `/treatments`

1. **Page banner**: "Our Treatments" + one-line intro.
2. **Jump list** (`TreatmentIndex`). 15 chips linking to anchors; horizontally scrollable on mobile.
3. **Treatment sections** (`TreatmentDetail` x 15), in brief order: Teeth Cleaning & Scaling, Tooth Filling, Tooth Extraction, Artificial Complete Denture, Dental Implants, Laser Dentistry, Root Canal Therapy, Wisdom Tooth Extraction, Fixed Partial Denture (Bridge), Teeth Whitening (Bleaching), Veneers, Pediatric Dentistry, Flap Surgery, Orthodontic Braces, Clear Aligners. Each: image, H2 title, full description, small "Fix an Appointment" button. Image side alternates on desktop; image on top on mobile. Each section has `id` = slug and `scroll-margin-top` so the sticky header never hides the heading.
4. **CTA band** + Footer.

Order and wording follow the brief exactly. Home card titles map to these anchors (section 3, item 7).

### FAQs `/faqs`

1. **Page banner**: "Frequently Asked Questions".
2. **Accordion** (`FaqAccordion`). 14 questions in brief order; one open at a time; first item open by default. Each header is a `<button>` with `aria-expanded`.
3. **Still have questions?** card linking to `/contact` + Footer.

### Contact Us `/contact`

1. **Page banner**: "Contact Us".
2. **Two columns** (stacked on mobile, form first). Left: "We would love to hear from you" + `ContactForm` (section 12). Right: "Reach us" (`ReachUs`): address with MapPin, email with Mail (`mailto:`), both phones with Phone (`tel:` links), timings with Clock and the hours in bold.
3. **Map link**: a static map image linking to Google Maps directions (no embedded iframe, to keep the page fast).
4. Footer.

### Privacy Policy `/privacy-policy`

Policy text exactly as supplied, sections 1 to 9, in a 720 px reading column with a "Last updated" line. Footer.

### 404

Friendly message, links to Home and Contact, `noindex` meta.

## 6. Design system

A soft lavender-and-white base with one pink accent reserved for action buttons, so "Fix an Appointment" is always the most visible thing on screen. All values live as Tailwind v4 `@theme` tokens in `client/src/styles/tokens.css`.

### Colour tokens

| Token                       | Hex               | Use                                       | Contrast on white           |
| --------------------------- | ----------------- | ----------------------------------------- | --------------------------- |
| `lavender-50`               | #F6F4FD           | Alternate section background              | Background only             |
| `lavender-100`              | #ECE8FB           | Cards, banner tint, input fill            | Background only             |
| `lavender-300`              | #C9BFF2           | Borders, decorative shapes                | Decorative only             |
| `lavender-700`              | #5B4BB7           | Headings accent, links, icons, focus ring | 6.7:1 (AA)                  |
| `rose-600` (accent)         | #B83280           | Primary CTA and Submit background         | White text on it 5.5:1 (AA) |
| `rose-50`                   | #FDF0F6           | Emergency button hover, highlight chips   | Background only             |
| `ink-900`                   | #1F1B2E           | Body and heading text                     | 16:1 (AAA)                  |
| `ink-600`                   | #55506A           | Secondary text                            | 7.7:1 (AAA)                 |
| `success-600` / `error-600` | #1E7A55 / #B42318 | Form states                               | AA                          |

### Typography

- Headings: **Plus Jakarta Sans** 600/700; body: **Inter** 400/500. Both are SIL Open Font License, self-hosted through `@fontsource`, Latin subset, `font-display: swap`.
- Fluid scale with `clamp()`: H1 36 to 56 px, H2 28 to 40 px, H3 20 to 24 px, body **18 px** (never below 16 px), small 15 px.
- Line height 1.6 for body, 1.2 for headings; reading width capped at 70 characters.

### Layout and spacing

- 8 px spacing grid; section padding 96 px desktop, 64 px mobile.
- Container max width 1200 px; gutters 24 px (16 px under 400 px).
- Breakpoints: 360 base, `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
- Radius 16 px for cards, 999 px for buttons; one soft shadow `0 8px 24px rgb(91 75 183 / 0.08)`.

### Core components

- `Button`: variants `primary` (rose), `secondary` (lavender outline), `ghost`; sizes `md` 48 px and `lg` 56 px tall.
- `AppointmentButton`, `EmergencyButton`: wrappers over `Button` (section 10).
- `SectionHeading` (eyebrow + title + intro), `Card`, `IconBadge`, `TreatmentCard`, `TestimonialCard`, `DoctorCard`, `Accordion`, `FormField`, `PageBanner`, `CtaBand`.

### Icons and imagery

- Icons: **lucide-react** (ISC licence) at 24 px in a 48 px lavender circle, plus the Drive icon set where it fits.
- Photos: Drive banners first, then Unsplash or Pexels (free licence). Bright clinic interiors, women and children patients, natural smiles; no blood, needles or close-up procedures.
- Each image gets a 4:3 or 16:9 frame, a lavender low-quality placeholder, and descriptive `alt` text.

### Motion

Fade-and-rise on scroll (200 ms, 16 px) via `IntersectionObserver` and CSS, no animation library. Hover lifts cards 4 px. Everything is disabled under `prefers-reduced-motion: reduce`.

## 7. MERN architecture and tech stack

React pages are prerendered at build time and served from a CDN; a single Express API reads and writes MongoDB and emails the clinic when someone submits the contact form.

&#91;embedded content: system architecture · client, API, database, email\]

Patients get full HTML instantly from the CDN, so the site is fast and search engines see every word. The API is only hit for the contact form and for content refreshes after hydration.

| Layer       | Choice                                                                                | Why                                                                           |
| ----------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Runtime     | Node.js 24 LTS                                                                        | Current LTS line, long support window                                         |
| Frontend    | React 19 + React Router v7 (framework mode, `prerender` on) + Vite                    | Meets the SEO requirement with static HTML per route while staying pure React |
| Styling     | Tailwind CSS v4 with `@theme` tokens                                                  | Fast mobile-first layout, tokens map 1:1 to section 6                         |
| Forms       | react-hook-form + zod                                                                 | Light, accessible errors, same schema as the server                           |
| Icons       | lucide-react                                                                          | Free ISC licence, tree-shakable                                               |
| API         | Express 5                                                                             | Native async error handling, minimal                                          |
| Database    | MongoDB Atlas (free M0 tier to start) + Mongoose 8                                    | The M in MERN; schemas and indexes in code                                    |
| Email       | Nodemailer over SMTP                                                                  | Notifies `info@sakthidentalclinic.in` on each submission                      |
| Shared code | `shared/` workspace with zod schemas and constants                                    | One validation source for client and server                                   |
| Testing     | Vitest, React Testing Library, Supertest, mongodb-memory-server, Playwright, axe-core | Unit, API, end-to-end and accessibility coverage                              |
| Tooling     | npm workspaces, ESLint, Prettier, Husky + lint-staged                                 | Clean code (N2) enforced on every commit                                      |
| Hosting     | Vercel (client), Render (API), Atlas (DB)                                             | Free tiers cover a clinic site's traffic                                      |
| CI          | GitHub Actions + Lighthouse CI                                                        | Lint, test, build and performance gates on every PR                           |

**Fallback if framework mode feels heavy:** a plain Vite SPA with `react-helmet-async` plus a small Puppeteer script that visits each route after build and saves the HTML. Same output, more manual wiring.

## 8. MongoDB data model

Eight collections: seven hold clinic content seeded from the brief, one stores contact submissions. Every content document has `order` (for display sequence) and `isActive` (to hide without deleting), plus Mongoose `timestamps`.

| Collection                 | Key fields                                                                                                                                                                                                                                                                                                                                      | Indexes                                                                       | Seeded count               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------- |
| `clinic_info` (singleton)  | `name`, `tagline`, `address{line1, area, city, state, pincode, country}`, `emails[]`, `phones[]`, `timings` ("Sunday to Saturday: 9am to 7pm"), `doctorAvailability` ("Doctors available daily (9 AM - 9 PM)"), `socials{instagram, facebook, youtube}`, `mapUrl`, `hero{headline, subtext}`, `assurance`, `privacyPolicy{markdown, updatedAt}` | `_id` only                                                                    | 1                          |
| `treatments`               | `title`, `slug`, `homeTitle`, `homeSummary`, `description`, `icon`, `image{src, alt}`, `isCore` (shown on Home), `order`                                                                                                                                                                                                                        | `slug` unique; `{isCore, order}`                                              | 15 (6 with `isCore: true`) |
| `doctors`                  | `name`, `specialty`, `isFounder`, `qualifications` (empty until confirmed), `photo{src, alt}`, `order`                                                                                                                                                                                                                                          | `order`                                                                       | 9                          |
| `testimonials`             | `quote`, `author`, `rating` (nullable), `order`                                                                                                                                                                                                                                                                                                 | `order`                                                                       | 3                          |
| `faqs`                     | `question`, `answer`, `order`                                                                                                                                                                                                                                                                                                                   | `order`                                                                       | 14                         |
| `amenities` + `why_choose` | `title`, `description` (why\_choose only), `icon`, `order`                                                                                                                                                                                                                                                                                      | `order`                                                                       | 5 + 4                      |
| `contact_messages`         | `name`, `email`, `phone`, `message`, `status` (`new`, `read`, `replied`), `source` (`contact-page`), `userAgent`, `ipHash` (SHA-256, not the raw IP), `emailNotified`                                                                                                                                                                           | `createdAt` desc; TTL on `createdAt` (365 days, pending coordinator approval) | 0                          |

**Seeding.** `server/src/seed/content.json` holds every piece of copy from the brief, typed once. `npm run seed` validates it with the shared zod schemas, then upserts by `slug` or `order`, so re-running is safe. The Privacy Policy is stored as Markdown exactly as supplied.

**Example document (treatments).**

```json
{
  "title": "Teeth Whitening (Bleaching)",
  "slug": "teeth-whitening",
  "homeTitle": "Bleaching",
  "homeSummary": "Cosmetic whitening treatments for a brighter smile.",
  "description": "Brighten your smile with professional teeth whitening services...",
  "icon": "sparkles",
  "image": {
    "src": "/images/treatments/teeth-whitening.webp",
    "alt": "Smiling woman after teeth whitening"
  },
  "isCore": true,
  "order": 10,
  "isActive": true
}
```

## 9. REST API specification

The API has 9 read endpoints and 1 write endpoint under `/api/v1`, all returning JSON in one envelope: `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code", "message", "fields"? } }`.

| Method | Path                       | Purpose                                          | Response / notes                                                                                   | Cache  |
| ------ | -------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------ |
| GET    | `/api/v1/health`           | Uptime and DB ping                               | `{ status, db, uptime }`                                                                           | none   |
| GET    | `/api/v1/content/home`     | Everything Home needs in one call                | `clinic` (hero, assurance), `whyChoose[]`, `coreTreatments[]` (6), `testimonials[]`, `amenities[]` | 10 min |
| GET    | `/api/v1/clinic`           | Address, phones, emails, timings, socials        | `clinic_info` minus `privacyPolicy`                                                                | 10 min |
| GET    | `/api/v1/treatments`       | All active treatments                            | Sorted by `order`; `?core=true` returns the 6 Home items                                           | 10 min |
| GET    | `/api/v1/treatments/:slug` | One treatment (reserved for future detail pages) | 404 `NOT_FOUND` if missing                                                                         | 10 min |
| GET    | `/api/v1/doctors`          | Team of 9                                        | Sorted by `order`, founder first                                                                   | 10 min |
| GET    | `/api/v1/testimonials`     | Patient quotes                                   | Sorted by `order`                                                                                  | 10 min |
| GET    | `/api/v1/faqs`             | 14 FAQs                                          | Sorted by `order`                                                                                  | 10 min |
| GET    | `/api/v1/privacy-policy`   | Policy Markdown + last updated                   | Verbatim text                                                                                      | 1 day  |
| POST   | `/api/v1/contact`          | Save an enquiry, email the clinic                | 201 `{ id }`; 422 `VALIDATION_ERROR` with `fields`; 429 `RATE_LIMITED`; 500 `SERVER_ERROR`         | never  |

**POST /api/v1/contact body.**

```json
{
  "name": "Revathi S",
  "email": "revathi@example.com",
  "phone": "+91 98765 43210",
  "message": "Is pediatric check-up available on Sunday?",
  "website": ""
}
```

`website` is a hidden honeypot: if it is filled, the API returns 201 but stores nothing. Read endpoints send `Cache-Control: public, max-age=600, stale-while-revalidate=86400`. No endpoint exposes contact messages; reading them is done in Atlas until an admin view is approved.

## 10. Frontend architecture

One monorepo with three npm workspaces; the client is organized by route, with shared UI in `components/` and every button that needs the dev team's action going through one file.

```text
sakthi-dental-clinic/
├── client/                         React Router v7 + Vite
│   ├── app/
│   │   ├── root.tsx                <html>, fonts, Header, Footer, MobileActionBar
│   │   ├── routes.ts               route table (section 4)
│   │   ├── routes/
│   │   │   ├── home.tsx            loader -> GET /content/home
│   │   │   ├── about.tsx           loader -> GET /doctors
│   │   │   ├── treatments.tsx      loader -> GET /treatments
│   │   │   ├── faqs.tsx            loader -> GET /faqs
│   │   │   ├── contact.tsx         loader -> GET /clinic
│   │   │   ├── privacy-policy.tsx  loader -> GET /privacy-policy
│   │   │   └── not-found.tsx
│   │   ├── components/
│   │   │   ├── layout/             Header, Navbar, MobileMenu, MobileActionBar, Footer, PageBanner
│   │   │   ├── cta/                AppointmentButton, EmergencyButton, CallButton, ctaConfig.ts
│   │   │   ├── home/               Hero, AssuranceBanner, WhyChoose, CoreTreatments,
│   │   │   │                       TestimonialCarousel, Amenities, CtaBand
│   │   │   ├── about/              FounderProfile, VisionMission, DoctorGrid, DoctorCard
│   │   │   ├── treatments/         TreatmentIndex, TreatmentDetail, TreatmentCard
│   │   │   ├── faqs/               FaqAccordion
│   │   │   ├── contact/            ContactForm, ReachUs
│   │   │   └── ui/                 Button, Card, IconBadge, SectionHeading, FormField, Seo
│   │   ├── lib/                    api.ts (fetch wrapper), seo.ts, jsonLd.ts
│   │   └── styles/                 tokens.css, globals.css
│   ├── public/                     images/, icons/, favicon, robots.txt, og-image.jpg
│   └── react-router.config.ts      prerender: ["/", "/about", "/treatments", "/faqs", "/contact", "/privacy-policy"]
├── server/                         Express API (section 11)
├── shared/                         zod schemas, constants (phone regex, limits)
├── e2e/                            Playwright specs
└── package.json                    workspaces + root scripts
```

**Data flow.** Each route's `loader` calls the API through `lib/api.ts`. At build time the loaders run once and the HTML is saved; in the browser they run again on navigation. If the API is down during in-app navigation, each route's `ErrorBoundary` shows a friendly message with the clinic phone number; a direct visit or reload still gets the prerendered HTML from the CDN, so a patient never sees a blank page.

**CTA integration hook (scope boundary S4).** Every "Fix an Appointment" and "Emergency Dental Support" button in the site renders through these components, so the dev team wires the action in exactly one place:

```tsx
// client/app/components/cta/ctaConfig.ts
export const ctaHandlers = {
  appointment: () => {}, // ShadowFox web dev team: replace with booking action
  emergency: () => {}, // ShadowFox web dev team: replace with emergency action
};

// client/app/components/cta/AppointmentButton.tsx
export function AppointmentButton({ size = "md", location }: Props) {
  return (
    <Button
      variant="primary"
      size={size}
      data-cta="fix-appointment"
      data-cta-location={location} // "header" | "hero" | "mobile-bar" | "treatment:<slug>"
      onClick={ctaHandlers.appointment}
    >
      Fix an Appointment
    </Button>
  );
}
```

The `data-cta` and `data-cta-location` attributes also let the dev team attach analytics or a modal without touching component code.

**State.** No global store is needed: content comes from loaders, form state lives in react-hook-form, and UI state (menu open, carousel index, open FAQ) stays local with `useState`.

## 11. Backend architecture

The Express server is layered routes → controllers → services → Mongoose models, with validation and errors handled in middleware so each controller stays under 20 lines.

```text
server/src/
├── app.js              builds the Express app (used by tests and index.js)
├── index.js            connects MongoDB, starts the server, handles SIGTERM
├── config/env.js       reads and validates env vars with zod at startup
├── routes/             content.routes.js, contact.routes.js, health.routes.js
├── controllers/        thin: read req, call service, send envelope
├── services/           content.service.js, contact.service.js, mail.service.js
├── models/             ClinicInfo, Treatment, Doctor, Testimonial, Faq, Amenity, WhyChoose, ContactMessage
├── middleware/         validate(schema), rateLimit, errorHandler, notFound, requestId
├── seed/               content.json, seed.js
└── utils/              logger.js (pino), hashIp.js
```

**Middleware order.** `requestId` → `pino-http` logging → `helmet` → `cors` (allow-list: production domain, Vercel previews, localhost) → `compression` → `express.json({ limit: "10kb" })` → routes → `notFound` → `errorHandler`.

**Contact flow.**

1. `rateLimit` allows 5 submissions per IP per 15 minutes on `POST /contact`.
2. `validate(contactSchema)` runs the shared zod schema; failures return 422 with per-field messages.
3. Honeypot check: a filled `website` field returns 201 and stops.
4. `contact.service` trims and strips HTML from all fields, hashes the IP, saves the document.
5. `mail.service` sends a plain-text email to `info@sakthidentalclinic.in` with name, phone, email and message. A mail failure is logged and `emailNotified: false` is saved, but the patient still gets success because the message is safely stored.
6. Controller returns 201 `{ id }`.

**Errors.** One `AppError(code, status, message)` class. The error handler maps zod errors to 422, Mongoose `CastError` to 400, unknown errors to 500, and never leaks stack traces in production.

**Environment variables.** `NODE_ENV`, `PORT`, `MONGODB_URI`, `CORS_ORIGINS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, `IP_HASH_SALT`. A committed `.env.example` lists them with no secrets.

## 12. Contact form specification

Four fields, three required, validated by one zod schema in `shared/` that runs in the browser for instant feedback and again on the server as the real gate.

| Field              | Input                                                       | Required | Rule                                                                                  | Error message                                                                      |
| ------------------ | ----------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Name               | `type="text"`, `autocomplete="name"`                        | Yes      | Trimmed, 2 to 60 characters, Unicode letters, spaces, `.` `'` `-`                     | "Please enter your name." / "Name should be 2 to 60 letters."                      |
| Email              | `type="email"`, `autocomplete="email"`, `inputmode="email"` | Yes      | Valid email format, max 254 characters, lower-cased                                   | "Please enter your email." / "Please enter a valid email, like name@example.com."  |
| Phone Number       | `type="tel"`, `autocomplete="tel"`, `inputmode="tel"`       | Yes      | Strip spaces, dashes, brackets; optional `+91` or `0`, then 10 digits starting 6 to 9 | "Please enter your phone number." / "Please enter a valid 10-digit mobile number." |
| Your Message       | `<textarea>` 5 rows                                         | No       | Max 1000 characters, live counter                                                     | "Message can be up to 1000 characters."                                            |
| `website` (hidden) | honeypot, `tabindex="-1"`, `aria-hidden`                    | -        | Must be empty                                                                         | none shown                                                                         |

**Behaviour.**

- Validate a field when it loses focus, then live as the user corrects it; on Submit, validate all and move focus to the first invalid field.
- Required fields show a visible "(required)" text, not only an asterisk, for screen readers and seniors.
- Errors sit under each field in `error-600` with an icon, linked by `aria-describedby`, and announced through `aria-live="polite"`.
- Submit button: label "Submit", `rose-600` background, full width on mobile, 56 px tall. While sending it shows a spinner, reads "Sending..." and is disabled to block double submits.
- Success: form is replaced by a confirmation card, "Thank you, {name}. We have received your message and will get back to you soon." with a "Send another message" link.
- Server 422: map `fields` back onto the matching inputs. 429: "Too many attempts, please try again in a few minutes or call us." Network or 500: keep the typed data and show the phone numbers as a fallback.
- Layout: two columns (form left, Reach us right) from 1024 px; stacked single column below, each field full width (requirement K5).
- A one-line note under the button links to the Privacy Policy: "We use your details only to respond to you."

## 13. Responsiveness, accessibility and senior-friendly UX

Target is WCAG 2.2 level AA on every page, designed at 360 px first and tested up to 1440 px.

**Responsive rules.**

| Element                | Mobile (< 768 px)                           | Tablet (768 to 1023 px) | Desktop (1024 px +)           |
| ---------------------- | ------------------------------------------- | ----------------------- | ----------------------------- |
| Header                 | Logo, call icon, hamburger                  | Same as mobile          | Full nav + Fix an Appointment |
| Hero                   | Text then image, buttons stacked full width | Text then image         | Text left, image right        |
| Why Choose / Amenities | 1 column / 2 columns                        | 2 columns / 3 columns   | 4 columns / 5 across          |
| Treatment cards        | 1 column                                    | 2 columns               | 3 columns                     |
| Testimonials           | 1 card, carousel                            | 1 card, carousel        | 3 cards side by side          |
| Doctor grid            | 1 column                                    | 2 columns               | 3 columns                     |
| Contact                | Form, then Reach us                         | Form, then Reach us     | Two columns                   |
| Footer                 | 4 stacked blocks                            | 2 x 2 grid              | 4 columns                     |
| Sticky action bar      | Shown                                       | Hidden                  | Hidden                        |

**Accessibility checklist.**

- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, no skipped heading levels.
- [ ] "Skip to main content" link as the first focusable element.
- [ ] Text contrast at least 4.5:1, UI borders and icons at least 3:1 (tokens in section 6 already pass).
- [ ] Visible 3 px `lavender-700` focus ring on every interactive element; full keyboard use including menu, carousel and accordion.
- [ ] Tap targets at least 48 x 48 px with 8 px spacing.
- [ ] Carousel: pause button, previous/next buttons with labels, no auto-rotate under reduced motion (WCAG 2.2.2).
- [ ] Accordion: `button` headers with `aria-expanded` and `aria-controls`.
- [ ] Mobile menu traps focus while open, closes on Escape, returns focus to the hamburger.
- [ ] Every image has meaningful `alt`; decorative ones use `alt=""`.
- [ ] Form labels always visible (no placeholder-only labels), errors announced.
- [ ] Page usable at 200% browser zoom and 320 px width with no horizontal scroll.
- [ ] `lang="en"` on `<html>`; page `<title>` unique per route.

**For senior citizens and anxious patients.**

- 18 px body text, generous line height, short paragraphs.
- Phone numbers are always tappable `tel:` links; the call button sits next to Fix an Appointment.
- Plain labels ("Call the clinic", not icons alone); icons always paired with text.
- No pop-ups, no auto-playing video or sound, no clinical imagery that could alarm children.
- Hours and address visible in the footer of every page, so nobody has to hunt for them.

## 14. SEO and performance

Release gate: Lighthouse mobile scores of at least 90 Performance and 100 for Accessibility, Best Practices and SEO on every route, checked in CI.

### SEO

- **Prerendered HTML** for all 6 content routes, so crawlers and WhatsApp/Facebook link previews see full text.
- **Per-page meta** via each route's `meta` export: unique `<title>` (under 60 characters) and description (under 155), canonical URL, Open Graph and Twitter card tags, one 1200 x 630 share image.

| Route             | Title                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| `/`               | Sakthi Dental Clinic, Hosur: Dental Care for Women, Children & Families |
| `/about`          | About Dr. Anupriya & Our Dental Team, Sakthi Dental Clinic Hosur        |
| `/treatments`     | Dental Treatments in Hosur: Implants, Braces, Root Canal & More         |
| `/faqs`           | Dental FAQs, Sakthi Dental Clinic Hosur                                 |
| `/contact`        | Contact & Directions, Sakthi Dental Clinic, Anthivadi, Hosur            |
| `/privacy-policy` | Privacy Policy, Sakthi Dental Clinic                                    |

- **Structured data (JSON-LD):** `Dentist` on every page (name, address, phones, email, opening hours, `medicalSpecialty`, `sameAs` for socials once given); `FAQPage` on `/faqs`; `BreadcrumbList` on inner pages. Validate with Google's Rich Results Test; rich display is not guaranteed.
- **Crawl files:** `sitemap.xml` generated at build from the route list; `robots.txt` allowing all and pointing to the sitemap; 404 page set to `noindex`.
- **Content structure:** one keyword-led `h1` per page ("dentist in Hosur", treatment names), descriptive link text (no "click here"), treatment anchors with readable slugs.
- **Local SEO handover note:** recommend the clinic claim or update its Google Business Profile with the same name, address and phone (NAP) as the site.

### Performance budgets

| Metric (mobile, 4G)            | Budget       |
| ------------------------------ | ------------ |
| Largest Contentful Paint       | under 2.5 s  |
| Interaction to Next Paint      | under 200 ms |
| Cumulative Layout Shift        | under 0.1    |
| JavaScript per route (gzipped) | under 120 KB |
| Hero image                     | under 150 KB |
| Total page weight, Home        | under 1 MB   |

**How we hit them.**

- Images: a `sharp` script converts every source image to AVIF and WebP at 480, 960 and 1600 px widths; `<picture>` with `srcset` and `sizes`; explicit `width` and `height` to prevent layout shift; `loading="lazy"` below the fold; hero gets `fetchpriority="high"` and a preload.
- Fonts: self-hosted, Latin subset, 2 families and 4 weights only, `font-display: swap`, preload the heading font.
- JS: route-level code splitting (automatic in React Router), no carousel or animation libraries, icons imported individually.
- Delivery: Brotli from Vercel, immutable cache headers on hashed assets, API responses cached 10 minutes.
- Third parties: none by default (no embedded map iframe, no chat widget), which also keeps the Privacy Policy's cookie section accurate.

## 15. Security and privacy

The only personal data the site handles is the contact form, so the plan protects that path end to end and keeps the site's behaviour consistent with the Privacy Policy we publish.

| Threat or duty                        | Control                                                                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Spam and bots on the form             | Honeypot field, 5 requests per 15 min per IP, 10 KB body limit                                                                              |
| Injection (NoSQL, script)             | zod whitelists fields and types; strip HTML; Mongoose `sanitizeFilter`; no user input in queries except validated values                    |
| Cross-site scripting on output        | React escapes by default; no `dangerouslySetInnerHTML` except the Privacy Policy Markdown, rendered through a sanitizing Markdown renderer  |
| Clickjacking, sniffing, mixed content | `helmet` with CSP (`default-src 'self'`, API origin in `connect-src`), `frame-ancestors 'none'`, HSTS; HTTPS everywhere                     |
| Cross-origin abuse                    | CORS allow-list only (production domain, Vercel previews, localhost)                                                                        |
| Leaked secrets                        | `.env` git-ignored, secrets only in Vercel and Render dashboards, `npm audit` and Dependabot in CI                                          |
| Database exposure                     | Atlas user with read/write on one database only, network access limited to Render's outbound IPs where the plan allows, daily Atlas backups |
| Over-collection                       | Only name, email, phone, message stored; IP stored as a salted hash, not raw                                                                |
| Data retention                        | 12-month TTL on `contact_messages`, pending coordinator approval                                                                            |
| Cookies                               | Site sets none by default; if analytics are added later, add a consent banner first                                                         |
| Children's privacy                    | Form asks no age or child data, matching section 6 of the policy                                                                            |
| Error leakage                         | Generic messages in production, details only in server logs                                                                                 |

The Privacy Policy text is published exactly as supplied; any change to it, including the India-law point in section 3, is the client's decision, not ours.

## 16. Testing and QA

Eight layers of testing: the first six run automatically in CI; real-device checks and content proofreading are manual passes on Days 8 and 9.

| Layer                | Tool                                                                                                 | What it covers                                                                                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit (shared)        | Vitest                                                                                               | zod contact schema: valid input, each invalid field, phone formats (`9876543210`, `+91 98765 43210`, `09876543210`), 1001-char message                                                                                                              |
| Component            | Vitest + React Testing Library                                                                       | ContactForm errors and focus, FaqAccordion keyboard and `aria-expanded`, TestimonialCarousel pause, AppointmentButton renders `data-cta` and calls `ctaHandlers.appointment`                                                                        |
| API                  | Vitest + Supertest + mongodb-memory-server                                                           | Every GET returns seeded counts (15 treatments, 9 doctors, 14 FAQs, 3 testimonials, 5 amenities); POST 201, 422 per field, honeypot, 429 after 5 tries, mail failure still 201                                                                      |
| End-to-end           | Playwright on Chromium, Firefox, WebKit + Pixel 7 and iPhone 14 profiles                             | Nav links reach each page; Fix an Appointment visible on every page; View Full List goes to `/treatments`; footer links work; Home treatment cards jump to the right anchor; contact form happy path and error path; no horizontal scroll at 360 px |
| Accessibility        | `@axe-core/playwright` on every route + manual keyboard and screen-reader pass (NVDA, VoiceOver iOS) | Zero serious or critical axe violations                                                                                                                                                                                                             |
| Performance and SEO  | Lighthouse CI on every PR                                                                            | Budgets in section 14                                                                                                                                                                                                                               |
| Real devices         | Android Chrome, iPhone Safari, Samsung Internet, desktop Chrome, Edge, Firefox, Safari               | Layout, fonts, tap targets, `tel:` and `mailto:` links                                                                                                                                                                                              |
| Content proofreading | Side-by-side with the brief                                                                          | Every heading and paragraph matches; Privacy Policy diffed character by character                                                                                                                                                                   |

Coverage targets: 90% on `shared/` and server services, 70% on client components. Bugs found in QA go into a GitHub issue with page, device, screenshot and severity.

## 17. Deployment, environments and CI/CD

Every pull request gets an automatic preview the coordinator can open on a phone, and `main` deploys to production only after lint, tests, build and Lighthouse all pass.

| Environment | Client                                                               | API                    | Database                                     | Trigger                                      |
| ----------- | -------------------------------------------------------------------- | ---------------------- | -------------------------------------------- | -------------------------------------------- |
| Local       | `localhost:5173` (Vite)                                              | `localhost:4000`       | Local MongoDB in Docker or Atlas dev cluster | `npm run dev` (both apps via `concurrently`) |
| Preview     | Vercel preview URL per PR                                            | Render staging service | Atlas `sakthi_staging`                       | Push to a PR                                 |
| Production  | Vercel, custom domain (expected `sakthidentalclinic.in`, to confirm) | Render web service     | Atlas `sakthi_prod`                          | Merge to `main`                              |

**GitHub Actions pipeline (on every PR).**

1. Install with `npm ci` (Node 24, cached).
2. `npm run lint` and `npm run typecheck` across workspaces.
3. `npm test` (unit, component, API against mongodb-memory-server).
4. `npm run build` (client prerender against the staging API).
5. Playwright E2E + axe against the built client.
6. Lighthouse CI on all 6 routes with the budgets from section 14.

**Git workflow.** `main` is protected; work happens on `feat/<area>` branches; Conventional Commits (`feat:`, `fix:`, `chore:`); one PR per feature with screenshots for UI changes; squash merge.

**Go-live steps.** Point DNS to Vercel, confirm HTTPS, set `CORS_ORIGINS` to the final domain, run `npm run seed` on production, submit `sitemap.xml` in Google Search Console, send one real test message through the form and confirm the clinic email arrives.

**Handover package.** README (setup, scripts, env vars, how to edit content in Atlas, where the CTA hook lives), `.env.example`, `CREDITS.md` for images and icons, and the final QA report.

## 18. 10-day timeline

The plan uses the full 10 days the brief allows, with every page feature-complete by Day 6 so Days 7 to 9 absorb feedback and bugs; if the coordinator wants 7 days, Days 7 and 8 merge and Day 9 becomes launch.

&#91;embedded content: 10-day plan · 9 workstreams, 3 gates, launch on Day 10\]

The brief's four phases map directly: UI mockups (Days 1 to 2), responsiveness (Day 7), interactivity (Days 6 to 7), testing (Days 8 to 9).

**Day-by-day deliverables.**

1. **Day 1:** Send section 3 questions; download Drive assets; create repo, workspaces, ESLint/Prettier, CI skeleton; design tokens in code; seed `content.json` typed from the brief.
2. **Day 2:** Mobile and desktop mockups for all 6 pages (Figma); Mongoose models and seed script. Gate 1: coordinator approves mockups.
3. **Day 3:** All API endpoints with tests; Header, Footer, MobileMenu, MobileActionBar, Button, CTA components.
4. **Day 4:** Home page complete (8 sections) wired to `/content/home`.
5. **Day 5:** About and Treatments pages, including 15 anchors.
6. **Day 6:** FAQs, Contact (form + API + email), Privacy Policy, 404. Gate 2: every page live on the preview URL.
7. **Day 7:** Responsive pass at 360, 768, 1024, 1440 px; carousel, accordion, sticky bar, scroll motion.
8. **Day 8:** Meta tags, JSON-LD, sitemap, prerender check; image pipeline; accessibility fixes; Lighthouse budgets green.
9. **Day 9:** Playwright across 3 engines, real devices, content proofreading, bug fixes. Gate 3: QA sign-off.
10. **Day 10:** Production deploy, go-live checks, README and handover, demo to coordinator.

**End-of-day update to the coordinator (copy and fill).**

```text
Sakthi Dental Clinic | Day N of 10 | <date>
Done today: ...
Preview link: ...
Planned tomorrow: ...
Blockers / questions: ...
On track for Day 10 launch: Yes / At risk (reason)
```

## 19. Definition of done

The project is done when every row in section 2 is ticked here and the coordinator has signed off on the production URL.

**Content**

- [ ] Home: hero copy, both CTAs, assurance banner, 4 Why Choose cards, 6 core treatments + View Full List, 3 testimonials rotating, 5 facilities with icons, footer.
- [ ] About: Dr. Anupriya section with all 4 paragraphs, Vision & Mission, 9 doctors.
- [ ] Treatments: all 15 with images and working anchors.
- [ ] FAQs: all 14 in order.
- [ ] Contact: form left, Reach us right with 4 icons and bold timings.
- [ ] Privacy Policy identical to the brief.
- [ ] Every open question from section 3 answered or logged with the default used.

**Function**

- [ ] Fix an Appointment and Emergency buttons present, styled, and routed through `ctaConfig.ts` with no booking logic.
- [ ] Contact form validates required fields and email format on client and server, saves to MongoDB, emails the clinic.
- [ ] All nav, footer and anchor links work; 404 page works.

**Quality**

- [ ] Lighthouse mobile: Performance 90+, Accessibility, Best Practices and SEO 100 on all routes.
- [ ] Zero serious axe violations; keyboard-only walk-through passes.
- [ ] No horizontal scroll from 320 px to 1440 px; checked on real Android and iPhone.
- [ ] Works in Chrome, Edge, Firefox, Safari, Samsung Internet.
- [ ] All CI checks green; no secrets in the repo.
- [ ] `CREDITS.md` lists every image and icon source with its licence.

**Handover**

- [ ] README, `.env.example`, seed script and QA report delivered.
- [ ] Production URL shared with coordinator; sitemap submitted.
