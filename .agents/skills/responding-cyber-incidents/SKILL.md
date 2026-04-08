---
name: responding-cyber-incidents
description: Forensic investigation and cyber incident response (IR) following NIST SP 800-61.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[incident/alert] [options]"
disable-model-invocation: true
---

# Cyber Incident Responder

This skill focuses on the containment and eradication of active threats.

## Instructions
1.  **Isolation (Containment):** Isolate the compromised host from the network.
    *   **K8s:** Cordon and drain the node, or delete the suspicious pod.
    *   **VM:** Apply a "Deny All" Security Group except for your origin.
2.  **Forensics (Identification):** Collect volatile evidence first (RAM -> Network -> Disk).
    *   **Process:** Identify strange processes (`ps aux --sort=-%cpu`).
    *   **Network:** Identify active connections (`ss -tunlp`).
    *   **Files:** Search for recently modified files (`find / -mtime -1`).
3.  **Log Analysis:**
    *   Look for attack patterns (SQLi, XSS, RCE) in access logs.
    *   Example: `grep -E "UNION SELECT|/etc/passwd" access.log`

## Common Tasks*   **Check Open Ports:** `netstat -tuln` or `ss -tuln`
*   **Check Active Connections:** `lsof -i -P -n | grep LISTEN`
*   **Analyze Auth Logs:**
    *   `grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr` (Top brute-force IPs).
*   **Check Crontab:** `crontab -l` and `ls /etc/cron.*` (Malware persistence).

## Best Practices
- **Chain of Custody:** Preserve original logs; work on copies.
- **Reference:** Consult the `triage-skill` for the initial triage protocol.
- **Post-Mortem:** Document everything for the final report (RCA).
