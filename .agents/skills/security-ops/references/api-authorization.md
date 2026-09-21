# API Authorization Review

Procedure for proving that every route enforces the access control it claims. Broken object-level authorization is the most common exploitable API defect and static review alone does not find it — the matrix below is the deliverable.

## 1. Enumerate every route

Build the list from the code, not from the documentation. Documentation omits the routes that leak.

- Framework routers: grep for the decorators or registration calls (`@Get`/`@Post`, `app.get`, `router.*`, `@app.route`, `[HttpGet]`, `MapGet`).
- Include what the router mounts implicitly: health and metrics endpoints, admin panels, file upload and download handlers, webhook receivers, GraphQL resolvers and mutations, WebSocket message types, static file mounts, and any framework-generated CRUD.
- Include non-HTTP entry points that carry the same authorization burden: queue consumers, scheduled jobs acting on user data, and server actions.

Record for each: method, path, handler, and the parameters that name a resource.

## 2. Classify each route

Mark each as public, authenticated, or role-restricted, and write down which rule enforces it: a global guard, a per-route decorator, or an in-handler check. A route whose classification you cannot point to in code is unclassified, which in practice means public.

Watch for the two silent failures:
- A global authentication guard with an allowlist that grew until it covers the interesting routes.
- A guard registered on a router that a later `use()` or mount bypasses.

## 3. Ownership checks

For every route taking a resource identifier from the path, query string, or body, find the check that ties that resource to the caller. The correct pattern scopes the lookup:

```
// broken: authenticated, but any user can read any invoice
const invoice = await repo.findById(params.id);

// correct: ownership is part of the query
const invoice = await repo.findOne({ id: params.id, ownerId: session.userId });
```

Also check:
- Nested resources (`/orgs/:orgId/projects/:id`) — the parent link must be verified, not assumed from the path.
- Mass assignment: a body field like `ownerId`, `role`, or `tenantId` that the handler passes straight into an update.
- Sequential or guessable identifiers, which turn a missing check into trivial enumeration.
- Cache keys, log lines, and downstream service calls that carry the resource but drop the identity.
- Filtered list endpoints: the filter must be applied server-side from the session, never taken from the request.

## 4. The route-by-role matrix

This is the artifact the review produces. One row per route, one column per identity class, each cell the *expected* status, then filled with the *observed* status from a real call.

Identity classes, at minimum: no credential, expired or tampered token, valid user who owns the resource, valid user who does not own it (second account, same tenant), valid user in another tenant, low-privilege role, admin role.

| Route | none | expired | owner | other user | other tenant | low role | admin |
|---|---|---|---|---|---|---|---|
| `GET /invoices/:id` | 401 | 401 | 200 | 404 | 404 | 200 | 200 |
| `DELETE /invoices/:id` | 401 | 401 | 204 | 403 | 404 | 403 | 204 |

Rules for filling it:
- Test by *calling the endpoint*, not by reading the guard. Credential testing is the point.
- Prefer 404 over 403 for resources the caller must not know exist; be consistent, because the difference is itself an enumeration oracle.
- Any cell where observed differs from expected is a finding. An unexpected 200 is critical.
- A tampered or expired token must fail closed; so must an unknown identity or a policy-service error.
- Re-run the matrix rows touched by a change as a regression check, in CI where possible.

## 5. Report

Per finding: route, identity class that succeeded, what it reached, the missing control, and the fix. Blocking severity applies when an unauthorized identity read or wrote data it does not own.

## Authn vs authz confusion

Both failures look identical from outside — a request that should have been rejected succeeds — but the fix lands in a different layer.

| Symptom | Likely cause | Fix |
|---|---|---|
| Unauthenticated request reaches a handler that assumes a session exists | Missing or misconfigured authentication guard on the route or router mount | Add or fix the guard; fail closed on a missing or invalid credential |
| Authenticated, valid user reaches or modifies another user's resource (IDOR) | Authentication succeeded but no object-level authorization ties the resource to the caller | Scope the lookup by caller identity, per Section 3, not just by the resource ID in the request |
| Low-privilege role reaches an admin-only action | Route checks "is authenticated" but not "has role/permission X" | Add the role/permission check at the same layer as authentication, not deeper in business logic |
| A body field (`role`, `ownerId`, `tenantId`) silently changes what the caller may do | Mass assignment: the handler trusts a field the permission system was meant to control | Strip or explicitly allow-list writable fields; never let the caller set their own authorization-relevant fields |
| A cross-tenant read succeeds only through a secondary path (cache key, log lookup, webhook replay) | Authorization enforced on the primary route but not on every path reaching the same data | Enforce the ownership check at the data-access layer, not per-route |

CWE separates the two failures: [CWE-287](https://cwe.mitre.org/data/definitions/287.html) is improper authentication; [CWE-863](https://cwe.mitre.org/data/definitions/863.html) and [CWE-639](https://cwe.mitre.org/data/definitions/639.html) are incorrect or missing authorization, including IDOR. A finding that names the wrong one sends the fix to the wrong layer.
