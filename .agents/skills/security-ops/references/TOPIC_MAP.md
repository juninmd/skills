# security-ops Reference Map

| Reference | Open when |
|---|---|
| [api-authorization.md](api-authorization.md) | Testing object ownership, route permissions and role matrices |
| [ecosystem-checks.md](ecosystem-checks.md) | Per-ecosystem audit layer: install and build hooks (build scripts, lifecycle hooks, MSBuild imports) and risky call sites, for Rust, JS/TS, Python, Go, Ruby, JVM, .NET, PHP, Elixir |
| [gitleaks.md](gitleaks.md) | Investigating exposed credentials and preparing authorized cleanup |
| [iam-least-privilege.md](iam-least-privilege.md) | Reviewing or designing service-account and CI credential scope, time-boxed elevated access |
| [plugin-vetting.md](plugin-vetting.md) | Reviewing third-party instructions, dependencies and execution permissions before installation |
| [real-world-cases.md](real-world-cases.md) | Comparing a finding with prior security examples |
| [threat-modeling.md](threat-modeling.md) | STRIDE walkthrough for a new component or trust boundary, before or without code |
| [security-audit/audit-workflow.md](security-audit/audit-workflow.md) | Running a full or focused vulnerability audit: recon, coverage-led hunting, validation, `findings.json` report (Cloudflare, MIT; see [UPSTREAM.md](security-audit/UPSTREAM.md)) |
| [security-audit/RECONNAISSANCE.md](security-audit/RECONNAISSANCE.md) | Audit phase 1: mapping source and trust boundaries, selecting companions, building the coverage ledger |
| [security-audit/HUNTING.md](security-audit/HUNTING.md) | Audit phase 2: hunter prompts, coverage-led waves, structured candidate results |
| [security-audit/ATTACK-CLASSES.md](security-audit/ATTACK-CLASSES.md) | Audit phase 2: choosing and splitting attack classes for hunters |
| [security-audit/VALIDATION-AND-REPORTING.md](security-audit/VALIDATION-AND-REPORTING.md) | Audit phases 3 to 6: candidate verification, `findings.json`, target-neutral report |
| [security-audit/AI-AND-LLM.md](security-audit/AI-AND-LLM.md) | Audit companion: an LLM, RAG pipeline, agent memory, tool loop, or MCP server makes a trust-sensitive decision |
| [security-audit/CLIENT-SIDE.md](security-audit/CLIENT-SIDE.md) | Audit companion: trust decisions or untrusted rendering in a browser, extension, webview, or service worker |
| [security-audit/CLOUD-AND-DEPLOYMENT.md](security-audit/CLOUD-AND-DEPLOYMENT.md) | Audit companion: cloud identity, IaC, containers, Kubernetes, serverless, ingress, object storage |
| [security-audit/DATA-ISOLATION-AND-LIFECYCLE.md](security-audit/DATA-ISOLATION-AND-LIFECYCLE.md) | Audit companion: multi-tenant data, derived copies (search, cache, analytics), object links, export and restore |
| [security-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md](security-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md) | Audit companion: desktop or mobile apps, updaters, local daemons, deep links, native messaging, local IPC |
| [security-audit/MEMORY-SAFETY-AND-BINARY.md](security-audit/MEMORY-SAFETY-AND-BINARY.md) | Audit companion: untrusted bytes in C/C++, Rust `unsafe`, FFI, drivers, parsers |
| [security-audit/PROTOCOLS-RPC-AND-MESSAGING.md](security-audit/PROTOCOLS-RPC-AND-MESSAGING.md) | Audit companion: gRPC, GraphQL transports, custom binary protocols, webhooks, brokers, queues, events |
| [security-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md](security-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md) | Audit companion: untrusted input can consume CPU, memory, disk, connections, workers, paid APIs, or queues |
| [security-audit/SUPPLY-CHAIN-AND-RELEASE.md](security-audit/SUPPLY-CHAIN-AND-RELEASE.md) | Audit companion: dependency resolution, untrusted CI builds, release artifacts, signing, plugin loading |
| [security-audit/WEB-PROTOCOL-AND-AUTH.md](security-audit/WEB-PROTOCOL-AND-AUTH.md) | Audit companion: HTTP parsing, caching, browser authentication, identity boundaries, proxies, CDNs |
| [supply-chain.md](supply-chain.md) | Assessing dependency CVEs, shipped containers and SBOM provenance |
