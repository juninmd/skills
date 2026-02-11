#!/usr/bin/env python3
import argparse
import json
import sys

def main():
    parser = argparse.ArgumentParser(description="Helper script to process Python Environment Manager forms.")
    parser.add_argument("--type", choices=["setup", "install"], required=True, help="Type of form to process.")
    parser.add_argument("--data", required=True, help="JSON string containing form data.")

    args = parser.parse_args()
    try:
        data = json.loads(args.data)
    except json.JSONDecodeError:
        print("Error: Invalid JSON data provided.")
        sys.exit(1)

    if args.type == "setup":
        version = data.get("python_version", "current")
        tool = data.get("tool", "venv")
        name = data.get("name", ".venv")
        
        print(f"--- Environment Setup Plan ---")
        print(f"Python Version: {version}")
        print(f"Tool: {tool}")
        print(f"Environment Name: {name}")
        print(f"Action: Preparing to create virtual environment using {tool}...")

    elif args.type == "install":
        packages = data.get("packages", [])
        version_spec = data.get("version_spec", "")
        dev_dep = data.get("dev_dependency", False)
        
        packages_str = ", ".join(packages) if isinstance(packages, list) else packages
        dep_type = "Development" if dev_dep else "Production"
        
        print(f"--- Package Installation Plan ---")
        print(f"Packages: {packages_str}")
        print(f"Version Constraint: {version_spec}")
        print(f"Dependency Type: {dep_type}")
        print(f"Action: Queuing installation for specified packages.")

if __name__ == "__main__":
    main()
