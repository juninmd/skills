# Argument Parsing and Exit Code Conventions

Open this when designing or debugging the flag surface, exit codes, or config
precedence of a CLI. Command Line Interface Guidelines (clig.dev) is the
tie-breaker for anything this file does not cover.

## Argument Parsing Edge Cases

| Case | Rule | Why it breaks otherwise |
|---|---|---|
| `--` end-of-options marker | Everything after it is positional, even if it looks like a flag | `rm -- --weird-file` must delete the file, not error on an unknown flag |
| Negative numbers as values | A numeric option consumes the next token even if it starts with `-`, or require `--limit=-5` | `sort --limit -5` is ambiguous between a flag and a value unless the parser knows `--limit` takes one |
| Repeated flags | Decide and document: last-wins (`--env=prod --env=dev` → dev) or accumulate (`-v -v -v` → verbosity 3, `--tag=a --tag=b` → `[a, b]`) | Silent overwrite of an accumulating flag is the kind of bug a user finds in production, not in review |
| Clustered short flags | `-abc` == `-a -b -c` only when none of them takes a value | A value-taking short flag inside a cluster (`-oabc`) is ambiguous; reserve clustering for boolean flags |
| `=` vs space for values | Support both `--env=prod` and `--env prod` | Scripts pick one convention; a tool that only accepts one breaks half its callers |
| Long-flag abbreviation | Disable auto-abbreviation (`--verb` matching `--verbose`) once the surface has more than a handful of flags, or pin the abbreviations explicitly | A second flag added later that shares the prefix silently breaks every script that relied on the shortcut |
| Unknown flag | Exit 2 and name the flag that was not recognized | "invalid option" with no name forces a re-read of the whole command line |
| Empty string vs absent | Treat `--tag=""` and no `--tag` as different states when the domain distinguishes them | A parser that collapses both to `undefined` cannot express "clear the tag" |

## Exit Codes: a Shared Vocabulary

A single `1` for every failure makes automation impossible — the caller
cannot script a retry for "the network died" differently from "you typed it
wrong". Borrow the BSD `sysexits.h` convention for the codes that recur across
tools instead of inventing a private numbering per project:

| Code | Name | Use |
|---|---|---|
| 0 | `EX_OK` | success |
| 1 | — | generic runtime failure, no more specific code applies |
| 2 | — | usage error: bad flag, missing required argument (conventional, not in `sysexits.h`) |
| 64 | `EX_USAGE` | command line usage error |
| 65 | `EX_DATAERR` | input data was incorrect |
| 66 | `EX_NOINPUT` | input file did not exist or was not readable |
| 69 | `EX_UNAVAILABLE` | a required service or resource was unavailable |
| 70 | `EX_SOFTWARE` | internal software error (a bug, not misuse) |
| 73 | `EX_CANTCREAT` | output file could not be created |
| 78 | `EX_CONFIG` | something was wrong with the configuration |
| 130 | — | interrupted by `SIGINT` (128 + signal number 2) |

Document the codes a tool actually uses in `--help`; a code with no documented
meaning is indistinguishable from `1` to every caller that scripts against it.
Version the meaning too — reassigning code 3 from "cache miss" to "auth
failure" between releases breaks every CI job that branches on it.

## Config Precedence: Diagnosing a Precedence Bug

The documented order is **flag → environment variable → project file → user
file → built-in default.** Most precedence bugs are not a wrong order; they
are one source silently missing from the resolution because of a typo in the
key name, a wrong search path, or a caching layer that read the value once.

```bash
mytool --print-config              # show the resolved value AND which source won
mytool --print-config --explain    # show every source that was checked, in order, with what it held
```

Implement `--print-config` before the bug report arrives — "why is it using
that value" is the most common support question a configurable tool
generates, and a resolved-value dump answers it without a debugging session.
When a value comes from an unexpected source, check in this order: the flag
name really matches the parser's definition (case, dashes vs underscores),
the environment variable name matches exactly (`MYTOOL_ENV` vs `MY_TOOL_ENV`),
the project file was discovered from the working directory the tool actually
ran in (not the directory a wrapper script assumed), and no earlier layer in
the process cached a stale read across a config reload.
