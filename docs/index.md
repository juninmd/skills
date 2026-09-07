---
layout: home

hero:
  name: "Engineering Skills"
  text: "Focused procedures. Small context. Reproducible proof."
  tagline: 22 domain skills, 4 agents, and shared operating instructions for production engineering work.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Browse Skills
      link: /skills/
    - theme: alt
      text: View on GitHub
      link: https://github.com/juninmd/skills

features:
  - title: 22 Domain Skills
    details: Broad enough to avoid overlap, procedural enough to improve execution. Depth lives in per-skill references.
    link: /skills/
    linkText: Browse skills

  - title: 4 Engineering Agents
    details: Code review, architecture, DevOps, and planning roles with explicit scopes.
    link: /agents/
    linkText: Browse agents

  - title: Symlink Install
    details: One checkout linked into Claude Code, Codex, and Antigravity. Edits are live everywhere.
    link: /getting-started
    linkText: Install

  - title: Validation Built In
    details: Spec frontmatter, token budgets, routing evals, retired-name checks, local links, and tests.
    link: /getting-started
    linkText: Run the checks
---

## Quick Setup

```bash
git clone https://github.com/juninmd/skills && cd skills
node .agents/tools/install.mjs all
```

## Example Routing

```text
/starting-dev           # clarify a request, map a repository, plan slices
/frontend-engineering   # implement or review a web UI
/cloud-devops           # change CI, containers, Helm, or IaC
/code-review            # adversarial review of a diff or plan
/finishing-dev          # review, fix, and open the PR
```
