
# Cost Engineering

## Contents

- Preflight
- Workflow
- Attribution Instruments
- Sweep Before Optimizing
- Rightsizing: A Two-Sided Tradeoff
- Where Cloud Money Actually Goes
- LLM Cost
- A Budget Alert Is Not a Guardrail
- Stop
- Rules
- Checklist

## Preflight
```bash
aws ce get-cost-and-usage --granularity MONTHLY --metrics UnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE --time-period Start=...,End=...
kubectl top pods -A --sort-by=memory | head
```

Name the unit — cost per request, tenant, job, or resolved task — before looking at any number. Absolute spend hides regressions behind growth.

## Workflow
1. Pick the **unit** that matters: cost per request, per tenant, per job, per resolved task. Absolute monthly spend hides regressions behind growth and growth behind regressions.
2. Attribute the spend to that unit with real instruments — unattributed spend cannot be optimized, only worried about.
3. Rank line items by **cost × growth rate**, not by size alone. The third-largest item doubling every month outranks the largest one that is flat.
4. Fix the top item at its cause, not at its symptom.
5. Re-measure the same unit and record the delta **with its traffic level**.
6. Add a guardrail that stops spend, not one that reports it afterwards.

## Attribution Instruments

| Instrument | Answers |
|---|---|
| Cost allocation tags on every resource, report grouped by them | which team, service, environment |
| Per-call accounting in the code path — bytes, rows, tokens, tagged by tenant or job | which customer, which workload |
| Container request-versus-actual CPU/memory | how much is reserved and never used |
| Egress and cross-zone metrics | the line item nobody looks at |

An untagged resource is unattributable, and untagged resources are exactly the ones nobody owns and nobody deletes.

## Sweep Before Optimizing
Idle and forgotten resources routinely beat algorithmic waste, and cost nothing to fix.

```bash
aws ec2 describe-volumes --filters Name=status,Values=available     # unattached disks
aws ec2 describe-addresses --query 'Addresses[?!InstanceId]'        # idle elastic IPs
gcloud compute disks list --filter='-users:*'
kubectl get pvc -A -o json | jq -r '.items[]|select(.status.phase=="Bound")|.metadata.name'
```

Then: old snapshots, non-production environments left running overnight, log retention set to "forever", and storage still in the hot tier years after anyone read it.

## Rightsizing: A Two-Sided Tradeoff
Rightsizing is not a one-way lever toward smaller. Over-provisioning is a silent, recurring cost that never pages anyone; under-provisioning is a latency risk that pages someone the first time traffic spikes. Name which side of the trade a change makes before making it.

| Symptom | Likely cause | Fix |
|---|---|---|
| Bill high, CPU/memory graphs flat and low all month | over-provisioned for a peak that never came (or came once) | resize to p99 of actual usage plus headroom, not to the largest peak ever observed; autoscale for the rare peak instead of reserving for it |
| Request-vs-actual CPU ratio far below 1 across the fleet, no incidents | over-provisioning, invisible until someone asks why the bill grew with no traffic growth | run the sweep in "Where Cloud Money Actually Goes" below; this is the most common finding |
| p99 latency spikes exactly at traffic peaks; CPU or memory pegged then | under-provisioned; the box cannot serve the peak | scale the resource before the next peak — a page after the fact is the cost of finding out this way |
| Container OOMKilled under normal load, not under an actual leak | memory limit set below real working-set size | raise the limit to the measured working set, not to "make the alert stop"; check for a genuine leak first ([profiling-playbook](profiling-playbook.md)) |
| Autoscaler thrashes (scale up, scale down, repeat) | target utilization set too close to the scaling trigger | widen the band, or scale on a leading saturation signal instead of a lagging one |

## Where Cloud Money Actually Goes

| Suspect | Check before rewriting code |
|---|---|
| Oversized instances | request vs actual — most workloads are provisioned for a peak that never came |
| Egress and cross-zone traffic | billed separately from compute, and invisible in a CPU graph |
| Storage tier | hot storage for cold data is a pure transfer to the vendor |
| Chatty inter-service calls | each hop may cross a zone boundary |
| Managed service tier | often sized once, at launch, and never revisited |

## LLM Cost

| Lever | Effect |
|---|---|
| Shorten the **output** format | output costs several times input per token — this is the biggest lever |
| Route by difficulty | small model on the easy path with escalation beats one large model everywhere |
| Cache the stable prefix | only pays off above the provider's minimum size **and** when calls repeat inside the TTL |
| Bound retries and fan-out | a retry storm multiplies spend silently |
| Cap tokens per request | the only thing that stops a runaway loop |

An expired cached prefix pays the write cost for no hit — caching a rarely repeated prompt costs more than not caching it.

## A Budget Alert Is Not a Guardrail
Billing is retroactive. The alert fires long after the runaway loop has been paid for. Enforce a hard stop the workload actually hits:

- a provider quota or spend limit
- a rate limit or concurrency cap
- a per-request token ceiling
- a hard timeout on the job

## Stop
- Spend cannot be attributed to the chosen unit. Instrument first; unattributed spend can only be worried about.
- The optimization would trade correctness or latency for cost. Stop and put the tradeoff to the user.
- Only a budget alert guards the spend. Billing is retroactive — add a hard quota, rate limit, or token ceiling.

## Rules
- Never optimize cost before correctness and latency. When they conflict, state the tradeoff and let the user decide.
- Cache only what is expensive **and** reused; a low hit rate adds cost, latency, and staleness at once — `backend-systems` owns that calculus.
- Measure the delta at a stated traffic level. A saving that came from a quiet week is not a saving.
- Latency and throughput belong to `performance-engineering`; the instrumentation that attributes spend to `observability`; rightsizing the cluster to `cloud-devops`.

## Checklist
- [ ] Unit of cost chosen, and spend attributed to it with tags and per-call accounting.
- [ ] Idle and orphaned resources swept before any code change.
- [ ] Line items ranked by cost × growth, not size.
- [ ] Egress, storage tier, and reservation waste checked before rewriting anything.
- [ ] Change measured as a before/after delta at a stated traffic level.
- [ ] A hard quota, rate limit, or token ceiling caps spend — not only an alert.
