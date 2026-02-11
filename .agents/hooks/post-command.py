#!/usr/bin/env python3
import sys
import time
import subprocess
import os

LOG_FILE = ".gemini_command_log"

def log_command_execution(command, duration, exit_code):
    """Logs command execution details to a file."""
    with open(LOG_FILE, "a") as f:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        status = "SUCCESS" if exit_code == 0 else "FAILURE"
        f.write(f"[{timestamp}] CMD: '{command}' | DURATION: {duration:.2f}s | STATUS: {status}
")

def check_failed_command(command, exit_code):
    """Suggests diagnostic actions if a command fails."""
    if exit_code != 0:
        print(f"
\033[31m[HOOK ALERT] Command failed with exit code {exit_code}.\033[0m")
        
        # Specific suggestions based on command type
        if "git" in command:
            print("Tip: Run 'git status' to check for conflicts or unstaged changes.")
        elif "kubectl" in command:
            print("Tip: Check 'kubectl get events' or pod logs.")
        elif "pip" in command:
            print("Tip: Check your internet connection or package name.")

def main():
    # Expects arguments: command string, exit code, duration (in seconds)
    # Note: Gemini CLI passes these via environment variables or arguments differently depending on version.
    # This is a template based on standard hook practices.
    
    # Simulating simple argument parsing for demonstration
    if len(sys.argv) < 4:
        # If not enough args, assume running standalone or different context
        return

    command = sys.argv[1]
    try:
        exit_code = int(sys.argv[2])
        duration = float(sys.argv[3])
    except ValueError:
        return

    log_command_execution(command, duration, exit_code)
    check_failed_command(command, exit_code)

if __name__ == "__main__":
    main()
