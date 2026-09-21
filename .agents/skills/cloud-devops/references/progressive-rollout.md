
# Progressive Rollout Strategies

A rolling update (Kubernetes' default) replaces old pods with new ones gradually but ships to
**100% of traffic on one signal: did the new pod become Ready.** It never asks whether the new
version is actually *correct* under real traffic. Canary, blue-green, and feature-flag-gated
rollouts each answer that question before the whole fleet is exposed — the difference is where
they draw the safety line and how fast they can pull back. Forsgren, Humble, and Kim
("Accelerate", "The DevOps Handbook") tie this directly to the four key metrics: a rollout you
can halt and reverse in seconds is what keeps deployment frequency high without dragging MTTR up
with it.

## Choosing a Strategy

| Strategy | Traffic exposed before full rollout | Rollback speed | Extra cost | Use when |
|---|---|---|---|---|
| Rolling (k8s default) | up to `maxSurge` at a time, no analysis gate | restart with old digest; pods already replaced stay replaced | none | low-risk, well-tested change |
| Canary | a small percentage, held and measured | fast — shift traffic back, scale canary to zero | small (extra replica set) | behavior change that only shows under real traffic/data |
| Blue-green | 0% until the cutover, 100% after | instant — flip the router back | full second environment during the switch | strict all-or-nothing release, schema-compatible both ways |
| Feature-flag-gated | 0% until flagged on, then any slice you choose | instant — flip the flag, no redeploy | flag-maintenance debt | decoupling *deploy* from *release*, staged user-facing rollout |

Rolling is the floor, not a strategy for anything you are actually unsure about.

## Canary

Ship the new version alongside the old one, route a small slice of real traffic to it, and hold
before promoting. The hard part is not the traffic split — it is what counts as "the canary is
healthy." Google's SRE book frames this as canary analysis against an **error budget**: define
the metrics and threshold *before* the rollout starts, not while watching a dashboard get worse.

```yaml
# conceptual - Argo Rollouts canary steps; the mechanism differs by controller,
# the discipline (percentage, pause, automated analysis) does not.
strategy:
  canary:
    steps:
      - setWeight: 10
      - pause: { duration: 10m }
      - analysis:
          templates: [{ templateName: error-rate-and-latency }]
      - setWeight: 50
      - pause: { duration: 10m }
```

A pause with no analysis attached is a canary in name only — someone has to remember to look, and
they will not at 2am.

## Blue-Green

Run two full environments (blue = live, green = new). Deploy to green while blue keeps serving,
smoke-test green directly, then flip the load balancer or ingress. Rollback is flipping it back —
no redeploy, no waiting for pods to reschedule. The cost is running double capacity for the
overlap window, and any stateful dependency (database schema, message queue) must tolerate both
versions at once during the switch — the same expand/migrate/contract discipline `data-engineering`
uses for schema changes applies here to the cutover window.

## Feature-Flag-Gated

Ship the code dark, behind a flag, decoupled from the release itself — Humble & Farley
("Continuous Delivery") call this out as one of the reasons deploy and release are different
events. The flag becomes the rollback: flipping it off is faster than any redeploy, and it works
even when the bad state is already in production memory. The trade is flag debt — a flag nobody
removes becomes a permanent, untested branch (see `launchdarkly.com`'s guide on flag technical
debt); every flag needs an owner and a removal date at creation.

## Rollback Triggers

Define the trigger before the rollout, not during the incident.

| Signal | Threshold example | Action |
|---|---|---|
| Error-rate burn against the error budget | 2% of the budget in 5 minutes (fast-burn) | halt promotion, roll back automatically |
| p99 latency regression | > 1.5x the pre-rollout baseline, sustained 5 minutes | halt promotion, page owner |
| Readiness/liveness flapping on the new version | any restart during the canary window | halt promotion — do not "wait and see" |
| Business metric (checkout rate, sign-up rate) | outside its normal band | pause; needs human judgment, not autopromote |

An automated gate that only pauses instead of rolling back still requires someone to notice; treat
"pause forever with no owner" as a rollback in slow motion — clean it up the same day.

## Rules

- State the rollback trigger and who owns the decision before the first percent of traffic moves.
- A canary with no automated analysis is a timer, not a safety gate.
- Blue-green needs the schema and any shared queue to work with both versions live at once during
  the switch.
- Every feature flag gets an owner and a removal date at creation; an unremoved flag is a live
  branch in production.
