# Security Operations Real-World Cases

Use this first for security findings, hardening work, and incident-adjacent changes.

## Secret Exposure
- Stop printing evidence once a value is confirmed sensitive.
- Record only type, location, commit/path, exposure channel, and redacted proof.
- Rotate or revoke before history cleanup.
- Add scanner regression and verify the replacement path uses environment or secret-manager delivery.

## Dependency CVE
- Confirm reachable package, vulnerable version, exploit preconditions, and whether the code path is exposed.
- Prefer patch/minor upgrade that preserves lockfile scope.
- Run affected tests plus startup/build smoke.
- If no fix exists, isolate, disable, or add compensating controls and expiration.

## Auth or Tenant Boundary
- Trace identity source, authorization decision, object ownership, cache keys, logs, and downstream calls.
- Test same-tenant allowed, cross-tenant denied, missing auth, low-privilege role, and stale session.
- Fail closed on unknown identity or policy errors.

## CI or Pipeline Hardening
- Pin actions/images where supported, reduce token permissions, and isolate untrusted PR input.
- Treat workflow commands, artifact paths, cache keys, and shell interpolation as injection surfaces.
- Prove hardening with static scan and a harmless negative test when possible.
