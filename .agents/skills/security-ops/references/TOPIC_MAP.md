# security-ops Reference Map

| Reference | Open when |
|---|---|
| [api-authorization.md](api-authorization.md) | Testing object ownership, route permissions and role matrices |
| [ecosystem-checks.md](ecosystem-checks.md) | Per-ecosystem audit layer: install and build hooks (build scripts, lifecycle hooks, MSBuild imports) and risky call sites, for Rust, JS/TS, Python, Go, Ruby, JVM, .NET, PHP, Elixir |
| [gitleaks.md](gitleaks.md) | Investigating exposed credentials and preparing authorized cleanup |
| [plugin-vetting.md](plugin-vetting.md) | Reviewing third-party instructions, dependencies and execution permissions before installation |
| [real-world-cases.md](real-world-cases.md) | Comparing a finding with prior security examples |
| [security-audit/audit-workflow.md](security-audit/audit-workflow.md) | Running a full or focused vulnerability audit: recon, coverage-led hunting, validation, `findings.json` report (Cloudflare, MIT; see [UPSTREAM.md](security-audit/UPSTREAM.md)) |
| [supply-chain.md](supply-chain.md) | Assessing dependency CVEs, shipped containers and SBOM provenance |
