# Specialized Skills

Skills for specific domains and niche engineering tasks.

## `implementing-accessibility`

**Invoke:** `/implementing-accessibility`

Web accessibility (a11y) standards and auditing.

**Standards:** WCAG 2.2 AA compliance.

**Covers:** semantic HTML, ARIA roles and attributes, keyboard navigation, focus management, screen reader testing (NVDA, VoiceOver), color contrast (4.5:1 minimum), reduced motion, form labels and error messages, skip navigation links.

**Testing:** axe-core, Lighthouse accessibility audit, manual keyboard testing checklist.

---

## `diagnosing-networks`

**Invoke:** `/diagnosing-networks`

Network troubleshooting: DNS, HTTP, and connectivity.

**Tools and techniques:**
- DNS: `dig`, `nslookup`, TTL inspection, authoritative vs recursive resolution
- HTTP: `curl -v`, response headers, TLS certificate inspection (`openssl s_client`)
- Connectivity: `ping`, `traceroute`, `mtr`, port scanning (`nmap`)
- Load balancer: health check diagnosis, session affinity issues
- Firewall: iptables rules inspection, security group review

---

## `diagnosing-rabbitmq`

**Invoke:** `/diagnosing-rabbitmq`

RabbitMQ queue diagnosis, consumer health, and dead letter queues.

**Covers:** queue inspection via Management API, consumer count and utilization, message rates (publish/deliver/ack), unacknowledged message buildup, DLQ routing configuration, shovel and federation plugin diagnosis, memory and disk alarms.

---

## `firebase-apk-scanner`

**Invoke:** `/firebase-apk-scanner`

APK security misconfiguration scanning.

**Detects:**
- Firebase database URLs exposed in APK resources
- Overly permissive Firebase Security Rules
- API keys hardcoded in strings.xml or BuildConfig
- Google Cloud credentials in APK assets
- Debug flags left enabled in release builds

---

## `trailmark-summary`

**Invoke:** `/trailmark-summary`

Quick codebase summary: language, entry points, and dependency graph.

**Output:**
- Primary language and framework detected
- Entry points (main files, index files)
- Key dependency graph (top-level imports)
- Build tool and test runner identification
- Estimated complexity (lines of code, file count)

**Use when:** onboarding to an unfamiliar codebase, before a code review, or to orient an agent in a new repository.

---

## `vscode-auto-update`

**Invoke:** `/vscode-auto-update`

Auto-update VS Code on Debian/Ubuntu Linux.

**Covers:** downloading the latest `.deb` from the official VS Code feed, verifying the GPG signature, installing with `dpkg`, and setting up a cron job or `apt` repository for automatic future updates.

---

## `using-superpowers`

**Invoke:** `/using-superpowers`

Skill discovery — find which skill applies to a task.

Use this when you're unsure which skill to invoke, or to get an overview of all available skills and their trigger keywords.

---

## `caveman`

**Invoke:** `/caveman`

Respond tersely like a smart caveman. Substance over fluff.

Use when you want the assistant to skip preambles, explanations, and caveats — and just give the direct answer or code.
