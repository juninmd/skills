# Tool Guards and Hooks

## Preflight
```bash
rg -n "execute|runCommand|callTool" src/ | head -20
rg -n "redact|sanitize|circuit" src/ | head -10
```

Prompts are not security barriers. An instruction like *"do not touch .env"* or *"never delete files"* fails when confronted with prompt injection, model confusion, or complex tool chains. Hard boundaries must be enforced by deterministic code interceptors around tool execution.

## The Interceptor Architecture

Place deterministic guards before and after every tool invocation:

```
[Agent Intent] → [Pre-Tool Guard] → (Blocked? → Return Tool Error)
                        ↓
                 [Tool Execution]
                        ↓
[Context Return] ← [Post-Tool Sanitizer] ← (Scrub Secrets / Truncate)
```

## Pre-Tool Gate Guards

Inspect tool arguments before invocation. Interceptors must fail closed: if verification throws, execution is aborted.

| Category | Guard Rule | Action on Violation |
|---|---|---|
| **Secret Paths** | Block `.env*`, `.git/`, `id_*`, `*.pem`, `*.key` | Return deterministic permission error; do not invoke tool |
| **Destructive Commands** | Block `rm -rf /`, `mkfs`, `git reset --hard`, `DROP DATABASE`, force-pushes | Require explicit interactive confirmation token or fail |
| **Path Traversal** | Sanitize and normalize relative paths (`..`, symlinks outside workspace) | Reject paths escaping project workspace root |
| **Network Boundaries** | Block private RFC1918 IPs, cloud metadata endpoints (`169.254.169.254`) | Reject unapproved host connections |

## Post-Tool Sanitizers & Circuit Breakers

Inspect tool outputs before appending them to the conversation context:

### 1. Secret Scrubber
Scan stdout, stderr, and file contents with regex patterns for high-entropy secrets (AWS keys, GitHub tokens, JWTs, private keys). Replace matches with `[REDACTED_SECRET]` before the string enters the model context. Leaked tokens in context invite hallucinated echoes and persistent exposure.

### 2. Token Budget Protection (Output Truncation)
Unbounded tool output (such as `npm test` or a giant log file) exhausts the agent's context window in a single turn. Cap raw output to a safe threshold (e.g. 50 KB or 200 lines). When output exceeds the limit, write the full output to a scratch file on disk and return a structured summary plus the file path.

### 3. Error Circuit Breaker (Thrash Guard)
Track error signatures across consecutive tool calls.
- If the agent executes the same failing tool command with identical arguments 3 times, trip the circuit breaker.
- Abort execution immediately and demand operator intervention or a strategy pivot. Never permit infinite retry loops that burn budget on a broken precondition.

## Workflow

1. **Define Security Boundaries**: Maintain an immutable list of sensitive paths, banned command patterns, and approved outbound networks.
2. **Implement Hook Middleware**: Wrap the tool dispatcher with synchronous pre-execution validators.
3. **Bind Execution Limits**: Enforce wall-clock timeouts on all child processes.
4. **Scrub and Truncate**: Filter results through the secret scrubber and output budget limiter.
5. **Update Circuit State**: Track tool outcomes to trip the loop on thrashing.

## Stop
- Relying on system prompt instructions to prevent tool misuse or credential access.
- Passing raw, unbounded stdout or logs containing secrets into model context.
- Continuing an automated loop after 3 consecutive identical tool failures.

## Rules
- Interceptors must run in host code, never as a subagent or LLM call.
- Pre-tool guards fail closed: any exception halts the tool call.
- Any redacting action must be logged as a security event without logging the secret value.

## Checklist
- [ ] Pre-tool path denylist protects secrets, keys, and git internals.
- [ ] Destructive commands blocked or requiring explicit elevation tokens.
- [ ] Secret scrubber active on tool return values.
- [ ] Output budget capped with disk-offload for oversized logs.
- [ ] Circuit breaker trips after 3 consecutive identical failures.
