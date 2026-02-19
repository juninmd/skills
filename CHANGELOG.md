# Changelog

## [Unreleased]

### Features

* **migrate Bash scripts to Node.js**: Convert spec automation scripts from Bash to Node.js for cross-platform compatibility
  - Consolidated `validate-spec.sh` and `spec-status.sh` into single `check-spec.mjs`
  - Added `pnpm spec:validate`, `pnpm spec:status`, `pnpm spec:check` commands
  - Updated Makefile targets for consistency
  - Backward compatible: all original commands still work via Makefile

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
