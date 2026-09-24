# Vector Databases

## Contents

- Decide at Collection Creation, Not After
- Memory Is Two Budgets, Not One
- Latency and Throughput Pull in Opposite Directions
- Bad Results Are Several Distinct Bugs
- Hybrid Search: Prefetch Mechanics
- Fusion: Pick by Score Comparability
- Chunk-to-Document Grouping
- Operating Checks
- Stop
- Sources

Qdrant is the reference engine here; the decisions generalize to pgvector, Milvus, and Weaviate, the
syntax does not. Everything below assumes the embedding model, its version, and the distance metric
are already written down — without those three, no tuning result is reproducible.

Qdrant ships breaking defaults often. Before quoting a config flag, fetch the current guidance from
`https://skills.qdrant.tech/search?query=<symptom>` rather than answering from memory; version notes
in this file are marked with the release that changed them.

## Decide at Collection Creation, Not After

| Decision | Why it cannot wait |
|---|---|
| Named vectors | Configurable **only** at collection creation. Adding a representation later means a rebuild. |
| Payload indexes on filtered fields | Create them *before* HNSW builds, so a filterable HNSW graph is constructed. |
| Distance metric and dimensions | Must match the embedding model exactly; a mismatch produces silent garbage, not an error. |
| Shard count | IDF and index statistics are computed per shard, so shard layout leaks into scoring (see below). |

An unfilled named vector can cost as much as a filled one. A representation earns its own vector only
when it carries signal the others do not — title vocabulary the body never repeats, an abstract read as
one semantic unit. Do not add one per field reflexively.

## Memory Is Two Budgets, Not One

- **Resident (`RSSAnon`)** — ID tracker and anything pinned in RAM. Above **80% of total RAM this is a
  problem**, not a high-water mark.
- **OS page cache** — vectors read from disk. Filling all free RAM here is normal and healthy; the
  kernel releases it under pressure.

Qdrant 1.19+ sets this per component with `memory: pinned | cached | cold`. On 1.18 and older the
equivalents are `always_ram: true` and the `on_disk` booleans on vectors, `hnsw_config`, the sparse
index, and payload indexes.

Optimization loads whole segments into RAM. Leave headroom proportional to `max_segment_size`, or the
node OOMs during an optimizer run and not under query load — which is why the crash never correlates
with traffic.

### Shrinking the footprint, cheapest first

| Lever | Reduction | Cost |
|---|---|---|
| Scalar quantization | ~4x | small recall loss; rescore from originals |
| Binary quantization | 16x–32x (1–2 bits/component) | efficient only on high-dimension vectors with a centered component distribution; enable rescoring |
| `float16` / `int8` datatype | 2x / 4x | precision loss, no rescore path |
| `turbo4` datatype (1.19+, dense only) | ~8x | pairs with 1-bit quantization for cheap rescoring |
| Matryoshka (MRL) models | small vectors in RAM, full on disk | requires an MRL-trained model |
| Sparse vectors and text payload on disk | large | these are disk-friendly; move them first |
| `async_scorer` (`io_uring`) | — | recovers on-disk throughput; Linux kernel 5.11+ only |

HNSW on disk (`memory: cold`) is usually a mistake: it is the hottest structure in the query path. It
pays off only on local NVMe, on multi-tenant collections where a small subset of tenants is active, or
with inline storage enabled.

## Latency and Throughput Pull in Opposite Directions

Tune one per node. Latency work saturates every core for a single query; throughput work minimizes
per-query cost so queries run in parallel.

For latency: raise `default_segment_number` toward the core count (each segment is searched in
parallel), keep quantized vectors and HNSW pinned, lower `hnsw_ef` at query time to trade recall for
speed, and use local NVMe. Cap background work with `optimizer_cpu_budget` and raise
`indexing_threshold` during peak hours.

Running above 90% RAM is not a tuning choice: cache eviction causes latency degradation that persists
for **days** after load returns to normal. Load-test before scaling RAM down.

## Bad Results Are Several Distinct Bugs

Diagnose each symptom separately. Hybrid search does not fix redundancy; MMR does not fix precision.

| Symptom | Strategy |
|---|---|
| Missing exact/keyword matches | Hybrid search with a sparse vector |
| Right documents in top-100, not top-10 | Multistage query with a reranker (late interaction or cross-encoder) |
| Dense retriever misses items that exist; reranking too costly | Relevance feedback |
| Results redundant or near-duplicate | MMR (Qdrant 1.15+), `diversity` starting at 0.5 |
| Need to steer with example points | Recommendation API (positive/negative) or Discovery API (context pairs) |
| Ranking must respect recency, popularity, distance | Score boosting via formula query |

