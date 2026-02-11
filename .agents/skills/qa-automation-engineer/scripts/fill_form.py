#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_bug_report(title, severity):
    """Generates a markdown template for a bug report."""
    date_str = datetime.date.today().isoformat()
    template = f"""# Bug Report: {title}

## Overview
- **Date:** {date_str}
- **Severity:** {severity}
- **Environment:** [e.g. Chrome 120, Windows 11]

## Description
[Provide a brief description of the defect]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Result
[Describe what the system should do]

## Actual Result
[Describe what the system actually did]

## Artifacts
- **Screenshots:** [Path/URL]
- **Logs:** [Path/URL]
- **Trace:** [Path/URL]

## Additional Context
[Any other relevant information]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a QA bug report template.")
    parser.add_argument("title", help="The title of the bug.")
    parser.add_argument("--severity", default="Major", choices=["Blocker", "Critical", "Major", "Minor"], help="The severity of the bug.")
    args = parser.parse_args()

    print(generate_bug_report(args.title, args.severity))

if __name__ == "__main__":
    main()
