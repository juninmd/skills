# pytest, Property-Based, and Mutation Testing

Covers the three areas the JS-runner references do not.

## pytest

- Test discovery: files `test_*.py`, functions `test_*`, classes `Test*` with no `__init__`.
- Assertions are plain `assert`; pytest rewrites them to show operand values. Do not wrap in helper asserts that hide the expression.
- Fixtures replace setup/teardown. Yield-style fixtures clean up after the yield:

```python
@pytest.fixture
def db(tmp_path):
    conn = connect(tmp_path / "test.db")
    yield conn
    conn.close()
```

- Scope (`function`, `class`, `module`, `session`) controls reuse. A session-scoped fixture that holds mutable state is a cross-test leak; keep shared fixtures immutable or make them per-function.
- `conftest.py` shares fixtures down the directory tree; nearest file wins.
- Parametrize instead of looping so each case reports separately:

```python
@pytest.mark.parametrize("value,expected", [(0, "zero"), (-1, "negative")])
def test_label(value, expected):
    assert label(value) == expected
```

- `pytest.raises(ValueError, match="...")` asserts the failure and its message. Bare `pytest.raises(Exception)` passes on the wrong bug.
- Useful flags: `-x` stop on first failure, `-k` name filter, `-q`, `--lf` last failed, `-p no:randomly` when ordering matters, `--durations=10` for slow tests.
- Async: `pytest-asyncio` with `@pytest.mark.asyncio`, or `anyio`. Mixing both plugins in one suite causes event-loop conflicts.
- Monkeypatching: `monkeypatch.setenv`, `monkeypatch.setattr`, `monkeypatch.chdir` all revert automatically; manual `os.environ` edits do not.

## Property-Based Testing

Assert an invariant over generated inputs instead of picked examples. The framework shrinks a failure to a minimal reproducing case.

- Python: Hypothesis (`@given(st.integers())`). JS/TS: fast-check. JVM: jqwik.
- Good properties: round-trip (`decode(encode(x)) == x`), invariants (a sort's output is a permutation and is ordered), oracle comparison against a slow reference implementation, idempotence (`f(f(x)) == f(x)`), and metamorphic relations.
- Constrain the generator to the real domain rather than filtering heavily; heavy filtering starves the run.
- Record every shrunk counterexample as an explicit regression test. Property tests are non-deterministic by design; the pinned example is what stops the bug returning.
- Set an explicit seed and example count in CI so a failure is reproducible, and store the failure database if the framework offers one.

## Mutation Testing

Mutation testing changes the code (flip a comparison, drop a call, swap a constant) and re-runs the suite. A mutant that survives is a line covered by tests that no assertion actually checks.

- Tools: `mutmut` or `cosmic-ray` (Python), Stryker (JS/TS, .NET, JVM), PIT (JVM).
- Read mutation score as assertion strength, not as a target to maximize. It complements line coverage, which only proves execution.
- Cost is high: mutants multiply by test runtime. Scope runs to changed files or to the modules where correctness matters, and run them nightly rather than per commit.
- Triage survivors: strengthen the assertion, delete the untested branch, or mark it equivalent with a reason. Do not silence the tool globally.
