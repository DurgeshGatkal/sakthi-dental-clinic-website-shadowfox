import {
  getClinic,
  getDoctors,
  getFaqs,
  getHome,
  getPrivacyPolicy,
  getTestimonials,
  getTreatmentBySlug,
  getTreatments,
} from "../services/content.service.js";
import { AppError } from "../utils/AppError.js";

/* Section 9 — cache policy for read endpoints. */
const CACHE_10_MIN = "public, max-age=600, stale-while-revalidate=86400";
const CACHE_1_DAY = "public, max-age=86400";

const send = (res, data, cacheControl = CACHE_10_MIN) => {
  res.setHeader("Cache-Control", cacheControl);
  res.json({ success: true, data });
};

export async function home(_req, res) {
  send(res, await getHome());
}

export async function clinic(_req, res) {
  send(res, await getClinic());
}

export async function treatments(req, res) {
  const core = req.query.core === "true";
  send(res, await getTreatments({ core }));
}

export async function treatmentBySlug(req, res) {
  const treatment = await getTreatmentBySlug(req.params.slug);
  if (!treatment) {
    throw new AppError("NOT_FOUND", 404, "That treatment does not exist.");
  }
  send(res, treatment);
}

export async function doctors(_req, res) {
  send(res, await getDoctors());
}

export async function testimonials(_req, res) {
  send(res, await getTestimonials());
}

export async function faqs(_req, res) {
  send(res, await getFaqs());
}

export async function privacyPolicy(_req, res) {
  const policy = await getPrivacyPolicy();
  if (!policy) {
    throw new AppError("NOT_FOUND", 404, "The privacy policy has not been published yet.");
  }
  send(res, policy, CACHE_1_DAY);
}
