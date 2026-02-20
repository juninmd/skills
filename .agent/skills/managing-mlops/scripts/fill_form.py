#!/usr/bin/env python3
import sys
import argparse

def generate_deployment_plan(model_name):
    """Generates a template for a model deployment plan."""
    template = f"""# Deployment Plan: {model_name}

## Model Details
- **Version:** [v1.0.0]
- **Artifact Location:** [s3://my-bucket/models/{model_name}/v1.0.0]

## Infrastructure
- **Environment:** Production
- **Resources:**
    - CPU: 2 cores
    - Memory: 4Gi
    - GPU: None

## Rollout Strategy
- **Type:** Rolling Update
- **Steps:**
    1. Deploy to staging.
    2. Run smoke tests.
    3. Promote to production (10% traffic).
    4. Monitor error rates.
    5. Scale to 100%.

## Rollback Plan
- If error rate > 1%, revert to previous revision using `kubectl rollout undo`.
"""
    return template

def generate_monitoring_config(service_name):
    """Generates a template for monitoring configuration."""
    template = f"""# Monitoring Config: {service_name}

## Metrics
- **Latency:** p95 < 200ms
- **Throughput:** > 10 req/sec
- **Error Rate:** < 0.1%

## Drift Detection
- **Input Data:** Monitor distribution of key features.
- **Model Output:** Monitor distribution of predictions.

## Alerts
- **High Latency:** Critical if p95 > 500ms for 5m.
- **High Error Rate:** Critical if errors > 1% for 1m.
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate MLOps templates.")
    subparsers = parser.add_subparsers(dest="command", help="The template to generate")

    deploy_parser = subparsers.add_parser("deployment", help="Generate deployment plan")
    deploy_parser.add_argument("model_name", help="Name of the model")

    monitor_parser = subparsers.add_parser("monitoring", help="Generate monitoring config")
    monitor_parser.add_argument("service_name", help="Name of the service")

    args = parser.parse_args()

    if args.command == "deployment":
        print(generate_deployment_plan(args.model_name))
    elif args.command == "monitoring":
        print(generate_monitoring_config(args.service_name))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
