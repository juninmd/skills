import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { getManifestDir, getManifestPath } from './platform.js';
import { ensureDir, fileExists } from './fs.js';
import type { Manifest } from '../types.js';

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

export function getCurrentPackageVersion(): string {
  // This is set at build time from package.json
  return '1.0.0';
}
