/*
 * Day 9 — one command that gives Playwright a clean, disposable world.
 *
 *   node scripts/e2e-env.mjs
 *
 * Starts an in-memory-style mongod on port 27018 (data in .e2e-db/, deleted
 * on every run), seeds content.json, boots the API on 4000 and serves the
 * prerendered build on 5000. Playwright's webServer waits for the last one.
 *
 * The build must already exist (`npm run build`). Everything here is
 * throwaway: no Atlas, no dev data, no mail.
 */
import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { MongoMemoryServer } from "mongodb-memory-server";

const API_PORT = 4000;
const WEB_PORT = 5000;
const MONGO_PORT = 27018;
const MONGO_VERSION = "8.2.6";
const DB_DIR = resolve(".e2e-db");
const URI = `mongodb://127.0.0.1:${MONGO_PORT}/sakthi_e2e`;

const children = new Set();
let mongo = null;
let stopping = false;

function log(message) {
  console.log(`[e2e-env] ${message}`);
}

function portIsFree(port) {
  return new Promise((resolvePort) => {
    const probe = createServer();
    probe.once("error", () => resolvePort(false));
    probe.once("listening", () => probe.close(() => resolvePort(true)));
    probe.listen(port, "127.0.0.1");
  });
}

function track(child, name) {
  children.add(child);
  child.on("exit", (code) => {
    children.delete(child);
    if (stopping) return;
    log(`${name} exited early (code ${code}); shutting the environment down.`);
    shutdown(1);
  });
  return child;
}

function spawnNode(args, env) {
  return spawn(process.execPath, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

function runToCompletion(args, env) {
  const child = spawnNode(args, env);
  return new Promise((resolveRun, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function waitFor(url, label, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`${label} did not answer at ${url} within ${timeoutMs / 1000}s`);
}

async function shutdown(code) {
  if (stopping) return;
  stopping = true;

  for (const child of children) {
    try {
      child.kill();
    } catch {
      /* already gone */
    }
  }
  children.clear();

  if (mongo) {
    try {
      await mongo.stop();
    } catch {
      /* already stopped */
    }
    mongo = null;
  }

  /*
   * .e2e-db/ is wiped at the start of the next run. Deleting it here is not
   * reliable on Windows: Playwright force-kills the web server before mongod
   * releases its file handles.
   */

  log("environment stopped.");
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

async function main() {
  for (const port of [API_PORT, WEB_PORT, MONGO_PORT]) {
    if (!(await portIsFree(port))) {
      throw new Error(
        `port ${port} is already in use. Stop any running dev server or mongod, then run the tests again.`,
      );
    }
  }

  await rm(DB_DIR, { recursive: true, force: true });
  await mkdir(DB_DIR, { recursive: true });

  mongo = await MongoMemoryServer.create({
    binary: { version: MONGO_VERSION },
    instance: { port: MONGO_PORT, dbPath: DB_DIR, storageEngine: "wiredTiger" },
  });
  log(`mongod ready on ${URI}`);

  const env = {
    MONGODB_URI: URI,
    PORT: String(API_PORT),
    NODE_ENV: "test",
    CORS_ORIGINS: "http://127.0.0.1:5000,http://localhost:5000",
    MAIL_ENABLED: "false",
    IP_HASH_SALT: "e2e-only-salt",
  };

  await runToCompletion(["server/src/seed/seed.js"], env);
  log("content seeded.");

  track(spawnNode(["server/src/index.js"], env), "api");
  await waitFor(`http://127.0.0.1:${API_PORT}/api/v1/health`, "API");
  log(`API ready on http://127.0.0.1:${API_PORT}/api/v1`);

  track(spawnNode(["scripts/serve-build.mjs"], { ...env, PORT: String(WEB_PORT) }), "web");
  await waitFor(`http://127.0.0.1:${WEB_PORT}/`, "build server");
  log(`build ready on http://127.0.0.1:${WEB_PORT}`);
}

main().catch(async (error) => {
  console.error(`[e2e-env] ${error.message}`);
  await shutdown(1);
});
