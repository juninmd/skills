---
name: github-actions-docs
description: "Official GitHub Actions documentation lookup and docs-grounded workflow guidance. Use when users ask how to write, explain, customize, migrate, secure, or troubleshoot GitHub Actions workflows, YAML syntax, triggers, matrices, runners, reusable workflows, artifacts, caching, secrets, OIDC, deployments, custom actions, or Actions Runner Controller and need current official links. Triggers: GitHub Actions docs, workflow syntax, actions YAML, reusable workflows, OIDC, GITHUB_TOKEN, self-hosted runners, Actions Runner Controller."
argument-hint: "[question or workflow topic]"
---

# GitHub Actions Docs

Use this skill for GitHub Actions documentation questions where stale memory is risky. Ground answers in official GitHub documentation and return the closest authoritative page instead of generic CI/CD advice.

Answer as a documentation navigator: classify the topic, verify the current docs, then give the shortest correct guidance with exact links. Do not turn a docs question into a repo-specific CI diagnosis unless the user asks for debugging.

## Scope

Use this skill for:

- Workflow YAML, triggers, events, jobs, steps, matrices, concurrency, variables, contexts, and expressions.
- GitHub-hosted runners, larger runners, self-hosted runners, and Actions Runner Controller.
- Artifacts, caches, reusable workflows, workflow templates, and custom actions.
- Secrets, `GITHUB_TOKEN`, OpenID Connect, artifact attestations, and secure workflow patterns.
- Environments, deployment protection rules, deployment history, and deployment examples.
- Migration from Jenkins, CircleCI, GitLab CI/CD, Travis CI, Azure Pipelines, or other CI systems.
- Troubleshooting workflow behavior when the user needs syntax guidance or official references.

Do not use this skill for repo-specific CI failure triage unless the user asks for documentation. For implementation or pipeline edits, combine with the local `configuring-ci-cd` skill after reading the relevant docs.

## Workflow

### 1. Classify The Request

Choose the closest bucket before searching:

- Getting started or tutorial.
- Workflow authoring and syntax.
- Triggers, events, contexts, expressions, or variables.
- Runners and execution environment.
- Security and supply chain.
- Deployments and environments.
- Custom actions and publishing.
- Monitoring, logs, and troubleshooting.
- Migration from another CI system.

If the topic is unclear, read [Topic Map](references/topic-map.md) as a compact routing index.

### 2. Search Official Docs First

- Treat `docs.github.com` as the source of truth.
- Prefer pages under `https://docs.github.com/en/actions`.
- Search with the user's exact terms plus a focused phrase such as `workflow syntax`, `contexts`, `OIDC`, `reusable workflows`, or `self-hosted runners`.
- Compare 2-3 plausible pages when the first result may be too broad.
- If the docs have moved or are ambiguous, say so and provide the nearest official pages.

### 3. Read Before Answering

- Open the best official page before answering.
- Read the most relevant section when practical.
- Use the topic map only to find likely entry points; never treat it as the final authority.
- If current docs conflict with local project conventions, state the conflict and prefer GitHub docs for product behavior.

### 4. Answer With Docs-Grounded Guidance

- Start with a direct answer.
- Include exact GitHub docs links close to the claims they support.
- Provide YAML only when the user asks for it or when it is the clearest way to explain syntax.
- Make inferences explicit with wording such as `Inference:` when combining multiple docs pages.
- Keep the answer compact unless the user asks for a full walkthrough.

## Common Mistakes

- Answering from memory without verifying current GitHub docs.
- Linking only the GitHub Actions landing page when a narrower page exists.
- Mixing up reusable workflows, workflow templates, composite actions, and JavaScript/Docker actions.
- Suggesting long-lived cloud credentials when OIDC is the documented safer path.
- Treating CodeQL, Dependabot, or generic GitHub repository operations as GitHub Actions docs questions.

## Checklist

- [ ] Classified the request into a GitHub Actions docs bucket.
- [ ] Checked official `docs.github.com` pages before answering.
- [ ] Linked the closest authoritative docs page, not only a landing page.
- [ ] Marked any inference clearly when combining docs pages.

## References

- [Topic Map](references/topic-map.md)
- [Configuring CI/CD Skill](../configuring-ci-cd/SKILL.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Git Workflow Rule](../../rules/git-workflow.instructions.md)
