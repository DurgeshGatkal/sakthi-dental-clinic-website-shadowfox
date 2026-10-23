import { AppError } from "../utils/AppError.js";

const fieldErrors = (issues) => {
  const fields = {};
  for (const issue of issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
};

/*
 * Section 11 — validation runs in middleware so controllers stay small.
 * A failure returns 422 with one message per field (section 9).
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new AppError(
          "VALIDATION_ERROR",
          422,
          "Some fields need attention.",
          fieldErrors(result.error.issues),
        ),
      );
    }
    req.body = result.data;
    next();
  };
}
