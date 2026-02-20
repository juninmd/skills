#!/usr/bin/env python3
import sys
import re

def analyze_log(log_file):
    """
    Scans a log file for potential security incidents.
    """
    patterns = {
        "SQL Injection": [
            r"UNION SELECT",
            r"OR 1=1",
            r"DROP TABLE",
            r"--",
            r"/*"
        ],
        "XSS (Cross-Site Scripting)": [
            r"<script>",
            r"javascript:",
            r"alert\(",
            r"onload="
        ],
        "Directory Traversal": [
            r"\.\./",
            r"%2e%2e%2f",
            r"/etc/passwd",
            r"C:\Windows\System32"
        ],
        "Command Injection": [
            r"; cat /etc/passwd",
            r"| netstat",
            r"& whoami"
        ]
    }

    try:
        with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"Error: Log file '{log_file}' not found.")
        return

    print(f"Analyzing {log_file} for suspicious patterns...
")
    found_incidents = {}

    for line_num, line in enumerate(lines, 1):
        for attack_type, attack_patterns in patterns.items():
            for pattern in attack_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    if attack_type not in found_incidents:
                        found_incidents[attack_type] = []
                    found_incidents[attack_type].append((line_num, line.strip()))

    if found_incidents:
        print("Potential Incidents Detected:")
        for attack_type, occurrences in found_incidents.items():
            print(f"
[{attack_type}]")
            for ln, content in occurrences:
                print(f"  Line {ln}: {content}")
    else:
        print("No suspicious patterns found based on current rules.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 log_analyzer.py <logfile>")
        sys.exit(1)
    
    analyze_log(sys.argv[1])
