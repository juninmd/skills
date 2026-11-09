#!/usr/bin/env node
// Cross-platform port list/kill. Usage:
//   portkill.mjs PORT --list | [--force]
// Exit 0: port free (or freed). Exit 1: kill failed / port still taken.

import { execFileSync } from "node:child_process";

const port = Number(process.argv[2]);
const args = process.argv.slice(3);
const listOnly = args.includes("--list");
const force = args.includes("--force");

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("usage: node portkill.mjs <port 1-65535> [--list] [--force]");
  process.exit(1);
}

function run(cmd, cmdArgs) {
  return execFileSync(cmd, cmdArgs, { encoding: "utf8", timeout: 15_000 });
}

function listWindows() {
  // TCP lines: Proto LocalAddr ForeignAddr State PID
  const out = run("netstat", ["-ano", "-p", "tcp"]);
  const pids = new Set();
  for (const line of out.split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 5) continue;
    const [proto, local, , state, pid] = parts;
    if (proto !== "TCP" || state !== "LISTENING") continue;
    if (Number(local.split(":").pop()) === port) pids.add(Number(pid));
  }
  return [...pids];
}

function listPosix() {
  const out = run("lsof", ["-nP", "-iTCP:" + port, "-sTCP:LISTEN", "-Fp"]).trim();
  return [...new Set(out.split("\n").filter((l) => l.startsWith("p")).map((l) => Number(l.slice(1))))];
}

function list() {
  return process.platform === "win32" ? listWindows() : listPosix();
}

function name(pid) {
  try {
    return process.platform === "win32"
      ? run("tasklist", ["/FI", `PID eq ${pid}`, "/FO", "CSV", "/NH"]).split(",")[0]?.replaceAll('"', "") || "?"
      : run("ps", ["-p", String(pid), "-o", "comm="]).trim() || "?";
  } catch {
    return "?";
  }
}

const isWindows = process.platform === "win32";
// Never kill the process running this script (the agent itself).
const selfPid = process.pid;

let pids = list().filter((pid) => pid !== selfPid);
if (pids.length === 0) {
  console.log(`port ${port}: free`);
  process.exit(0);
}

for (const pid of pids) console.log(`${pid}\t${name(pid)}`);
if (listOnly) process.exit(0);

let failed = false;
for (const pid of pids) {
  try {
    if (isWindows) {
      run("taskkill", ["/PID", String(pid), "/F"]);
    } else {
      const signal = force ? "-9" : "-TERM";
      run("kill", [signal, String(pid)]);
    }
  } catch {
    failed = true;
    console.error(`kill ${pid} failed`);
  }
}

const left = list().filter((pid) => pid !== selfPid);
if (left.length > 0 || failed) {
  console.error(`port ${port}: still taken by ${left.join(", ") || "unknown"}`);
  process.exit(1);
}
console.log(`port ${port}: freed`);
