import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

function directories(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function validateEvals(agentsRoot) {
  const skillsRoot = path.join(agentsRoot, 'skills');
  const evalsRoot = path.join(skillsRoot, 'evals');
  const skillNames = directories(skillsRoot)
    .filter((name) => fs.existsSync(path.join(skillsRoot, name, 'SKILL.md')));
  const issues = [];

  for (const skill of skillNames) {
    const evalRoot = path.join(evalsRoot, skill);
    const evalFile = path.join(evalRoot, 'eval.yaml');
    if (!fs.existsSync(evalFile)) {
      issues.push(`${skill}: missing eval.yaml`);
      continue;
    }

    const manifest = fs.readFileSync(evalFile, 'utf8');
    if (!new RegExp(`^skill:\\s*${skill}\\s*$`, 'm').test(manifest)) {
      issues.push(`${skill}: eval.yaml skill must match directory`);
    }
    if (!/tasks:\s*\r?\n\s+-\s+"tasks\/\*\.yaml"/m.test(manifest)) {
      issues.push(`${skill}: eval.yaml must include tasks/*.yaml`);
    }

    const tasksRoot = path.join(evalRoot, 'tasks');
    const taskFiles = fs.existsSync(tasksRoot)
      ? fs.readdirSync(tasksRoot).filter((name) => name.endsWith('.yaml'))
      : [];
    const positive = taskFiles.filter((name) => name.startsWith('positive-trigger-'));
    const negative = taskFiles.filter((name) => name.startsWith('negative-trigger-'));
    if (positive.length < 2) issues.push(`${skill}: requires at least 2 positive trigger tasks`);
    if (negative.length < 1) issues.push(`${skill}: requires at least 1 negative trigger task`);

    for (const taskFile of taskFiles) {
      const content = fs.readFileSync(path.join(tasksRoot, taskFile), 'utf8');
      for (const key of ['id:', 'description:', 'prompt:', 'expected:']) {
        if (!content.includes(key)) issues.push(`${skill}/${taskFile}: missing ${key.slice(0, -1)}`);
      }
    }
  }

  for (const evalName of directories(evalsRoot)) {
    if (!skillNames.includes(evalName)) issues.push(`${evalName}: eval has no matching skill`);
  }

  return { issues, skillCount: skillNames.length };
}

export function runCli(argv = process.argv, stdout = console.log, stderr = console.error) {
  const agentsRoot = argv[2] ? path.resolve(argv[2]) : path.resolve('.agents');
  const result = validateEvals(agentsRoot);
  if (result.issues.length) {
    stderr(result.issues.map((issue) => `- ${issue}`).join('\n'));
    return 1;
  }
  stdout(`Validated eval coverage for ${result.skillCount} skills.`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = runCli();
}
