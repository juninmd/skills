# Contract Testing Between Services

The "Contract" row in [SKILL.md](../SKILL.md)'s level table names the level;
this expands it into a routine, since a useful contract suite is a small
protocol, not just "write an integration test against the other service."

## Why Not Just End-to-End

A full end-to-end chain across two services proves the two versions deployed
together work, at the cost of standing up every dependency and failing for
reasons that have nothing to do with the API shape — a flaky third service, a
slow database, an unrelated outage. It also runs too late: the break is
discovered after both sides have already changed. A contract test isolates the
one thing that actually needs proving — does the provider's real response still
match what the consumer depends on — and runs fast, in each side's own CI,
without the other service present.

## Consumer-Driven Contracts

1. **Consumer writes the contract.** The consumer's own test suite records the
   exact requests it sends and the exact response shape it depends on, against a
   mock provider it controls.
2. **The contract is a fixture, not a guess.** Generate it from a real test run,
   never hand-write it from documentation, so it captures what the consumer
   actually reads — including fields it silently ignores and fields it does not.
3. **The provider replays it.** In the provider's own CI, a verification step
   sends each recorded request to the real provider code and diffs the real
   response against the contract.
4. **A broken contract fails the provider's build** before the incompatible
   version ships — not after the consumer's users see an error.
5. **Version the contract with the consumer.** A provider serving multiple
   consumer versions verifies against every contract still in use; retiring one
   is a deliberate step taken when that consumer upgrades.

## What It Does Not Replace

Contract tests prove the *shape* both sides agree on; they do not prove the
*system* — network topology, auth, timeouts, load — behaves correctly end to
end. Keep a small number of true end-to-end smoke tests for the critical path
(checkout, login) and let contract tests carry the combinatorial weight of every
other consumer/provider pair.

## Rules

- Generate the contract from a real consumer test, never by hand against
  documentation — a hand-written contract drifts from what the consumer
  actually calls.
- A contract failure blocks the provider's release; treat it as a hard gate,
  not an advisory report.
- Do not let contract-test coverage become an excuse to delete the last
  end-to-end smoke test on a critical journey.
