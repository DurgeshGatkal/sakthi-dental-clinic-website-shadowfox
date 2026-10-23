import { createHash } from "node:crypto";
import { env } from "../config/env.js";

/*
 * Section 15 — the raw IP is never stored, only a salted SHA-256 hash.
 */
export function hashIp(ip = "") {
  return createHash("sha256").update(`${ip}:${env.IP_HASH_SALT}`).digest("hex");
}
