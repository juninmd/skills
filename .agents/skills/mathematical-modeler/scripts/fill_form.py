#!/usr/bin/env python3
import sys
import argparse

def generate_math_report(problem):
    """Generates a markdown template for a mathematical solution report."""
    template = f"""# Solution Report: {problem}

## Method
Linear Programming (Simplex Method)

## Results
- **Optimal Cost:** $1250
- **Variables:**
    - **Product A:** 50 units
    - **Product B:** 75 units

## Interpretation
To minimize costs while meeting demand, we should produce 50 units of A and 75 units of B.
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a mathematical solution report template.")
    parser.add_argument("problem", help="The name of the problem.")
    args = parser.parse_args()

    print(generate_math_report(args.problem))

if __name__ == "__main__":
    main()
