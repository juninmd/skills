---
name: diagnosing-networks
description: "Network & Diagnostics for Inspecting HTTP/HTTPS, Analyzing SSL/TLS, Diagnosing DNS via curl."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file]
---

# Network & Diagnostics

Expert methodology for debugging service connectivity, API endpoints, and infrastructure issues using CLI tools.

**USE FOR:**
- Inspecting HTTP/HTTPS requests with `curl`.
- Analyzing SSL/TLS validity with `openssl`.
- Diagnosing DNS issues with `dig` or `nslookup`.
- Testing port accessibility and latency with `nc` and `ping`.
- Investigating network routes with `traceroute`.

**DO NOT USE FOR:**
- Debugging internal application logic.
- Managing cloud resources without CLI access.

**INVOKES:**
- `curl`, `openssl`, `dig`, `ping`, `nc` commands.

## Methodology and Guidelines
Refer to these modules:
1. [Connectivity/DNS](references/network-connectivity.md) | [HTTP/SSL](references/network-http-ssl.md)
2. [Performance/Traffic](references/network-performance.md) | [Troubleshooting](references/network-troubleshooting.md)

## Core Principles
1. **Hop Identification:** Isolate layer (DNS -> TCP -> TLS -> HTTP).
2. **Reproducibility:** Capture exact commands and timestamps.
3. **Safety:** No insecure flags (e.g., `curl -k`) in production.

## Checklist
- [ ] Identify failing hop before changing configurations.
- [ ] Capture exact command output for the report.
- [ ] Verify fix using the tool that identified the failure.
