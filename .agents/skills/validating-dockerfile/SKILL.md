---
name: validating-dockerfile
description: Ability to validate Dockerfiles by performing build and smoke tests.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Validation of Dockerfile

This skill provides a mechanism to ensure that Dockerfiles are syntactically correct and functional through real build and execution.

## Description
Use this skill when a `Dockerfile` is created or modified. It prevents broken images from being committed or sent to CI/CD pipelines by catching errors locally.

## Instructions

1.  **Manual Validation:**
    *   Run the validation script directly: `node .agents/skills/validating-dockerfile/scripts/validate.mjs [path_to_dockerfile]`
    *   If no path is provided, it will automatically attempt to detect staged Dockerfiles (`git add`).

2.  **Git Integration:**
    *   You can ininternalorate this into a `pre-commit` hook or a `Makefile` to ensure validation before each commit.

3.  **Validation Steps:**
    *   **Build:** Runs `docker build` with a temporary tag.
    *   **Run:** Starts a container in detached mode to verify if the application starts (smoke test).
    *   **Cleanup:** Automatically stops the container, removes it, and deletes the temporary image.

## Best Practices
*   **Clean Context:** Ensure the `Dockerfile` is at the correct context level to avoid sending excessive data to the Docker daemon.
*   **Permissions:** Ensure the user running the agent has permissions for `docker` commands.
*   **Resources:** Terminate the container quickly if it is a long-running service to save local resources.

