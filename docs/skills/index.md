# Skills

The catalog contains 70 domain skills. They are intentionally broader than single-tool skills so the model has fewer overlapping routes, while reference files preserve depth.

For optimization order and real development casebooks, see [Practical Skill Priorities](./practical-priorities.md).

| Category | Skills |
|---|---|
| Backend | `backend-node`, `backend-python`, `backend-systems` |
| Frontend | `frontend-engineering`, `frontend-design`, `design-systems`, `ui-state-design`, `accessibility`, `web-performance` |
| Mobile | `mobile-engineering` |
| Infrastructure | `cloud-devops`, `security-ops`, `incident-response`, `cost-engineering` |
| Quality | `diagnostics`, `expert-review`, `test-engineering`, `performance-engineering`, `webapp-testing`, `code-simplification`, `legacy-refactoring` |
| Architecture | `software-architecture`, `agent-engineering`, `codebase-mapping`, `context-engineering`, `api-design`, `mcp-integration`, `caching-strategy`, `parallel-subagents`, `domain-modeling` |
| Data | `data-engineering`, `sql-authoring`, `migration-engineering` |
| Observability | `observability` |
| Research | `web-research`, `docs-verification`, `knowledge-freshness`, `web-scraping` |
| Lifecycle | `project-lifecycle`, `requirements-clarification`, `incremental-delivery`, `git-workflow`, `finishing-dev`, `release-management`, `documentation`, `session-handoff` |
| Delivery loop | `dev-loop`, `phase-research`, `phase-prototype`, `phase-plan`, `phase-implement`, `phase-finalize`, `phase-done` |
| Tooling | `tooling-dev`, `skill-creator`, `document-generation`, `ascii-figures`, `human-step-wizard` |

## How Discovery Works

The frontmatter description states what the skill does and when it applies. The workflow and references load only after the skill is selected.

Use explicit invocation when you need to force a domain:

```text
/security-ops
/software-architecture
/mobile-engineering
```
