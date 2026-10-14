# Decision Records, Dependency Vetting, and Boring Technology

## Contents

- ADR Structure
- Evaluating Maintenance Signal
- License Compatibility Check
- Cost of Migration vs. Cost of Staying
- Boring Technology
- Justifying a Deviation from Repo Defaults

Open this before adopting a dependency, replacing an incumbent, or writing
up a deviation from the Defaults table. It does not repeat why each default
holds — see [stack rationale](stack-rationale.md) for that.

## ADR Structure

Follow Michael Nygard's architecture decision record pattern: a short,
immutable document per significant decision, checked into the repository
next to the code it governs.

| Section | Content |
|---|---|
| Title | The decision in one line: "Use pgvector for embedding search" |
| Status | Proposed, accepted, or superseded (by which later ADR) |
| Context | The forces at play: constraints, the problem, what triggered the decision now |
| Decision | The option chosen, stated as a decision, not a description of the options |
| Consequences | What becomes easier and what becomes harder; the tradeoffs accepted |
| Reversal trigger | The specific, observable condition that would reopen this decision |

The reversal trigger is this skill's addition to Nygard's pattern: without it,
the next team inherits a rule with no expiry and either follows it forever
out of caution or discards it without knowing why it existed. "Revisit if
p99 query latency exceeds 200ms" is a trigger; "revisit if it stops working
well" is not.

ThoughtWorks' Technology Radar classifies a candidate into four rings —
Adopt, Trial, Assess, Hold — which is a useful complement to the ADR when the
question is "is this even mature enough to bet on" rather than "which of two
mature options fits." Treat "Assess" as "read about it, do not put it on the
critical path yet," and "Hold" as a reason to state explicitly in the ADR's
Context section if a stakeholder proposes it anyway.

## Evaluating Maintenance Signal

Before adding a dependency, check signals that predict whether it will still
be maintained in a year — not just whether it works today.

| Signal | What it means | Action |
|---|---|---|
| Release cadence stalled 12–18+ months | Maintenance may have stopped | Pin the version, plan an exit, do not build new critical-path code on it |
| Single maintainer (bus factor 1) | One person's availability is a project risk | Acceptable for a low-stakes utility; avoid or budget for forking on the critical path |
| Open, unpatched CVEs | Supply-chain risk already identified | Block adoption until patched, or accept the specific risk explicitly in the ADR |
| Issue/PR response latency measured in months | Community or maintainer capacity is thin | Weigh against a less popular but more responsive alternative |
| Breaking major releases every few months | Upgrade cost will recur | Budget for it, or prefer a project with a stated stability policy |

`github.com`'s own signals (contributor graph, last release date, open
security advisories) and the registry's own audit command (`npm audit`,
`pip-audit`, `cargo audit`) are enough for most checks; a formal SBOM scan is
`security-ops` territory once a dependency is already in the critical path.

## License Compatibility Check

| License family | Typical terms | Risk for a proprietary SaaS product |
|---|---|---|
| MIT, BSD, Apache-2.0 | Permissive, attribution only | None; safe default |
| MPL-2.0 | File-level copyleft | Safe if modified files are kept separate from proprietary files |
| LGPL | Copyleft on the library itself | Safe via dynamic linking; risky if statically linked into a distributed binary |
| GPL | Copyleft on derivative works | Flag for legal review before embedding in anything distributed; internal-only SaaS use is commonly treated as not "distribution," but this is a legal judgment, not an engineering one |
| AGPL | Network use counts as distribution | Blocks embedding in a SaaS product without releasing the combined source — treat as a `security-ops`/legal veto until reviewed |
| No license file | No granted rights at all | Do not depend on it; the absence of a license is not permission |

License review is not optional for a dependency that ships to customers or
runs a revenue-generating service; treat an unresolved license question the
same as an unresolved CVE — it blocks adoption, it does not get "checked
later."

## Cost of Migration vs. Cost of Staying

A replacement decision is a comparison of two slopes, not two snapshots:

- **Cost of staying** grows over time — security patch lag, harder hiring
  for a shrinking-community tool, missing features the team builds around
  instead of getting for free, and the compounding interest of workarounds.
- **Cost of migrating** is mostly one-time — rewrite surface area, team
  retraining, the downtime or dual-write period during cutover, and the
  rollback plan if it fails partway.

Migrate when the staying-cost slope crosses the migration's one-time cost
within a bounded horizon the team can defend (commonly 12–24 months) — not
on the strength of a preference for the newer option. State the horizon and
the crossing estimate in the ADR; "it feels slower" is not a horizon.

## Boring Technology

Dan McKinley's essay "Choose Boring Technology" frames engineering choice as
a budget: a team has a small number of "innovation tokens" to spend on
technology that is genuinely new to them, and every token spent on
infrastructure (the database, the queue, the language runtime) is a token
not available for the part of the product that actually differentiates it.
Boring does not mean bad — it means well understood, with known failure
modes and an available on-call runbook. Spend the team's innovation tokens
on the problem the business is actually betting on; default to the boring,
well-understood option everywhere else, which is why the Defaults table in
`SKILL.md` favors PostgreSQL, Redis, and mature ORMs over newer alternatives
with a thinner operational track record.

## Justifying a Deviation from Repo Defaults

A deviation from the Defaults table needs the same ADR shape as any other
decision, with one addition: name the specific default row being overridden
and the constraint that beats it (platform, hosting, team skill, a pinned
dependency, a license conflict — see the Workflow section in `SKILL.md`).
"We prefer X" is a preference, not a constraint, and does not clear the bar
that a working incumbent already met.
