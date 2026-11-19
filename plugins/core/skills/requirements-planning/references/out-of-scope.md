# Out-of-Scope Knowledge Base

## Contents

- Directory structure
- File format
- When to check .out-of-scope/
- When to write to .out-of-scope/
- Updating or removing out-of-scope files

`.out-of-scope/` is a repo directory holding one record per rejected feature request. It exists for two reasons:

1. **Memory** — the rationale outlives the closed issue.
2. **Dedup** — a new issue that matches an earlier rejection gets the old decision shown to the maintainer rather than a fresh debate.

## Directory structure

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

One file per **concept**, not per issue. Every issue asking for the same thing is listed in that concept's file.

## File format

Write it like a short design note, not a database row: prose, a code sample or example where it helps, readable by someone who has never seen the issues.

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The renderer assumes one color palette, fixed in `ThemeConfig`. Multiple
themes would need:

- a theme context provider around the whole component tree
- theme-aware style resolution in every component
- storage for each user's theme choice

That is a large architectural change, and the project is about content
authoring. Theming belongs to downstream consumers who embed or redistribute
the output.

```ts
// ThemeConfig was not built for switching at runtime:
interface ThemeConfig {
  colors: ColorPalette; // one palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42 — "Add dark mode support"
- #87 — "Night theme for accessibility"
- #134 — "Dark theme option"
```

### Naming the file

Kebab-case name for the concept (`dark-mode.md`, `plugin-system.md`, `graphql-api.md`). Someone scanning the directory should know what was rejected without opening anything.

### Writing the reason

Give a real reason, never just "we don't want this". Solid reasons cite:

- scope or philosophy ("the project focuses on X; theming is a downstream concern")
- technical constraints ("this needs Y, which clashes with our Z architecture")
- strategic choices ("we picked A over B because...")

Keep it durable. "We're busy right now" is a deferral, not a rejection; do not record it here.

## When to check `.out-of-scope/`

At triage step 1 (gather context), read every file in `.out-of-scope/`. For each new issue:

- Compare by concept, not keywords: "night theme" matches `dark-mode.md`.
- On a match, tell the maintainer: "This resembles `.out-of-scope/dark-mode.md`, rejected earlier because [reason]. Still the right call?"

The maintainer can:

- **Confirm** — add the issue to the file's "Prior requests" list and close it.
- **Reconsider** — delete or update the file; the issue goes through normal triage.
- **Distinguish** — related but different; normal triage applies.

## When to write to `.out-of-scope/`

Only when an **enhancement** (not a bug) is closed as `wontfix`. A request closed because the behavior **already exists** is not a rejection: point to where it lives and write nothing here, otherwise the next dedup check reports a rejection that never happened. Steps:

1. The maintainer rules the request out of scope.
2. Look for an existing `.out-of-scope/` file for the concept.
3. Found: append the issue to its "Prior requests".
4. Not found: create a file with the concept name, the decision, the reason, and the first prior request.
5. Comment on the issue with the decision and a mention of the file.
6. Close the issue with the `wontfix` label.

## Updating or removing out-of-scope files

When the maintainer reverses an old rejection:

- Delete the `.out-of-scope/` file.
- Leave old issues closed; they are history.
- The issue that prompted the reversal goes through normal triage.
