import pino from "pino";
import { isTest } from "../config/env.js";

export const logger = pino({
  level: isTest ? "silent" : "info",
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.ipHash"],
    censor: "[redacted]",
  },
});
