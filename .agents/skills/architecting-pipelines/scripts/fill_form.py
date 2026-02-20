#!/usr/bin/env python3
import sys
import argparse

def generate_pipeline_design(project_name):
    """Generates a markdown template for a pipeline design document."""
    template = f"""# Pipeline Design: {project_name}

## Platform
GitHub Actions

## Triggers
- Push to `main`
- Pull Request to `main`

## Stages
1. **Build:** Compile code and build Docker image.
2. **Test:** Run unit and integration tests.
3. **Scan:** Run security scans (SAST/SCA).
4. **Deploy (Staging):** Deploy to staging environment on merge to `main`.
5. **Deploy (Prod):** Deploy to production on release tag.

## Environments
- Staging
- Production

## Secrets
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DOCKER_REGISTRY_TOKEN`
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a pipeline design template.")
    parser.add_argument("project_name", help="The name of the project.")
    args = parser.parse_args()

    print(generate_pipeline_design(args.project_name))

if __name__ == "__main__":
    main()
