import mongoose from "mongoose";

/* Section 9 — uptime and a real database ping. */
export function health(_req, res) {
  const connected = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    data: {
      status: connected ? "ok" : "degraded",
      db: connected ? "connected" : "disconnected",
      uptime: Math.round(process.uptime()),
    },
  });
}
