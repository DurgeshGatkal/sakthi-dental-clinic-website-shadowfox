import mongoose from "mongoose";
import { createApp } from "../server/src/app.js";
import { env } from "../server/src/config/env.js";

const app = createApp();

let cached = globalThis.__sakthiMongo;
if (!cached) cached = globalThis.__sakthiMongo = { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  if (!env.MONGODB_URI) {
    res
      .status(503)
      .json({
        success: false,
        error: { code: "NO_DATABASE", message: "Database is not configured." },
      });
    return;
  }
  try {
    await connect();
  } catch {
    res
      .status(503)
      .json({
        success: false,
        error: { code: "DB_UNAVAILABLE", message: "Database connection failed." },
      });
    return;
  }
  return app(req, res);
}
