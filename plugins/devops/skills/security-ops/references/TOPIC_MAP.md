# security-ops Reference Map

| Reference | Open when |
|---|---|
| [api-authorization.md](api-authorization.md) | Testing object ownership, route permissions and role matrices |
| [ecosystem-checks.md](ecosystem-checks.md) | Per-ecosystem audit layer: install and build hooks (build scripts, lifecycle hooks, MSBuild imports) and risky call sites, for Rust, JS/TS, Python, Go, Ruby, JVM, .NET, PHP, Elixir |
| [gitleaks.md](gitleaks.md) | Investigating exposed credentials and preparing authorized cleanup |
| [iam-least-privilege.md](iam-least-privilege.md) | Reviewing or designing service-account and CI credential scope, time-boxed elevated access |
| [mcp-config-drift.md](mcp-config-drift.md) | Static review of repo-scoped MCP config (`.mcp.json`, Cursor, VS Code) for mutable package or image references: `@latest`, bare names, version ranges, untagged images |
| [plugin-vetting.md](plugin-vetting.md) | Reviewing third-party instructions, dependencies and execution permissions before installation |
| [privacy-lgpd-gdpr.md](privacy-lgpd-gdpr.md) | Personal data compliance: data map, LGPD/GDPR legal basis, consent, retention, data subject requests, ANPD 3-business-day and GDPR 72-hour breach notification |
| [real-world-cases.md](real-world-cases.md) | Comparing a finding with prior security examples |
| [threat-modeling.md](threat-modeling.md) | STRIDE walkthrough for a new component or trust boundary, before or without code |
| [audit-workflow.md](audit-workflow.md) | Running a full or focused vulnerability audit: recon, coverage-led hunting, validation, structured report |
| [audit-reconnaissance.md](audit-reconnaissance.md) | Audit phase 1: mapping source and trust boundaries, selecting companions, building the coverage ledger |
| [audit-hunting.md](audit-hunting.md) | Audit phase 2: hunter prompts, coverage-led waves, structured candidate results |
| [audit-attack-classes.md](audit-attack-classes.md) | Audit phase 2: choosing and splitting attack classes for hunters |
| [audit-reporting.md](audit-reporting.md) | Audit phases 3 to 6: candidate verification, findings json report schema, target-neutral report |
| [audit-ai-llm.md](audit-ai-llm.md) | Audit companion: an LLM, RAG pipeline, agent memory, tool loop, or MCP server makes a trust-sensitive decision |
| [audit-client-side.md](audit-client-side.md) | Audit companion: trust decisions or untrusted rendering in a browser, extension, webview, or service worker |
| [audit-cloud-infra.md](audit-cloud-infra.md) | Audit companion: cloud identity, IaC, containers, Kubernetes, serverless, ingress, object storage |
| [audit-data-isolation.md](audit-data-isolation.md) | Audit companion: multi-tenant data, derived copies (search, cache, analytics), object links, export and restore |
| [audit-desktop-mobile.md](audit-desktop-mobile.md) | Audit companion: desktop or mobile apps, updaters, local daemons, deep links, native messaging, local IPC |
| [audit-memory-binary.md](audit-memory-binary.md) | Audit companion: untrusted bytes in C/C++, Rust `unsafe`, FFI, drivers, parsers |
| [audit-protocols.md](audit-protocols.md) | Audit companion: gRPC, GraphQL transports, custom binary protocols, webhooks, brokers, queues, events |
| [audit-resource-bounds.md](audit-resource-bounds.md) | Audit companion: untrusted input can consume CPU, memory, disk, connections, workers, paid APIs, or queues |
| [audit-supply-chain.md](audit-supply-chain.md) | Audit companion: dependency resolution, untrusted CI builds, release artifacts, signing, plugin loading |
| [audit-web-auth.md](audit-web-auth.md) | Audit companion: HTTP parsing, caching, browser authentication, identity boundaries, proxies, CDNs |
| [supply-chain.md](supply-chain.md) | Assessing dependency CVEs, shipped containers and SBOM provenance |
