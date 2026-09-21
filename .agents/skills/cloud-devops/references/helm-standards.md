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

## 4. Liveness vs Readiness Probe Misconfiguration

Liveness answers "is the process stuck and needs a restart"; readiness answers "should traffic
reach this pod right now." Charts that copy one probe definition for both, or point liveness at a
dependency check, turn a transient slowdown into a restart storm.

| Symptom | Likely cause | Fix |
|---|---|---|
| `CrashLoopBackOff` only under load, never at idle | liveness probe checks a downstream dependency (DB, cache) that gets slow under load, so a healthy process gets killed for someone else's latency | liveness checks only "is this process alive" (e.g. an in-process ping); readiness checks dependencies |
| Pod restarts during a slow cold start (JIT warmup, large cache load) | liveness starts probing before initialization finishes and the first few probes fail | add a `startupProbe` with enough `failureThreshold * periodSeconds` to cover worst-case startup; liveness only takes over after it succeeds |
| Traffic reaches a pod that is not actually ready (empty connection pool, cache not warmed) | no `readinessProbe` defined — Kubernetes treats "started" as "ready" | define a distinct `readinessProbe`; never rely on liveness alone to gate traffic |
| Rolling update takes down capacity even though pods report `Running` | readiness never flips true because its check is wrong (wrong port/path) rather than the app being unhealthy | verify the probe path/port against the actual listener, not the app's public port if they differ |
| One slow request causes a restart | `timeoutSeconds`/`failureThreshold` too tight for the endpoint's real p99 | size the threshold to the measured p99 latency, not a guessed round number |

The failure mode to design against: identical liveness and readiness probes mean a slow dependency
both pulls traffic away (correct) and kills the pod (wrong) at the same time, guaranteeing a
restart loop precisely when the pod is under the most load and least able to recover.
