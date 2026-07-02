import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { AGENT_FILES_DIR, SKILLS_DIR } from './lib/catalog.mjs';
import { extractFrontmatterRaw, findBlockArrayKeys } from './lib/frontmatter.mjs';

const skillMentionPattern = /Skill:\s*`([^`]+)`/g;
const existingAgents = fs.readdirSync(AGENT_FILES_DIR)
  .filter((fileName) => fileName.endsWith('.agent.md'))
  .map((fileName) => fileName.replace('.agent.md', ''));
const existingSkills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let hasErrors = false;

for (const fileName of fs.readdirSync(AGENT_FILES_DIR).filter((name) => name.endsWith('.agent.md'))) {
  const filePath = path.join(AGENT_FILES_DIR, fileName);
  const text = fs.readFileSync(filePath, 'utf8');
  const rawFrontmatter = extractFrontmatterRaw(text);
  const blockArrayKeys = rawFrontmatter ? findBlockArrayKeys(rawFrontmatter) : [];

  if (blockArrayKeys.length) {
    hasErrors = true;
    console.error(`[${fileName}] Inline arrays required for: ${blockArrayKeys.join(', ')}`);
  }

  let parsed;
  try {
    parsed = matter(text);
  } catch (error) {
    hasErrors = true;
    console.error(`[${fileName}] Frontmatter parse failed: ${error.message}`);
    continue;
  }

  for (const agentName of parsed.data.agents ?? []) {
    if (!existingAgents.includes(agentName)) {
      hasErrors = true;
      console.error(`[${fileName}] Unknown agent reference: ${agentName}`);
    }
  }

  for (const skillName of parsed.data.skills ?? []) {
    if (!existingSkills.includes(skillName)) {
      hasErrors = true;
      console.error(`[${fileName}] Unknown skill reference: ${skillName}`);
    }
  }

  let match = skillMentionPattern.exec(parsed.content);
  while (match) {
    if (!existingSkills.includes(match[1])) {
      hasErrors = true;
      console.error(`[${fileName}] Unknown skill mention: ${match[1]}`);
    }
    match = skillMentionPattern.exec(parsed.content);
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log('Validated agent references.');
