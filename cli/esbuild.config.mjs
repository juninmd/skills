import * as esbuild from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

const files = (await getFiles('./src')).filter(f => f.endsWith('.ts'));

await esbuild.build({
  entryPoints: files,
  outdir: 'dist',
  platform: 'node',
  format: 'esm',
  target: 'node18',
});