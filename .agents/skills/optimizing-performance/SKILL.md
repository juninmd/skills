---
name: optimizing-performance
description: Analyze applications for performance bottlenecks and implement optimizations through profiling and testing.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Performance Optimizer

## Description
This skill enables the agent to analyze applications for performance bottlenecks and implement optimizations. It covers code profiling, query optimization, resource usage analysis, and load testing.

## Flow

### 1. Profiling and Benchmarking
- Establish a performance baseline with benchmarking tools.
- Perform profiling to identify hot paths and slow functions (e.g., `cProfile` for Python, Chrome DevTools for JS).
- Monitor system resources (CPU, memory, I/O) during execution.

### 2. Bottleneck Analysis
- Examine profiling data to locate lines/operations causing delays.
- Analyze execution plans for slow queries.
- Identify memory leaks and excessive object creation.

### 3. Code and Resource Optimization
- Refactor algorithms for better time/space complexity.
- Implement caching strategies (e.g., Redis, Memcached) to reduce database load.
- Optimize database indices and schema.
- Use concurrency and parallelism (multi-threading or async I/O) where appropriate.

### 4. Verification of Improvements
- Rerun benchmarks to measure the impact of changes.
- Ensure that optimizations do not introduce regressions or bugs.
- Compare metrics against the baseline.

## Best Practices
- **Measure First:** Never assume where the bottleneck is; always measure.
- **Premature Optimization:** Avoid optimizing code that is not critical for performance.
- **Realistic Data:** Run tests with volumes close to production.

