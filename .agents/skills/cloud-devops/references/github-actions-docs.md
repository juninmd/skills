# GitHub Actions documentation lookup

Method for answering documentation questions about GitHub Actions. Routing aid only: verify every final answer against the live page on `docs.github.com`.

## Contents
- Answer rules
- Classify, then search
- Doc entry points

## Answer rules
- Start with the direct answer; link the exact section for every claim, never a landing page.
- YAML only when requested or essential to explain syntax; mark combined insights as `Inference:`.
- Never answer from memory; do not confuse composite actions with reusable workflows; prefer OIDC over static keys; generic repo operations are not Actions questions.
- If the docs conflict with local conventions, flag the discrepancy.

## Classify, then search
Pick the closest bucket, search exact terms plus the category (e.g. `OIDC workflow syntax`) under `docs.github.com/en/actions`, read the applicable section, and compare pages when ambiguity remains.

| Bucket | Covers |
|---|---|
| Authoring | YAML syntax, triggers, events, expressions, variables |
| Infrastructure | hosted/self-hosted runners, Actions Runner Controller |
| Standardization | reusable workflows, templates, custom actions |
| Security | secrets, OIDC, `GITHUB_TOKEN`, attestations |
| Ops | monitoring, troubleshooting, deployments |
| Migration | from Jenkins, GitLab, Azure Pipelines |

## Doc entry points
- Overview: `https://docs.github.com/en/actions`
- Quickstart: `https://docs.github.com/en/actions/writing-workflows/quickstart`
- Workflow syntax (matrix: `jobs.<job_id>.strategy.matrix`): `https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions`
- Events: `https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows`
- Contexts: `https://docs.github.com/en/actions/learn-github-actions/contexts`
- Expressions: `https://docs.github.com/en/actions/reference/workflows-and-actions/expressions`
- Variables: `https://docs.github.com/en/actions/learn-github-actions/variables`
- Reusable workflows: `https://docs.github.com/en/actions/sharing-automations/reusing-workflows`
- Composite actions: `https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-composite-action`
- Search by phrase: `workflow templates`, `creating a JavaScript action`, `creating a Docker container action`, `GitHub-hosted runners`, `larger runners`, `self-hosted runners`, `Actions Runner Controller`, `security hardening for GitHub Actions`, `using secrets in GitHub Actions`, `automatic token authentication`, `OpenID Connect GitHub Actions`, `artifact attestations GitHub Actions`, `managing environments for deployment`, `deployment protection rules`, `monitoring and troubleshooting workflows`, `enable debug logging GitHub Actions`, `migrating to GitHub Actions`; for cloud deploys, the provider plus `GitHub Actions deploy`.
