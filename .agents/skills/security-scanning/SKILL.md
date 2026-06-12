---
name: security-scanning
description: "Security Scanning for Scanning dependencies, Detecting secrets, Generating Software via configuring-ci-cd, managing-cloud-infrastructure."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Security Scanning

Professional guidance for implementing automated security scans across the supply chain: vulnerabilities, secrets, dependencies, and build artifacts.

**USE FOR:**
- Scanning dependencies for known CVEs (npm audit, pip audit, cargo audit).
- Detecting secrets in code (API keys, tokens, passwords).
- Generating Software Bill of Materials (SBOM) for compliance.
- Scanning container images for vulnerabilities.
- Enforcing license compliance (GPL, proprietary, etc.).
- Attesting artifact authenticity and provenance.
- Managing dependency upgrades and patch cycles.
- Tracking vulnerability exposure and remediation timelines.

**DO NOT USE FOR:**
- Penetration testing and live application security testing.
- Zero-trust architecture design (use `zero-trust-architecture`).
- Fine-grained access control policies (use cloud/k8s skills).

**INVOKES:**
- `configuring-ci-cd` for scan automation in pipelines.
- `managing-cloud-infrastructure` for registry scanning.
- `fix-gitleaks` for secrets remediation.

## Scanning Tiers

1. **Dependency Scanning (Every Build)**
   - npm audit, pip audit, cargo audit, go mod tidy.
   - Fail builds on high/critical vulnerabilities.
   - Daily CVE updates from NVD, GitHub Advisory Database.

2. **Secrets Detection (Pre-commit + CI)**
   - Scan for API keys, tokens, credentials.
   - Block commits with secrets (pre-commit hooks).
   - Rotate exposed secrets immediately.
   - Tools: `gitleaks`, `truffleHog`, `detect-secrets`.

3. **Container & Artifact Scanning**
   - Scan images before pushing to registry (Trivy, Snyk).
   - Require attestation before deployment.
   - Track image provenance and build metadata.

4. **License Compliance**
   - Identify GPL/AGPL/proprietary licenses.
   - Enforce license policies in CI/CD.
   - Track license obligations (attribution, source distribution).

5. **SBOM Generation**
   - Generate SBOM for every release (CycloneDX, SPDX).
   - Include all transitive dependencies.
   - Use for supply chain transparency and incident response.

## Integration Pattern

```
Code Commit
  ↓
Pre-commit: Secrets detection (gitleaks)
  ↓
CI/CD: Dependency scan (npm audit, snyk)
  ↓
CI/CD: Container scan (Trivy)
  ↓
CI/CD: SBOM generation
  ↓
Registry: Image attestation
  ↓
Deploy: Verify attestation before rollout
```

## Application Security Coding Standards
- **Input Validation:** Use schema validation (e.g., Zod) on all external inputs (API bodies, query params, env vars). Never bypass validation with `any`.
- **SQL Injection Prevention:** Use parameterized queries exclusively. No string interpolation for SQL.
- **Authentication & Authorization:** Require auth middleware on all protected routes. Verify permissions explicitly.
- **XSS Prevention:** Ensure inputs are escaped. Avoid dangerous DOM APIs (e.g., `dangerouslySetInnerHTML`) with user input.
- **Secret Management:** Never hardcode secrets. Access them via environment variables and ensure they are not logged.
- **OWASP Top 10:** Enforce HTTPS, secure cookies, signed tokens, and explicit CORS origins.

## Data Privacy & PII Handling
- **PII Redaction:** Automatically sanitize logs to mask emails, names, IP addresses, API keys, tokens, phone numbers, SSNs, and credit cards before they are written.
- **Context Isolation:** Never paste real user data into AI prompts; use placeholders (`<USER_EMAIL>`) and fake data.
- **Data Minimization:** Collect only necessary data, encrypt it at rest and in transit, and support user data deletion flows (GDPR/LGPD).
- **.gitignore:** Ensure environment files and key/pem files are excluded.

## Environment & Secrets Management
- **File Structure:** `.env` and `.env.local` must NEVER be committed. Maintain an `.env.example` with placeholder values (e.g., `OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx`).
- **Startup Validation:** Validate environment variables at application startup using a strict schema (e.g., Zod). Fail fast if required variables are missing or malformed.
- **Production Secrets:** Do not use `.env` files in production; inject secrets via a secure vault (AWS Secrets Manager, HashiCorp Vault, etc.).

## Checklist

- [ ] Dependency scanning runs on every build; blocks on critical CVEs.
- [ ] Secrets are detected pre-commit and in CI/CD.
- [ ] No credentials in git history; exposed secrets are rotated.
- [ ] Container images are scanned before registry push.
- [ ] SBOM is generated and retained for every release.
- [ ] License compliance is enforced; GPL/AGPL/proprietary flagged.
- [ ] Patch cycles are tracked; critical updates applied within SLA.
- [ ] Vulnerability disclosure process is documented.
- [ ] Supply chain attestation is enabled (SLSA, in-toto).
