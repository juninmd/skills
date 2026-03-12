import { mkdir, cp, rm, readdir, stat, symlink, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { log } from './logger.js';

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

/**
 * Cria symlinks de forma granular (item a item).
 * Preserva itens que o usuario possa ter na pasta de destino,
 * apenas sobresscrevendo os itens do nosso proprio bundle.
 */
export async function syncSymlinksGranular(srcDir: string, destDir: string): Promise<number> {
  if (!existsSync(srcDir)) return 0;

  await ensureDir(destDir);
  const entries = await readdir(srcDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);

    // Se o destino ja existe, verifica se e um symlink. Se for, podemos apagar.
    // Se for um arquivo/diretorio real que conflitue com o nosso nome, apagamos
    // para sobrepor com o symlink oficial, pois nossos nomes de skills oficiais tem precedencia.
    try {
      const destStat = await lstat(destPath);
      if (destStat) {
        await rm(destPath, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignora erro se nao existir
    }

    try {
      const type = entry.isDirectory() ? 'dir' : 'file';
      await symlink(srcPath, destPath, type);
      
      // Conta apenas a raiz se for diretorio para refletir "quantas skills" ou
      // conta arquivos recursivamente se quisermos o numero total de arquivos.
      // Optamos por contar recursivamente para logar volume de impacto.
      count += entry.isDirectory() ? await countFiles(srcPath) : 1;
    } catch (err) {
      log.detail(`Symlink granular falhou para ${destPath}, caindo para copia recursiva...`);
      if (entry.isDirectory()) {
        count += await copyDirRecursive(srcPath, destPath);
      } else {
        await cp(srcPath, destPath, { force: true });
        count++;
      }
    }
  }

  return count;
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
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter(e => e.isFile()).map(e => e.name);
  } catch {
    return [];
  }
}
