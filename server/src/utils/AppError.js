/*
 * One error class for the whole API (section 11). Anything thrown as an
 * AppError becomes a controlled JSON response; anything else is a 500.
 */
export class AppError extends Error {
  constructor(code, status, message, fields) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}
