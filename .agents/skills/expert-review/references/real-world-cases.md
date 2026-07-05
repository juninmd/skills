# Expert Review Real-World Cases

Use this first when reviewing code, plans, specs, or operational changes.

## Pull Request
- Read the diff, touched call paths, tests, migrations/config, and user-facing contract.
- Prioritize correctness, security, data loss, backward compatibility, concurrency, and operability.
- For each finding, include file/line, impact, evidence, and minimal fix.
- Do not report style unless it hides a defect or violates a local gate.

## Plan or Architecture
- Check whether success criteria, rollback, observability, migration order, and ownership are explicit.
- Identify hidden coupling, impossible sequencing, untested assumptions, and operational blast radius.
- Separate blockers from refinements; push for smaller reversible steps when risk is high.

## Security-Sensitive Change
- Trace secrets, tokens, auth decisions, tenant boundaries, logs, CI permissions, and third-party calls.
- Treat missing negative tests as risk when auth, money, identity, data deletion, or external writes are involved.

## No Findings
- State that no confirmed defects were found.
- Still report unverified areas, skipped commands, and residual risk.
