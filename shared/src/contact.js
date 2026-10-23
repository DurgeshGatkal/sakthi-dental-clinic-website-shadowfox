import { z } from "zod";

/*
 * Section 12 — one contact schema shared by the browser and the server.
 * The browser gives instant feedback; the server is the real gate.
 */

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 60,
  emailMax: 254,
  messageMax: 1000,
  phoneDigits: 10,
};

const NAME_PATTERN = /^[\p{L}\p{M} .'-]+$/u;

/* 9862890897, +91 98628 90897, 0 98628 90897 — all valid Indian mobiles. */
const PHONE_PATTERN = /^(?:\+91|0)?[6-9]\d{9}$/;

export const contactSchema = z.object({
  name: z
    .string({ error: "Please enter your name." })
    .trim()
    .min(1, "Please enter your name.")
    .min(2, "Name should be 2 to 60 letters.")
    .max(60, "Name should be 2 to 60 letters.")
    .regex(NAME_PATTERN, "Name should be 2 to 60 letters."),
  email: z
    .string({ error: "Please enter your email." })
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email.")
    .max(254, "Please enter a valid email, like name@example.com.")
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), {
      message: "Please enter a valid email, like name@example.com.",
    }),
  phone: z
    .string({ error: "Please enter your phone number." })
    .trim()
    .min(1, "Please enter your phone number.")
    .transform((value) => value.replace(/[\s\-()]/g, ""))
    .refine((value) => PHONE_PATTERN.test(value), {
      message: "Please enter a valid 10-digit mobile number.",
    }),
  message: z
    .string()
    .trim()
    .max(1000, "Message can be up to 1000 characters.")
    .optional()
    .default(""),
  /* Honeypot: must stay empty. Never rejected, just ignored (section 9). */
  website: z.string().optional().default(""),
});

export const contactFieldLabels = {
  name: "Name",
  email: "Email",
  phone: "Phone Number",
  message: "Your Message",
};
