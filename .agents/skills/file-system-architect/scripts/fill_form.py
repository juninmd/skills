#!/usr/bin/env python3
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Helper script to process File System Architect forms.")
    parser.add_argument("--type", choices=["design", "reorganize"], required=True, help="Type of form to process.")
    parser.add_argument("--data", required=True, help="JSON string containing form data.")

    args = parser.parse_args()
    data = json.loads(args.data)

    if args.type == "design":
        project_type = data.get("project_type", "Generic")
        framework = data.get("framework", "None")
        modules = data.get("modules", [])
        
        print(f"--- Project Architecture Proposal ---")
        print(f"Type: {project_type}")
        print(f"Framework: {framework}")
        print(f"Modules: {', '.join(modules)}")
        print(f"Recommended Structure: Standard {framework} layout with feature-based modules.")

    elif args.type == "reorganize":
        target = data.get("target_dir", ".")
        strategy = data.get("strategy", "By feature")
        
        print(f"--- Reorganization Plan ---")
        print(f"Target Directory: {target}")
        print(f"Strategy: {strategy}")
        print(f"Action: Scanning {target} for structural improvements using {strategy} pattern.")

if __name__ == "__main__":
    main()
