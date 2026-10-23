import { randomUUID } from "node:crypto";

/* Section 11 — every request gets an id so a log line can be traced back. */
export function requestId(req, res, next) {
  const incoming = req.get("x-request-id");
  req.id = incoming && incoming.length <= 100 ? incoming : randomUUID();
  res.setHeader("x-request-id", req.id);
  next();
}
