# Roadmap

Ideas to implement in our own words and structure. Each item ships as its own small pull request, validated with `pnpm run validate`.

## Next

1. **Entry router**: a short skill that tells the assistant to check the catalog before acting and lists the invocable flows.
2. **Interview mode**: a skill that asks one question at a time until intent is clear, then writes the answers into a brief.
3. **Domain glossary**: a project glossary file plus inline decision records, reused by planning and review skills.
4. **Ticket slicing**: split a plan into thin, end-to-end tickets, each with its own check.
5. **Two-stage review**: review against the spec first, then for quality, ideally with separate subagents.

## Later

- Verification hooks that block "done" without evidence or when a check was silenced.
- Multi-client install notes for more assistants.
- Pull request summaries with before/after evidence.
- Deprecation and migration guidance.
- Real-model evals in CI, with more negative cases between neighboring skills.
