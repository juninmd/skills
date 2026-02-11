const fs = require('fs')
const path = require('path')

// project root is one level above this scripts/ directory
const projectRoot = path.resolve(__dirname, '..')
const skillsDir = path.join(projectRoot, 'skills')
const outDir = path.join(projectRoot, 'docs', 'skills')

if (!fs.existsSync(path.join(projectRoot, 'docs'))) fs.mkdirSync(path.join(projectRoot, 'docs'), { recursive: true })
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const dirs = fs.readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)

const indexLines = []

for (const dir of dirs) {
  const skillMdPath = path.join(skillsDir, dir, 'SKILL.md')
  if (!fs.existsSync(skillMdPath)) continue
  const raw = fs.readFileSync(skillMdPath, 'utf8')

  // Attempt to extract a short description from YAML frontmatter or first paragraph
  let title = dir
  let summary = ''
  const yamlMatch = raw.match(/^---\n([\s\S]*?)\n---/)
  if (yamlMatch) {
    const yaml = yamlMatch[1]
    const nameMatch = yaml.match(/name:\s*(.+)/)
    const descMatch = yaml.match(/description:\s*(.+)/)
    if (nameMatch) title = nameMatch[1].trim()
    if (descMatch) summary = descMatch[1].trim()
  }
  if (!summary) {
    // fallback: find first non-empty paragraph after headings
    const lines = raw.split(/\r?\n/)
    let found = false
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i].trim()
      if (!l) continue
      if (l.startsWith('#')) { found = true; continue }
      if (found) { summary = l; break }
    }
  }

  // Write output file (copying content)
  const outPath = path.join(outDir, `${dir}.md`)
  fs.writeFileSync(outPath, raw, 'utf8')

  indexLines.push({ dir, title, summary })
}

// Generate index.md with grid wrapper using HTML cards so CSS can style them
const indexPath = path.join(outDir, 'index.md')
let indexContent = `# Skills\n\nLista de todas as skills disponíveis:\n\n<div class="skills-grid">\n\n`

for (const item of indexLines) {
  indexContent += `<article class="skill-card">\n` +
                  `### <a href="./${item.dir}.md">${item.title}</a>\n\n` +
                  `${item.summary ? `<p>${item.summary}</p>` : ''}` +
                  `\n</article>\n\n`
}

indexContent += `</div>\n`

fs.writeFileSync(indexPath, indexContent, 'utf8')

console.log(`Generated ${indexLines.length} skill pages in ${outDir}`)
