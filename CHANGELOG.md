# Changelog

# [1.24.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.23.1...v1.24.0) (2026-03-11)


### Features

* Enhance frontend-expert documentation and update naming conventions for skills ([d32fde5](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/d32fde5))

## [1.23.1](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.23.0...v1.23.1) (2026-03-10)


### Bug Fixes

* build image ([9d09152](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/9d09152))


### Improvements

* update pnpm-lock.yaml to match package.json ([951b30d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/951b30d))

# [1.23.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.22.0...v1.23.0) (2026-03-09)


### Features

* Add documentation for the authenticating-sso-corp skill. ([ce1c265](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/ce1c265))

# [1.22.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.21.0...v1.22.0) (2026-03-09)


### Features

* add Google Antigravity agent detection and global configuration to the setup command. ([96cc3f4](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/96cc3f4))

# [1.21.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.20.0...v1.21.0) (2026-03-09)


### Features

* Reordered agent installation options, making GitLab (Cron) the recommended default and updating setup logic accordingly. ([6bef0f0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/6bef0f0))

# [1.20.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.19.0...v1.20.0) (2026-03-09)


### Features

* provide Windows-specific auto-update instructions when crontab is unavailable. ([03a161d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/03a161d))

# [1.19.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.18.0...v1.19.0) (2026-03-09)


### Features

* Introduce Git-based repository synchronization, standardize agent directories to `~/.agents`, and migrate JSON parsing to `comment-json`. ([6dd557f](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/6dd557f))

# [1.18.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.17.1...v1.18.0) (2026-03-09)


### Features

* Add backup functionality for settings.json in Copilot and Gemini CLI installers ([4bb6255](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/4bb6255))

## [1.17.1](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.17.0...v1.17.1) (2026-03-06)


### Documentation

* Add local CLI development instructions and refine README formatting. ([aa04f0a](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/aa04f0a))

# [1.17.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.16.0...v1.17.0) (2026-03-06)


### Features

* Configure Copilot settings to use individual rule files, add agent skills and agent files locations, and convert workflows to prompts with frontmatter. ([52dabd8](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/52dabd8))
* Enhance Copilot installer to support hooks and workflows as prompts, and remove the `--verbose` option. ([0110cc3](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/0110cc3))
* enhance setup command to support global VS Code settings, multiple profiles, and update agent directory structure ([2448ccd](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/2448ccd))

# [1.16.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.15.0...v1.16.0) (2026-03-06)


### Features

* Add a `setup` CLI command to configure the development environment for VS Code extensions and Copilot, and update the CLI build process to use esbuild. ([1b46525](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/1b46525))
* Implement subagent architecture with new coordinating agents like `code-reviewer` and `feature-builder`, and add a skill for configuring VS Code Copilot. ([0290691](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/0290691))

# [1.15.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.14.0...v1.15.0) (2026-03-02)


### Features

* Enhance category validation and improve cron configuration handling ([8ad1366](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/8ad1366))
* Enhance platform engineer and software architect guidelines with Helm chart review and design doc output modes ([12ed769](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/12ed769))

# [1.14.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.13.0...v1.14.0) (2026-02-27)


### Features

* Add GitLab token input and environment configuration for MCP integration ([0b8a1d7](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/0b8a1d7))

# [1.13.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.12.0...v1.13.0) (2026-02-27)


### Features

* Add GitLab MCP configuration and automation for VSCode integration ([84d1da0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/84d1da0))

# [1.12.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.7...v1.12.0) (2026-02-27)


### Bug Fixes

* ci: ignore scripts during install to speed up build and avoid side effects ([582999d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/582999d))


### Documentation

* Update GitHub Copilot access instructions in deploy.md ([e2a8c2d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/e2a8c2d))


### Features

* Add build_cli job to CI and update postinstall script in package.json ([cc59384](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/cc59384))
* Add GitLab CLI skill and command reference documentation ([889b8e5](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/889b8e5))

## [1.11.7](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.6...v1.11.7) (2026-02-26)


### Documentation

* Add setup instructions for GitLab SSH key configuration and GitHub Copilot access. ([e9c0c2f](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/e9c0c2f))

## [1.11.6](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.5...v1.11.6) (2026-02-25)


### Documentation

* Remove Specification-Driven Development navigation link and update dark mode background colors. ([736b35c](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/736b35c))

## [1.11.5](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.4...v1.11.5) (2026-02-25)


### Documentation

* enhance deployment guide clarity with inline comments and improve markdown styling for better readability. ([731a9a7](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/731a9a7))

## [1.11.4](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.3...v1.11.4) (2026-02-25)


### Documentation

* add specific instructions for handling `GOOGLE_APPLICATION_CREDENTIALS` in MGC clusters and remove a horizontal rule. ([567bf9f](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/567bf9f))

## [1.11.3](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.2...v1.11.3) (2026-02-25)


### Documentation

* Update deploy instructions with new sections on quality, observability, image registry, detailed GMUD approval, and refined configuration file guidance. ([2fa40bc](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/2fa40bc))

## [1.11.2](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.1...v1.11.2) (2026-02-25)


### Documentation

* add Design Doc section, CI/CD flow diagram, GMUD approval rules, and `ci-knife create-gmud` example. ([4a8ac2d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/4a8ac2d))

## [1.11.1](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.11.0...v1.11.1) (2026-02-25)


### Documentation

* expand and clarify deployment prerequisites, access requirements, and environment details in the deployment documentation. ([551da3b](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/551da3b))

# [1.11.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.10.0...v1.11.0) (2026-02-25)


### Code Refactoring

