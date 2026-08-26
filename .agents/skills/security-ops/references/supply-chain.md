# Dependency, Container, and SBOM Security

Scanning the software supply chain and triaging what comes back.

## Dependency scanning

- Node: `npm audit --audit-level=high --omit=dev`, or `pnpm audit`. Lockfile-driven, so run it against the committed lockfile, not a fresh resolve.
- Python: `pip-audit -r requirements.txt` or `uv pip audit`.
- Language-agnostic: `osv-scanner scan --lockfile <path>` covers most ecosystems from the OSV database. `trivy fs --scanners vuln,secret,misconfig .` covers the repository as a whole.
- Run scans in CI on every pull request and on a schedule — a clean scan today goes stale when a new CVE is published against unchanged code.

## Container scanning

- `trivy image --severity HIGH,CRITICAL --ignore-unfixed <image>` — vulnerabilities from the base image and installed packages.
- `grype <image>` as a second opinion; the two databases disagree often enough to matter.
- `docker scout cves <image>` where the toolchain is already present.
- `--ignore-unfixed` first: a CVE with no upstream fix is not actionable this sprint, so separate it from the fixable backlog rather than drowning in it.
- Most container CVEs are base-image CVEs. Rebuilding on a current minimal base (distroless, alpine, slim, or a patched vendor tag) closes more findings than any per-package pin.
- Scan the image that ships, built by CI from the tag — not a locally built approximation.

## SBOM generation

- `syft <image-or-dir> -o cyclonedx-json=sbom.json`, or `trivy sbom`, or `cyclonedx-npm` / `cyclonedx-py` per ecosystem.
- CycloneDX or SPDX — pick one format and keep it; downstream consumers cannot merge both.
- Generate the SBOM in the same CI job that builds the artifact, attach it to the release, and sign or attest it (`cosign attest`) so it is verifiably about that artifact.
- The SBOM's value is retrospective: when the next widely exploited CVE lands, it answers "are we affected, and where" in minutes instead of days.

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
- **Becomes a tracked issue:** unreachable or unexposed CVEs, findings with no upstream fix, base-image debt, and hardening improvements not caused by this change.

Never block a merge on a finding the change did not introduce and does not worsen — that is how scanners get turned off.
