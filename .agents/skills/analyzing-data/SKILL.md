---
name: analyzing-data
description: Data analysis and processing (CSV, JSON, SQL) using Python (Pandas) and CLI tools (csvkit, jq).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Data Analyst

This skill allows for quick and deep exploration of datasets to extract insights.

## Instructions
1.  **Quick Look (CLI First):** Before opening a notebook, inspect the file in the terminal.
    *   **CSV:** Use `csvlook` (formatted) or `csvstat` (statistics).
    *   **JSON:** Use `jq` to filter and format.
2.  **Exploratory Data Analysis (EDA):** Use Python for complex analysis.
    *   **Load:** `df = pd.read_csv('data.csv', parse_dates=['date'])`
    *   **Profile:** Generate automatic reports with `sweetviz` or `ydata-profiling`.
3.  **Data Cleaning:** Handle null values and duplicates before analysis.
    *   **Drop:** `df.dropna()` or `df.fillna(0)`.
    *   **Deduplicate:** `df.drop_duplicates()`.

## Common Tasks
### CLI Tools
*   **Preview CSV:** `head -n 5 data.csv | csvlook`
*   **Stats CSV:** `csvstat data.csv` (Mean, Median, Nulls).
*   **Filter JSON:** `cat data.json | jq '.[] | select(.status == "active")'`

### Python (Pandas)
*   **Group By:** `df.groupby('category')['value'].sum()`
*   **Pivot Table:** `df.pivot_table(index='date', columns='region', values='sales')`
*   **Export:** `df.to_csv('output.csv', index=False)`

## Best Practices
- **Reproducibility:** Use versioned Jupyter Notebooks or Python scripts, never manual Excel.
- **Privacy:** Remove PII (CPF, Email, Phone) before sharing analyses.
- **Visuals:** Use simple charts (Bar, Line) with clear titles and axes (`matplotlib`, `seaborn`).
