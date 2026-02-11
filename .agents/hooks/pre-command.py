#!/usr/bin/env python3
import sys
import os
import subprocess
import shutil

# --- Configuration ---
PROTECTED_BRANCHES = ['main', 'master', 'production', 'release']
VENV_DIR = ".venv"

def log_warning(msg):
    """Prints a warning message to stderr."""
    print(f"\033[33m[HOOK WARNING] {msg}\033[0m", file=sys.stderr)

def log_info(msg):
    """Prints an info message to stderr."""
    print(f"\033[36m[HOOK INFO] {msg}\033[0m", file=sys.stderr)

def check_git_safety(command):
    """Warns if pushing to a protected branch."""
    if "git" in command and ("push" in command or "commit" in command):
        try:
            # Check current branch
            branch = subprocess.check_output(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"], 
                stderr=subprocess.DEVNULL
            ).decode().strip()
            
            if branch in PROTECTED_BRANCHES:
                log_warning(f"You are operating on protected branch: '{branch}'")
                log_warning("Ensure you have created a Pull Request or have explicit approval.")
        except subprocess.CalledProcessError:
            pass # Not a git repo or error, ignore

def check_k8s_context(command):
    """Displays current k8s context for awareness."""
    if "kubectl" in command:
        try:
            context = subprocess.check_output(
                ["kubectl", "config", "current-context"], 
                stderr=subprocess.DEVNULL
            ).decode().strip()
            
            # Check for production keywords
            if "prod" in context or "production" in context:
                log_warning(f"KUBERNETES CONTEXT: {context} (PRODUCTION DETECTED!)")
            else:
                log_info(f"Kubernetes Context: {context}")
        except FileNotFoundError:
            pass # kubectl not installed
        except subprocess.CalledProcessError:
            pass # No context set

def check_python_env(command):
    """Warns if .venv exists but is not active when running python/pip."""
    # Check if command involves python execution
    py_cmds = ["python", "pip", "python3", "pip3"]
    is_python_cmd = any(cmd in command for cmd in py_cmds)

    if is_python_cmd:
        # Check if virtual env is active
        if not os.environ.get("VIRTUAL_ENV"):
            # Check if .venv directory exists in current path
            if os.path.isdir(VENV_DIR):
                log_warning(f"Virtual environment '{VENV_DIR}' detected but NOT active.")
                log_info(f"Suggestion: source {VENV_DIR}/bin/activate")

def check_npm_lock(command):
    """Warns if using npm in a pnpm project."""
    if "npm install" in command and os.path.exists("pnpm-lock.yaml"):
        log_warning("pnpm-lock.yaml detected. You should probably use 'pnpm install' instead of 'npm'.")

def main():
    # The command to be executed is passed as arguments
    if len(sys.argv) < 2:
        return

    # Join arguments to form the command string for simple checking
    command_str = " ".join(sys.argv[1:])
    
    # Run Checks
    check_git_safety(command_str)
    check_k8s_context(command_str)
    check_python_env(command_str)
    check_npm_lock(command_str)

if __name__ == "__main__":
    main()
