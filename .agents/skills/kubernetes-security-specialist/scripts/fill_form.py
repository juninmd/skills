#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_security_report(cluster, namespace):
    """Generates a markdown template for a Kubernetes security report."""
    date_str = datetime.date.today().isoformat()
    template = f"""# Kubernetes Security Findings Report

## Overview
- **Cluster/Namespace:** {cluster}/{namespace}
- **Date:** {date_str}

## Summary
- **Critical Findings:** 0
- **High Findings:** 0
- **Medium Findings:** 0
- **Low Findings:** 0

## Findings
### Finding 1
- **Severity:** [Critical / High / Medium / Low]
- **Finding:** [Description]
- **Impact:** [Impact]
- **Remediation:** [Remediation Steps]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a Kubernetes security findings report template.")
    parser.add_argument("cluster", help="The name of the Kubernetes cluster.")
    parser.add_argument("--namespace", default="all", help="The namespace (default: all).")
    args = parser.parse_args()

    print(generate_security_report(args.cluster, args.namespace))

if __name__ == "__main__":
    main()
