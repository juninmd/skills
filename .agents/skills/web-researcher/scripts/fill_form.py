#!/usr/bin/env python3
import sys
import argparse

def generate_report_template(topic):
    """Generates a markdown template for a research report."""
    template = f"""# Research Report: {topic}

## Executive Summary
[Brief overview of the key findings.]

## Key Findings
- [Finding 1] (Source: [URL 1])
- [Finding 2] (Source: [URL 2])

## Detailed Answers
### Question 1: [Question 1]
[Detailed answer based on findings.]

### Question 2: [Question 2]
[Detailed answer based on findings.]

## Sources Used
- [URL 1] - [Title/Description]
- [URL 2] - [Title/Description]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a research report template.")
    parser.add_argument("topic", help="The topic of the research.")
    args = parser.parse_args()

    print(generate_report_template(args.topic))

if __name__ == "__main__":
    main()
