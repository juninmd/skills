---
name: optimizing-performance
description: Analisar aplicações em busca de gargalos de desempenho e implementar otimizações através de profiling e testes.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Performance Optimizer Skill

## Description
This skill enables the agent to analyze applications for performance bottlenecks and implement optimizations. It covers code profiling, database query optimization, resource usage analysis, and load testing.

## Workflow

### 1. Profile & Benchmark
- Establish a performance baseline using benchmarking tools.
- Profile the application to identify hot paths and slow functions (e.g., using `cProfile` for Python, Chrome DevTools for JS).
- Monitor system resources (CPU, memory, I/O) during execution.

### 2. Analyze Bottlenecks
- Examine profiling data to pinpoint specific lines of code or operations causing delays.
- Analyze database query execution plans for slow queries.
- Identify memory leaks or excessive object creation.

### 3. Optimize Code & Resources
- Refactor algorithms for better time/space complexity.
- Implement caching strategies (e.g., Redis, Memcached) to reduce database load.
- Optimize database indexes and schema.
- Concurrency and parallelism: Utilize multi-threading or async I/O where appropriate.

### 4. Verify Improvements
- Re-run benchmarks to measure the impact of changes.
- Ensure that optimizations do not introduce regressions or bugs.
- Compare metrics against the baseline.

## Best Practices
- **Measure First:** Never guess where the bottleneck is; always measure.
- **Premature Optimization:** Avoid optimizing code that is not critical to performance.
- **Realistic Data:** specific performance tests using data volumes similar to production.
