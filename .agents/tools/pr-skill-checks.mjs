import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Get base branch from env or default to master/main
const baseBranch = process.env.GITHUB_BASE_REF || 'master';
const baseRef = `origin/${baseBranch}`;

// Run git command safely
function runGit(args) {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  } catch (err) {
    console.error(`Error running git ${args}:`, err.message);
    return [];
  }
}

// Fetch base branch to ensure it exists locally
try {
  execSync(`git fetch --depth=1 origin ${baseBranch}`, { stdio: 'ignore' });
} catch {
  // Ignore fetch errors in local dev environment
}

// Find added/modified/deleted files
const allDiff = runGit(`diff ${baseRef} --name-only`);
const addedDiff = runGit(`diff ${baseRef} --diff-filter=A --name-only`);
const deletedDiff = runGit(`diff ${baseRef} --diff-filter=D --name-only`);

// Extract skill name from paths like .agents/skills/<skill-name>/...
function getSkillName(filePath) {
  const parts = filePath.split('/');
  if (parts[0] === '.agents' && parts[1] === 'skills') {
    const name = parts[2];
    if (name && name !== 'evals' && !name.endsWith('.md')) {
      return name;
    }
  }
  return null;
}

const modifiedSkills = new Set();
const addedSkills = new Set();
const deletedSkills = new Set();

for (const file of allDiff) {
  const skill = getSkillName(file);
  if (skill) {
    if (file.endsWith('SKILL.md') && addedDiff.includes(file)) {
      addedSkills.add(skill);
    } else if (file.endsWith('SKILL.md') && deletedDiff.includes(file)) {
      deletedSkills.add(skill);
    } else {
      modifiedSkills.add(skill);
    }
  }
}

// Clean up sets to avoid overlap
for (const skill of addedSkills) {
  modifiedSkills.delete(skill);
}
for (const skill of deletedSkills) {
  modifiedSkills.delete(skill);
  addedSkills.delete(skill);
}

const issues = [];
const tableRows = [];

for (const skill of addedSkills) {
  const skillPath = path.join('.agents', 'skills', skill);
  const evalPath = path.join('.agents', 'skills', 'evals', skill);
  const skillMd = path.join(skillPath, 'SKILL.md');
  const evalYaml = path.join(evalPath, 'eval.yaml');
  const tasksPath = path.join(evalPath, 'tasks');

  const checks = {
    skillMd: fs.existsSync(skillMd),
    evalYaml: fs.existsSync(evalYaml),
    positiveTriggers: 0,
    negativeTriggers: 0,
  };

  if (fs.existsSync(tasksPath)) {
    const taskFiles = fs.readdirSync(tasksPath).filter(f => f.endsWith('.yaml'));
    checks.positiveTriggers = taskFiles.filter(f => f.startsWith('positive-trigger-')).length;
    checks.negativeTriggers = taskFiles.filter(f => f.startsWith('negative-trigger-')).length;
  }

  const failedChecks = [];
  if (!checks.skillMd) failedChecks.push('Missing SKILL.md');
  if (!checks.evalYaml) failedChecks.push('Missing eval.yaml');
  if (checks.positiveTriggers < 2) {
    failedChecks.push(`Needs >= 2 positive triggers (found ${checks.positiveTriggers})`);
  }
  if (checks.negativeTriggers < 1) {
    failedChecks.push(`Needs >= 1 negative trigger (found ${checks.negativeTriggers})`);
  }

  if (failedChecks.length > 0) {
    issues.push(`Skill "${skill}" failed completeness check:\n  - ${failedChecks.join('\n  - ')}`);
    tableRows.push(`| 🆕 Added | \`${skill}\` | ❌ Failed:<br>${failedChecks.join('<br>')} |`);
  } else {
    tableRows.push(`| 🆕 Added | \`${skill}\` | Passed completeness checks |`);
  }
}

for (const skill of modifiedSkills) {
  tableRows.push(`| ✏️ Modified | \`${skill}\` | |`);
}

for (const skill of deletedSkills) {
  tableRows.push(`| ❌ Removed | \`${skill}\` | |`);
}

if (tableRows.length > 0) {
  const commentBody = [
    '## 🛠️ Skill Changes in this PR',
    '',
    '| Status | Skill | Details |',
    '| --- | --- | --- |',
    ...tableRows,
    '',
  ].join('\n');

  fs.writeFileSync('pr-comment.md', commentBody, 'utf8');
  console.log('Generated pr-comment.md:\n', commentBody);
} else {
  console.log('No skill changes found.');
}

if (issues.length > 0) {
  console.error('\nCompleteness check failed:');
  console.error(issues.join('\n'));
  process.exit(1);
} else {
  console.log('\nAll checks passed!');
}
