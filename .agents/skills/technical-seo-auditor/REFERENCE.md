# Technical SEO Reference Guide

## Essential Concepts

### Crawling vs. Indexing
- **Crawling:** The process where search engine bots (like Googlebot) discover pages by following links.
- **Indexing:** The process where search engines store and organize the content found during crawling.

### Robots.txt
A file that tells search engine crawlers which pages or files they can or can't request from your site.
- `User-agent: *`
- `Disallow: /admin/`

### Canonical Tags
Used to tell search engines which version of a URL is the "master" copy, preventing duplicate content issues.
- `<link rel="canonical" href="https://example.com/page/" />`

### Core Web Vitals (CWV)
A set of specific factors that Google considers important in a webpage's overall user experience:
- **Largest Contentful Paint (LCP):** Measures loading performance (aim for < 2.5s).
- **First Input Delay (FID):** Measures interactivity (aim for < 100ms).
- **Cumulative Layout Shift (CLS):** Measures visual stability (aim for < 0.1).

## Common Audit Tools & Resources
- **Google Search Console:** Essential for monitoring indexation and search performance.
- **Screaming Frog SEO Spider:** A desktop program that crawls websites to analyze technical SEO.
- **Lighthouse:** An open-source, automated tool for improving the quality of web pages (built into Chrome DevTools).
- **Schema Markup Validator:** To test and validate structured data.

## HTTP Status Codes for SEO
- **200 OK:** Standard response for successful requests.
- **301 Moved Permanently:** Recommended for permanent redirects (passes link equity).
- **302 Found:** Temporary redirect (does not pass link equity as effectively as 301).
- **404 Not Found:** The page does not exist.
- **500 Internal Server Error:** Server-side issues that prevent page loading.
- **503 Service Unavailable:** Server is temporarily down for maintenance.
