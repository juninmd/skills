import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./walk-files.mjs";

// A placeholder makes a block an illustration, not a runnable command, so the whole
// block is skipped. It is an identifier in angle brackets (<repo-url>), an ellipsis,
// or a template marker. A file redirect such as <names.txt is not a placeholder.
const PLACEHOLDER = /<[A-Za-z][A-Za-z_-]*>|\.\.\.|…|\{\{/;
const SHELL = /^(bash|sh|shell)$/;

export function shellFences(markdown) {
  const fences = [];
  let open = null;
  markdown.split(/\r?\n/).forEach((line, index) => {
    if (open === null) {
      const match = line.match(/^\s*(`{3,})(\S*)/);
      if (match) open = { marker: match[1], lang: match[2], line: index + 1, body: [] };
    } else if (line.trim() === open.marker) {
      if (SHELL.test(open.lang)) fences.push({ line: open.line, code: open.body.join("\n").trimEnd() });
      open = null;
    } else {
      open.body.push(line);
    }
  });
  if (open && SHELL.test(open.lang)) fences.push({ line: open.line, code: open.body.join("\n").trimEnd() });
  return fences;
}

// Returns the first line of bash's complaint, or null when the code parses.
export function bashSyntaxError(code) {
  const result = spawnSync("bash", ["-n"], { input: code, encoding: "utf8" });
  if (result.error) throw new Error(`bash is required to check shell fences: ${result.error.message}`);
  return result.status === 0 ? null : result.stderr.trim().split("\n")[0];
}

export function shellFenceErrors(skillDirectory, syntaxError = bashSyntaxError) {
  const skillName = path.basename(skillDirectory);
  const files = walkFiles([skillDirectory], { filter: (file) => file.endsWith(".md") });
  return files.flatMap((file) => {
    const where = path.relative(skillDirectory, file).split(path.sep).join("/");
    return shellFences(fs.readFileSync(file, "utf8"))
      .filter((fence) => !PLACEHOLDER.test(fence.code))
      .flatMap((fence) => {
        const problem = syntaxError(fence.code);
        return problem ? [`${skillName}: ${where}:${fence.line} shell block does not parse: ${problem}`] : [];
      });
  });
}
