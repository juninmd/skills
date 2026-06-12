---
name: contract-testing
description: "Contract Testing & API Maturity for Defining API, Implementing consumer-driven, Generating type-safe via openapi-generator."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Contract Testing & API Maturity

Expert methodology for defining, validating, and versioning API contracts to prevent integration failures and enforce service maturity levels.

**USE FOR:**
- Defining API contracts using OpenAPI 3.1 specification (YAML/JSON).
- Implementing consumer-driven contract testing (Pact, Spring Cloud Contract).
- Generating type-safe client SDKs from OpenAPI specs.
- Detecting breaking changes before deployment.
- Enforcing API maturity levels (alpha, beta, stable, deprecated).

**DO NOT USE FOR:**
- End-to-end integration tests across services.
- Performance and load testing (use performance-profiling).
- UI/consumer acceptance testing.

**INVOKES:**
- `openapi-generator`, `pact-cli`, `schemathesis`, `prism`, `spectacle`.

## Methodology
Contract testing ensures API producers and consumers remain synchronized, preventing silent failures and enabling confident service evolution.

## Core Principles
1. **Contract as Specification:** OpenAPI spec is source of truth; all code is generated or validated against it.
2. **Consumer-Driven:** Clients define expectations; producers validate compliance before release.
3. **Version Management:** APIs must declare stability level and deprecation timeline for all breaking changes.

## Checklist
- [ ] OpenAPI 3.1 spec defined with clear operation IDs, request/response schemas, auth.
- [ ] Request/response schemas enforce strong typing (no `additionalProperties: true`).
- [ ] Consumer-side contract tests validate happy path, error codes, and edge cases.
- [ ] Client SDK generated from OpenAPI spec (avoid hand-written clients).
- [ ] CI/CD validates spec against implementation before merge.
- [ ] Breaking changes flagged in spec versioning and changelog.
- [ ] API maturity level (alpha/beta/stable) documented; deprecation timeline set.
- [ ] Rate limiting, pagination, sorting documented in spec with defaults.
- [ ] Security schemes (OAuth 2.0, API Key, JWT) explicitly defined in OpenAPI.
