export function extractFrontmatterRaw(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  return match ? match[1] : null;
}

export function findBlockArrayKeys(frontmatter) {
  const keys = new Set();
  const patterns = [
    /^([A-Za-z0-9_-]+):\s*\n\s*-\s+/gm,
    /^\s{2}([A-Za-z0-9_-]+):\s*\n\s{4}-\s+/gm,
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(frontmatter);
    while (match) {
      keys.add(match[1]);
      match = pattern.exec(frontmatter);
    }
  }

  return [...keys];
}

export function findInlineStyleIssues(frontmatter) {
  const issues = [];

  if (/^\w[\w-]*:\s*[>|]-\s*$/m.test(frontmatter)) {
    issues.push('Folded or literal frontmatter values are not allowed.');
  }
  if (/^\w[\w-]*:\s*\n\s*-\s+/m.test(frontmatter)) {
    issues.push('Top-level arrays must use inline syntax.');
  }
  if (/^\s{2}\w[\w-]*:\s*\n\s{4}-\s+/m.test(frontmatter)) {
    issues.push('Nested arrays must use inline syntax.');
  }
  if (/^\w[\w-]*:\s*\n\s{2}\w[\w-]*:\s+/m.test(frontmatter)) {
    issues.push('Objects must use inline syntax.');
  }

  return issues;
}
