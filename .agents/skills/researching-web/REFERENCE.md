# Web Researcher Referência 📚
## Tools

### 1. `google_web_search`
**Description:** Performs a web search using Google Search (via Gemini API).
**Parameters:**
- `query` (string): The search query to find information on the web.
**Usage:**
- Use concise, keyword-rich queries.
- Combine terms with boolean operators if needed (AND, OR, -).
- Limit queries to specific domains if relevant (e.g., `site:docs.python.org`).

### 2. `web_fetch`
**Description:** Processes content from URL(s) embedded in a prompt.
**Parameters:**
- `prompt` (string): A comprehensive prompt that includes the URL(s) to fetch and specific instructions on how to process their content.
**Usage:**
- Provide clear instructions in the prompt (e.g., "Summarize https://example.com/article").
- Can handle multiple URLs in a single call.
- Useful for extracting specific data points or getting a summary of a long article.

