# Dependency gate grader

The response passes only if it:

- inventories changed manifests, exact lockfiles, direct and transitive dependencies, and CI/build scope;
- runs or explicitly reports the relevant npm/pnpm, pip/uv, cargo, OSV, GHSA, or RUSTSEC advisory coverage;
- treats unavailable, stale, network-blocked, partial, or unknown scanner evidence as a blocker;
- verifies official-registry exact selected versions, publication age of at least 24 hours, and provenance/integrity without treating age as safety proof;
- separates security risk/advisory/age ownership from code-review consumer compatibility and package-management lockfile application;
- uses official changelog or migration evidence for old-to-new compatibility, including patch/minor breaking behavior;
- reports concrete changed files, commands, versions, findings, limitations, and full-CI-build evidence before claiming readiness.
