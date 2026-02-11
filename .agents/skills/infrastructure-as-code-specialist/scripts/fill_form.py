#!/usr/bin/env python3
import sys
import argparse

def generate_infra_template(project_name):
    """Generates a markdown template for an infrastructure design."""
    template = f"""# Infrastructure Design: {project_name}

## Goal
Define the architecture and resource specifications for the project.

## Fields
- **Project Name:** {project_name}
- **Cloud Provider:** [AWS, Azure, GCP, etc.]
- **IaC Tool:** [Terraform, Pulumi]
- **Resource List:**
    - [Resource Name]: [Type, Specs, Count]
    - ...
- **Architecture Diagram Description:**
    [Describe how resources connect]
- **Variables/Parameters:**
    - [Variable Name]: [Description, Default Value]
    - ...
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate an infrastructure design template.")
    parser.add_argument("project", help="The name of the project.")
    args = parser.parse_args()

    print(generate_infra_template(args.project))

if __name__ == "__main__":
    main()
