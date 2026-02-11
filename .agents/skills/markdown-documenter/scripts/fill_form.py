#!/usr/bin/env python3
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Helper script to format Markdown Documenter forms.")
    parser.add_argument("--type", choices=["overview", "api"], required=True, help="Type of documentation to generate.")
    parser.add_argument("--data", required=True, help="JSON string containing form data.")

    args = parser.parse_args()
    data = json.loads(args.data)

    if args.type == "overview":
        name = data.get("name", "Project Name")
        description = data.get("description", "Description...")
        language = data.get("language", "Unknown")
        deps = data.get("dependencies", [])
        
        md = f"# {name}

"
        md += f"## Description
{description}

"
        md += f"## Language
{language}

"
        if deps:
            md += "## Dependencies
"
            for d in deps:
                md += f"- {d}
"
        print(md)

    elif args.type == "api":
        name = data.get("name", "Symbol")
        stype = data.get("type", "function")
        params = data.get("parameters", [])
        returns = data.get("returns", "None")
        example = data.get("example", "")
        
        md = f"### {name} ({stype})

"
        if params:
            md += "| Parameter | Type | Description |
"
            md += "|-----------|------|-------------|
"
            for p in params:
                pname = p.get("name", "")
                ptype = p.get("type", "")
                pdesc = p.get("description", "")
                md += f"| {pname} | {ptype} | {pdesc} |
"
            md += "
"
        md += f"**Returns:** {returns}

"
        if example:
            md += "#### Example
"
            md += f"```python
{example}
```
"
        print(md)

if __name__ == "__main__":
    main()
