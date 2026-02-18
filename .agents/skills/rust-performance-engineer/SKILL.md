---
name: rust-performance-engineer
description: Optimize Rust code performance through profiling, memory analysis, and advanced low-level techniques
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Skill: Rust Performance Engineer

## Description
This skill focuses on low-level optimization of Rust code. It involves analyzing performance bottlenecks, utilizing profiling tools, and applying advanced Rust techniques to improve execution speed, reduce memory usage, and optimize resource utilization.

## Capabilities
- Profile Rust applications using tools like `cargo flamegraph`, `perf`, or `valgrind`.
- Analyze assembly output using `cargo-show-asm` or Compiler Explorer.
- Implement zero-cost abstractions and minimize heap allocations.
- Utilize SIMD (Single Instruction, Multiple Data) instructions for parallel processing.
- Optimize memory layout with `#[repr(C)]`, `#[repr(packed)]`, and careful struct design.
- Implement custom allocators or use arena allocation for specific performance needs.
- Leverage asynchronous programming with `tokio` or `async-std` for I/O-bound tasks.

## Usage
1. **Profiling:** Identify bottlenecks by running profiling tools on the target application.
2. **Analysis:** Examine the hot paths and identify opportunities for optimization (e.g., unnecessary allocations, cache misses).
3. **Refactoring:** Apply Rust-specific performance optimizations such as using `SmallVec`, avoiding `Clone`, or using `Cow`.
4. **Verification:** Re-run benchmarks and profiles to ensure the changes resulted in actual performance gains without introducing regressions.

## Constraints
- Always prioritize safety and maintainability unless the performance requirement is extreme.
- Use `unsafe` sparingly and only when it provides a significant and measurable performance benefit.
- Benchmarking should be done in a controlled environment to ensure consistent results.
