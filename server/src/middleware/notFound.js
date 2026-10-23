import { AppError } from "../utils/AppError.js";

export function notFound(req, _res, next) {
  next(new AppError("NOT_FOUND", 404, `No route matches ${req.method} ${req.originalUrl}.`));
}
