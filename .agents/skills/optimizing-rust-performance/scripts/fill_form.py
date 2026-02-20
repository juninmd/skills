#!/usr/bin/env python3
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Helper script to format Rust Performance Engineer forms.")
    parser.add_argument("--type", choices=["profile", "optimize"], required=True, help="Type of form to fill.")
    parser.add_argument("--data", required=True, help="JSON string containing form data.")

    args = parser.parse_args()
    data = json.loads(args.data)

    if args.type == "profile":
        path = data.get("path", ".")
        tool = data.get("tool", "cargo-flamegraph")
        target = data.get("target", "")
        cmd_args = data.get("args", "")
        
        command = f"{tool} -- {target} {cmd_args}"
        print(f"Generated Profiling Command: cd {path} && {command}")

    elif args.type == "optimize":
        goal = data.get("goal", "execution speed")
        context = data.get("context", "")
        
        print(f"Optimization Analysis Request:")
        print(f"Goal: {goal}")
        print(f"Context: {context}")
        print(f"Code to analyze is provided in the input snippet.")

if __name__ == "__main__":
    main()
