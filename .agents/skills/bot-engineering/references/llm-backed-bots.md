
# LLM-backed bots

A bot that summarizes, extracts, or translates source content with an LLM before delivery inherits two failure surfaces on top of the base scheduling/dedupe/delivery problem: the model's output isn't guaranteed structured, and a self-hosted gateway in front of it is another moving part.

## Flaky structured output

| Symptom | Fix |
|---|---|
| The model returns near-JSON (trailing comma, prose before/after the object) | Repair before parsing: strip surrounding prose, then a tolerant JSON-repair pass; never `eval`/`Function` the output |
| A field is missing or the wrong type on some responses | Validate against a schema after repair; treat a schema failure as "no update this cycle", not a crash |
| The same bad answer repeats across runs | Check whether a cache (Redis, a gateway's own response cache) is serving a stale/bad response — invalidate it, don't just retry the call |

## Self-hosted gateway (e.g. LiteLLM) gotchas

- **API shape drift**: an SDK's `.chat()` convenience method and the provider's own Responses API are not interchangeable — a model that only supports one will fail silently-different ways through the other. Confirm which the gateway actually proxies before wiring a client to it.
- **Provider-specific extra fields** (`reasoning_effort`, `chat_template_kwargs`, and similar) usually must be passed through a generic `extra_body`-style escape hatch, not the SDK's typed parameters — check the gateway's own docs for the pass-through mechanism per provider.
- **GitOps self-heal can revert a live config fix.** If the gateway's config is managed by ArgoCD or similar, a manual `kubectl edit`/config patch made to unblock a bot mid-incident gets silently reverted on the next sync — see [gitops-homelab-deploy](../../cloud-devops/references/gitops-homelab-deploy.md) in `cloud-devops` for the out-of-band pattern that survives self-heal during a real fix.
- **Model/quota homologation before relying on it in production** — verify the exact model id, context window, and quota the gateway routes to, not the name in the request; a routing rule change upstream can silently swap the model a bot is calling.
