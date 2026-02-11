#!/usr/bin/env python3
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Helper script to format API Integrator requests.")
    parser.add_argument("--type", choices=["rest", "graphql"], required=True, help="Type of API request.")
    parser.add_argument("--data", required=True, help="JSON string containing request data.")

    args = parser.parse_args()
    data = json.loads(args.data)

    if args.type == "rest":
        url = data.get("url")
        method = data.get("method", "GET").upper()
        headers = data.get("headers", {})
        body = data.get("body")

        if not url:
            print("Error: URL is required for REST request.")
            return

        cmd = f"curl -X {method} '{url}'"
        for key, value in headers.items():
            cmd += f" -H '{key}: {value}'"
        
        if body:
            if isinstance(body, dict):
                body = json.dumps(body)
            cmd += f" -d '{body}'"
        
        print(f"Generated curl command:
{cmd}")

    elif args.type == "graphql":
        endpoint = data.get("endpoint")
        query = data.get("query")
        variables = data.get("variables", {})
        headers = data.get("headers", {})

        if not endpoint or not query:
            print("Error: Endpoint and Query are required for GraphQL operation.")
            return

        payload = {"query": query}
        if variables:
            payload["variables"] = variables

        cmd = f"curl -X POST '{endpoint}' -H 'Content-Type: application/json'"
        for key, value in headers.items():
            cmd += f" -H '{key}: {value}'"
        
        cmd += f" -d '{json.dumps(payload)}'"
        
        print(f"Generated curl command:
{cmd}")

if __name__ == "__main__":
    main()
