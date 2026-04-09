# GitLab CLI (glab) Command Reference

**CRITICAL**: All placeholders like `<id>`, `<repo>`, `<alias>`, etc., MUST be replaced with real values before executing any command. Never use these symbols literally in a terminal.

This document provides a comprehensive list of core `glab` commands. Always use
`--help` (e.g., `glab mr --help`) for specific sub-command flags.

## Authentication (glab auth)
*   `glab auth login` - Authenticate with a GitLab instance.
*   `glab auth status` - View authentication status.

## Aliases (glab alias)
*   `glab alias set my-alias "mr list"` - Set an alias.
*   `glab alias list` - List configured aliases.

## API Interactivity (glab api)
*   `glab api projects/123/merge_requests` - Make an authenticated request to the GitLab API.

## CI/CD Pipelines (glab ci)
*   `glab ci status` - View the status of the current pipeline.
*   `glab ci view` - View detailed information about a pipeline.
*   `glab ci trace` - Trace/tail the logs of a running job.
*   `glab ci run` - Create/run a new CI pipeline.
*   `glab ci lint` - Check the syntax of `.gitlab-ci.yml`.

## Issues (glab issue)
*   `glab issue list` - List project issues.
*   `glab issue create` - Create a new issue.
*   `glab issue view 123` - Display the title, body, and other information about an issue.
*   `glab issue close 123` - Close an issue.
*   `glab issue reopen 123` - Reopen a closed issue.
*   `glab issue board view` - View issue boards.

## Merge Requests (glab mr)
**MANDATORY**: ALWAYS append `-R <FULL_URL>` (e.g., `-R https://gitlab.luizalabs.com/group/repo`) to all `mr` commands.

*   `glab mr list -R https://...` - List merge requests.
*   `glab mr create -R https://...` - Create a new merge request.
*   `glab mr view 280 -R https://...` - View information about a merge request.
*   `glab mr merge 280 -R https://...` - Accept and merge a merge request.
*   `glab mr approve 280 -R https://...` - Approve a merge request.
*   `glab mr diff 280 -R https://...` - View changes in a merge request.
*   `glab mr checkout 280 -R https://...` - Checkout a branch associated with a merge request.

## Repositories/Projects (glab repo)
*   `glab repo list` - List repositories.
*   `glab repo clone group/project` - Clone a repository locally.
*   `glab repo create my-project` - Create a new repository.
*   `glab repo view group/project` - View a repository in the browser or terminal.
*   `glab repo archive` - Archive a repository.

## Releases (glab release)
*   `glab release list` - List project releases.
*   `glab release create v1.0.0` - Create a new release.
*   `glab release upload v1.0.0 file.zip` - Upload assets to a release.

## SSH Keys (glab ssh-key)
*   `glab ssh-key list` - List SSH keys for your account.
*   `glab ssh-key add id_rsa.pub` - Add an SSH key to your GitLab account.

## Variables (glab variable)
*   `glab variable list` - List project or group variables.
*   `glab variable set MY_VAR "value"` - Create a new project or group variable.

## General Configuration (glab config)
*   `glab config set host gitlab.luizalabs.com` - Set configuration values (e.g., `host`, `editor`).
*   `glab config get host` - Get a configuration value.
