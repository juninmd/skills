---
name: auditing-technical-seo
description: Perform technical SEO audits to identify crawling, indexing, and ranking issues on websites.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Technical SEO Auditor

## Description
This skill enables the agent to perform technical SEO audits on websites to identify issues that may affect crawling, indexing, and ranking. It covers site structure analysis, performance, mobile responsiveness, and compliance with search engine guidelines.

## Flow

### 1. Initial Crawl and Analysis
- Identify the target URL and its domain.
- Use `web_fetch` to get the main page and analyze its structure.
- Identify key pages and subdirectories for further inspection.

### 2. Indexability and Crawlability Verification
- Check `robots.txt` and sitemaps.
- Analyze `meta name="robots"` tags and `X-Robots-Tag` headers.
- Identify canonical tags and potential duplicate content issues.
- Look for crawl errors (404, 5xx) and redirect chains.

### 3. On-Page Technical Elements
- Audit title tags, meta descriptions, and headings (H1-H6).
- Check image alternative text and structured data implementation (Schema.org).
- Evaluate URL structure for readability and keyword inclusion.

### 4. Performance and Core Web Vitals
- Evaluate loading speed (LCP, FID, CLS).
- Identify heavy assets (large images, unminified JS/CSS) that can be optimized.
- Verify HTTPS implementation and security points.

### 5. Mobile Audit and Usability
- Check responsiveness and viewport configuration.
- Evaluate intrusive interstitials and usability issues on smaller screens.

### 6. Audit Report Generation
- Summarize findings in a structured report.
- Prioritize issues by impact (High, Medium, Low).
- Provide actionable recommendations for development and content.

## Best Practices
- **Prioritization:** Focus first on high-impact issues, such as indexing blocks.
- **Contextual Analysis:** Understand the site's goal to adapt the audit (e.g., e-commerce vs. blog).
- **Data-Driven:** Use specific data (e.g., "the page size is 5MB") instead of vague statements.

