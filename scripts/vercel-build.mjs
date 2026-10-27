/*
 * Vercel build entry point.
 *
 * The client prerenders every route, and each route's loader fetches its data
 * from the API. On Vercel there is no always-on API process, so we start the
 * Express server for the duration of the build (it connects to the Atlas
 * cluster through MONGODB_URI) and stop it afterwards. The browser then talks
 * to the same-origin serverless function at /api/v1.
 */
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const PORT = process.env.PORT || 4000;
const HEALTH = `http://127.0.0.1:${PORT}/api/v1/health`;

function run(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: "inherit", shell: true });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`"${command}" exited ${code}`)),
    );
  });
}

let api;
try {
  api = spawn("npm run start -w @sakthi/server", {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, PORT: String(PORT) },
  });

  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(HEALTH);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // API not ready yet; retry.
    }
    await wait(2000);
  }
  if (!ready) throw new Error("API did not become ready in time");

  await run("npm run build -w @sakthi/client");
} finally {
  if (api && !api.killed) api.kill("SIGTERM");
}

console.log("Vercel build complete.");
