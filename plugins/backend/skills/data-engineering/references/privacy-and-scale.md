# Privacy and Scale

## Identifiers to remove before sharing

Direct identifiers: government or tax ID, email, phone, full name, postal address, account or device ID.

Quasi-identifiers (re-identifying in combination): birth date, postcode, employer, job title, exact timestamps, rare category values.

## Safe treatments, in order of preference

1. **Drop the column.** If the analysis does not group or join on it, it should not be in the export.
2. **Tokenize.** Replace the value with a random opaque token and keep the token-to-value map in a separate, access-controlled store. Joins still work; the export carries no recoverable value.
3. **Salted hash.** Only if a deterministic value is required and tokenization is impossible. Use a secret salt (a pepper) held outside the dataset and rotated, never a bare `sha256(email)`.

A plain hash is not anonymization. Emails, phone numbers, national IDs, and postcodes come from small enumerable domains, so an attacker hashes the whole domain once and reverses the column by lookup. The same salt across exports also lets two exports be joined.

## Aggregation

Row-level output is identifying until proven otherwise. Prefer aggregates, and suppress groups with a small member count (a common floor is 5) — a group of one is a record.

## Large files

Check size before loading: `ls -lh data.csv`, `wc -l data.csv`.

- Above roughly 1 GB, or half of free RAM, `pd.read_csv` allocates several times the file size and the process is killed by the OOM killer with no traceback.
- Read only what is needed: `usecols=[...]`, `dtype={...}` with `category` for low-cardinality strings, `parse_dates` only on real dates.
- Stream it: `for chunk in pd.read_csv(path, chunksize=500_000)` and aggregate per chunk.
- Or use a lazy columnar engine: `pl.scan_csv(path).filter(...).group_by(...).collect()`, or DuckDB querying the CSV or Parquet file directly. Both push filters down and never materialize the whole file.
- Convert once to Parquet when the file is read more than a few times; it is columnar, typed, and compressed.

## Sampling

Iterate on a sample, but a finding from a sample is a hypothesis. Rare classes, skew, and long tails move the number. Rerun every reported figure on the full dataset and state which figures came from which.

## Grouping and nulls

`groupby` drops rows whose key is null by default, so group totals stop matching the row count and the loss is invisible. Pass `dropna=False`, or count the nulls before grouping, and reconcile the group total against `len(df)` after every reshape.
