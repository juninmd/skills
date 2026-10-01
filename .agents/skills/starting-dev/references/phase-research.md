# Research procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

1. Resolve the goal and the existing [workspace](loop-state.md) before creating one. Do not create or edit issues without authorization.
2. Trace relevant code using [codebase mapping](codebase-mapping.md). Record path/line evidence for modules, data flow, tests, and constraints.
3. Invoke `web-research` for primary-source API/version checks, prior art, and compatibility. Record source URLs, dates, facts, and inferences separately.
4. Record risks: runtime, auth boundaries, migration, compatibility, dependencies, and unresolved product decisions. The existing stack wins unless migration is requested; new-project choices go to `stack-selection`.
5. Produce `research.md` in the workspace with goal, non-goals, measurable acceptance, code map, sourced prior art, constraints, ranked risks, and unknowns.
6. Advance to prototype only when product direction needs experimentation; otherwise record the skip and advance to plan. Ask material questions when they block safe progress, not at an arbitrary later ceremony.

Research is read-only outside agreed task artifacts. Never substitute memory for current API evidence or present an unknown as a fact. Update [loop state](loop-state.md) after the artifact exists.