If exact (non-approximate) search already returns bad results, the embedding model is wrong for the
task. No amount of index tuning recovers that.

## Hybrid Search: Prefetch Mechanics

Each `prefetch` runs exactly one search; the outer `query` fuses the parallel results. Prefetches nest,
so a whole multi-stage pipeline fits in one Query API request.

Choosing the sparse side for lexical recall:

| Model | Strength | Constraint |
|---|---|---|
| **BM25** (server-side) | solid baseline, works out of domain, long text | per-language config: tokenizer, stemmer, stopwords |
| **BM42** | small chunks, some meaning | English only, needs fine-tuning, unmaintained |
| **miniCOIL** | BM25 plus word-sense context | English only, FastEmbed, needs fine-tuning |
| **SPLADE++** | term expansion, best quality | heaviest inference and storage |

Two traps that silently skew BM25 scoring:

- `avg_len` is **not** computed server-side. It is a parameter you pass, calibrated per field. The
  document-length default against a ten-word title overweights term frequency.
- IDF statistics are computed **per shard, not per tenant**. On 1.18 and older, payload-based tenant
  partitioning does not isolate them, so tenants with different vocabularies contaminate each other's
  scores. On 1.19+ the `idf` search param scopes statistics to a payload-filtered corpus, which needs a
  payload index on that field.

For language-neutral content, disable text processing explicitly: `stemmer: {"type": "none"}` plus an
empty `stopwords` set on 1.19+, or the deprecated `language: none` on 1.18 and older.

## Fusion: Pick by Score Comparability

| Method | Use when | Watch out |
|---|---|---|
| **RRF** | scores are on incomparable scales (BM25 + cosine) — the default | tune `k` for rank sensitivity; weights must be fitted per collection, never by vibe |
| **DBSF** | you want distribution-normalized scores (mean ± 3σ per prefetch) | absolute scores are not comparable across queries |
| **Formula query** | payload values (recency, popularity) must enter the ranking | no ranks available; normalize each score first |
| **Late-interaction reranking** (ColBERT/ColPali) | top-K precision justifies the cost | highest compute; evaluate MUVERA or pooling first |

`FormulaQuery` indexes prefetches positionally: `$score[i]` follows declaration order, so reordering the
`prefetch` list silently reassigns weights. Provide `defaults` for every `$score[i]`, or candidates that
surfaced from only one prefetch fail to evaluate.

Never linearly weight raw scores from incomparable ranges. That is what RRF exists for.

## Chunk-to-Document Grouping

When chunk-level points are grouped back to documents, each prefetch only contributes the candidates it
returned. Size per-prefetch `limit` well above the final document limit —
`prefetch_limit >= final_limit x expected_chunks_per_document` — otherwise a handful of chunk-heavy
documents saturate the pool and relevant documents disappear with no error. Index the grouping field
(`document_id`) as a keyword payload index first, and validate grouped recall on a labeled sample.

## Operating Checks

- Read optimizer status **before** blaming search latency; a stuck optimizer explains most "suddenly
  slow after a bulk upload" reports.
- Scrape `/metrics` (Prometheus) and `/telemetry`; alert on resident memory share, optimizer lag, and
  p99 search latency.
- Record for every collection: embedding model and version, dimensions, metric, chunking strategy,
  filters, and a recall evaluation. Changing the model invalidates every stored vector silently.

## Stop

- The embedding model changed and vectors were not re-indexed. Every score is meaningless — stop and
  re-embed.
- A tuning change is about to ship without a recall evaluation on real queries. There is no way to tell
  improvement from regression; build the eval first.
- Resident memory is above 80% of RAM. Fix the memory tiering before any latency work.
- A multi-tenant collection on Qdrant <= 1.18 relies on BM25 scoring. IDF is shard-wide; the scores are
  already wrong.

## Sources

Consolidated from the official Qdrant agent skills (`github.com/qdrant/skills`, Apache-2.0):
`qdrant-advisor`, `qdrant-search-strategies`, `qdrant-hybrid-search`, `qdrant-hybrid-search-prefetches`,
`qdrant-hybrid-search-combining`, `qdrant-memory-usage-optimization`, `qdrant-minimize-latency`,
`qdrant-monitoring`. Quantization ratios and the binary-quantization constraints are taken from the
canonical documentation, which supersedes the skills where they disagree:
<https://qdrant.tech/documentation/guides/quantization/>.
