---
layout: home

hero:
  name: "Engineering Skills"
  text: "Focused procedures. Small context. Reproducible proof."
  tagline: 30 domain skills, 4 agents, and 4 prompt templates for production engineering work.
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
  - title: 30 Domain Skills
    details: Broad enough to avoid overlap, procedural enough to improve execution.
    link: /skills/
    linkText: Browse skills

  - title: 4 Engineering Agents
    details: Code review, architecture, DevOps, and planning roles with explicit scopes.
    link: /agents/
    linkText: Browse agents

  - title: Validation Built In
    details: Spec frontmatter, word budgets, local links, catalog consistency, and tests.
    link: /getting-started
    linkText: Run the checks

  - title: Multi-Platform
    details: Compatible with assistants that discover `.agents/skills/<name>/SKILL.md`.
---

## Quick Setup

```bash
npx skills add juninmd/skills --all
```

Or add the repository as your project's `.agents` directory:

```bash
git submodule add https://github.com/juninmd/skills .agents
```

## Example Routing

```text
/diagnostics            # reproduce and isolate a failure
/frontend-engineering   # implement or review a web UI
/cloud-devops           # change CI, containers, Helm, or IaC
/expert-review          # review a diff, plan, or design
```
