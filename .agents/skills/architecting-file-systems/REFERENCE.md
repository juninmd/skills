# Reference: File System Standards

## Standard Structures

### Web Development (React/Next.js)
- **App Router:** `app/`, `components/`, `lib/`, `hooks/`, `public/`, `styles/`.
- **Atomic Design:** `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`.

### Web Development (React + Vite + TypeScript)
```text
src/
	app/
	pages/
	features/
		billing/
			ui/
			hooks/
			services/
			domain/
			store/
			types/
		profile/
			ui/
			hooks/
			services/
			domain/
			store/
			types/
	components/ui/
	lib/
	assets/
	styles/
```

- **Feature First:** Use `features/<feature-name>/` when a screen or domain starts accumulating its own UI, hooks, services, and state.
- **Shared UI:** Keep design-system primitives and cross-feature building blocks in `components/ui/`.
- **Business Rules:** Keep calculations, policies, and domain transformations in `domain/`, not inside components.
- **Integration Boundaries:** Keep HTTP clients, adapters, and side-effectful orchestration in `services/`.
- **State Boundaries:** Keep Zustand stores close to the feature in `store/` when the state is feature-specific.
- **Types:** Keep explicit contracts in `types/` when they are reused by multiple modules inside the feature.

### Python (Standard)
- **Small Project:** `app/`, `tests/`, `README.md`, `requirements.txt`.
- **Large Project:** `src/{package}/`, `tests/`, `docs/`, `scripts/`, `setup.py`.

### Go (Standard Layout)
- `cmd/`, `internal/`, `pkg/`, `api/`, `configs/`, `scripts/`.

## Best Practices
- **KISS (Keep It Simple, Stupid):** Don't over-engineer the structure for small projects.
- **Separation of Concerns:** Keep logic, UI, and data models in distinct directories.
- **Consistency:** Use consistent naming (kebab-case, camelCase) across the entire system.
- **Flat vs. Nested:** Prefer flatter structures until nesting becomes necessary for clarity.
- **Escalate by Need:** Start with `components/`, `hooks/`, and `services/`; introduce `features/` only when the application size justifies domain grouping.
- **Avoid Junk Drawers:** Avoid generic folders such as `utils/`, `helpers/`, or `common/` without clear ownership.
- **Co-locate by Ownership:** Keep files near the feature that owns them, and extract to shared directories only when the reuse is real.

## External Resources
- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
- [Python Project Structure](https://docs.python-guide.org/writing/structure/)
- [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
