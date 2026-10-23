import { rateLimit } from "express-rate-limit";
import { AppError } from "../utils/AppError.js";

/*
 * Section 15 — 5 submissions per IP per 15 minutes on POST /contact.
 * A factory, so each app instance (and each test) gets its own store.
 */
export function createContactRateLimit({ limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(
        new AppError(
          "RATE_LIMITED",
          429,
          "Too many attempts, please try again in a few minutes or call us.",
        ),
      );
    },
  });
}
