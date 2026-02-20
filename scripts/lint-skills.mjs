import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Name must contain only lowercase alphanumeric characters and hyphens")
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: "Name must not start or end with a hyphen",
    })
    .refine((val) => !val.includes('--'), {
      message: "Name must not contain consecutive hyphens",
    }),
  description: z.string().min(1).max(1024),
  license: z.string().optional(),
  compatibility: z.any().optional(),
  metadata: z.any().optional(),
  'allowed-tools': z.string().optional()
});

const skillsDir = path.join(process.cwd(), '.agent/skills');
const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let hasErrors = false;

for (const skill of skills) {
  const skillMdPath = path.join(skillsDir, skill, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    console.error(`❌ [${skill}] Missing SKILL.md file.`);
    hasErrors = true;
    continue;
  }

  const fileContent = fs.readFileSync(skillMdPath, 'utf8');
  let frontmatter;
  try {
    const parsed = matter(fileContent);
    frontmatter = parsed.data;
  } catch (err) {
    console.error(`❌ [${skill}] Failed to parse frontmatter: ${err.message}`);
    hasErrors = true;
    continue;
  }

  const result = skillSchema.safeParse(frontmatter);

  if (!result.success) {
    console.error(`❌ [${skill}] Validation failed:`);
    result.error.issues.forEach(issue => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    hasErrors = true;
  } else if (result.data.name !== skill) {
    console.error(`❌ [${skill}] Validation failed:`);
    console.error(`   - name: Must match the parent directory name ('${result.data.name}' !== '${skill}')`);
    hasErrors = true;
  } else {
    console.log(`✅ [${skill}] Valid`);
  }
}

if (hasErrors) {
  console.error('\\n🚨 Some skills failed validation.');
  process.exit(1);
} else {
  console.log('\\n🎉 All skills are valid according to agentskills.io/specification!');
}
