#!/usr/bin/env python3
import sys
import argparse

def generate_cluster_report(cluster_name):
    """Generates a markdown template for a cluster status report."""
    template = f"""# Cluster Status Report: {cluster_name}

## Node Status
- **worker-node-1:** Ready
- **worker-node-2:** Ready

## Pod Status
- **Running:** 15
- **Pending:** 0
- **Failed:** 0
- **CrashLoopBackOff:** 1

## Deployments
- **frontend:** 3/3 Replicas
- **backend:** 2/2 Replicas

## Issues
- `payment-service` pod is restarting frequently (OOMKilled).
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a cluster status report template.")
    parser.add_argument("cluster_name", help="The name of the cluster.")
    args = parser.parse_args()

    print(generate_cluster_report(args.cluster_name))

if __name__ == "__main__":
    main()
