# Multi-Model Council

## Preflight
```bash
git diff --stat HEAD~1 2>/dev/null || true
rg -n "council|consensus|adversarial" src/ | head -10
```

Deploy multi-model council patterns for irreversible decisions: architecture contracts, database migrations, security trust boundaries, and destructive infrastructure actions. Single-model reviews suffer from self-confirmation bias.

## Council Roles

Assign distinct hats to separate model contexts to prevent sycophancy:

| Role | Hat / Mandate | Veto Power? | Primary Check |
|---|---|---|---|
| **Lead Synthesizer** | SWE (Build) | No | Drives implementation, balances ergonomics and maintainability |
| **Adversarial Challenger** | Architecture / Reliability | Advisory | Concurrency races, scale bottlenecks, boundary decoupling |
| **SecOps Auditor** | Security & Supply Chain | **Absolute Veto** | Secrets in diff, injection vectors, unauthenticated boundaries |
| **QA Adversary** | Correctness & Proof | **Conditional Veto** | Missing negative tests, brittle mocks, unverified assertions |

## Consensus & Arbitration Protocol

1. **Context Isolation**: Never feed the lead model's conversational reasoning directly to the auditor. Present only the task specification, acceptance criteria, and the resulting patch or plan.
2. **Precedence Hierarchy**: `SecOps > QA > DevOps > SWE`. If SecOps flags a vulnerability, no amount of architectural elegance or developer convenience overrides it.
3. **Anti-Hallucination Arbitration**: When two models disagree on an API contract, flag existence, or system behavior, **never vote**. Demand an executable probe (running a test, querying the runtime, or checking verified docs) to resolve the dispute deterministically.
4. **Structured Verdict Format**:
   ```markdown
   Verdict: [APPROVED | BLOCKED | REVISE]
   - Concern: concrete line/contract affected
   - Evidence: failure scenario or proof
   - Required Action: minimal surgical fix
   ```

## Workflow

1. **Classify Criticality**: Determine if the change alters security boundaries, schema migrations, public APIs, or deployment infrastructure. Low-risk changes do not justify council overhead.
2. **Draft Baseline**: Lead model produces the initial plan, ADR, or code diff.
3. **Dispatch Isolated Passes**: Delegate the proposal concurrently to:
   - An adversarial reviewer focusing on edge cases and failure modes.
   - A SecOps auditor inspecting credentials, trust boundaries, and injection surfaces.
4. **Collate & Reconcile**: Collect structured reviews. If any veto is triggered, the lead model must implement the secure/correct alternative or provide deterministic proof.
5. **Final Sign-off**: Record consensus and remaining accepted risks before merging or applying changes.

## Stop
- Overriding a SecOps or QA veto with a majority vote.
- Allowing council members to debate without grounding claims in executable code or documentation.
- Leaking internal reasoning or biased prompts to reviewer models.

## Rules
- Keep council prompts stateless and focused exclusively on the artifact under review.
- Tie-breaks follow the seniority ladder: SecOps > QA > DevOps > SWE.
- Every rejected finding must document why it is a false positive with verifiable evidence.

## Checklist
- [ ] Task criticality evaluated (high-impact vs routine).
- [ ] Reviewers received clean artifacts without lead-model bias.
- [ ] SecOps and QA checks completed with zero unaddressed vetoes.
- [ ] Disputed facts resolved by executable probes or verified sources.
