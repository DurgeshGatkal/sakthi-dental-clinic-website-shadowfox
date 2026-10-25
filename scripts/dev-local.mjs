/*
 * Local development without Atlas.
 *
 * A home broadband address changes whenever the ISP re-leases it, which means
 * the Atlas allow-list has to be edited every few days. This starts a real
 * mongod locally instead (the binary is already cached for the test suite),
 * seeds it from content.json, and then runs API + client against it.
 *
 *   npm run dev:local
 *
 * Data lives in .local-db/ (git-ignored) and survives restarts. `npm run seed`
 * is upsert-based, so re-seeding never touches saved enquiries.
 */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { MongoMemoryServer } from "mongodb-memory-server";

const PORT = 27017;
const DB_NAME = "sakthi_local";
const DATA_DIR = ".local-db";
// Pinned to the binary the test suite already downloaded; prevents a new fetch.
const MONGO_VERSION = "8.2.6";

const uri = `mongodb://127.0.0.1:${PORT}/${DB_NAME}`;

function run(command, env) {
  return new Promise((resolve, reject) => {
    // A single command string avoids Node's shell+args deprecation warning;
    // nothing here is user input.
    const child = spawn(command, { stdio: "inherit", env, shell: true });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`"${command}" exited with code ${code}`));
    });
  });
}

let mongo;
try {
  // MongoMemoryServer needs the data folder to exist before it can inspect it.
  await mkdir(DATA_DIR, { recursive: true });
  mongo = await MongoMemoryServer.create({
    binary: { version: MONGO_VERSION },
    instance: { port: PORT, dbPath: DATA_DIR, storageEngine: "wiredTiger" },
  });
} catch (error) {
  console.error("");
  console.error("Could not start the local MongoDB.");
  if (String(error?.message).includes("EADDRINUSE")) {
    console.error(`Port ${PORT} is already in use â€” another mongod is probably running.`);
    console.error("Stop it, or change PORT in scripts/dev-local.mjs.");
  } else {
    console.error(error?.message ?? error);
  }
  process.exit(1);
}

console.log("");
console.log(`  Local MongoDB  ${uri}`);
console.log(`  Data folder    ${DATA_DIR}/ (git-ignored)`);
console.log(`  Admin UI       none â€” use npm run seed to refresh content`);
console.log("");

const env = { ...process.env, MONGODB_URI: uri };

console.log("Seeding content.jsonâ€¦");
try {
  await run("npm run seed -w @sakthi/server", env);
} catch (error) {
  console.error(error.message);
  await mongo.stop();
  process.exit(1);
}

const dev = spawn("npm run dev", { stdio: "inherit", env, shell: true });

let stopping = false;
async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`\n${signal} â€” stopping local MongoDBâ€¦`);
  dev.kill();
  await mongo.stop();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

dev.on("exit", async (code) => {
  if (stopping) return;
  stopping = true;
  await mongo.stop();
  process.exit(code ?? 0);
});
