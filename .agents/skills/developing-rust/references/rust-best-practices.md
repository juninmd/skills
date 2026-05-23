# Rust Development Best Practices

Guidelines for writing idiomatic, safe, and performant Rust code.

## 1. Ownership and Borrowing
- **Borrow First:** Prefer borrowing (`&T` or `&mut T`) over cloning or taking ownership.
- **Rules:** Each value has a single owner; values are dropped when the owner goes out of scope.
- **Avoid Clones:** Avoid `.clone()` in performance-critical paths unless necessary for the borrow checker.

## 2. Error Handling
- **Result:** Use `Result<T, E>` for recoverable errors; use `?` for propagation.
- **No Unwraps:** Avoid `unwrap()` or `expect()` in production code.
- **Crates:** Use `anyhow` for applications and `thiserror` for library custom errors.

## 3. Tooling and Commands
- **Check:** `cargo check` (fast compilation check).
- **Format:** `cargo fmt` (automatic formatting).
- **Lint:** `cargo clippy` (must-address lints for idiomatic usage).
- **Test:** `cargo test` (runs inline `#[cfg(test)]` and `tests/` integration tests).
- **Commands:** `cargo new`, `cargo build --release`, `cargo run`.

## References
- [The Rust Programming Language](https://doc.rust-lang.org/book/)
- [The Cargo Book](https://doc.rust-lang.org/cargo/)
