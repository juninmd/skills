#!/usr/bin/env python3
import argparse
import datetime

def generate_cost_assessment(project_name, provider):
    """Generates a markdown template for a cloud cost assessment."""
    date_str = datetime.date.today().isoformat()
    template = f"""# Cost Optimization Assessment: {project_name}

## Assessment Details
- **Date:** {date_str}
- **Provider:** {provider}
- **Assessor:** [Your Name]

## Financial Overview
- **Current Monthly Spend:** $0.00
- **Projected Annual Spend:** $0.00
- **Target Savings:** 20%

## Findings & Recommendations

### 1. Compute
- [ ] Review EC2/VM instance types for rightsizing.
- [ ] Identify idle instances for termination or stopping.
- **Potential Savings:** $0.00

### 2. Storage
- [ ] Check for unattached EBS volumes/disks.
- [ ] Analyze S3/Blob storage access patterns for tiering.
- **Potential Savings:** $0.00

### 3. Networking
- [ ] Review Data Transfer costs.
- [ ] Check for unused Static/Elastic IPs.
- **Potential Savings:** $0.00

### 4. Commitment Plans
- [ ] Evaluate Reserved Instances (RIs).
- [ ] Evaluate Savings Plans.
- **Est. Savings:** $0.00

## Action Plan
1. [Action Item 1]
2. [Action Item 2]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a cloud cost assessment template.")
    parser.add_argument("project", help="The name of the project or team.")
    parser.add_argument("--provider", default="AWS", help="The cloud provider (default: AWS).")
    args = parser.parse_args()

    print(generate_cost_assessment(args.project, args.provider))

if __name__ == "__main__":
    main()
