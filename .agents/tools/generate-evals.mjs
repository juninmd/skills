import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

function routingValue(content, marker) {
  const match = content.match(new RegExp(`^\\s*${marker}:\\s*(.+)$`, 'mi'));
  return match?.[1]?.trim().replace(/\.$/, '') ?? '';
}

function yamlString(value) {
  return JSON.stringify(value);
}

function task(id, name, tag, prompt, shouldTrigger, keywords) {
  const matcher = shouldTrigger ? 'contains' : 'not_contains';
  return [
    `id: ${id}`,
    `name: ${name}`,
    `description: Generated ${tag} routing task.`,
    'tags:',
    `  - ${tag}`,
    'inputs:',
    `  prompt: ${yamlString(prompt)}`,
    'expected:',
    `  should_trigger: ${shouldTrigger}`,
    'graders:',
    '  - type: text',
    `    name: ${shouldTrigger ? 'contains-keywords' : 'omits-skill-keywords'}`,
    '    config:',
    `      ${matcher}:`,
    ...keywords.map((keyword) => `        - ${yamlString(keyword)}`),
    '',
  ].join('\n');
}

export function generateMissingEvals(agentsRoot) {
  const skillsRoot = path.join(agentsRoot, 'skills');
  const evalsRoot = path.join(skillsRoot, 'evals');
  const created = [];

  for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
    const skillFile = path.join(skillsRoot, entry.name, 'SKILL.md');
    if (!entry.isDirectory() || !fs.existsSync(skillFile)) continue;
    const evalRoot = path.join(evalsRoot, entry.name);
    if (fs.existsSync(path.join(evalRoot, 'eval.yaml'))) continue;

    const content = fs.readFileSync(skillFile, 'utf8');
    const useFor = routingValue(content, 'USE FOR');
    const doNotUseFor = routingValue(content, 'DO NOT USE FOR');
    const keywords = entry.name.split('-').filter((word) => word.length > 2).slice(0, 4);
    const positivePrompts = useFor.split(',').map((value) => value.trim()).filter(Boolean);
    const negativePrompt = doNotUseFor.split(',')[0]?.trim() || `unrelated work outside ${entry.name}`;

    fs.mkdirSync(path.join(evalRoot, 'tasks'), { recursive: true });
    fs.writeFileSync(path.join(evalRoot, 'eval.yaml'), [
      `name: ${entry.name}-eval`,
      `description: Routing eval for ${entry.name}.`,
      `skill: ${entry.name}`,
      'version: "1.0"',
      'config:',
      '  trials_per_task: 1',
      '  timeout_seconds: 300',
      '  parallel: false',
      '  executor: copilot-sdk',
      '  model: claude-sonnet-4.6',
      'metrics:',
      '  - name: task_completion',
      '    weight: 1.0',
      '    threshold: 0.8',
      'graders:',
      '  - type: behavior',
      '    name: token-budget',
      '    config:',
      '      max_tokens: 1200',
      'tasks:',
      '  - "tasks/*.yaml"',
      '',
    ].join('\n'));
    fs.writeFileSync(path.join(evalRoot, 'tasks', 'positive-trigger-1.yaml'),
      task('positive-trigger-001', 'Positive Trigger 1', 'positive-trigger', positivePrompts[0] || entry.name, true, keywords));
    fs.writeFileSync(path.join(evalRoot, 'tasks', 'positive-trigger-2.yaml'),
      task('positive-trigger-002', 'Positive Trigger 2', 'positive-trigger', positivePrompts[1] || `help with ${entry.name}`, true, keywords));
    fs.writeFileSync(path.join(evalRoot, 'tasks', 'negative-trigger-1.yaml'),
      task('negative-trigger-001', 'Negative Trigger 1', 'negative-trigger', negativePrompt, false, keywords));
    created.push(entry.name);
  }

  return created;
}

export function runCli(argv = process.argv, stdout = console.log) {
  const agentsRoot = argv[2] ? path.resolve(argv[2]) : path.resolve('.agents');
  const created = generateMissingEvals(agentsRoot);
  stdout(created.length ? `Generated evals for: ${created.join(', ')}` : 'No missing evals.');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = runCli();
}
