---
name: triaging-incidents
description: Incident investigation, alert triaging, and cloud resource mapping with forensic rigor (DNS/Logs/Impact).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[incident/alert] [options]"
disable-model-invocation: true
---

# Triage and Reconnaissance (Incident Response)

This skill establishes the "First Response" protocol for any anomaly.

## Mandatory Protocol (The 5 Steps)
1.  **Check Status Pages:** Before blaming the code, check external dependencies.
    *   **External:** Google Cloud Status, GitHub Status, Payments Gateway.
    *   **Internal:** Luizalabs Platform Status Page.
2.  **DNS Investigation (DNS First):** Is the problem connectivity or the application?
    *   **Command:** `dig +short <hostname>` (Does it resolve IP?).
    *   **Command:** `nc -zv <host> <port>` (Is the port open?).
3.  **Asset Identification:** Where is it running? (K8s, VM, Cloud Function).
    *   **Validation:** `kubectl get pods -l app=<name>`
4.  **Impact Assessment:** Define severity (P1=Critical, P2=High, P3=Medium).
    *   **Criteria:** Affects checkout? (P1). Affects internal report? (P3).
5.  **Log Analysis (Deep Dive):** Look for error patterns.
    *   **Search:** `ERROR`, `FATAL`, `EXCEPTION`, `TIMEOUT`.
    *   **Trace ID:** Copy the error's Trace ID and search across all related services.

## Diagnostic Commands
*   **Network Path:** `mtr -r -c 10 <target_ip>` (Packet loss?).
*   **Kubernetes Events:** `kubectl get events --sort-by=.lastTimestamp` (Did an OOMKill occur? Eviction?).
*   **Log Grep:** `kubectl logs -l app=my-app --tail=200 | grep -i "error"`

## Example: Incident Report Template
```markdown
### Incident Summary
- **Severity:** P2
- **Service:** Order API
- **Impact:** 5% of orders failing
- **Root Cause (Hypothesis):** Database connection pool exhaustion
- **Action:** Restarting pods and increasing the pool size
```
