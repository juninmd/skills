#!/usr/bin/env python3
import sys
import argparse

def generate_mechanic_spec(name):
    """Generates a markdown template for a game mechanic specification."""
    template = f"""# Mechanic Specification: {name}

## Description
[Detailed description of how the mechanic works.]

## Inputs
- Key Press: `SPACE` (Jump)
- Key Hold: `SHIFT` (Sprint)

## Logic
1. If `SPACE` is pressed and `is_grounded` is true:
    - Apply vertical impulse.
    - Set `is_grounded` to false.
2. Apply gravity every frame.

## Parameters
- `jump_force`: 10.0
- `gravity`: -9.8
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a game mechanic specification template.")
    parser.add_argument("name", help="The name of the mechanic.")
    args = parser.parse_args()

    print(generate_mechanic_spec(args.name))

if __name__ == "__main__":
    main()
