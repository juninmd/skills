---
name: exploring-github
description: Search, explore, and analyze GitHub repositories including file contents and project metadata
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Skill: GitHub Explorer

## Description
This skill allows the agent to search for repositories, read file contents, and explore the structure of GitHub repositories. It is useful for finding code examples, libraries, and understanding project architectures.

## Capabilities
- Search for repositories by keywords, language, or user.
- List repository contents (files and directories).
- Read specific file contents from a repository.
- Retrieve repository metadata (stars, forks, description).

## Usage
1. **Search:** Use the GitHub Search API to find relevant repositories.
2. **Explore:** Navigate the file tree using the repository content API.
3. **Analyze:** Read key files like `README.md`, `package.json`, or main source files to understand the project.

## Constraints
- Respect GitHub API rate limits.
- Use authentication if high-volume access is required.
