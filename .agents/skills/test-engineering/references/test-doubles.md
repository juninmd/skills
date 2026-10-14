# Test Doubles and Test Smells

Vocabulary and anti-pattern recognition for what to fake, mock, or leave real. The
"Choosing the Level" table in [SKILL.md](../SKILL.md) picks the test level; this
picks what stands in for a collaborator once the level is picked.

## Vocabulary (Meszaros, *xUnit Test Patterns*)

| Double | Behavior | What it proves | Vitest/pytest equivalent |
|---|---|---|---|
| Dummy | Never actually exercised, only fills a required parameter | Nothing — it satisfies a signature | `null`, an empty placeholder object |
| Stub | Returns canned answers; the test never asserts on how it was called | The unit under test reacts correctly to given data | `vi.fn().mockReturnValue(...)`, a static fixture |
| Spy | Wraps a real or partial implementation and records calls for later inspection | The unit under test called through, with real side effects still happening | `vi.spyOn` |
| Mock | Pre-programmed with expectations; the test fails if the expected calls did not happen | An interaction occurred, in the right shape, the right number of times | `vi.fn()` + `toHaveBeenCalledWith` |
| Fake | A working, lighter real implementation (in-memory DB, in-memory queue) | Behavior that depends on state written earlier in the same test | a hand-written in-memory repository |

## When a Fake Beats a Mock

Mock the *interaction* when the collaborator has an externally visible side effect
the test must prove happened once and only once — charging a card, sending an
email, publishing an event. Reach for a fake when the collaborator has *state*
that a later step in the same test depends on — a repository, a cache, a queue —
because a mock can only assert that a call was made, never that the state those
calls should have produced is actually there; a fake exercises the write and the
read through the same real logic path. Freeman & Pryce (*Growing Object-Oriented
Software, Guided by Tests*) frame this as mocking roles you own at a collaboration
boundary and faking collaborators whose state the test needs to observe.

## Over-Mocking Couples Tests to Implementation

A test that mocks every collaborator of the unit under test stops testing
behavior and starts asserting that the implementation calls its dependencies in
the exact order and shape it already does — so a refactor that produces the same
externally visible result through a different call sequence breaks a passing
feature. Two tells in review: the test needed an update for a refactor that
changed no behavior, and a mock's `mockReturnValue` payload has to be kept in
lockstep with whatever the real collaborator would actually return. Reserve
mocks for the boundary of the system — network, clock, filesystem, third-party
APIs — and let the unit under test collaborate with the real, in-process objects
it owns.

## Anti-Patterns to Spot in Review

**Mystery guest** (Meszaros): the test's outcome depends on state the reader
cannot see in the test body — a row seeded by another test, a file left on disk,
an environment variable set three files away in a shared `beforeAll`. Fix: move
the dependency into the test's own arrange step, even when that means an
explicit builder call that looks repetitive next to a neighboring test.

**Fragile test** (Meszaros): the test breaks when unrelated production code
changes — a full-object snapshot that fails on an unrelated field, a mock
asserted with the exact argument list so any new optional parameter breaks every
caller's test, a CSS-selector chain that breaks on any restyle. Fix: assert only
the fields and behavior the test is actually about; use `toMatchObject` /
`objectContaining` for the field under test and ignore the rest.

Test interdependence (order dependence) is already covered in
[SKILL.md](../SKILL.md)'s Flake Attribution table — it is the same defect there,
not a separate one to fix twice.

## Test Data Builders vs Fixture Files

A static fixture file is fast to write and fine until the tenth test needs the
same object with one field different — the field that matters gets buried in
ninety lines of boilerplate the reader has to diff against the default. A test
data builder is a small fluent factory with sensible defaults, so each test
states only the field it cares about:

```ts
const order = anOrder().withStatus('refunded').withItems(0).build();
```

Freeman & Pryce document this as the standard way to keep test setup readable as
a domain object grows; reach for a builder once more than two or three tests
need variations of the same shape. Keep a plain fixture file for genuinely
static reference data — a currency list, a country-code table — that no test
varies.
