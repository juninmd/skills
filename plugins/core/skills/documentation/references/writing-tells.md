# AI Writing Tells and Editorial Neutralization

Open when editing or reviewing prose (READMEs, ADRs, documentation, pull requests, postmortems) to eliminate robotic artifacts, structural clichés, and synthetic tone while preserving factual claims.

## Contents

- Principles of Natural Prose
- Structural Staging and Openers
- Pacing Clichés: Forced Triads and Dash Saturation
- Significance Inflation and Artificial Authority
- Formatting Tells: Bolded Labels and Uniform Lists
- Conversational Leftovers
- Editing Workflow
- Exceptions and When to Keep Specific Phrasing

## Principles of Natural Prose

Large language models generate text by predicting statistically probable transitions across broad training distributions. This produces predictable default choices that flatten distinctive human voice:

1. **Information density:** Every retained sentence must deliver concrete facts, instructions, or verifiable constraints. Cut sentences that merely announce what the next sentence will say.
2. **Context-specific phrasing:** Human domain experts write directly for their intended audience without stage-managing the conversation or over-explaining self-evident concepts.
3. **Uneven cadence:** Natural writing alternates short statements with complex sentences according to the logic of the argument, rather than adhering to rigid symmetrical templates.

## Structural Staging and Openers

Robotic prose frequently spends lines setting up points before stating them.

### Announcing and Staging Openers

| Pattern | Problem | Direct Alternative |
|---|---|---|
| "In today's fast-paced digital world..." | Generic throat-clearing | Start directly with the technical requirement or subject |
| "It is important to remember that..." | Padded warning | State the constraint directly: "Set `timeout` to..." |
| "Let's dive into the core implementation..." | Chatbot conversational transition | Use an informative section heading |
| "Not only X, but also Y..." | Formulaic synthetic contrast | State both capabilities plainly or separate into distinct facts |

### Formulaic One-Line Closers

Synthetic text regularly ends sections with a trite summarizing aphorism ("Ultimately, choosing the right tool makes all the difference"). Delete these closers entirely; technical sections should end on their final factual requirement.

## Pacing Clichés: Forced Triads and Dash Saturation

### Forced Triads

Models frequently group adjectives, nouns, or verbs into symmetrical triplets ("fast, reliable, and scalable", "build, deploy, and monitor") regardless of whether all three are meaningful.

- **Check:** Does every element in the triad describe a separate, necessary technical dimension?
- **Correction:** Keep only the distinct, required terms. If two words mean the same thing, retain the more precise one.

### Em-Dash Saturation

An over-reliance on em-dashes to inject parenthetical commentary or synthetic drama into simple declarative sentences weakens technical clarity. Replace em-dashes with standard periods or subordinate clauses.

## Significance Inflation and Artificial Authority

### Inflated Vocabulary

Replace synthetic corporate hype with direct engineering terminology:

| Fluff Word | Concrete Replacement |
|---|---|
| delve / dive deep | examine, analyze, inspect |
| pivotal / game-changer | required, standard, primary |
| seamlessly | automatically, via `<hook>`, without restart |
| foster / empower | enable, allow, provide |
| testament to | evidence of, demonstrates |
| landscape / realm | ecosystem, platform, codebase |

### Unearned Authority

Phrases like "Experts agree", "Industry best practices dictate", or "It is well established" disguise absent data. Cite the specific standard, benchmark, or RFC, or state the exact tradeoff directly.

## Formatting Tells: Bolded Labels and Uniform Lists

Models rely heavily on repetitive list structures where every bullet starts with an unnecessary bold label followed by an explanation:

```markdown
<!-- Robotic pattern -->
- **Efficiency:** The cache reduces database latency.
- **Reliability:** Retries prevent network dropouts.
- **Scalability:** Horizontal workers absorb request spikes.

<!-- Direct human pattern -->
The Redis cache absorbs repeated queries, background workers handle request spikes, and automatic retries cover transient network drops.
```

Convert mechanical bulleted lists into connected paragraphs when discussing continuous workflows. Reserve bulleted lists for actual discrete items, steps, or flags.

## Conversational Leftovers

Scrub remnants of chatbot interactions that leaked into committed documentation:

- "Certainly! Here is the updated configuration..."
- "As requested, below are the steps..."
- "I hope this helps clarify the architecture."
- Heading restated verbatim in the first sentence beneath it.

## Editing Workflow

1. **Identify the structural signals:** Scan for symmetrical triplets, staged openings, bolded bullet headers, and synthetic concluding summaries.
2. **Preserve technical claims:** Extract all hard facts, parameters, version numbers, API flags, and architectural decisions. Never drop functional requirements when trimming prose.
3. **Rewrite directly:** State each point plainly. Match the voice of the surrounding repository.
4. **Read aloud:** Confirm that sentence lengths vary and that transitions sound natural rather than mechanically generated.

## Exceptions and When to Keep Specific Phrasing

Do not flag or alter:

- Exact quotations from RFCs, vendor manuals, or external commit messages.
- Formal legal or compliance boilerplate.
- Technical terminology that happens to coincide with common words (e.g., "seamless scrolling" when referencing CSS `scroll-behavior: smooth`).
- Historical context in CHANGELOG entries where past behavior must be contrasted with new releases.
