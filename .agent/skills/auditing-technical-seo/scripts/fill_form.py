#!/usr/bin/env python3
import sys
import argparse
from datetime import date

def generate_seo_report_template(url):
    """Generates a markdown template for a technical SEO audit report."""
    today = date.today().strftime("%Y-%m-%d")
    template = f"""# Technical SEO Audit Report: {url}

## Website/URL: {url}
## Audit Date: {today}

## Executive Summary
[A brief overview of the site's technical health.]

## High-Priority Issues
1. [Issue 1] - [Impact: High] - [Recommendation: Fix ASAP]
2. [Issue 2] - [Impact: High] - [Recommendation: Fix ASAP]

## Detailed Findings
### Crawlability & Indexing
- **Robots.txt:** [Found/Not Found]
- **XML Sitemap:** [Valid/Missing]
- **Indexation Status:** [Indexed/Blocked]
- **Canonical Tags:** [Correctly implemented/Missing/Misconfigured]

### Performance (Core Web Vitals)
- **LCP:** [Value]
- **FID:** [Value]
- **CLS:** [Value]
- **Asset Optimization:** [Large images found/JS & CSS minified]

### On-Page Elements
- **Title Tags:** [Missing/Too Long/Optimized]
- **Meta Descriptions:** [Missing/Duplicate/Optimized]
- **Header Structure:** [H1-H6 hierarchy correct/Multiple H1s]
- **Structured Data:** [Schema found/Errors detected]

### Mobile & Security
- **Mobile Friendly:** [Yes/No]
- **HTTPS:** [Secure/Not Secure]

## Conclusion & Next Steps
[Final thoughts and prioritized action items.]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a technical SEO audit report template.")
    parser.add_argument("url", help="The URL of the website being audited.")
    args = parser.parse_args()

    print(generate_seo_report_template(args.url))

if __name__ == "__main__":
    main()
