import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { SKILLS_DIR } from './lib/catalog.mjs';
import { extractFrontmatterRaw, findBlockArrayKeys } from './lib/frontmatter.mjs';

const skillSchema = z.object({
  name: z.string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/)
    .refine((value) => !value.startsWith('-') && !value.endsWith('-'))
    .refine((value) => !value.includes('--')),
  description: z.string().min(1).max(1024),
  'argument-hint': z.string().min(1),
  'disable-model-invocation': z.boolean().optional(),
  license: z.string().optional(),
  compatibility: z.any().optional(),
  metadata: z.any().optional(),
  'allowed-tools': z.string().optional(),
});

let hasErrors = false;
const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const skillName of skillDirs) {
  const filePath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
  if (!fs.existsSync(filePath)) {
    hasErrors = true;
    console.error(`[${skillName}] Missing SKILL.md.`);
    continue;
  }

  const text = fs.readFileSync(filePath, 'utf8');
  const rawFrontmatter = extractFrontmatterRaw(text);
  const blockArrayKeys = rawFrontmatter ? findBlockArrayKeys(rawFrontmatter) : [];

  if (blockArrayKeys.length) {
    hasErrors = true;
    console.error(`[${skillName}] Inline arrays required for: ${blockArrayKeys.join(', ')}`);
    continue;
  }

  let parsed;
  try {
    parsed = matter(text);
  } catch (error) {
    hasErrors = true;
    console.error(`[${skillName}] Frontmatter parse failed: ${error.message}`);
    continue;
  }

  const result = skillSchema.safeParse(parsed.data);
  if (!result.success) {
    hasErrors = true;
    console.error(`[${skillName}] Invalid frontmatter.`);
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    continue;
  }

  if (result.data.name !== skillName) {
    hasErrors = true;
    console.error(`[${skillName}] Frontmatter name must match the directory.`);
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`Validated ${skillDirs.length} skill(s).`);
