# GitLab CLI (glab) Command Reference

This document provides a comprehensive list of core `glab` commands. Always use `--help` (e.g., `glab mr --help`) for specific sub-command flags.

## Authentication (glab auth)
*   `glab auth login` - Authenticate with a GitLab instance.
*   `glab auth status` - View authentication status.

## Aliases (glab alias)
*   `glab alias set <alias> <command>` - Set an alias.
*   `glab alias list` - List configured aliases.

## API Interactivity (glab api)
*   `glab api <endpoint>` - Make an authenticated request to the GitLab API.

## CI/CD Pipelines (glab ci)
*   `glab ci status` - View the status of the current pipeline.
*   `glab ci view` - View detailed information about a pipeline.
*   `glab ci trace` - Trace/tail the logs of a running job.
*   `glab ci run` - Create/run a new CI pipeline.
*   `glab ci lint` - Check the syntax of `.gitlab-ci.yml`.

## Issues (glab issue)
*   `glab issue list` - List project issues.
*   `glab issue create` - Create a new issue.
*   `glab issue view <id>` - Display the title, body, and other information about an issue.
*   `glab issue close <id>` - Close an issue.
*   `glab issue reopen <id>` - Reopen a closed issue.
*   `glab issue board view` - View issue boards.

## Merge Requests (glab mr)
*   `glab mr list` - List merge requests.
*   `glab mr create` - Create a new merge request.
*   `glab mr view <id>` - View information about a merge request.
*   `glab mr merge <id>` - Accept and merge a merge request.
*   `glab mr approve <id>` - Approve a merge request.
*   `glab mr diff <id>` - View changes in a merge request.
*   `glab mr checkout <id>` - Checkout a branch associated with a merge request.

## Repositories/Projects (glab repo)
*   `glab repo list` - List repositories.
*   `glab repo clone <repo>` - Clone a repository locally.
*   `glab repo create <name>` - Create a new repository.
*   `glab repo view <repo>` - View a repository in the browser or terminal.
*   `glab repo archive` - Archive a repository.

## Releases (glab release)
*   `glab release list` - List project releases.
*   `glab release create <tag>` - Create a new release.
*   `glab release upload <tag> <files>` - Upload assets to a release.

## SSH Keys (glab ssh-key)
*   `glab ssh-key list` - List SSH keys for your account.
*   `glab ssh-key add <key_file>` - Add an SSH key to your GitLab account.

## Variables (glab variable)
*   `glab variable list` - List project or group variables.
*   `glab variable set <key> <value>` - Create a new project or group variable.

## General Configuration (glab config)
*   `glab config set <key> <value>` - Set configuration values (e.g., `host`, `editor`).
*   `glab config get <key>` - Get a configuration value.
