import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

function countFiles(directory, predicate) {
  return fs.readdirSync(directory, { withFileTypes: true }).filter(predicate).length;
}

export function checkCatalog(root) {
  const agentsRoot = path.join(root, '.agents');
  const counts = {
    skills: countFiles(path.join(agentsRoot, 'skills'), (entry) =>
      entry.isDirectory() && fs.existsSync(path.join(agentsRoot, 'skills', entry.name, 'SKILL.md'))),
    agents: countFiles(path.join(agentsRoot, 'agents'), (entry) => entry.isFile() && entry.name.endsWith('.agent.md')),
    rules: countFiles(path.join(agentsRoot, 'rules'), (entry) => entry.isFile() && entry.name.endsWith('.instructions.md')),
    prompts: countFiles(path.join(agentsRoot, 'prompts'), (entry) => entry.isFile() && entry.name.endsWith('.prompt.md')),
  };
  const issues = [];
  const files = ['README.md', path.join('docs', 'index.md'), path.join('docs', 'skills', 'index.md')];

  for (const relativePath of files) {
    const content = fs.readFileSync(path.join(root, relativePath), 'utf8');
    const declaredSkills = [...content.matchAll(/\b(\d+)\s+skills\b/gi)].map((match) => Number(match[1]));
    if (declaredSkills.some((value) => value !== counts.skills)) {
      issues.push(`${relativePath}: declared skill count differs from ${counts.skills}`);
    }
  }

  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  for (const [kind, count] of Object.entries(counts)) {
    if (!new RegExp(`\\b${count}\\s+${kind}\\b`, 'i').test(readme)) {
      issues.push(`README.md: missing current ${kind} count (${count})`);
    }
  }

  return { counts, issues };
}

export function runCli(argv = process.argv, stdout = console.log, stderr = console.error) {
  const root = argv[2] ? path.resolve(argv[2]) : process.cwd();
  const result = checkCatalog(root);
  if (result.issues.length) {
    stderr(result.issues.map((issue) => `- ${issue}`).join('\n'));
    return 1;
  }
  stdout(`Catalog is consistent: ${Object.entries(result.counts).map(([key, value]) => `${value} ${key}`).join(', ')}.`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = runCli();
}
