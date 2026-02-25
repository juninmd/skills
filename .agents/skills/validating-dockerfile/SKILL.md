---
name: validating-dockerfile
description: Skill to validate Dockerfiles by performing a build and run smoke test.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Validating Dockerfile

This skill provides a mechanism to ensure Dockerfiles are syntactically correct and functional by performing a real build and run operation.

## Description

Use this skill when a `Dockerfile` is created or modified. It prevents broken images from being committed or pushed to CI/CD pipelines by catching errors locally.

## Instructions

1.  **Manual Validation:**
    *   Run the validation script directly: `node .agents/skills/validating-dockerfile/scripts/validate.mjs [path_to_dockerfile]`
    *   If no path is provided, it will attempt to detect staged (git add) Dockerfiles automatically.

2.  **Git Integration:**
    *   You can incorporate this into a `pre-commit` hook or a `Makefile` to ensure validation before every commit.

3.  **Validation Steps:**
    *   **Build:** Execs `docker build` with a temporary tag.
    *   **Run:** Starts a detached container to verify the application starts (smoke test).
    *   **Cleanup:** Automatically stops the container, removes it, and deletes the temporary image.

## Best Practices

*   **Clean Context:** Ensure the `Dockerfile` is at the correct context level to avoid sending too much data to the Docker daemon.
*   **Permissions:** Ensure the user running the agent has permissions to execute `docker` commands.
*   **Resources:** Close the container quickly if it's a long-running service to save local resources.
