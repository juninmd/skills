# Skills

The catalog contains 33 domain skills. They are intentionally broader than single-tool skills so the model has fewer overlapping routes, while reference files preserve depth.

For optimization order and real development casebooks, see [Practical Skill Priorities](./practical-priorities.md).

| Category | Skills |
|---|---|
| Backend | `backend-node`, `backend-python`, `backend-systems` |
| Frontend | `frontend-engineering`, `frontend-design` |
| Mobile | `mobile-engineering` |
| Infrastructure | `cloud-devops`, `security-ops`, `incident-response` |
| Quality | `diagnostics`, `expert-review`, `test-engineering`, `performance-engineering`, `webapp-testing` |
| Architecture | `software-architecture`, `agent-engineering`, `codebase-mapping`, `context-engineering` |
| Data | `data-engineering`, `sql-authoring` |
| Observability | `observability` |
| Research | `web-research`, `docs-verification`, `knowledge-freshness`, `web-scraping` |
| Lifecycle | `project-lifecycle`, `git-workflow`, `pr-delivery`, `release-management`, `documentation` |
| Tooling | `tooling-dev`, `skill-creator`, `document-generation` |

## How Discovery Works

The frontmatter description states what the skill does and when it applies. The workflow and references load only after the skill is selected.

Use explicit invocation when you need to force a domain:

```text
/security-ops
/software-architecture
/mobile-engineering
```
