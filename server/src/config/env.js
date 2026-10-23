import { config } from "dotenv";
import { z } from "zod";

config({ path: new URL("../../../.env", import.meta.url), quiet: true });

/*
 * Section 11 — reads and validates environment variables at startup.
 * A bad value stops the process instead of failing later at request time.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: z.string().trim().default(""),
  CORS_ORIGINS: z.string().trim().default("http://localhost:5173"),
  SMTP_HOST: z.string().trim().default(""),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_USER: z.string().trim().default(""),
  SMTP_PASS: z.string().default(""),
  MAIL_TO: z.email().default("info@sakthidentalclinic.in"),
  IP_HASH_SALT: z.string().default("development-only-salt"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const isTest = env.NODE_ENV === "test";
export const isProduction = env.NODE_ENV === "production";
