/*
 * Vercel build entry point.
 *
 * The client prerenders every route, and each route's loader fetches its data
 * from the API. On Vercel there is no always-on API process and the build
 * environment cannot reach a whitelisted Atlas cluster, so we spin up an
 * in-memory MongoDB (mongodb-memory-server, already a dependency) for the
 * duration of the build, seed it from content.json, start Express against it,
 * build, and tear everything down. The browser then talks to the same-origin
 * serverless function at /api/v1, which uses the real MONGODB_URI at runtime.
 */
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { MongoMemoryServer } from "mongodb-memory-server";

const PORT = process.env.PORT || 4000;
const HEALTH = `http://127.0.0.1:${PORT}/api/v1/health`;

function run(command, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: "inherit", shell: true, env });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`"${command}" exited ${code}`)),
    );
  });
}

let mongo;
let api;
try {
  mongo = await MongoMemoryServer.create({ instance: { port: 27019 } });
  const memoryUri = mongo.getUri();

  await run("npm run seed", { ...process.env, MONGODB_URI: memoryUri, NODE_ENV: "test" });

  api = spawn("npm run start -w @sakthi/server", {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, MONGODB_URI: memoryUri, PORT: String(PORT), NODE_ENV: "test" },
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

  await run("npm run build -w @sakthi/client", process.env);
} finally {
  if (api && !api.killed) api.kill("SIGTERM");
  if (mongo) await mongo.stop();
}

console.log("Vercel build complete.");
