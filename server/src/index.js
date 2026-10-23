import mongoose from "mongoose";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

/* Section 11 — connect to MongoDB, start the server, handle SIGTERM. */

if (!env.MONGODB_URI) {
  logger.error(
    "MONGODB_URI is not set. Copy .env.example to .env, paste your Atlas connection string, then start again.",
  );
  process.exit(1);
}

try {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  logger.info(`Connected to MongoDB database "${mongoose.connection.name}".`);
} catch (error) {
  logger.error({ err: error }, "Could not connect to MongoDB.");
  process.exit(1);
}

const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT}/api/v1`);
});

async function shutdown(signal) {
  logger.info(`${signal} received; shutting down.`);
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
