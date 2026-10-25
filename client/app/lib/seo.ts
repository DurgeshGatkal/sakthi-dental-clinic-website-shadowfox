import type { MetaDescriptor } from "react-router";
import { PRIMARY_PHONE_E164, SITE_URL } from "@sakthi/shared/site";
import type { Clinic, Faq } from "~/lib/api";

/*
 * Section 14 — every page ships a unique title and description, a canonical
 * URL, Open Graph and Twitter cards, and one 1200 x 630 share image.
 * VITE_SITE_URL lets a preview build advertise its own origin; production
 * falls back to the clinic's domain.
 */
const ORIGIN = (import.meta.env.VITE_SITE_URL ?? SITE_URL).replace(/\/+$/, "");

export const SHARE_IMAGE = "/og-image.jpg";
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;

/* Section 14 — titles exactly as approved in the plan's SEO table. */
export const PAGE_TITLES = {
  home: "Sakthi Dental Clinic, Hosur: Dental Care for Women, Children & Families",
  about: "About Dr. Anupriya & Our Dental Team, Sakthi Dental Clinic Hosur",
  treatments: "Dental Treatments in Hosur: Implants, Braces, Root Canal & More",
  faqs: "Dental FAQs, Sakthi Dental Clinic Hosur",
  contact: "Contact & Directions, Sakthi Dental Clinic, Anthivadi, Hosur",
  privacy: "Privacy Policy, Sakthi Dental Clinic",
} as const;

export function canonicalUrl(path: string) {
  return `${ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function absoluteAsset(path: string) {
  return path.startsWith("http") ? path : `${ORIGIN}${path}`;
}

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: unknown[];
};

export function seoMeta({
  title,
  description,
  path,
  image = SHARE_IMAGE,
  type = "website",
  jsonLd = [],
}: SeoInput): MetaDescriptor[] {
  const url = canonicalUrl(path);
  const shareImage = absoluteAsset(image);

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: "Sakthi Dental Clinic" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: shareImage },
    { property: "og:image:width", content: String(SHARE_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(SHARE_IMAGE_HEIGHT) },
    { property: "og:image:alt", content: "Sakthi Dental Clinic, Hosur" },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: shareImage },
    ...jsonLd.map((data) => ({ "script:ld+json": data }) as MetaDescriptor),
  ];
}

/* Section 14 — JSON-LD rendered from the layout, escaped for inline HTML. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/* Section 14 — Dentist on every page, built from the seeded clinic record. */
export function dentistJsonLd(clinic: Clinic) {
  const socials = [
    clinic.socials.instagram,
    clinic.socials.facebook,
    clinic.socials.youtube,
  ].filter((href) => href !== "" && href !== "#");

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${ORIGIN}/#clinic`,
    name: clinic.name,
    description: clinic.tagline,
    url: `${ORIGIN}/`,
    telephone: PRIMARY_PHONE_E164,
    email: clinic.emails[0],
    image: absoluteAsset(clinic.hero.image.src),
    logo: absoluteAsset("/images/logo/sdc-logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${clinic.address.line1}, ${clinic.address.area}`,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.pincode,
      addressCountry: "IN",
    },
    openingHours: clinic.openingHours,
    medicalSpecialty: "Dentistry",
    areaServed: { "@type": "City", name: clinic.address.city },
    ...(socials.length > 0 ? { sameAs: socials } : {}),
  };
}

/* Section 14 — FAQPage on /faqs, straight from the seeded answers. */
export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/* Section 14 — BreadcrumbList on every inner page. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function breadcrumbs(...trail: { name: string; path: string }[]) {
  return breadcrumbJsonLd([{ name: "Home", path: "/" }, ...trail]);
}
