---
name: workspace-nav
description: Best practices for file system navigation and workspace MyProject.
applyTo: '**/*.sh, **/Makefile, **/Dockerfile, **/package.json, **/pyproject.toml'
---

# Rule: Navigation & Workspace
# Identifier: workspace_nav

## Description
Best practices for file system navigation and workspace MyProject.

## Commands and Aliases
- **Navigation**: `cd -` (go back to previous directory), `cd ..`.
- **Exploration**: `ls -la` (detailed view), `tree -L 2` (limited hierarchy).
- **Actions**: `mv`, `cp -r`.

## Rules
1. **Directory Context**: when suggesting commands that depend on relative paths, show the expected `pwd`.
2. **Hierarchical View**: use `tree` with depth flags (`-L`) to avoid very large outputs in folders such as `node_modules`.
3. **Safe Move Operations**: when suggesting `mv`, validate the destination directory to avoid accidental renames.
4. **Editor Integration**: suggest `code .` to open the current directory in VS Code when multi-file editing is required.
5. **File Reading**: use agent file-reading tools for inspection. Avoid `cat` on large files; prefer `head`, `tail`, or `grep` for focused filtering.

## Protocol
- Whenever a user enters a new project, suggest `ls -F` to quickly identify executable scripts and directories.

