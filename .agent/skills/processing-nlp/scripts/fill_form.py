#!/usr/bin/env python3
import sys
import argparse

def generate_nlp_report(task):
    """Generates a markdown template for an NLP analysis report."""
    template = f"""# NLP Analysis Report: {task}

## Input Summary
[Brief description of input text or dataset.]

## Results

### Sentiment
- **Label:** Positive
- **Score:** 0.98

### Entities
- **Google** (ORG)
- **Mountain View** (GPE)
- **2023** (DATE)

### Summary
[Generated summary of the text.]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate an NLP analysis report template.")
    parser.add_argument("task", help="The NLP task performed.")
    args = parser.parse_args()

    print(generate_nlp_report(args.task))

if __name__ == "__main__":
    main()
