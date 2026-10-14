# STRIDE Threat Modeling Walkthrough

A worked example of Adam Shostack's STRIDE method (*Threat Modeling: Designing for Security*) applied to a typical web application trust boundary. Use this before code exists, in a design review, or against an existing system before a security-sensitive change.

## When to run this

- A new component crosses a trust boundary: a new service, a new external integration, a new user-facing upload or webhook feature.
- Before `software-architecture` finalizes a data flow that a lower-trust principal can influence.
- As the first pass of a full audit ([audit-workflow.md](security-audit/audit-workflow.md)) when the system has no existing threat model to build on.

## Preflight

```bash
rg -n '(app\.(get|post|put|delete)|@(Get|Post|Put|Delete)|router\.)' -g '*.{ts,js,py}' | head -50
rg -n 'trust|boundary|internal|external' -g '*.md' docs/ 2>/dev/null
```

Draw the data flow diagram first. Shostack's core method is to model the system, not the code: processes, data stores, external entities, and every trust boundary between them. A STRIDE pass with no diagram degenerates into a checklist applied to code instead of to the design.

## Step 1: Draw the boundary

A typical three-tier web app has at minimum: browser (untrusted) -> load balancer/CDN -> application server (trusted, but receives untrusted input) -> database (trusted, receives only application-mediated input) -> third-party API (untrusted response data). Each arrow crossing a trust level is a boundary that needs its own STRIDE pass; boundaries inside one trust level are lower priority.

## Step 2: Apply STRIDE per element crossing a boundary

| STRIDE category | Violates | Applied to browser -> app | Applied to app -> third-party API |
|---|---|---|---|
| **Spoofing** | Authentication | Session token forgeable or replayable; missing `HttpOnly`/`Secure` on the session cookie | App impersonated by a compromised or MITM'd third party; TLS certificate not verified |
| **Tampering** | Integrity | Request body or hidden field modified client-side to escalate privilege (mass assignment) | Response body from the third party trusted without schema or signature validation |
| **Repudiation** | Non-repudiation | No audit log ties a state change to the authenticated identity that made it | No log of which upstream response version drove a decision, blocking incident reconstruction |
| **Information disclosure** | Confidentiality | Error responses leak stack traces, internal paths, or another tenant's data | Third-party API key or internal request details leaked in outbound logs or referrer headers |
| **Denial of service** | Availability | No rate limit or body-size cap on a public endpoint | No timeout or circuit breaker; a slow or hostile third party blocks the request thread pool |
| **Elevation of privilege** | Authorization | Authenticated low-privilege user reaches an admin action (see [api-authorization.md](api-authorization.md)) | Third-party webhook callback trusted as if it came from an authenticated internal caller |

## Step 3: Rank and route

Not every cell is a finding — most are already mitigated. Record only where the mitigation is missing or unverified, then route:

| Ranked as | Route to |
|---|---|
| Missing authentication or session control | This skill's `## Finding Decisions`; treat as blocking if reachable |
| Missing object or role authorization | [api-authorization.md](api-authorization.md) for the route-by-role matrix |
| Missing rate limit, timeout, or resource bound | `performance-engineering` for the fix, this skill for the finding |
| Missing audit logging on a state change | `observability` |
| Third-party trust assumption (webhook, callback, API response) | This skill; treat an unauthenticated webhook the same as unauthenticated user input |

## Common mistake

Running STRIDE against source code line-by-line instead of against the data-flow diagram finds the same injection and access-control bugs [ecosystem-checks.md](ecosystem-checks.md) and [api-authorization.md](api-authorization.md) already cover, and misses the boundary-level design gaps a diagram surfaces — a missing trust boundary between two internal services, a webhook treated as trusted because it "comes from our own infra." Model first, then trace code into the model.

## Stop

- No trust boundary can be drawn because the data flow is unknown: map it first, or hand reconnaissance to `starting-dev`.
- A STRIDE cell is marked mitigated with no evidence in code or config; treat it as unmitigated until shown.

## Checklist

- [ ] Data flow diagram drawn with every trust boundary marked.
- [ ] All six STRIDE categories applied to every boundary-crossing element, not just the obvious ones.
- [ ] Every unmitigated cell routed to the owning reference or skill.
- [ ] Third-party and webhook boundaries treated as untrusted input, not as internal trust.
