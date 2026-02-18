import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getManifestDir, getManifestPath } from './platform.js';
import { ensureDir, fileExists } from './fs.js';
import type { Manifest } from '../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_DIR = join(__dirname, '..', '..');
const PACKAGE_JSON_PATH = join(CLI_DIR, 'package.json');

export async function readManifest(): Promise<Manifest | null> {
  const manifestPath = getManifestPath();
  if (!(await fileExists(manifestPath))) {
    return null;
  }

  try {
    const content = await readFile(manifestPath, 'utf-8');
    return JSON.parse(content) as Manifest;
  } catch {
    return null;
  }
}

export async function writeManifest(manifest: Manifest): Promise<void> {
  await ensureDir(getManifestDir());
  await writeFile(getManifestPath(), JSON.stringify(manifest, null, 2), 'utf-8');
}

export function getLatestVersion(registry?: string): string | null {
  try {
    const registryFlag = registry ? `--registry=${registry}` : '';
    const result = execSync(
      `npm view @luizalabs/padrao-labs-agents version ${registryFlag}`,
      { encoding: 'utf-8', stdio: 'pipe', timeout: 15000 }
    ).trim();
    return result || null;
  } catch {
    return null;
  }
}

export async function getCurrentPackageVersion(): Promise<string> {
  try {
    const content = await readFile(PACKAGE_JSON_PATH, 'utf-8');
    const pkg = JSON.parse(content);
    return pkg.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}
