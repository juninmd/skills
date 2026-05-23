# Helm Chart Best Practices and Standards

Guidelines for ensuring security, stability, and maintainability of Kubernetes deployments.

## 1. Best Practices
- **Version via SemVer:** Strictly follow semantic versioning for both chart and app.
- **Resource Management:** Always define CPU/Memory `requests` and `limits`.
- **Naming:** Use lowercase and hyphens; follow the "Fullname" helper pattern.
- **Immutable Tags:** Avoid `latest`; use specific versions or image SHAs.
- **Security:** Use Kubernetes `Secrets`; never put plain-text secrets in `values.yaml`.

## 2. Common Patterns
- **ConfigMap Checksum:** Add `checksum/config` annotation to Deployments to force restarts on config changes.
- **Library Charts:** Use `type: library` for reusable template logic.

## 3. Troubleshooting
- **Debug Rendering:** Use `helm template` to inspect generated manifests.
- **Release State:** Use `helm status` and `helm history` for failure diagnosis.
