---
name: performance-profiling
description: "Performance Profiling for Generating CPU, Identifying hot, Detecting memory via diagnosing-bugs, frontend-craftsmanship."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Performance Profiling

Expert guidance for identifying and eliminating performance bottlenecks using runtime profiling, flame graphs, and trace analysis.

**USE FOR:**
- Generating CPU and memory flame graphs (Node.js, Python, Go, Rust).
- Identifying hot functions consuming most CPU time.
- Detecting memory leaks and heap bloat.
- Analyzing request latency with distributed tracing.
- Measuring garbage collection impact.
- Profiling under realistic load (staging environment).
- Validating optimizations before and after.
- Finding N+1 database queries, missing indices, or inefficient algorithms.

**DO NOT USE FOR:**
- Frontend visual performance (use `frontend-craftsmanship`).
- Query optimization (use `administrating-databases`).
- Code style improvements (use `applying-clean-code`).

**INVOKES:**
- `diagnosing-bugs` for debugging performance regressions.
- `frontend-craftsmanship` for web vitals validation.
- `developing-tooling` for custom profiling tools.

## Profiling Workflow

1. **Establish Baseline**
   - Measure current performance under realistic conditions.
   - Record metrics: CPU, memory, latency, GC pause times.
   - Compare against SLA/target.

2. **Profile Under Load**
   - Use production-like data volumes and concurrency.
   - Generate flame graph: identify top functions by CPU time.
   - Track memory allocation: where is memory being consumed?

3. **Identify Bottleneck**
   - Locate hot function (>10% CPU, top of flame graph).
   - Check for algorithmic inefficiency (O(n²) where O(n) is possible).
   - Look for repeated allocations, unnecessary work, or I/O blocking.

4. **Optimize**
   - Change algorithm, cache, batch requests, reduce allocations.
   - Measure impact with profiler; validate improvement.
   - If <2% improvement, consider diminishing returns.

5. **Validate at Scale**
   - Re-profile with new implementation.
   - Compare flame graph before/after.
   - Verify no regression in other metrics (memory, latency p99).

## Tools by Language

- **Node.js:** `node --prof`, `clinic.js`, `0x`, Chrome DevTools.
- **Python:** `cProfile`, `py-spy`, `memory_profiler`.
- **Go:** `pprof` (CPU, memory, goroutines).
- **Rust:** `perf`, `flamegraph`, `cargo-flamegraph`.

## Red Flags

- Hot function doing string concatenation in a loop.
- Unbounded map/dictionary (grows indefinitely).
- Recursive function without memoization.
- Blocking I/O in event loop (Node.js).
- N+1 queries: loop with inner DB call.
- GC pause times >100ms in production.

## Checklist

- [ ] Baseline metrics established for current performance.
- [ ] Flame graph generated under realistic load; hot functions identified.
- [ ] Memory heap snapshot analyzed; no obvious leaks.
- [ ] GC pause times acceptable (<100ms for most apps).
- [ ] Database queries are efficient (no N+1, proper indices).
- [ ] Optimizations validated: measured improvement >5% or clarified why skipped.
- [ ] Load tested: performance stable under expected concurrency.
- [ ] Monitoring alerts configured for performance regressions.
