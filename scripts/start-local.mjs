import { spawn } from "node:child_process";
import { mkdir, open, access } from "node:fs/promises";
import { createConnection } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const url = "http://127.0.0.1:3000";
const logPath = join(root, ".local", "server.log");

function portInUse() {
  return new Promise((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port: 3000 });
    const finish = (busy) => { socket.destroy(); resolve(busy); };
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
    socket.setTimeout(2000, () => finish(false));
  });
}

async function siteReady() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const html = await response.text();
    return response.ok && /<title>DART\s/.test(html) && html.includes("https://zalo.me/0963549673");
  } catch { return false; }
}

async function start() {
  if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Install Node.js 22 or newer, then try again.");
  if (await portInUse()) {
    if (await siteReady()) {
      console.log(`DART is already running: ${url}`);
      return;
    }
    throw new Error("Port 3000 is in use, but DART is not responding correctly. Check .local/server.log or close the other server before trying again.");
  }
  const next = join(root, "node_modules", "next", "dist", "bin", "next");
  await access(next);
  await mkdir(dirname(logPath), { recursive: true });
  const log = await open(logPath, "a");
  await log.write(`\n[DART launcher] ${new Date().toISOString()} | ${root}\n`);
  let child;
  try {
    child = spawn(process.execPath, [next, "dev", "--hostname", "127.0.0.1", "--port", "3000"], {
      cwd: root, detached: true, windowsHide: true, stdio: ["ignore", log.fd, log.fd],
    });
    await new Promise((resolve, reject) => {
      child.once("spawn", resolve);
      child.once("error", reject);
    });
  } finally { await log.close(); }
  child.unref();
  console.log("Starting DART in the background...");
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (await siteReady()) {
      console.log(`Ready: ${url}\nYou can close this launcher. Server log: ${logPath}`);
      return;
    }
    if (child.exitCode !== null) throw new Error(`The server exited. Check ${logPath}`);
    await delay(500);
  }
  throw new Error(`DART did not become ready in time. Check ${logPath}`);
}

start().catch((error) => {
  console.error(`DART could not start: ${error.message}`);
  process.exitCode = 1;
});
