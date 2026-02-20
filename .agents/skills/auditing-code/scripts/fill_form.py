#!/usr/bin/env python3
import sys
import argparse

def generate_report_template(target):
    """Generates a markdown template for a code audit report."""
    template = f"""# Code Audit Report: {target}

## Summary
[Brief overview of the key findings.]

## Findings

### Finding 1: [Issue Name]
- **Severity:** [Critical/High/Medium/Low]
- **Description:** [Description of the issue]
- **Location:** [File path]:[Line number]
- **Recommendation:** [Suggested fix]

### Finding 2: [Issue Name]
- **Severity:** [Critical/High/Medium/Low]
- **Description:** [Description of the issue]
- **Location:** [File path]:[Line number]
- **Recommendation:** [Suggested fix]

## Overall Rating
[Pass/Fail/Warning]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a code audit report template.")
    parser.add_argument("target", help="The target directory or file(s) for the audit.")
    args = parser.parse_args()

    print(generate_report_template(args.target))

if __name__ == "__main__":
    main()
