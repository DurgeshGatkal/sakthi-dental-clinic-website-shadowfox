import ClinicInfo from "../models/ClinicInfo.js";
import Treatment from "../models/Treatment.js";
import Doctor from "../models/Doctor.js";
import Testimonial from "../models/Testimonial.js";
import Faq from "../models/Faq.js";
import Amenity from "../models/Amenity.js";
import WhyChoose from "../models/WhyChoose.js";

/*
 * Section 9 — read services. Every content query sorts by `order`,
 * returns only active rows, and hands back plain objects for JSON.
 */

export async function getClinic() {
  return ClinicInfo.findOne().select("-privacyPolicy").lean();
}

export async function getHome() {
  const [clinic, whyChoose, coreTreatments, testimonials, amenities] = await Promise.all([
    ClinicInfo.findOne().select("-privacyPolicy").lean(),
    WhyChoose.find({ isActive: true }).sort({ order: 1 }).lean(),
    Treatment.find({ isActive: true, isCore: true }).sort({ homeOrder: 1 }).lean(),
    Testimonial.find({ isActive: true }).sort({ order: 1 }).lean(),
    Amenity.find({ isActive: true }).sort({ order: 1 }).lean(),
  ]);

  return { clinic, whyChoose, coreTreatments, testimonials, amenities };
}

export async function getTreatments({ core = false } = {}) {
  const filter = { isActive: true };
  if (core) filter.isCore = true;
  return Treatment.find(filter)
    .sort(core ? { homeOrder: 1 } : { order: 1 })
    .lean();
}

export async function getTreatmentBySlug(slug) {
  return Treatment.findOne({ slug: String(slug).toLowerCase(), isActive: true }).lean();
}

export async function getDoctors() {
  return Doctor.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function getTestimonials() {
  return Testimonial.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function getFaqs() {
  return Faq.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function getPrivacyPolicy() {
  const clinic = await ClinicInfo.findOne().select("privacyPolicy").lean();
  return clinic?.privacyPolicy ?? null;
}
