# Probe Contract

Status handling, retry policy, and the per-model record schema for a gateway conformance run.

## Status handling

| Class | Action |
| --- | --- |
| 2xx | Record `finish_reason`, the `tool_calls` count, and a preview truncated to about 1KB. |
| 4xx | Record a client or model incompatibility and move on. Never retry: it is a deterministic contract mismatch and retrying only burns quota. |
| 429 | Retry with jittered exponential backoff. Treat a sustained 429 as a pacing bug in the harness, not a model result. |
| 5xx, timeout, connection error | Retry with jittered exponential backoff, then record the last error. |

Cap retries at roughly 3 attempts. Jitter every delay so a degraded gateway is not stampeded by a synchronized retry wave.

## Concurrency and cost

- Send probes through a bounded worker pool (a handful of in-flight requests) with a delay between dispatches. An unthrottled sweep across a large catalog manufactures the 429s it is supposed to measure.
- Set a low `max_tokens` on every probe. The run only needs to know whether a tool call is emitted, not to read a completion.
- Keep a deny list of expensive model ids and apply it during name filtering, before any request is sent.

## Record schema

One JSON object per model, every field always present so reports diff cleanly:

```json
{
  "modelId": "vendor/model-name",
  "statusCode": 200,
  "ok": true,
  "tool_calls": 1,
  "malformed_tool_call": false,
  "finish_reason": "tool_calls",
  "attempts": 1,
  "preview": "…truncated to ~1KB…",
  "error": null
}
```

- `ok` reflects transport success only. A 2xx with `tool_calls` 0 is `ok` true and still not a pass.
- `malformed_tool_call` is true when the message content contains a JSON tool call emitted as text under a normal stop reason.
- Truncate `preview` before persisting. Never write the bearer token, request headers, or the full prompt into the report.

## Report

Write the array of records to a single JSON file, then print one line per model: id, status, tool call count, and malformed flag. The suite passes only when at least one model returned `tool_calls` above 0.
