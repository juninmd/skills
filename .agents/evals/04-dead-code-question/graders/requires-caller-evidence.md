---
type: llm
focus: last_message
weight: 1
---
The response must:
- Not simply confirm the function is safe to delete based only on a single grep for direct imports.
- Point out that additional evidence is needed before deleting: string-based/dynamic dispatch, re-exports or a barrel/index file, feature flags, and scheduled jobs or other indirect callers a plain import grep would miss.
- Either ask for that additional evidence or explicitly state the deletion is not yet proven safe.
