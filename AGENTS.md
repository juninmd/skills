# Repository Guide

This repository is intentionally limited to a small catalog that generates plugin bundles and a marketplace manifest from source files in `.agents/`.

## Source of truth

- Edit agents and skills only inside `.agents/`.
- Keep plugin manifests in `plugins/*/.github/plugin/plugin.json`.
- Run `pnpm build` to lint the catalog and regenerate plugin bundles plus `.github/plugin/marketplace.json`.

## Scope

Only keep code related to catalog generation, plugin manifests, and validation scripts. Remove unrelated apps, CLIs, release tooling, and organization-specific metadata.
