# Reference: File System Standards

## Standard Structures

### Web Development (React/Next.js)
- **App Router:** `app/`, `components/`, `lib/`, `hooks/`, `public/`, `styles/`.
- **Atomic Design:** `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`.

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

## External Resources
- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
- [Python Project Structure](https://docs.python-guide.org/writing/structure/)
- [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
