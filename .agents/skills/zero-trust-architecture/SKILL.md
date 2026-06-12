---
name: zero-trust-architecture
description: "Zero-Trust Architecture & Secrets Management for Implementing automated, Deploying OIDC, Establishing encryption-in-transit via vault."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Zero-Trust Architecture & Secrets Management

Expert methodology for eliminating implicit trust boundaries through cryptographic identity, continuous verification, and comprehensive audit trails.

**USE FOR:**
- Implementing automated secrets rotation (Vault, AWS Secrets Manager, Google Secret Manager).
- Deploying OIDC federation for workload identity without long-lived credentials.
- Establishing encryption-in-transit standards (mTLS, TLS 1.3+).
- Designing audit logging and access tracing for compliance (PCI, SOC 2, ISO 27001).
- Validating attestation and provenance through cryptographic signatures (Sigstore, SPIFFE).

**DO NOT USE FOR:**
- SSL certificate procurement or renewal.
- Network firewall configuration (use managing-cloud-infrastructure).
- Dependency vulnerability scanning (use security-scanning).

**INVOKES:**
- `vault`, `sealed-secrets`, `spiffe`, `sigstore`, `security-scanning`, `managing-cloud-infrastructure`.

## Methodology
Zero-trust rejects perimeter security; every request is authenticated, authorized, and logged regardless of origin.

## Core Principles
1. **No Implicit Trust:** Every identity is cryptographically verified; no "internal network" exemptions.
2. **Secrets Rotation:** Credentials expire automatically; long-lived secrets are forbidden.
3. **Complete Audit Trail:** All authentication, authorization, and sensitive access logged and immutable.

## Checklist
- [ ] Secrets management system deployed (Vault, AWS Secrets Manager, Google Secret Manager).
- [ ] Secrets rotated automatically at fixed intervals (max 90 days); rotation tested in CI/CD.
- [ ] OIDC federation configured for workload identity (no hardcoded API keys or tokens).
- [ ] mTLS enforced for service-to-service communication; client/server certs validated.
- [ ] Audit logging enabled for all authentication, authorization, and secret access events.
- [ ] Encryption at rest enforced (databases, blob storage, backups); key rotation automated.
- [ ] Attestation and provenance tracked (container images signed; deployment sources verified).
- [ ] Compliance validations in CI/CD (secrets must not appear in logs, config, or source code).
- [ ] Breach response plan documented: secret revocation, audit review, notification timelines.
