---
name: researching-web
description: Perform comprehensive web research through search engines, content fetching, and information synthesis
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[query/topic] [options]"
---

# Web Researcher Skill

## Description
This skill enables the agent to perform comprehensive web research by effectively utilizing search engines and content fetching tools. It covers query formulation, source evaluation, content extraction, and information synthesis.

## Workflow

### 1. Plan & Decompose
- Analyze the user's request to understand the core topic and specific information needs.
- Break down complex topics into smaller, answerable questions.
- Formulate specific search queries for each question.

### 2. Search (google_web_search)
- Execute `google_web_search` for the planned queries.
- **Tip:** Use specific keywords and operators (e.g., "site:", "filetype:") if applicable to narrow down results.

### 3. Evaluate & Select
- Review the search results (snippets and titles).
- Identify the most promising URLs that are likely to contain the required information.
- Prioritize authoritative and recent sources.

### 4. Fetch Content (web_fetch)
- Use `web_fetch` to retrieve the full content of the selected URLs.
- **Tip:** You can fetch multiple URLs in a single call if they are related to the same sub-topic.
- Process the fetched content to extract relevant facts, data, and insights.

### 5. Synthesize & Report
- Combine information from multiple sources to answer the original questions.
- Resolve any contradictions by cross-referencing or noting the discrepancy.
- Structure the final output clearly, using headings, bullet points, and citations (URLs).

## Best Practices
- **Iterative Search:** If initial results are poor, refine your queries based on what you found (or didn't find).
- **Source Diversity:** Try to get information from different types of sources (official docs, articles, forums) for a balanced view.
- **Verification:** Double-check critical facts against multiple sources.
