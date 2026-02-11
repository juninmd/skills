#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_graphql_doc(project_name):
    """Generates a markdown template for GraphQL schema documentation."""
    date_str = datetime.date.today().isoformat()
    template = f"""# GraphQL Schema Documentation: {project_name}

## Overview
- **Project:** {project_name}
- **Date:** {date_str}

## Type Definitions
### [ExampleType]
- **Description:** [Description]
- **Fields:**
  - `id`: ID! - Unique identifier.
  - `name`: String - Name of the entity.

## Queries
### [exampleQuery]
- **Return Type:** [ExampleType]
- **Arguments:**
  - `id`: ID!

## Mutations
### [exampleMutation]
- **Input:** [ExampleInput]
- **Return Type:** [ExampleType]
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a GraphQL schema documentation template.")
    parser.add_argument("project", help="The name of the project.")
    args = parser.parse_args()

    print(generate_graphql_doc(args.project))

if __name__ == "__main__":
    main()