* Adjust Dockerfile to copy specific subdirectories for build and use `pnpm build` instead of `pnpm docs:build`. ([7b2bae7](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/7b2bae7))


### Features

* skill dockerfile ([1c37668](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/1c37668))

# [1.10.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.9.0...v1.10.0) (2026-02-24)


### Features

* add logo and social icons to documentation ([dab5fe7](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/dab5fe7))

# [1.9.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.8.0...v1.9.0) (2026-02-23)


### Features

* add padrao-labs-agent and configuring-sonarqube skill with templates and guidelines ([3a43c26](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/3a43c26))

# [1.8.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.7.0...v1.8.0) (2026-02-23)


### Features

* add helm-chart-reviewer agent and validating-baseweb-charts skill with configuration files ([24bad84](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/24bad84))

# [1.7.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.6.0...v1.7.0) (2026-02-23)


### Features

* add feature comparison table for AI agent capabilities ([8d59f53](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/8d59f53))

# [1.6.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.5.0...v1.6.0) (2026-02-23)


### Features

* add refactoring-agent and skills for software design principles ([784a625](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/784a625))

# [1.5.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.4.0...v1.5.0) (2026-02-20)


### Features

* update agent directory structure and remove unsupported tools ([d58419d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/d58419d))

# [1.4.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.3.0...v1.4.0) (2026-02-20)


### Bug Fixes

* path location ([ecbfad3](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/ecbfad3))


### Features

* add workflows documentation and update settings for agent file locations ([afc7cae](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/afc7cae))

# [1.3.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.2.0...v1.3.0) (2026-02-20)


### Bug Fixes

* linter skills ([06a1818](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/06a1818))


### Code Refactoring

* migrate Bash spec scripts to Node.js for cross-platform compatibility ([022d13e](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/022d13e))
* remove IDs from rule documents and enhance security protocols ([7280a91](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/7280a91))


### Documentation

* add Bash→Node.js migration summary documentation ([3773feb](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/3773feb))


### Features

* add approve-spec script for changing spec status and update package.json ([6ffa016](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/6ffa016))
* add initial settings configuration for agent tools and GitHub Copilot ([73cd007](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/73cd007))
* add naming conventions and security quality guidelines ([cf41b55](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/cf41b55))
* add README for CLI usage and testing instructions ([50dd972](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/50dd972))
* add validation checklist and implementation plan for init-padrao-labs feature ([54d21f8](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/54d21f8))
* reviewing skills for compliance with Anthropic best practices and agentskills.io specification ([2aa826c](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/2aa826c))

# [1.2.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.1.1...v1.2.0) (2026-02-19)


### Features

* agente dd ([1c6edbe](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/1c6edbe))

# [1.2.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.1.1...v1.2.0) (2026-02-19)

## [1.1.1](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.1.0...v1.1.1) (2026-02-18)


### Improvements

* deploy ([9fe9c75](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/9fe9c75))

# [1.1.0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.0.1...v1.1.0) (2026-02-18)


### Features

* enhance CategoryLayout and loader with improved titles and loading messages ([187ec08](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/187ec08))
* force deploy ([695f569](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/695f569))
* npx publish CLI to npm on tag release ([42cb1a1](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/42cb1a1))
* tests ([9db1a49](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/9db1a49))
* update documentation and improve installation instructions across multiple files ([f7a4dfc](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/f7a4dfc))
* update navigation and documentation for improved onboarding experience ([01f1d69](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/01f1d69))


### Improvements

* deploy ([383bcb0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/383bcb0))

## [1.0.1](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/compare/v1.0.0...v1.0.1) (2026-02-13)

### Bug Fixes

* deployment with correct server file and build command ([9a94f49](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/9a94f49))

# 1.0.0 (2026-02-13)

### Bug Fixes

* ci ([fa1a82c](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/fa1a82c))
* pages ([f86a264](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/f86a264))
* update Dockerfile and package.json for consistent HTTP server configuration ([7443a3d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/7443a3d))

### Code Refactoring

* change SkillShell from sidebar to card layout below title ([c1d28b2](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/c1d28b2))
* compact card layout with 2-column bottom section ([c3d2cc5](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/c3d2cc5))
* reduce card size and move to page footer ([da3371b](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/da3371b))
* remove debug logging from server request handling ([2fb5cbb](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/2fb5cbb))
* remove unused dependencies from pnpm-lock.yaml ([e0028df](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/e0028df))
* replace http-server with custom Node.js server for serving documentation ([5904768](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/5904768))

### Continuous Integration

* add security report pipeline ([5e81aae](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/5e81aae))

### Documentation

* add agentic concepts and architecture guides ([0c1e522](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/0c1e522))
* update agents md with magalu dev culture ([7527269](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/7527269))
* update AGENTS.md with Netskope configuration and guidelines ([015f91d](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/015f91d))
* update installation instructions and enhance setup guide for VS Code and Gemini ([ec85f3f](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/ec85f3f))

### Features

* add Gemini CLI integration and loader script ([5081d8f](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/5081d8f))
* add quality engineer and secops agents with detailed capabilities and instructions ([6bc2924](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/6bc2924))
* add skill metadata to frontmatter and read from SkillShell sidebar ([e579ea7](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/e579ea7))
* implement installation command tabs for multiple platforms in SkillShell and update documentation ([a0a8a97](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/a0a8a97))
* improve ([e3dd00e](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/e3dd00e))
* redesign SkillShell component with GitHub theme and improved UX ([75d2ee0](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/75d2ee0))

### Improvements

* test ([b2cd9fe](https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/commit/b2cd9fe))
