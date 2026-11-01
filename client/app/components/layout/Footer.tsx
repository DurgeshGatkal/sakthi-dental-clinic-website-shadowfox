import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import type { Clinic, Treatment } from "~/lib/api";
import { SHOWCASE_SOCIALS } from "~/lib/showcase";

const socialLinks = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
] as const;

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/treatments", label: "Treatments" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy Policy" },
];

type Props = {
  clinic: Clinic | null;
  treatments: Treatment[];
};

/* Section 5 — four-column footer, stacked on mobile. */
export function Footer({ clinic, treatments }: Props) {
  const year = new Date().getFullYear();
  const socials = clinic
    ? socialLinks.filter(({ key }) => {
        const href = clinic.socials[key];
        const showcase = SHOWCASE_SOCIALS[key as keyof typeof SHOWCASE_SOCIALS];
        return (href !== "" && href !== "#") || showcase;
      })
    : [];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-900 pb-24 text-white md:pb-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 size-[30rem] rounded-full bg-gold-400/10 blur-3xl"
      />
      <div className="container-page relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-lg font-bold text-white">{clinic?.name ?? "Sakthi Dental Clinic"}</h2>
          {clinic ? (
            <address className="mt-4 flex gap-3 text-base text-white/70 not-italic">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold-400" />
              <span>
                {clinic.address.line1}, {clinic.address.area},<br />
                {clinic.address.city}, {clinic.address.state} {clinic.address.pincode},
                <br />
                {clinic.address.country}
              </span>
            </address>
          ) : null}

          {clinic ? (
            <ul className="mt-4 space-y-3 text-base">
              <li className="flex gap-3">
                <Phone aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold-400" />
                <span className="flex flex-col items-start">
                  {clinic.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="inline-flex min-h-12 min-w-12 items-center hover:text-gold-400"
                    >
                      {phone}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold-400" />
                <a
                  href={`mailto:${clinic.emails[0]}`}
                  className="inline-flex min-h-12 items-center break-all hover:text-gold-400"
                >
                  {clinic.emails[0]}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold-400" />
                <span className="font-medium text-white">{clinic.timings}</span>
              </li>
            </ul>
          ) : null}

          {/*
           * Section 5 — social profiles. Brand icons are not in lucide, and
           * installing an icon pack for three marks is not worth the weight,
           * so each profile is a labelled link. The seeded URLs are still "#"
           * placeholders, which means nothing renders until the clinic sends
           * real profiles: no dead links, no invented handles.
           */}
          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-small">
              {socials.map(({ key, label }) => (
                <li key={key}>
                  <a
                    href={
                      clinic?.socials[key] && clinic.socials[key] !== "#"
                        ? clinic.socials[key]
                        : SHOWCASE_SOCIALS[key as keyof typeof SHOWCASE_SOCIALS]
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center gap-1.5 font-medium text-gold-400 hover:underline"
                  >
                    {label}
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <h2 className="text-lg font-bold text-white">Quick links</h2>
          <ul className="mt-4 space-y-2 text-base">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex min-h-12 min-w-12 items-center hover:text-gold-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Key treatments">
          <h2 className="text-lg font-bold text-white">Key treatments</h2>
          <ul className="mt-4 space-y-2 text-base">
            {treatments.map((treatment) => (
              <li key={treatment.slug}>
                <Link
                  to={`/treatments#${treatment.slug}`}
                  className="inline-flex min-h-12 min-w-12 items-center hover:text-gold-400"
                >
                  {treatment.homeTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-lg font-bold text-white">Visit us</h2>
          <p className="mt-4 text-base text-white/70">
            Open every day. Wheelchair access and parking available.
          </p>
          <p className="mt-4 text-base">
            <Link to="/contact" className="font-medium text-gold-400 underline underline-offset-4">
              Fix an Appointment
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-small text-white/70">
          <p>© {year} Sakthi Dental Clinic. All rights reserved.</p>
          <Link
            to="/privacy-policy"
            className="inline-flex min-h-12 items-center hover:text-gold-400"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
