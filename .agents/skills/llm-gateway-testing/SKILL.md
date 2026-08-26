---
name: llm-gateway-testing
description: |
  Conformance-test tool calling across every model on an OpenAI-compatible LLM gateway. Use for auditing which models emit tool calls, catching regressions after a gateway upgrade, screening a new model catalog, and triaging 4xx/429/5xx responses.
---

# LLM Gateway Testing

## Preflight
Abort loudly on any failure here. A sweep started against a misconfigured gateway spends money to learn nothing.

```bash
: "${OPENAI_BASE_URL:?set the gateway base URL}"
: "${OPENAI_API_KEY:?set the API key}"
curl -sS -H "Authorization: Bearer $OPENAI_API_KEY" "$OPENAI_BASE_URL/models" \
  | jq -r '.data[].id' | sort
```

## Workflow
1. Preflight the environment and the `/models` endpoint.
2. Filter the catalog **before** spending anything (below).
3. POST `/chat/completions` per surviving model: a system plus user message, one small tool schema, `tool_choice: "auto"`, and a low `max_tokens`.
4. Dispatch through a bounded worker pool with a delay between requests.
5. Classify each response against the outcome table.
6. Write one JSON record per model to a report file, then print a compact per-model summary.

## Filter Before Spending
Probing a whole catalog costs real money, and most of it is wasted on models that cannot possibly pass.

| Order | Filter | Why first |
|---|---|---|
| 1 | Drop `embedding` and `rerank` ids by name | they have no chat endpoint at all |
| 2 | Drop deny-listed expensive ids | one probe of a frontier model can cost more than the rest combined |
| 3 | Use capability metadata where the gateway exposes it | free and authoritative |
| 4 | Only then let a 4xx settle the rest | costs a request, so it goes last |

## Outcome Classification
A 2xx is not a pass. This table is the whole point of the suite.

| Response | Record as | Note |
|---|---|---|
| 2xx with `tool_calls` non-empty | **pass** | the model supports tool calling |
| 2xx with `tool_calls` empty, normal stop | `ok: true, tool_calls: 0` | not a pass — let the gate decide |
| 2xx whose **message content** holds a JSON tool call as text | **malformed** | the most common real failure; never score it as a silent miss |
| 4xx | `unsupported` | deterministic contract mismatch |
| 429 | `throttled` | pacing problem, not a model result |
| 5xx | `gateway_error` | retry bounded, then record |
| Timeout | `timeout` | record the bound that was used |

```bash
# The malformed case: a tool call emitted as prose
jq -r '.choices[0].message.content' resp.json | rg -q '"(name|arguments)"\s*:' && echo malformed
```

## Pacing
An unthrottled sweep manufactures exactly the 429s it was built to measure, and then reports them as findings.

- Bounded worker pool — a handful of in-flight requests, not the whole catalog.
- A delay between dispatches.
- `max_tokens` low: the probe only needs to see whether a tool call appears.
- **Never retry a 4xx.** It is deterministic; retrying only burns quota against a permanent answer.

## Reference Routing
- Status handling, retry policy, cost guards, and the record schema: [probe-contract.md](references/probe-contract.md)

## Stop
- `OPENAI_BASE_URL` or `OPENAI_API_KEY` is missing, or `/models` fails. Abort loudly; a sweep against a broken gateway spends money to learn nothing.
- Name and deny-list filters have not run. Do not send the first request.
- Zero models across the whole catalog returned `tool_calls`. Suspect the harness before reporting a gateway finding.

## Rules
- Keep the tool schema tiny — one function, two properties. A null result must mean "the model does not support this", not "the prompt confused it".
- The suite passes only if **at least one** model returned `tool_calls` above zero. Zero across the whole catalog means the harness is broken, not the gateway.
- Truncate previews before persisting, and never log the bearer token, the request headers, or the full response body.
- Every candidate model gets exactly one record with the full field set — a missing record is indistinguishable from a model that was never probed.
- Designing the tool schemas under test belongs to `agent-engineering`; the spend a full sweep incurs to `cost-engineering`; the MCP-side contract to `mcp-integration`.

## Checklist
- [ ] Environment and `/models` verified before any spend.
- [ ] Name and deny-list filters ran before the first probe; `max_tokens` bounded.
- [ ] Probes paced under a concurrency cap with a dispatch delay; no 4xx retried.
- [ ] Every candidate model has exactly one JSON record with the full field set.
- [ ] Tool calls embedded in message text flagged as malformed, not scored as a miss.
- [ ] At least one model returned `tool_calls` above zero.
- [ ] Report file is valid JSON and contains no credentials.
