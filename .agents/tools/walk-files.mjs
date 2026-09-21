// One definition of "walk a directory tree and return matching files",
// parameterized for the four call sites that used to each re-derive it with a
// different, undocumented symlink policy (one of them followed symlinks with
// no cycle guard while a sibling walker over the same kind of tree explicitly
// skipped them).

import fs from "node:fs";
import path from "node:path";

/**
 * @param {string[]} roots - paths (absolute or relative to `cwd`) to walk
 * @param {object} [options]
 * @param {string} [options.cwd] - base for resolving relative roots
 * @param {"skip"|"throw"|"follow"} [options.symlinks] - "skip" (default) omits
 *   symlinks silently; "throw" fails loudly the moment one is found; "follow"
 *   stats through them (pair with `maxDepth` as a cycle guard).
 * @param {Iterable<string>} [options.skip] - entry names pruned before they
 *   are stat'd, whether file or directory (e.g. "node_modules", ".git")
 * @param {(absolutePath: string) => boolean} [options.filter] - only matching
 *   files are returned; directories are always traversed regardless of filter
 * @param {number} [options.maxDepth] - recursion depth cap, root is depth 0
 * @param {boolean} [options.tolerant] - swallow a stat/read failure on one
 *   entry (e.g. a broken symlink, a permission error) instead of throwing
 * @returns {string[]} absolute file paths
 */
export function walkFiles(roots, options = {}) {
  const {
    cwd = process.cwd(),
    symlinks = "skip",
    skip = [],
    filter,
    maxDepth = Infinity,
    tolerant = false,
  } = options;
  const skipNames = skip instanceof Set ? skip : new Set(skip);
  const files = [];

  const statOf = (target) => (symlinks === "follow" ? fs.statSync(target) : fs.lstatSync(target));

  // A root may itself be a file (check-links.mjs's LINK_ROOTS includes
  // "README.md" alongside directories like "docs"), so every target — root or
  // recursed-into child — goes through the same stat-then-dispatch.
  const visit = (target, depth) => {
    let stats;
    try {
      stats = statOf(target);
    } catch (error) {
      if (tolerant) return;
      throw error;
    }
    if (stats.isSymbolicLink()) {
      if (symlinks === "throw") throw new Error(`Symlinks are not allowed here: ${target}`);
      return; // "skip"
    }
    if (stats.isFile()) {
      if (!filter || filter(target)) files.push(target);
      return;
    }
    if (stats.isDirectory()) {
      if (depth > maxDepth) return;
      let entries;
      try {
        entries = fs.readdirSync(target).sort();
      } catch (error) {
        if (tolerant) return;
        throw error;
      }
      for (const name of entries) {
        if (skipNames.has(name)) continue;
        visit(path.join(target, name), depth + 1);
      }
      return;
    }
    if (!tolerant) throw new Error(`Unsupported file type: ${target}`);
  };

  for (const root of roots) {
    const resolved = path.resolve(cwd, root);
    if (fs.existsSync(resolved)) visit(resolved, 0);
  }
  return files;
}
