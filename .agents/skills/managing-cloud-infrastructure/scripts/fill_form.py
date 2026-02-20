#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_deployment_report(deployment_id, status):
    """Generates a markdown template for a deployment report."""
    date_str = datetime.date.today().isoformat()
    template = f"""# Deployment Report: {deployment_id}

## Overview
- **Date:** {date_str}
- **Status:** {status}

## Changes Applied
- [Change 1]
- [Change 2]

## Issues Encountered
- [Issue 1] - [Resolution]

## Next Steps
- [Next Step 1]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a deployment report template.")
    parser.add_argument("deployment_id", help="The ID of the deployment.")
    parser.add_argument("--status", default="Success", help="The status of the deployment (Success/Failure).")
    args = parser.parse_args()

    print(generate_deployment_report(args.deployment_id, args.status))

if __name__ == "__main__":
    main()
