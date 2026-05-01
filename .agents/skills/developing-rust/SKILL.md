---
name: developing-rust
description: "Rust with ownership, safety, Cargo tooling. Triggers: rust, systems."
argument-hint: "[module/file] [options]"
---

# Developing Rust

## Concept
Rust is a systems programming language that guarantees memory safety and thread safety without a garbage collector, primarily through its ownership model. This skill outlines best practices for writing idiomatic, safe, and performant Rust code.

## Guidelines
1. **Embrace Ownership and Borrowing:**
   - Understand the rules of ownership: each value has a single owner, values are dropped when the owner goes out of scope.
   - Prefer borrowing (`&T` or `&mut T`) over cloning or taking ownership unless necessary.
   - Avoid `clone()` in performance-critical paths unless explicitly required to bypass borrow checker constraints.
2. **Error Handling:**
   - Use `Result<T, E>` for recoverable errors. Never use `unwrap()` or `expect()` in production code unless you can absolutely guarantee the operation will never fail.
   - Use the `?` operator to propagate errors ergonomically.
   - Consider crates like `anyhow` for application-level error handling and `thiserror` for library-level custom errors.
3. **Immutability by Default:**
   - Variables are immutable by default. Only use `mut` when a variable must be changed. This reduces side effects and reasoning complexity.
4. **Tooling (Cargo):**
   - Use `cargo fmt` to format code automatically.
   - Use `cargo clippy` to catch common mistakes and improve idiomatic Rust usage. Address all clippy warnings.
   - Manage dependencies using `cargo add` and keep `Cargo.toml` well-structured.
5. **Testing:**
   - Write inline unit tests in the same file as the code they test using `#[cfg(test)]` modules.
   - Place integration tests in the `tests/` directory at the project root.
   - Use `cargo test` to run all tests.

## Common Cargo Commands
- **New Project:** `cargo new project_name`
- **Build:** `cargo build` (use `--release` for production builds)
- **Run:** `cargo run`
- **Test:** `cargo test`
- **Format:** `cargo fmt`
- **Lint:** `cargo clippy`

## Execution
- When modifying Rust code, ensure it compiles (`cargo check`).
- Address all compiler warnings and clippy lints.
- Run tests (`cargo test`) to ensure no regressions.

## Checklist

- [ ] Model ownership and borrowing rules before adding shared mutable state.
- [ ] Run `cargo check` and the narrowest relevant tests after each change.
- [ ] Fix clippy warnings when they expose correctness or maintainability problems.

## References

- [The Rust Programming Language](https://doc.rust-lang.org/book/)
- [The Cargo Book](https://doc.rust-lang.org/cargo/)
