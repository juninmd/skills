import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// project root is one level above this scripts/ directory
const projectRoot = path.resolve(__dirname, '..', '..'); // Fix path: script is in .agents/scripts
const skillsDir = path.join(projectRoot, '.agents', 'skills');
const outDir = path.join(projectRoot, 'docs', 'skills');

if (!fs.existsSync(path.join(projectRoot, 'docs'))) fs.mkdirSync(path.join(projectRoot, 'docs'), { recursive: true });
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const dirs = fs.readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

const indexLines = [];
const REPO_URL = 'git@gitlab.example.com:example-org/plugin-marketplace-tools.git';

for (const dir of dirs) {
  const skillMdPath = path.join(skillsDir, dir, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) continue;
  const raw = fs.readFileSync(skillMdPath, 'utf8');

  // Attempt to extract a short description from YAML frontmatter or first paragraph
  let title = dir;
  let summary = '';
  let worksOn = ['gemini_cli', 'vscode', 'antigravity']; // Default if missing

  const yamlMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    const yaml = yamlMatch[1];
    const nameMatch = yaml.match(/name:\s*(.+)/);
    const descMatch = yaml.match(/description:\s*(.+)/);
    // Modified regex to handle indentation and potential metadata wrapper
    const worksOnMatch = yaml.match(/works_on:\s*\[(.*?)\]/);

    if (nameMatch) title = nameMatch[1].trim();
    if (descMatch) summary = descMatch[1].trim();
    if (worksOnMatch) {
      worksOn = worksOnMatch[1].split(',').map(s => s.trim());
    }
  } else {
      // Fallback: find first non-empty paragraph after headings
      const lines = raw.split(/\r?\n/);
      let found = false;
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i].trim();
        if (!l) continue;
        if (l.startsWith('#')) { found = true; continue; }
        if (found) { summary = l; break; }
      }
  }

  // Construct InstallTabs string
  let installTabs = '\n\n## Instalação\n\n<InstallTabs\n';
  let hasTabs = false;

  if (worksOn.includes('gemini_cli')) {
    const cmd = `gemini skills install ${REPO_URL} --path .agents/skills/${dir}`;
    installTabs += `  gemini="${cmd}"\n`;
    hasTabs = true;
  }

  // Common sparse checkout command for manual installs
  const sparseCmd = `git clone --filter=blob:none --no-checkout ${REPO_URL} ${dir}
cd ${dir}
git sparse-checkout set --no-cone .agents/skills/${dir}
git checkout`;

  if (worksOn.includes('vscode')) { // Mapping vscode -> Copilot
    installTabs += `  copilot="${sparseCmd}"\n`;
    hasTabs = true;
  }

  if (worksOn.includes('antigravity')) {
    // Customize message for Antigravity if needed, or use generic
    installTabs += `  antigravity="${sparseCmd}"\n`;
    hasTabs = true;
  }

  installTabs += '/>\n\n';

  let newContent = raw;
  if (hasTabs) {
      // Try to insert after the first paragraph (summary)
      // For now, let's append it after the title block (H1)
      newContent = raw.replace(/(^# .+?\n+)(.+?\n+)/, `$1$2${installTabs}`);
      // If regex doesn't match well (no description), append after H1
      if (newContent === raw) {
          newContent = raw.replace(/(^# .+?\n+)/, `$1${installTabs}`);
      }
  }

  const outPath = path.join(outDir, `${dir}.md`);
  fs.writeFileSync(outPath, newContent, 'utf8');

  indexLines.push({ dir, title, summary });
}

// Generate index.md with grid wrapper using HTML cards so CSS can style them
const indexPath = path.join(outDir, 'index.md');
let indexContent = `# Skills\n\nLista de todas as skills disponíveis:\n\n<div class="skills-grid">\n\n`;

for (const item of indexLines) {
  indexContent += `<article class="skill-card">\n` +
                  `### <a href="./${item.dir}.md">${item.title}</a>\n\n` +
                  `${item.summary ? `<p>${item.summary}</p>` : ''}` +
                  `\n</article>\n\n`;
}

indexContent += `</div>\n`;

fs.writeFileSync(indexPath, indexContent, 'utf8');

console.log(`Generated ${indexLines.length} skill pages in ${outDir}`);
