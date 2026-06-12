---
name: developing-rust
description: "Developing Rust for Implementing memory-safe, Managing Rust, Optimizing performance via cargo build."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Developing Rust

Expert methodology for writing idiomatic, safe, and efficient systems software using Rust's unique ownership model and robust toolchain.

**USE FOR:**
- Implementing memory-safe and thread-safe logic without a garbage collector.
- Managing Rust projects and dependencies using the Cargo toolchain.
- Optimizing performance through zero-cost abstractions and borrow-checker patterns.
- Enforcing code quality with `cargo clippy` and `cargo fmt`.
- Implementing structured error handling with `Result` and the `?` operator.

**DO NOT USE FOR:**
- Tasks better suited for high-level scripting or managed runtimes.
- Prototyping where memory safety and performance are not critical concerns.

**INVOKES:**
- `cargo build`, `cargo test`, `cargo clippy` commands.

## Methodology and Guidelines
Implementation details for ownership, borrowing, and toolchain usage are documented in:
- [Rust Development Best Practices](references/rust-best-practices.md)

## Core Principles
1. **Safety First:** Variables are immutable by default; use `mut` and `unsafe` sparingly and with documentation.
2. **Robustness:** Prefer explicit error propagation over panics or swallowing failures.
3. **Idiomaticity:** Address all Clippy warnings to align with Rust community standards.

## Checklist
- [ ] Model ownership and borrowing rules before adding shared mutable state.
- [ ] Run `cargo check` and the narrowest relevant tests after each change.
- [ ] Fix all clippy warnings before submitting code.
