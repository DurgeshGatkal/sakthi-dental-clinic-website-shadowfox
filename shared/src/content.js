import { z } from "zod";

/*
 * Content schemas — section 8 of the project plan.
 *
 * The seed script validates content.json against these before it touches
 * MongoDB, so a typo in the copy fails the seed instead of shipping.
 * Counts are pinned to the brief: 15 treatments, 9 doctors, 14 FAQs,
 * 3 testimonials, 5 amenities, 4 reasons to choose the clinic.
 */

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const ordered = {
  order: z.number().int().min(1),
  isActive: z.boolean(),
};

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs are lower-case words joined by hyphens");

export const clinicInfoSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  address: z.object({
    line1: z.string().min(1),
    area: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    country: z.string().min(1),
  }),
  emails: z.array(z.email()).min(1),
  phones: z.array(z.string().min(6)).min(1),
  timings: z.string().min(1),
  doctorAvailability: z.string().min(1),
  socials: z.object({
    instagram: z.string(),
    facebook: z.string(),
    youtube: z.string(),
  }),
  mapUrl: z.url(),
  hero: z.object({
    eyebrow: z.string().min(1),
    headline: z.string().min(1),
    subtext: z.string().min(1),
  }),
  assurance: z.string().min(1),
  privacyPolicy: z.object({
    markdown: z.string().min(1),
    updatedAt: z.string().min(1),
  }),
});

export const whyChooseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  ...ordered,
});

export const amenitySchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  iconImage: z.string().min(1),
  ...ordered,
});

export const treatmentSchema = z
  .object({
    title: z.string().min(1),
    slug: slugSchema,
    homeTitle: z.string().min(1),
    homeSummary: z.string().min(1).nullable(),
    description: z.string().min(1),
    icon: z.string().min(1),
    image: imageSchema,
    isCore: z.boolean(),
    homeOrder: z.number().int().min(1).max(6).nullable(),
    ...ordered,
  })
  .superRefine((treatment, ctx) => {
    if (treatment.isCore && treatment.homeOrder === null) {
      ctx.addIssue({
        code: "custom",
        path: ["homeOrder"],
        message: "Core treatments need a homeOrder so the Home page order is fixed",
      });
    }
    if (!treatment.isCore && treatment.homeOrder !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["homeOrder"],
        message: "Only core treatments carry a homeOrder",
      });
    }
    if (treatment.isCore && treatment.homeSummary === null) {
      ctx.addIssue({
        code: "custom",
        path: ["homeSummary"],
        message: "Core treatments need the one-line summary shown on the Home cards",
      });
    }
  });

export const doctorSchema = z.object({
  name: z.string().min(1),
  specialty: z.string().min(1),
  isFounder: z.boolean(),
  qualifications: z.array(z.string().min(1)),
  photo: imageSchema.nullable(),
  ...ordered,
});

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  rating: z.number().int().min(1).max(5).nullable(),
  ...ordered,
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  ...ordered,
});

const uniqueBy = (items, key) => new Set(items.map((item) => item[key])).size === items.length;

export const contentFileSchema = z
  .object({
    clinicInfo: clinicInfoSchema,
    whyChoose: z.array(whyChooseSchema).length(4),
    amenities: z.array(amenitySchema).length(5),
    treatments: z.array(treatmentSchema).length(15),
    doctors: z.array(doctorSchema).length(9),
    testimonials: z.array(testimonialSchema).length(3),
    faqs: z.array(faqSchema).length(14),
  })
  .superRefine((content, ctx) => {
    const groups = [
      { items: content.treatments, key: "slug", name: "treatments", path: "treatments" },
      { items: content.treatments, key: "order", name: "treatment order", path: "treatments" },
      { items: content.doctors, key: "order", name: "doctor order", path: "doctors" },
      { items: content.faqs, key: "order", name: "FAQ order", path: "faqs" },
      { items: content.amenities, key: "order", name: "amenity order", path: "amenities" },
      { items: content.whyChoose, key: "order", name: "why-choose order", path: "whyChoose" },
    ];

    for (const group of groups) {
      if (!uniqueBy(group.items, group.key)) {
        ctx.addIssue({
          code: "custom",
          path: [group.path],
          message: `Duplicate ${group.name}; every value must be unique`,
        });
      }
    }

    const core = content.treatments.filter((treatment) => treatment.isCore);
    if (core.length !== 6) {
      ctx.addIssue({
        code: "custom",
        path: ["treatments"],
        message: `Exactly 6 treatments are core (Home page); found ${core.length}`,
      });
    }
  });

export const CONTENT_COUNTS = {
  treatments: 15,
  coreTreatments: 6,
  doctors: 9,
  testimonials: 3,
  faqs: 14,
  amenities: 5,
  whyChoose: 4,
};
