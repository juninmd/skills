---
name: auditing-technical-seo
description: Perform technical SEO audits to identify crawling, indexing, and ranking issues on websites
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Technical SEO Auditor Skill

## Description
This skill enables the agent to perform technical SEO audits on websites to identify issues that may affect search engine crawling, indexing, and ranking. It covers analysis of site structure, performance, mobile-friendliness, and compliance with search engine guidelines.

## Workflow

### 1. Initial Site Crawl & Analysis
- Identify the target URL and its domain.
- Use `web_fetch` to retrieve the main page and analyze its structure.
- Identify key pages and subdirectories for further inspection.

### 2. Indexability & Crawlability Check
- Check for `robots.txt` and sitemaps.
- Analyze `meta name="robots"` tags and `X-Robots-Tag` headers.
- Identify canonical tags and potential duplicate content issues.
- Look for crawl errors (404s, 5xx) and redirect chains.

### 3. On-Page Technical Elements
- Audit title tags, meta descriptions, and header tags (H1-H6).
- Check image alt text and structured data (Schema.org) implementation.
- Evaluate URL structure for readability and keyword inclusion.

### 4. Performance & Core Web Vitals
- Assess page load speed (LCP, FID, CLS).
- Identify heavy assets (large images, unminified JS/CSS) that could be optimized.
- Check for HTTPS implementation and security issues.

### 5. Mobile & Usability Audit
- Verify mobile responsiveness and viewport settings.
- Check for intrusive interstitials or usability issues on smaller screens.

### 6. Generate Audit Report
- Summarize findings into a structured report.
- Prioritize issues based on impact (High, Medium, Low).
- Provide actionable recommendations for developers and content creators.

## Best Practices
- **Prioritization:** Focus on high-impact issues first, such as indexation blocks.
- **Contextual Analysis:** Understand the site's purpose to tailor the audit (e.g., e-commerce vs. blog).
- **Data-Driven:** Use specific data points (e.g., "Page size is 5MB") rather than vague statements.
