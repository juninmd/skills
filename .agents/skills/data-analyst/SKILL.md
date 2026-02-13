---
name: data-analyst
description: Análise e processamento de dados (CSV, JSON, SQL) usando Python (Pandas) e ferramentas de CLI (csvkit, jq).
metadata:
  metadata:
    works_on: [vscode, antigravity, gemini_cli]

---

# Data Analyst

Esta skill permite a exploração rápida e profunda de datasets para extração de insights.

## Instructions
1.  **Quick Look (CLI First):** Antes de abrir um notebook, inspecione o arquivo no terminal.
    *   **CSV:** Use `csvlook` (formatado) ou `csvstat` (estatísticas).
    *   **JSON:** Use `jq` para filtrar e formatar.
2.  **Exploratory Data Analysis (EDA):** Use Python para análises complexas.
    *   **Load:** `df = pd.read_csv('data.csv', parse_dates=['date'])`
    *   **Profile:** Gere relatórios automáticos com `sweetviz` ou `ydata-profiling`.
3.  **Data Cleaning:** Trate valores nulos e duplicatas antes da análise.
    *   **Drop:** `df.dropna()` ou `df.fillna(0)`.
    *   **Deduplicate:** `df.drop_duplicates()`.

## Common Tasks
### CLI Tools
*   **Preview CSV:** `head -n 5 data.csv | csvlook`
*   **Stats CSV:** `csvstat data.csv` (Média, Mediana, Nulls).
*   **Filter JSON:** `cat data.json | jq '.[] | select(.status == "active")'`

### Python (Pandas)
*   **Group By:** `df.groupby('category')['value'].sum()`
*   **Pivot Table:** `df.pivot_table(index='date', columns='region', values='sales')`
*   **Export:** `df.to_csv('output.csv', index=False)`

## Best Practices
- **Reproducibility:** Use Jupyter Notebooks ou scripts Python versionados, nunca Excel manual.
- **Privacy:** Remova PII (CPF, Email, Telefone) antes de compartilhar análises.
- **Visuals:** Use gráficos simples (Barra, Linha) com títulos e eixos claros (`matplotlib`, `seaborn`).
