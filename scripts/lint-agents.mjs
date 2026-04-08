import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const agentsDir = path.join(process.cwd(), '.agents/agents');
const skillsDir = path.join(process.cwd(), '.agents/skills');

const existingAgents = fs.readdirSync(agentsDir)
  .filter(f => f.endsWith('.agent.md'))
  .map(f => f.replace('.agent.md', ''));

const existingSkills = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

function extractFrontmatterRaw(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  return match ? match[1] : '';
}

function findBlockArrayKeys(frontmatterRaw) {
  const keys = new Set();
  const topLevelRegex = /^([A-Za-z0-9_-]+):\s*\n\s*-\s+/gm;
  const nestedRegex = /^\s{2}([A-Za-z0-9_-]+):\s*\n\s{4}-\s+/gm;

  let match;
  while ((match = topLevelRegex.exec(frontmatterRaw)) !== null) {
    keys.add(match[1]);
  }
  while ((match = nestedRegex.exec(frontmatterRaw)) !== null) {
    keys.add(match[1]);
  }

  return [...keys];
}

let globalHasErrors = false;
const skillMentionPattern = /Skill:\s*`([^`]+)`/g;

for (const agentFile of fs.readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'))) {
  const agentPath = path.join(agentsDir, agentFile);
  const fileContent = fs.readFileSync(agentPath, 'utf8');

  let hasErrors = false;

  try {
    const parsed = matter(fileContent);
    const rawFrontmatter = extractFrontmatterRaw(fileContent);
    const blockArrayKeys = findBlockArrayKeys(rawFrontmatter);
    const { agents, skills } = parsed.data;

    if (blockArrayKeys.length > 0) {
      console.error(`❌ [${agentFile}] Frontmatter arrays must be inline. Convert keys: ${blockArrayKeys.join(', ')}`);
      hasErrors = true;
      globalHasErrors = true;
    }

    // Validate Subagents in Frontmatter
    if (agents && Array.isArray(agents)) {
      for (const subagent of agents) {
        if (!existingAgents.includes(subagent)) {
          console.error(`❌ [${agentFile}] Invalid subagent reference in frontmatter: '${subagent}'`);
          hasErrors = true;
          globalHasErrors = true;
        }
      }
    } else if (agents) {
      console.error(`❌ [${agentFile}] 'agents' property in frontmatter must be an array.`);
      hasErrors = true;
      globalHasErrors = true;
    }

    // Validate Skills in Frontmatter
    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        if (!existingSkills.includes(skill)) {
          console.error(`❌ [${agentFile}] Invalid skill reference in frontmatter 'skills' array: '${skill}'`);
          hasErrors = true;
          globalHasErrors = true;
        }
      }
    } else if (skills) {
      console.error(`❌ [${agentFile}] 'skills' property in frontmatter must be an array.`);
      hasErrors = true;
      globalHasErrors = true;
    }

    // Optional: Cross-validate markdown body mentions against the frontmatter
    let match;
    while ((match = skillMentionPattern.exec(parsed.content)) !== null) {
      const skill = match[1];
      if (!existingSkills.includes(skill)) {
        console.error(`❌ [${agentFile}] Invalid skill reference in markdown body: '${skill}'`);
        hasErrors = true;
        globalHasErrors = true;
      }
      if (skills && Array.isArray(skills) && !skills.includes(skill)) {
        console.warn(`⚠️  [${agentFile}] Skill '${skill}' mentioned in body but missing from 'skills' array in frontmatter.`);
      }
    }

    if (!hasErrors) {
      console.log(`✅ [${agentFile}] Valid`);
    }
  } catch (err) {
    console.error(`❌ [${agentFile}] Failed to parse: ${err.message}`);
    globalHasErrors = true;
  }
}

if (globalHasErrors) {
  console.error('\n🚨 Some agents failed validation (Invalid subagents or skills).');
  process.exit(1);
} else {
  console.log('\n🎉 All agents contain valid subagent and skill references!');
}
