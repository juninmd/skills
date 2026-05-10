import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const PRIMARY_FILE_PATTERNS = [
  /^agents[\\/][^\\/]+\.agent\.md$/,
  /^prompts[\\/][^\\/]+\.prompt\.md$/,
  /^rules[\\/][^\\/]+\.instructions\.md$/,
  /^skills[\\/][^\\/]+[\\/]SKILL\.md$/,
];

const REQUIRED_KEYS = {
  agent: ['name', 'description', 'user-invocable'],
  prompt: ['name', 'description', 'argument-hint'],
  rule: ['name', 'description', 'applyTo'],
  skill: ['name', 'description'],
};

const TRIGGER_PATTERNS = [
  /\bTriggers?:/i,
  /\bUse for\b/i,
  /\bUse when\b/i,
  /\bWhen to invoke\b/i,
  /\bWhen to use\b/i,
];

const CHECKLIST_HEADING_PATTERN = /^##+\s+.*Checklist\b/im;
const REFERENCES_HEADING_PATTERN = /^##+\s+References?\b/im;
const SKILL_REFERENCE_PATTERNS = [
  /`([a-z0-9][a-z0-9-]+)` skill\b/gi,
  /\((?:\.\/)?\.\.\/([a-z0-9][a-z0-9-]+)\/SKILL\.md(?:#[^)]+)?\)/gi,
];

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

export function detectFileType(relativePath) {
  const posixPath = toPosix(relativePath);

  if (posixPath.startsWith('agents/') && posixPath.endsWith('.agent.md')) {
    return 'agent';
  }

  if (posixPath.startsWith('prompts/') && posixPath.endsWith('.prompt.md')) {
    return 'prompt';
  }

  if (posixPath.startsWith('rules/') && posixPath.endsWith('.instructions.md')) {
    return 'rule';
  }

  if (posixPath.startsWith('skills/') && posixPath.endsWith('/SKILL.md')) {
    return 'skill';
  }

  return 'unknown';
}

export function parseFrontmatter(content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
    return { data: {}, body: content, error: 'Missing opening frontmatter fence.' };
  }

  const lines = content.split(/\r?\n/);
  if (lines[0] !== '---') {
    return { data: {}, body: content, error: 'Frontmatter must start with --- on its own line.' };
  }

  const closingIndex = lines.indexOf('---', 1);
  if (closingIndex === -1) {
    return { data: {}, body: content, error: 'Missing closing frontmatter fence.' };
  }

  const data = {};
  for (let index = 1; index < closingIndex; index += 1) {
    const line = lines[index];

    if (!line.trim()) {
      continue;
    }

    const match = /^(?<key>[A-Za-z][A-Za-z0-9-]*):(?:\s(?<value>.*)|(?<empty>\s*))$/.exec(line);
    if (!match?.groups) {
      return {
        data: {},
        body: content,
        error: `Unsupported frontmatter line: ${line}`,
      };
    }

    const key = match.groups.key;
    const value = (match.groups.value ?? '').trim();

    if (!value && index + 1 < closingIndex && /^\s+-\s+/.test(lines[index + 1])) {
      const items = [];
      while (index + 1 < closingIndex && /^\s+-\s+/.test(lines[index + 1])) {
        index += 1;
        items.push(lines[index].replace(/^\s+-\s+/, '').trim());
      }
      data[key] = items;
      continue;
    }

    data[key] = value;
  }

  const body = lines.slice(closingIndex + 1).join('\n');
  return { data, body, error: null };
}

export function collectPrimaryFiles(agentsRoot) {
  const discovered = [];

  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      const relativePath = path.relative(agentsRoot, fullPath);
      if (PRIMARY_FILE_PATTERNS.some((pattern) => pattern.test(relativePath))) {
        discovered.push(relativePath);
      }
    }
  }

  walk(agentsRoot);
  return discovered.sort();
}

function collectSkillNames(agentsRoot) {
  return new Set(
    collectPrimaryFiles(agentsRoot)
      .filter((relativePath) => detectFileType(relativePath) === 'skill')
      .map((relativePath) => path.basename(path.dirname(relativePath))),
  );
}

function hasTriggerHint(description) {
  return TRIGGER_PATTERNS.some((pattern) => pattern.test(description));
}

function hasChecklistSection(content) {
  return CHECKLIST_HEADING_PATTERN.test(content);
}

function hasReferencesSection(content) {
  return REFERENCES_HEADING_PATTERN.test(content);
}

function findReferencedSkills(content) {
  const references = new Set();

  for (const pattern of SKILL_REFERENCE_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      references.add(match[1]);
    }
  }

  return [...references].sort();
}

function findBrokenRelativeLinks(absoluteFilePath, content) {
  const brokenLinks = [];
  const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;

  while ((match = markdownLinkPattern.exec(content)) !== null) {
    const target = match[1].trim();
    if (!target || target.startsWith('http://') || target.startsWith('https://') || target.startsWith('#')) {
      continue;
    }

    const sanitizedTarget = target.split('#')[0];
    if (!sanitizedTarget) {
      continue;
    }

    const resolvedPath = path.resolve(path.dirname(absoluteFilePath), sanitizedTarget);
    if (!fs.existsSync(resolvedPath)) {
      brokenLinks.push(sanitizedTarget);
    }
  }

  return brokenLinks;
}

