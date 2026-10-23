import { Router } from "express";
import {
  clinic,
  doctors,
  faqs,
  home,
  privacyPolicy,
  testimonials,
  treatmentBySlug,
  treatments,
} from "../controllers/content.controller.js";

export const contentRouter = Router();

contentRouter.get("/content/home", home);
contentRouter.get("/clinic", clinic);
contentRouter.get("/treatments", treatments);
contentRouter.get("/treatments/:slug", treatmentBySlug);
contentRouter.get("/doctors", doctors);
contentRouter.get("/testimonials", testimonials);
contentRouter.get("/faqs", faqs);
contentRouter.get("/privacy-policy", privacyPolicy);
