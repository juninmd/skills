#!/usr/bin/env node
// Top self-time functions from a V8 .cpuprofile (Node --cpu-prof, Bun --cpu-prof, Chrome CDP).
// usage: node cpuprofile-top.mjs <file.cpuprofile> [topN=15]
import { readFileSync } from 'node:fs';

const [file, topArg] = process.argv.slice(2);
if (!file) { console.error('usage: cpuprofile-top.mjs <file.cpuprofile> [topN]'); process.exit(2); }
const top = Number(topArg ?? 15);
const profile = JSON.parse(readFileSync(file, 'utf8'));
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
let total = 0;
profile.samples.forEach((id, i) => {
  const dt = (profile.timeDeltas[i] ?? 0) / 1000;
  const { functionName, url, lineNumber } = byId.get(id).callFrame;
  const key = `${functionName || '(anonymous)'} ${url.replace(/^file:\/\//, '')}:${lineNumber + 1}`;
  self.set(key, (self.get(key) ?? 0) + dt);
  total += dt;
});
console.log(`total ${total.toFixed(0)} ms, ${self.size} frames`);
for (const [key, ms] of [...self].sort((a, b) => b[1] - a[1]).slice(0, top)) {
  console.log(`${ms.toFixed(1).padStart(8)} ms ${((ms / total) * 100).toFixed(1).padStart(5)}%  ${key}`);
}
