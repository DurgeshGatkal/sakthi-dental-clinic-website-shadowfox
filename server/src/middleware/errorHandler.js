import { AppError } from "../utils/AppError.js";
import { isProduction } from "../config/env.js";
import { logger } from "../utils/logger.js";

/*
 * Section 11 — one place maps every error to the API envelope.
 * Stack traces never reach production responses.
 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields ? { fields: err.fields } : {}),
      },
    });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: { code: "PAYLOAD_TOO_LARGE", message: "That request is too large." },
    });
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_JSON", message: "The request body is not valid JSON." },
    });
  }

  if (err?.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_IDENTIFIER", message: "That identifier is not valid." },
    });
  }

  logger.error({ err, requestId: req.id }, "unhandled error");

  return res.status(500).json({
    success: false,
    error: {
      code: "SERVER_ERROR",
      message: isProduction
        ? "Something went wrong. Please call us on +91 9862890897."
        : `Something went wrong: ${err?.message ?? "unknown error"}`,
    },
  });
}
