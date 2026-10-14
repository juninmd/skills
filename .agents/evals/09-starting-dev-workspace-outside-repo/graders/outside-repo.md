---
type: llm
focus: last_message
weight: 1
---
The response must:
- Place the task checklist, loop state, and stage artifacts in a temp directory keyed by the session id (for example `<tmpdir>/starting-dev/<session-id>/`).
- State explicitly that nothing goes inside the repository: no `TASKS.md`, no `.workflow/` directory.
- Mention that a new session resumes from the path recorded in the handoff, not by guessing an id.
