#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_arch_design(project_name):
    """Generates a markdown template for a distributed systems architecture design."""
    date_str = datetime.date.today().isoformat()
    template = f"""# Architecture Design: {project_name}

## Project Overview
- **Date:** {date_str}
- **Status:** Draft

## Requirements
- **Core Goal:** [What are we building?]
- **Scale:** [Throughput, data size]

## Proposed Architecture
### Microservices
1. **[Service Name]:** [Responsibility]
2. **[Service Name]:** [Responsibility]

### Communication
- **Sync:** [e.g., Service A -> Service B via REST]
- **Async:** [e.g., Service B -> Message Queue -> Service C]

## Resilience Strategies
- [ ] Circuit Breaker
- [ ] Retries with Backoff
- [ ] Dead Letter Queues

## Monitoring & Observability
- **Tracing:** [e.g., OpenTelemetry]
- **Metrics:** [e.g., Prometheus/Grafana]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a distributed systems architecture design template.")
    parser.add_argument("project", help="The name of the project.")
    args = parser.parse_args()

    print(generate_arch_design(args.project))

if __name__ == "__main__":
    main()
