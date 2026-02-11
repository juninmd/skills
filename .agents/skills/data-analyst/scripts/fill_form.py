#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_analysis_report(title):
    """Generates a markdown template for a data analysis report."""
    date_str = datetime.date.today().isoformat()
    template = f"""# Analysis Report: {title}

## Date
{date_str}

## Executive Summary
[Brief summary of the analysis and key takeaways.]

## Key Insights
1. [Insight 1]
2. [Insight 2]

## Visualizations
- [Chart 1]: [Description of what this chart shows]
- [Chart 2]: [Description of what this chart shows]

## Methodology
- **Tools:** Python, Pandas, Matplotlib
- **Data Source:** [Source]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a data analysis report template.")
    parser.add_argument("title", help="The title of the analysis.")
    args = parser.parse_args()

    print(generate_analysis_report(args.title))

if __name__ == "__main__":
    main()
