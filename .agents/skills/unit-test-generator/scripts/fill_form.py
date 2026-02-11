#!/usr/bin/env python3
import sys
import argparse

def generate_test_plan_template(target):
    """Generates a markdown template for a test plan."""
    template = f"""# Test Plan: {target}

## Target File/Function
- {target}

## Framework
- [Detecting framework...]

## Test Scenarios
### Happy Path
1. [Standard case 1]
2. [Standard case 2]

### Edge Cases
1. [Edge case 1 (e.g., empty input)]
2. [Edge case 2 (e.g., large input)]

### Error Cases
1. [Error case 1 (e.g., invalid type)]
2. [Error case 2 (e.g., missing parameter)]

## Mocking Requirements
- [Dependency 1]
- [Dependency 2]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a test plan template.")
    parser.add_argument("target", help="The target file or function to test.")
    args = parser.parse_args()

    print(generate_test_plan_template(args.target))

if __name__ == "__main__":
    main()
