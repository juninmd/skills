# Dependency, Container, and SBOM Security

## Contents

- Dependency scanning
- Container scanning
- SBOM generation
- Beyond CVE scanning
- CVE triage: exploitability and reachability
- Severity to action
- Pull-request dependency gate

Scanning the software supply chain and triaging what comes back.

## Dependency scanning

- Node: `npm audit` or `pnpm audit`, including dev/build dependencies. Run against the exact candidate lockfile, not a fresh resolve; exclude a group only with documented evidence that it cannot enter the assessed build or artifact.
- Python: `pip-audit -r requirements.txt`; for uv projects export the frozen lock to a temporary requirements file and audit that file. See the owning skill and [pip-audit usage](https://github.com/pypa/pip-audit#usage).
- Language-agnostic: `osv-scanner scan --lockfile <path>` covers most ecosystems from the OSV database. `trivy fs --scanners vuln,secret,misconfig .` covers the repository as a whole.
- Run scans in CI on every pull request and on a schedule — a clean scan today goes stale when a new CVE is published against unchanged code.

## Container scanning

- `trivy image --severity HIGH,CRITICAL <image>` — vulnerabilities from the base image and installed packages.
- `grype <image>` as a second opinion; the two databases disagree often enough to matter.
- `docker scout cves <image>` where the toolchain is already present.
- Retain unfixed findings: containment may be needed before a vendor patch exists.
- Most container CVEs are base-image CVEs. Rebuilding on a current minimal base (distroless, alpine, slim, or a patched vendor tag) closes more findings than any per-package pin.
- Scan the image that ships, built by CI from the tag — not a locally built approximation.

## SBOM generation

- `syft <image-or-dir> -o cyclonedx-json=sbom.json`, or `trivy sbom`, or `cyclonedx-npm` / `cyclonedx-py` per ecosystem.
- CycloneDX or SPDX — pick one format and keep it; downstream consumers cannot merge both.
- Generate the SBOM in the same CI job that builds the artifact, attach it to the release, and sign or attest it (`cosign attest`) so it is verifiably about that artifact.
- The SBOM's value is retrospective: when the next widely exploited CVE lands, it answers "are we affected, and where" in minutes instead of days.

## Beyond CVE scanning

A clean CVE scan is not a clean supply chain — event-stream, ua-parser-js, xz-utils, and polyfill.io all shipped compromised with no CVE at install time.

### Typosquatting and name confusion

- Before adding a dependency, compare the exact name against the well-known one: `reqeusts` vs `requests`, a scoped package (`@babel/core`) typo'd unscoped, a name claiming to replace an abandoned popular package.
- Check the registry, not memory: publish date (days-old claiming to be a 10-year-old library's replacement is a red flag), download counts relative to the real package, maintainer account age, and whether the linked repository actually matches the published source.
- A dependency proposed by a bot- or AI-assisted PR gets the same check as a human-proposed one — a hallucinated package name becomes installable the moment someone squats it.

### Unpinned transitive dependencies

- A direct dependency pinned to an exact version does not pin what it depends on; `^`/`~` ranges and unpinned transitive deps mean a `postinstall` script can change between two otherwise identical CI runs.
- Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, `Cargo.lock`, `go.sum`) pin the whole tree — commit them, and use the install mode that fails on drift (`npm ci`, not `npm install`, in CI).
- Install and build hooks on the full tree, not just top-level packages, carry the same risk in every ecosystem; see [Install and build hooks](ecosystem-checks.md#install-and-build-hooks) — a hostile transitive dependency runs at the same trust level as a hostile direct one.

## CVE triage: exploitability and reachability

Severity scores rank vulnerabilities in the abstract. Your job is ranking them in *this* system. Order by:

1. **Reachability.** Is the vulnerable symbol actually called from your code, directly or transitively? A CVE in a code path you never execute is not a priority — it is a scheduled upgrade. Tools: `osv-scanner` call analysis, `govulncheck` (Go), Snyk reachable-vulns. Absent tooling, grep the vulnerable API name across the repository and read the import graph.
2. **Exposure.** Is the reachable path reachable by an *attacker* — internet-facing, or behind authentication, or only in a build-time tool that never touches request data? A dev-dependency CVE and a request-path CVE with the same score are not the same finding.
3. **Preconditions.** Does the exploit need a specific configuration, feature flag, or platform you do not run? Read the advisory, not just the score.
4. **Privilege and blast radius.** What does the process hold — credentials, database access, the ability to reach internal networks?
5. **Fix cost and confidence.** A patch-level bump that a green test suite covers goes now. A major-version rewrite gets planned.

State the reasoning in the finding. "CRITICAL, but the vulnerable parser is only invoked by a build script that reads repository-local files — scheduled, not blocking" is a defensible call; silently suppressing it is not.

No fix available: isolate the code path, disable the feature, add a compensating control (input validation, network policy, WAF rule), and set an expiry date for revisiting.

## Severity to action

- **Blocks the merge:** a reachable, attacker-exposed vulnerability in the changed code; any live secret; a new dependency with a known critical CVE and an available fix; a control removed or weakened by this change.
- **May become tracked work:** demonstrably unreachable or unexposed findings with recorded evidence and an owner. Missing fixes and pre-existing debt can still block when exposure demands containment.

## Pull-request dependency gate

Inventory every changed manifest, lockfile, package manager configuration, CI
install command, and build scope. Resolve direct and transitive dependencies
from the committed exact lock (never a fresh resolution), and record selected
versions, source registries, integrity/provenance, lifecycle or build hooks, and
whether dev/build dependencies enter privileged CI or shipped artifacts.

Run the relevant fresh advisory sources against that exact tree: npm or pnpm
audit, pip-audit or uv's frozen export, cargo audit, OSV/GHSA/RUSTSEC feeds,
and the full CI build or equivalent install path. A scanner that is unavailable,
network-blocked, stale, or only covers part of the tree leaves the dependency
gate unverified and blocks a clean-ready claim; do not disable it or invent a
waiver. Preserve exit codes and distinguish findings from scanner failure.

For every selected direct and transitive version, including locked entries, verify the exact version
exists in the official registry, was published at least 24 hours before review,
has known provenance and a matching lock integrity record, and is not reported
as unknown or unpublished. The 24-hour age is a minimum review signal, never a
safety guarantee, and applies to the locked selected version. Security owns
advisory, provenance, age, and risk triage. `code-review` owns consumer
compatibility: compare old to new behavior using the official changelog and
migration guide, including patch/minor changes that carry breaking behavior.
`package-management` owns applying supported project-local package-manager controls and lockfile
changes within existing authority. Preserve stricter waits; unavailable native controls need a deterministic registry timestamp gate. An ordinary update without an effective 24-hour control stays blocked. Explicit emergency exceptions require a recorded owner, exact version, reason, authority, and expiry; never silently bypass an age gate for a security fix.

Report changed manifests, lockfiles, and CI files; exact scan commands and
versions; advisory database/source freshness; registry and age evidence; full
build scope; findings and reachability; and every unresolved limitation. Do not
call the dependency gate clean when any of those deliverables is missing.

Use the project security gate and actual exposure; do not waive active exploitation or severe reachable vulnerabilities solely because they predate this change.

