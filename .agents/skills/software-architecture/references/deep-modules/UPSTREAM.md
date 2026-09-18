# Upstream

- Source: https://github.com/mattpocock/skills (`skills/engineering/codebase-design/` and `skills/engineering/improve-codebase-architecture/`), MIT, see `LICENSE`.
- Pinned commit: `74ca5fe077456a0b3b2f5310cf9430999fd0b5fd` (2026-09-17).
- Local changes:
  - both upstream `SKILL.md` files renamed (`codebase-design.md`, `improve-codebase-architecture.md`) so clients do not load them as separate skills; the links to the old `SKILL.md` name in `DEEPENING.md` and `DESIGN-IT-TWICE.md` now point at `codebase-design.md`;
  - `HTML-REPORT.md` sets Mermaid `securityLevel` to `strict` (upstream: `loose`, which runs HTML and click callbacks in labels), and `improve-codebase-architecture.md` asks before opening the report and HTML-escapes repository names instead of opening it unasked;
  - in `improve-codebase-architecture.md`, four "call the Skill tool with ..." instructions and one `/codebase-design` slash-command mention now link local procedures, because those skills are not part of this catalog: the vocabulary to [codebase-design.md](codebase-design.md), the design-it-twice pattern to [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md), the grilling loop to [requirements-clarification.md](../../../starting-dev/references/requirements-clarification.md), and domain upkeep to [domain-modeling.md](../domain-modeling.md).
- Not vendored: `agents/openai.yaml` (client metadata).
- `HTML-REPORT.md` loads Tailwind and Mermaid from public CDNs into a report written to the OS temp directory. The Tailwind Play CDN is unversioned, Mermaid floats on major `@11`, and neither has SRI; the report holds repository structure, so open it only where running those scripts is acceptable.
- Precedence against [design-principles.md](../design-principles.md): the file-size and nesting limits there stay hard limits; deepening consolidates behavior behind a smaller interface, and a deep module may still be split internally across files behind that interface.
- Cancels item 8 of the repository `roadmap.md`.
- Updating: re-vet the upstream diff from the pinned commit before copying, per [plugin-vetting.md](../../../security-ops/references/plugin-vetting.md).
