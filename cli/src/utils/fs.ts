import { mkdir, cp, rm, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function copyDirRecursive(src: string, dest: string): Promise<number> {
  if (!existsSync(src)) {
    return 0;
  }

  await ensureDir(dest);

  let count = 0;
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      count += await copyDirRecursive(srcPath, destPath);
    } else {
      await cp(srcPath, destPath, { force: true });
      count++;
    }
  }

  return count;
}

export async function cleanAndCopy(src: string, dest: string): Promise<number> {
  if (existsSync(dest)) {
    await rm(dest, { recursive: true, force: true });
  }
  return copyDirRecursive(src, dest);
}

export async function countFiles(dir: string): Promise<number> {
  if (!existsSync(dir)) return 0;

  let count = 0;
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += await countFiles(join(dir, entry.name));
    } else {
      count++;
    }
  }

  return count;
}

export async function dirExists(dir: string): Promise<boolean> {
  try {
    const s = await stat(dir);
    return s.isDirectory();
  } catch {
    return false;
  }
}

export async function fileExists(file: string): Promise<boolean> {
  try {
    const s = await stat(file);
    return s.isFile();
  } catch {
    return false;
  }
}

export async function readFileList(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isFile()).map(e => e.name);
}
