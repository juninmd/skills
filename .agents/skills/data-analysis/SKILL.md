---
name: data-analysis
description: |
  Explore CSV, JSON, and SQL datasets reproducibly: CLI inspection first, then pandas for profiling, cleaning, and aggregation. Use for csvstat, csvlook, jq, describe, groupby, pivot tables, nulls and duplicates, and scrubbing identifiers before sharing.
---

# Data Analysis

## Workflow
1. Inspect from the terminal **before** opening a notebook. It catches encoding, delimiter, and header defects that pandas silently absorbs.
2. Record shape, column types, null counts, and cardinality — and state the question the analysis must answer.
3. Check file size before loading, and pick the strategy from it.
4. Profile before concluding anything.
5. Clean deliberately, with every decision visible in code.
6. Aggregate, then verify the row counts survived the reshape.
7. Scrub identifiers before sharing anything.
8. Persist as versioned code plus output, and commit both with the finding.

## Preflight

```bash
command -v csvstat jq || echo 'fall back to head + a bounded pandas read'
csvstat data.csv                      # types, nulls, cardinality, min/max
head -n 5 data.csv | csvlook          # does the header line up with the rows?
file data.csv && wc -lc data.csv      # encoding and size before loading
jq '.[0] | keys' data.json            # shape without loading the file
```

A delimiter or encoding defect found here costs a minute. Found after three hours of analysis, it costs the analysis.

## Size Decides the Strategy

| Size | Load with |
|---|---|
| < ~1 GB | `pd.read_csv(path, parse_dates=['date'], dtype={...})` |
| ~1–10 GB | `chunksize=`, or a lazy columnar engine (Polars, DuckDB) |
| > 10 GB | query it in the database; extract only what the question needs |
| From SQL | sample first, confirm the shape, **then** extract |

Above ~1 GB a plain `read_csv` is OOM-killed — and in a notebook that kills the kernel and the session state with it.

## Profile Before Concluding

```python
df.describe(include='all')
df.isna().sum().sort_values(ascending=False).head(10)
df.nunique().sort_values().head(10)          # constant or near-constant columns
df.duplicated().sum()
```

## Traps That Change the Answer Silently

| Trap | Effect | Fix |
|---|---|---|
| `groupby` drops null keys | group totals stop matching the row count | `groupby(..., dropna=False)`, then reconcile |
| Aggregates ignore NaN | `mean` divides by a smaller denominator | `fillna(0)` first, when zero is what you mean |
| Silent dtype inference | an id column becomes float, loses leading zeros | pass `dtype=` explicitly |
| Merge multiplies rows | a many-to-many join inflates counts | check `len` before and after; `validate='1:m'` |
| `dropna()` with no subset | drops a row for **any** null column | always pass `subset=` |
| Reporting from a sample | figures do not match the source | compute final figures over the full dataset |

## Before Sharing: Scrub

| Identifier | Handling |
|---|---|
| Direct — name, email, phone, account id | drop, or tokenize with a mapping held outside the dataset |
| Quasi — birth date + postcode + gender | re-identifying; aggregate or coarsen |
| Free text | may contain anything; review or drop |

A plain hash is **not** anonymization — an email or a phone number is dictionary-reversible in seconds. Drop it, tokenize it, or salt with a secret stored outside the dataset.

## Reference Routing
- Identifiers, tokenization, salted hashing, out-of-memory recipes, sampling: [privacy-and-scale.md](references/privacy-and-scale.md)

## Stop
- The delimiter, encoding, or header does not line up. Stop and fix the read; every number after it is wrong.
- A merge or reshape changed the row count unexpectedly. Reconcile before reporting anything.
- A direct or quasi-identifier would leave the machine. Scrub it first — a plain hash is not anonymization.

## Rules
- Never edit source data by hand. Every transform lives in versioned code and re-runs from raw input; a hand-edited cell is unreproducible and undiscoverable.
- State null and duplicate handling explicitly. An unexplained `dropna` invalidates every number after it.
- Treat row-level output as identifying until proven otherwise; aggregate or mask before sharing.
- Report figures over the full dataset, not the sample used while iterating.
- The query itself belongs to `sql-authoring` and database operation to `data-engineering`; extracting the data from a site to `web-scraping`.

## Checklist
- [ ] CLI inspection ran before any notebook work; encoding and delimiter confirmed.
- [ ] Size checked and the load strategy chosen from it.
- [ ] Nulls, duplicates, and dtypes handled with a stated, code-visible rule.
- [ ] Row counts verified across every merge and reshape.
- [ ] No direct or quasi-identifier remains in shared output.
- [ ] Analysis reproduces end to end from raw input via versioned code.
