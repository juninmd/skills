import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import test from "node:test";

const script = new URL("../skills/portkill/scripts/portkill.mjs", import.meta.url).pathname;
const hasLsof = process.platform !== "win32" && spawnSync("lsof", ["-v"]).error === undefined;

function freePort() {
  return new Promise((resolve) => {
    const srv = net.createServer().listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

const portkill = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });

test("a port nobody listens on is reported free with exit 0", { skip: !hasLsof }, async () => {
  const result = portkill(String(await freePort()));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /: free/);
});

test("a listener is listed, then terminated and the port reported freed", { skip: !hasLsof }, async () => {
  const port = await freePort();
  const child = spawn(process.execPath, ["-e", `require("net").createServer().listen(${port}, "127.0.0.1"); setInterval(() => {}, 1000)`], {
    stdio: "ignore",
  });
  try {
    for (let i = 0; i < 50 && portkill(String(port), "--list").stdout.includes("free"); i++) {
      await new Promise((r) => setTimeout(r, 100));
    }
    const listed = portkill(String(port), "--list");
    assert.match(listed.stdout, new RegExp(`^${child.pid}\\t`, "m"));
    const killed = portkill(String(port));
    assert.equal(killed.status, 0, killed.stderr);
    assert.match(killed.stdout, /freed/);
  } finally {
    child.kill("SIGKILL");
  }
});

test("an invalid port prints usage and exits 1", () => {
  assert.equal(portkill("70000").status, 1);
});
