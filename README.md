# Plugin Marketplace Tools

Minimal tooling for a source catalog stored in `.agents/`. The repository validates agent and skill metadata, copies referenced assets into plugin folders, and generates `.github/plugin/marketplace.json`.

## Structure

```text
.
├── .agents/          # source agents and skills
├── plugins/          # plugin manifests and generated bundles
├── scripts/          # generation and lint scripts
└── .github/plugin/   # generated marketplace manifest
```

## Commands

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
```
