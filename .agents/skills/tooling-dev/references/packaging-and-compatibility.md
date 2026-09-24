# Signals, Atomic Writes, Piping, Packaging, and Deprecation

## Contents

- Signal Handling During Long Operations
- Atomic Writes: Never Ship a Partial File
- Stdin/Stdout Piping and TTY Detection
- Cross-Platform Paths and Newlines
- Packaging and Versioning a CLI
- Backward-Compatible Flag Deprecation

Open this when a tool needs to survive interruption, behave correctly in a
pipe, ship cross-platform, or change its interface without breaking callers.

## Signal Handling During Long Operations

`SIGINT` (Ctrl-C, 128+2=130) and `SIGTERM` (orchestrator shutdown, 128+15=143)
must stop work, clean up, and exit non-zero — never leave a partial file or a
zombie child process.

```js
let interrupted = false;
const cleanupAndExit = (signal) => {
  if (interrupted) process.exit(130); // second signal: stop waiting, exit now
  interrupted = true;
  process.stderr.write(`\nInterrupted (${signal}), cleaning up...\n`);
  fs.rmSync(tempPath, { force: true });
  process.exitCode = 130;
};
process.on('SIGINT', () => cleanupAndExit('SIGINT'));
process.on('SIGTERM', () => cleanupAndExit('SIGTERM'));
```

```python
import signal, sys

def handle_signal(signum, frame):
    cleanup()
    sys.exit(128 + signum)

signal.signal(signal.SIGINT, handle_signal)
signal.signal(signal.SIGTERM, handle_signal)
```

Honor a second signal by exiting immediately rather than hanging — a user
who presses Ctrl-C twice has already decided cleanup can be incomplete.
Propagate the signal to child processes explicitly; a subprocess spawned
with its own process group does not receive the parent's signal for free.

## Atomic Writes: Never Ship a Partial File

Write to a temporary path in the same filesystem (so the rename is atomic,
not a cross-device copy) and rename into place only on success.

```js
const tmp = `${destPath}.tmp-${process.pid}`;
fs.writeFileSync(tmp, content);
fs.renameSync(tmp, destPath); // atomic on POSIX and NTFS within one volume
```

A crash, `SIGKILL`, or disk-full error between `open` and `close` leaves the
temp file, never the real destination — a truncated artifact that looks
complete is worse than a missing one, because downstream tools have no
signal to distinguish "not built yet" from "built and broken."

## Stdin/Stdout Piping and TTY Detection

```js
const isTTY = process.stdout.isTTY;
const hasStdin = !process.stdin.isTTY; // data is being piped in
if (hasStdin && !argv.file) readFromStdin();
```

- When `stdin` is not a TTY, a tool that also accepts a `--file` flag should
  read stdin only when no file was given and stdin is not empty — do not
  block forever waiting for input nobody is sending.
- Emit human-formatted output (colors, tables, spinners) only when `stdout`
  is a TTY; emit machine-readable output (JSON, TSV) otherwise, or on an
  explicit `--json`/`--porcelain` flag that overrides detection either way.
- Handle `EPIPE` on `stdout` (the downstream reader, e.g. `head`, closed
  early) by exiting quietly with a non-error code — never a stack trace for
  a reader that simply stopped listening.
- Honor `NO_COLOR` and an explicit `--no-color` regardless of TTY detection;
  some CI systems present a pseudo-TTY that is not actually interactive.

## Cross-Platform Paths and Newlines

- Build paths with the platform's own separator (`path.join`, `os.path.join`,
  `pathlib`) — never string-concatenate `/`; Windows accepts `/` for reads
  but many tools and shells do not accept it for writes or display.
- Normalize line endings on read (`\r\n` → `\n`) before parsing structured
  text; write with the platform default or a documented, explicit choice —
  a generator that emits `\n` into a repo configured for `\r\n` churns every
  diff on Windows checkouts.
- Treat filesystem case-sensitivity as unknown: two paths differing only in
  case may or may not collide, depending on the host filesystem. Never rely
  on case to disambiguate two artifacts.
- Quote paths containing spaces in every shell invocation the tool
  generates; test with a path that has one, matching this repository's own
  convention of exercising space-containing paths in cross-platform scripts.

## Packaging and Versioning a CLI

- Follow semver for the tool's own version, independent of the libraries it
  bundles; a patch release must not change documented flag behavior.
- Pin the runtime and declare it (`engines` in `package.json`, a
  `requires-python` range) so an install fails loudly on an unsupported
  version instead of failing obscurely at first use.
- Smoke the **packaged** artifact before release: `npm pack` and install the
  tarball, or build the single-file binary and run it from a clean
  directory — the source tree's `node_modules` or virtualenv hides missing
  dependencies that the packaged form exposes.
- Ship shell completion (`--completion bash|zsh|fish`) generated from the
  same argument definitions the parser uses, so completions cannot drift
  from the flags that actually exist.
- Record the tool's own release the same way any other release ships —
  conventional commits, a version bump, a tag on a green SHA, and a
  changelog entry — see the `git-workflow` skill's
  [release procedure](../../git-workflow/references/release-management.md)
  for the full pre-tag gate.

## Backward-Compatible Flag Deprecation

1. Add the replacement flag or behavior first; keep the old one fully
   functional.
2. On use of the deprecated flag, print one line to stderr naming the
   replacement and the removal version — never to stdout, where it would
   corrupt machine-readable output.
3. Document both in `--help`, with the old one marked deprecated and the
   version it disappears in.
4. Remove only after the documented window elapses, in a release whose
   changelog calls out the breaking change explicitly (see Conventional
   Commits' `BREAKING CHANGE:` footer, covered in the `git-workflow` skill).
5. Never repurpose a removed flag name for something else — a script still
   passing the old flag should fail loudly (`EX_USAGE`), not silently do
   something unintended.
