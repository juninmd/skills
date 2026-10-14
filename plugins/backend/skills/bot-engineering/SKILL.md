---
name: bot-engineering
description: |
  Design and operate scheduled scraper, monitor, and notification bots. Use for dedupe/seen-state, rate-limit backoff, keyless endpoints, CronJob scheduling, Telegram/Discord/WhatsApp delivery, and optional LLM steps. Trigger on 'a bot that checks this and pings me', 'track prices, releases, or job listings', 'poll this RSS feed', 'duplicate alerts'.
---

# Bot Engineering

**Not this skill:** one-off research (`web-research`), the AI-ecosystem daily digest (`radar-ia`), or CronJob/K8s manifest mechanics (`cloud-devops`).

## Preflight
```bash
crontab -l 2>/dev/null; kubectl get cronjob 2>/dev/null; ls .github/workflows/*.yml 2>/dev/null   # is scheduling already wired, and how?
rg -n 'setInterval|node-cron|schedule\(' src/ 2>/dev/null | head   # a scheduler inside the long-running process is the anti-pattern
```

## Workflow
1. Identify the source: keyed API, keyless API, RSS/Atom feed, or HTML page. Hand scraping/escalation mechanics (headless browser, embedded JSON, block detection) to `web-research`; this skill owns what wraps it.
2. Design the dedupe/seen-state store before writing the poll loop: a stable key (item id, canonical URL, or content hash — never a timestamp or list position that shifts), persisted outside process memory (sqlite/redis/file) so a restart does not re-notify everything already seen.
3. Move scheduling out of the long-running process into its own unit — a CronJob, systemd timer, or scheduled CI workflow — never `setInterval`/`node-cron` inside the bot's main loop. Hand manifest/YAML mechanics to `cloud-devops`.
4. Add rate-limit backoff per source: exponential backoff with jitter, respect `Retry-After`, cache aggressively, and treat a keyless or undocumented endpoint as unstable rather than a hardcoded single point of failure.
5. Deliver: confirm the bot is a member/admin of every target channel before relying on it — a silent no-op is the default failure mode — get chat-id vs. user-id right for the platform, and verify delivery via the channel API's own response, never from "no exception thrown".
6. If an LLM step processes source content before delivery, add JSON-repair/schema validation for flaky model output and sanitize it for the channel's formatting syntax before send. See [LLM-backed bots](references/llm-backed-bots.md) when the model runs behind a self-hosted gateway.

## Failure modes
| Symptom | Cause | Fix |
|---|---|---|
| Duplicate notifications after every restart | Seen-state lived only in process memory | Persist dedupe state (sqlite/redis/file) keyed by a stable id |
| Scheduler drifts, doubles up, or dies silently with the process | `setInterval`/`node-cron` inside the main loop | Move scheduling to its own CronJob/systemd timer/CI schedule |
| Source starts returning 429 or bans the IP | No backoff, or retrying immediately on failure | Exponential backoff + jitter, respect `Retry-After`, cache |
| Bot "sends" nothing and reports no error | Not a member/admin of the channel, or chat-id/user-id swapped | Verify channel membership and id type before shipping |
| Delivered content breaks formatting or leaks structure | Untrusted/LLM-generated content sent unescaped | Escape channel-specific formatting characters before send |

## Stop
- The source has no stable identifier for dedup (only a changing timestamp or list position) — design a content hash before writing the poll loop, not after duplicates ship.
- About to send to a channel the bot's membership/admin status hasn't been confirmed for.
- About to retry against a source that just returned 429/403 instead of backing off.

## Rules
- Hand off scraping/escalation mechanics to `web-research`; this skill owns the scheduling, dedupe, and delivery wrapper around a fetch, not the fetch itself.
- Hand off CronJob/systemd/CI manifest mechanics to `cloud-devops`; this skill owns the decision to use one, not the YAML.
- The AI-ecosystem daily digest is `radar-ia`'s specific instance of this pattern; a different content domain (deals, releases, job listings, prices) is this skill, not a reason to fork `radar-ia`.
- Never trust "no exception thrown" as delivery proof; verify via the channel API's own confirmation.

## Checklist
- [ ] Dedupe/seen-state persists across restarts, keyed by a stable id, not a timestamp.
- [ ] Scheduling runs as its own infra unit, not inside the bot's long-lived process.
- [ ] Rate-limit backoff implemented per source; no hardcoded single point of failure on a keyless endpoint.
- [ ] Bot's channel membership/admin status and id type (chat vs. user) confirmed before relying on delivery.
- [ ] Delivery verified via the channel API's own response.
