import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { corsOrigins, isTest } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { createContactRateLimit } from "./middleware/rateLimit.js";
import { requestId } from "./middleware/requestId.js";
import { contactRouter } from "./routes/contact.routes.js";
import { contentRouter } from "./routes/content.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { AppError } from "./utils/AppError.js";
import { logger } from "./utils/logger.js";

const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

/*
 * Section 11 — middleware order.
 * requestId → pino-http → helmet → cors → compression → json → routes →
 * notFound → errorHandler.
 */
export function createApp({ contactRateLimit } = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestId);
  app.use(pinoHttp({ logger, genReqId: (req) => req.id, autoLogging: !isTest }));

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          frameAncestors: ["'none'"],
          imgSrc: ["'self'", "data:"],
        },
      },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin) || vercelPreview.test(origin)) {
          return callback(null, true);
        }
        return callback(new AppError("CORS_BLOCKED", 403, "That origin is not allowed."));
      },
    }),
  );

  app.use(compression());
  app.use(express.json({ limit: "10kb" }));

  app.use("/api/v1", healthRouter);
  app.use("/api/v1", contentRouter);
  app.use("/api/v1/contact", contactRateLimit ?? createContactRateLimit(), contactRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
