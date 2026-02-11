#!/usr/bin/env python3
import sys
import argparse

def generate_plan_template(objective):
    """Generates a markdown template for a command execution plan."""
    template = f"""# Command Execution Plan: {objective}

## Objective
{objective}

## Environment
- **OS:** Linux
- **Shell:** Bash
- **Working Directory:** {sys.path[0]}

## Command Sequence
1. `[Command 1]` - [Purpose]
2. `[Command 2]` - [Purpose]

## Expected Outcome
[What should be the final result?]

## Potential Risks
- [Risk 1]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a command execution plan template.")
    parser.add_argument("objective", help="The objective of the command execution.")
    args = parser.parse_args()

    print(generate_plan_template(args.objective))

if __name__ == "__main__":
    main()
