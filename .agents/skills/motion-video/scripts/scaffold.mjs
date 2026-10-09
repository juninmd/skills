#!/usr/bin/env node
// Scaffold a motion-video project: engine + render pipeline + music generator + chosen scene patterns.
// usage: node scaffold.mjs <target-dir> [--with counter-bar,terminal-bars]
import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = resolve(fileURLToPath(import.meta.url), '..', '..');
const PATTERNS = join(SKILL, 'templates', 'patterns');
const camel = name => name.replace(/-(\w)/g, (_, c) => c.toUpperCase());

const [targetArg, ...rest] = process.argv.slice(2);
if (!targetArg || targetArg.startsWith('--')) {
  console.error('usage: node scaffold.mjs <target-dir> [--with pattern,pattern]');
  process.exit(2);
}
const withIdx = rest.indexOf('--with');
const wanted = withIdx < 0 ? [] : (rest[withIdx + 1] ?? '').split(',').filter(Boolean);

const available = (await readdir(PATTERNS)).filter(f => f.endsWith('.js')).map(f => basename(f, '.js'));
const unknown = wanted.filter(w => !available.includes(w));
if (unknown.length) {
  console.error(`unknown pattern(s): ${unknown.join(', ')}\navailable: ${available.join(', ')}`);
  process.exit(2);
}

const target = resolve(targetArg);
const rel = relative(SKILL, target); // absolute when the target is on another drive
if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) {
  console.error('target must be outside the skill folder');
  process.exit(2);
}
try {
  if ((await readdir(target)).length) throw new Error('not empty');
} catch (e) {
  if (e.code !== 'ENOENT') { console.error(`target ${target} must be empty or not exist`); process.exit(2); }
}

await mkdir(target, { recursive: true });
await cp(join(SKILL, 'templates', 'video-project'), target, { recursive: true });
await cp(join(SKILL, 'scripts', 'music.py'), join(target, 'scripts', 'music.py'));
for (const name of wanted) await cp(join(PATTERNS, `${name}.js`), join(target, 'src', 'scenes', `${name}.js`));

const imports = ['hook', ...wanted, 'outro'];
await writeFile(join(target, 'src', 'scenes', 'index.js'), [
  ...imports.map(n => `import ${camel(n)} from './${n}.js';`),
  '',
  '// Order = playback order. Durations are multiples of one beat (0.5s at 120 BPM) so every cut lands on a beat.',
  `export default [${imports.map(camel).join(', ')}];`,
  '',
].join('\n'));

console.error(`scaffolded ${target}\nnext: cd "${target}" && npm install && npm run still -- 1,5 && npm run build`);
