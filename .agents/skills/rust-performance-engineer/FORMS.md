# Form Filling Guide: Rust Performance Engineer

## Profiling Request Form
To request a profiling session for a Rust project, provide the following:

| Field | Description | Example |
|-------|-------------|---------|
| Project Path | Absolute or relative path to the Rust project | "./my-rust-app" |
| Tool | Profiling tool to use | "cargo-flamegraph", "perf", "valgrind" |
| Target | The binary or example to profile | "my-binary", "--example demo" |
| Arguments | Command-line arguments for the target | "--input data.bin --threads 4" |

## Optimization Analysis Form
To analyze a specific piece of code for optimization:

| Field | Description | Example |
|-------|-------------|---------|
| Code Snippet | The Rust code to be analyzed | `pub fn process(data: &[u8]) { ... }` |
| Goal | Primary optimization goal | "execution speed", "memory footprint" |
| Context | Where this code is used and how often | "called in a tight loop during image processing" |
| Constraints | Any limitations (e.g., no `unsafe`, must stay on stable Rust) | "Must remain on stable Rust" |
