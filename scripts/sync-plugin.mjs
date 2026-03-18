import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const pluginJsonPath = path.join(process.cwd(), 'plugin.json');
const agentsDir = path.join(process.cwd(), '.agents');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const capabilities = {
  skills: [],
  agents: []
};

// Map Skills
const skillsDir = path.join(agentsDir, 'skills');
if (fs.existsSync(skillsDir)) {
  const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `.agents/skills/${dirent.name}`);
  capabilities.skills = skills;
}

// Map Agents
const agentsSubDir = path.join(agentsDir, 'agents');
if (fs.existsSync(agentsSubDir)) {
  const agents = fs.readdirSync(agentsSubDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md') && dirent.name !== 'index.md')
    .map(dirent => `.agents/agents/${dirent.name}`);
  capabilities.agents = agents;
}

// Map Hooks (if any applicable format)
const hooksDir = path.join(agentsDir, 'hooks');
if (fs.existsSync(hooksDir)) {
  const hooks = fs.readdirSync(hooksDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json'))
    .map(dirent => `.agents/hooks/${dirent.name}`);
  if (hooks.length > 0) {
    capabilities.hooks = hooks;
  }
}

const pluginJson = {
  name: packageJson.name || 'padrao-labs-agents',
  version: packageJson.version || '1.0.0',
  publisher: packageJson.publisher || 'luizalabs',
  description: packageJson.description || 'Luizalabs Agents and Skills',
  capabilities
};

fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2), 'utf8');
console.log(`Successfully synced plugin.json with ${capabilities.skills.length} skills and ${capabilities.agents.length} agents.`);
