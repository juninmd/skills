#!/usr/bin/env python3
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Helper script to format Git Workflow forms.")
    parser.add_argument("--type", choices=["commit", "pr"], required=True, help="Type of form to fill.")
    parser.add_argument("--data", required=True, help="JSON string containing form data.")

    args = parser.parse_args()
    data = json.loads(args.data)

    if args.type == "commit":
        c_type = data.get("type", "feat")
        scope = data.get("scope")
        subject = data.get("subject", "update")
        body = data.get("body", "")
        footer = data.get("footer", "")
        
        msg = f"{c_type}"
        if scope:
            msg += f"({scope})"
        msg += f": {subject}

{body}"
        if footer:
            msg += f"

{footer}"
        
        print("Generated Commit Message:")
        print("-" * 20)
        print(msg)
        print("-" * 20)

    elif args.type == "pr":
        title = data.get("title", "New PR")
        description = data.get("description", "")
        issues = data.get("issues", "")
        
        pr_body = f"# {title}

## Description
{description}"
        if issues:
            pr_body += f"

## Related Issues
{issues}"
            
        print("Generated PR Description:")
        print("-" * 20)
        print(pr_body)
        print("-" * 20)

if __name__ == "__main__":
    main()