function findMissingBaseDirToolPaths(absoluteFilePath, frontmatter) {
  const missingPaths = [];
  const allowedTools = frontmatter['allowed-tools'];

  if (!allowedTools || typeof allowedTools !== 'string') {
    return missingPaths;
  }

  const baseDirPattern = /\{baseDir\}\/([^:),\s]+)/g;
  let match;

  while ((match = baseDirPattern.exec(allowedTools)) !== null) {
    const resolvedPath = path.resolve(path.dirname(absoluteFilePath), match[1]);
    if (!fs.existsSync(resolvedPath)) {
      missingPaths.push(match[1]);
    }
  }

  return missingPaths;
}

export function validatePluginFile(agentsRoot, relativePath, knownSkillNames = collectSkillNames(agentsRoot)) {
  const absoluteFilePath = path.join(agentsRoot, relativePath);
  const content = fs.readFileSync(absoluteFilePath, 'utf8');
  const issues = [];
  const fileType = detectFileType(relativePath);
  const { data, error } = parseFrontmatter(content);

  if (error) {
    issues.push({ severity: 'error', rule: 'frontmatter', message: error });
    return issues;
  }

  for (const key of REQUIRED_KEYS[fileType] ?? []) {
    if (!(key in data) || !data[key]) {
      issues.push({ severity: 'error', rule: 'required-key', message: `Missing or empty frontmatter key: ${key}` });
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (!value) {
      issues.push({ severity: 'error', rule: 'empty-value', message: `Frontmatter key has an empty value: ${key}` });
    }
  }

  if ('allowed-tools' in data) {
    issues.push({ severity: 'error', rule: 'allowed-tools', message: 'Do not restrict tools in frontmatter; all tools are allowed by default.' });
  }

  if (data.description && !hasTriggerHint(data.description)) {
    issues.push({ severity: 'error', rule: 'description-triggers', message: 'Description must include clear routing triggers.' });
  }

  if (fileType === 'skill') {
    const expectedName = path.basename(path.dirname(relativePath));
    if (data.name && data.name !== expectedName) {
      issues.push({ severity: 'error', rule: 'skill-name', message: `Skill name must match folder name: expected ${expectedName}` });
    }

    if (!hasChecklistSection(content)) {
      issues.push({ severity: 'error', rule: 'skill-checklist', message: 'Skill files must include a checklist section.' });
    }

    if (!hasReferencesSection(content)) {
      issues.push({ severity: 'error', rule: 'skill-references', message: 'Skill files must include a references section.' });
    }

    for (const referencedSkill of findReferencedSkills(content)) {
      if (!knownSkillNames.has(referencedSkill)) {
        issues.push({ severity: 'error', rule: 'referenced-skill', message: `Referenced skill does not exist: ${referencedSkill}` });
      }
    }
  }

  if (content.includes('\uFFFD')) {
    issues.push({ severity: 'error', rule: 'encoding', message: 'File contains replacement characters.' });
  }

  for (const brokenLink of findBrokenRelativeLinks(absoluteFilePath, content)) {
    issues.push({ severity: 'error', rule: 'broken-link', message: `Broken relative link: ${brokenLink}` });
  }

  for (const missingPath of findMissingBaseDirToolPaths(absoluteFilePath, data)) {
    issues.push({ severity: 'error', rule: 'missing-tool-path', message: `Missing {baseDir} tool path: ${missingPath}` });
  }

  return issues;
}

export function validateAgentsRoot(agentsRoot) {
  const results = [];
  const knownSkillNames = collectSkillNames(agentsRoot);
  for (const relativePath of collectPrimaryFiles(agentsRoot)) {
    const issues = validatePluginFile(agentsRoot, relativePath, knownSkillNames);
    if (issues.length > 0) {
      results.push({ relativePath: toPosix(relativePath), issues });
    }
  }

  return results;
}

export function formatResults(results) {
  return results
    .map(({ relativePath, issues }) => {
      const lines = issues.map((issue) => `  - [${issue.severity}] ${issue.rule}: ${issue.message}`);
      return `${relativePath}\n${lines.join('\n')}`;
    })
    .join('\n\n');
}

export function runValidation(agentsRoot) {
  const results = validateAgentsRoot(agentsRoot);

  if (results.length > 0) {
    return { ok: false, output: formatResults(results), fileCount: collectPrimaryFiles(agentsRoot).length };
  }

  return {
    ok: true,
    output: `Validated ${collectPrimaryFiles(agentsRoot).length} plugin files with no issues.`,
    fileCount: collectPrimaryFiles(agentsRoot).length,
  };
}

export function runCli(argv = process.argv, stdout = console.log, stderr = console.error) {
  const agentsRoot = argv[2] ? path.resolve(argv[2]) : path.resolve(process.cwd(), '.agents');
  const result = runValidation(agentsRoot);

  if (!result.ok) {
    stderr(result.output);
    return 1;
  }

  stdout(result.output);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = runCli();
}
