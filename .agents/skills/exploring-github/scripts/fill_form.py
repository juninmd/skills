#!/usr/bin/env python3
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Helper script to format GitHub Explorer forms.")
    parser.add_argument("--type", choices=["search", "file"], required=True, help="Type of form to fill.")
    parser.add_argument("--data", required=True, help="JSON string containing form data.")

    args = parser.parse_args()
    data = json.loads(args.data)

    if args.type == "search":
        query = data.get("query", "")
        language = data.get("language")
        user = data.get("user")
        
        q_parts = [query]
        if language:
            q_parts.append(f"language:{language}")
        if user:
            q_parts.append(f"user:{user}")
            
        full_query = "+".join(q_parts)
        url = f"https://api.github.com/search/repositories?q={full_query}"
        print(f"Generated Search URL: {url}")

    elif args.type == "file":
        owner = data.get("owner")
        repo = data.get("repo")
        path = data.get("path", "")
        
        if not owner or not repo:
            print("Error: Owner and Repo are required for file retrieval.")
            return

        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        print(f"Generated Content URL: {url}")

if __name__ == "__main__":
    main()
