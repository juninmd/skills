#!/usr/bin/env node
// Top allocation sites from a DHAT JSON (valgrind --tool=dhat --dhat-out-file=out.json).
// usage: node dhat-top.mjs <out.json> [topN=8] [frameFilter=""]  (filter keeps frames whose name contains it, e.g. a crate name)
import { readFileSync } from 'node:fs';

const [file, topArg, filter = ''] = process.argv.slice(2);
if (!file) { console.error('usage: dhat-top.mjs <out.json> [topN] [frameFilter]'); process.exit(2); }
const top = Number(topArg ?? 8);
const dhat = JSON.parse(readFileSync(file, 'utf8'));
const mb = (n) => (n / 1e6).toFixed(1).padStart(7);
const frames = (p) => p.fs.map((i) => dhat.ftbl[i].replace(/^0x[0-9A-F]+: /i, '').slice(0, 110)).filter((f) => f.includes(filter)).slice(0, 3);
const show = (title, key) => {
  console.log(`# ${title}`);
  for (const p of [...dhat.pps].sort((a, b) => b[key] - a[key]).slice(0, top)) {
    console.log(`${mb(p[key])} MB  ${p.tbk} blocks  ${frames(p).join(' <- ')}`);
  }
};
show('live at peak (gb)', 'gb');
show('total allocated (tb)', 'tb');
