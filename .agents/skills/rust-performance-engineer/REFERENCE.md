# Reference: Rust Performance Tools and Techniques

## Profiling Tools
- **cargo-flamegraph:** Easy-to-use flamegraph generator for Rust projects.
  - [Repository](https://github.com/flamegraph-rs/flamegraph)
- **perf:** Linux profiler for performance counter analysis and call graph visualization.
- **valgrind (DHAT/Massif):** Tools for memory profiling and heap analysis.

## Benchmarking
- **Criterion.rs:** Statistics-driven micro-benchmarking library for Rust.
  - [Documentation](https://bheisler.github.io/criterion.rs/book/index.html)

## Optimization Techniques
- **Zero-cost Abstractions:** Using traits and generics that compile down to efficient code.
- **SIMD:** Using the `std::arch` module for manual SIMD or crates like `packed_simd`.
- **Memory Management:**
  - `Box`, `Rc`, `Arc`: Understanding the overhead of smart pointers.
  - `SmallVec`: Stack-allocated vectors for small numbers of elements.
  - `Arena Allocation`: Using crates like `typed-arena` or `bumpalo`.

## Resources
- [The Rust Performance Book](https://nnethercote.github.io/perf-book/)
- [Rust Assembly Exploration](https://rust.godbolt.org/)
