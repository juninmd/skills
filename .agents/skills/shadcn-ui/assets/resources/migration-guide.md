# Migration Guide: shadcn/ui

## Why Migrate?
- **Ownership:** Code lives in your project.
- **Customizable:** Modify any component freely.
- **Performance:** Smaller bundles, only include what you use.

## Strategies
- **Incremental (Recommended):** Project-wide, page by page.
- **Big Bang:** Replace all components in one effort (higher risk).

## Migration Guides by Library
- [From Material-UI (MUI)](./MIGRATION_MUI.md)
- [From Chakra UI & Ant Design](./MIGRATION_CHAKRA_ANT.md)
- [From Bootstrap](./MIGRATION_BOOTSTRAP.md)

## Checklist
- [ ] Audit current component usage.
- [ ] Set up Tailwind CSS & Path Aliases.
- [ ] Create component mapping document.
- [ ] Replace incrementally & Test thoroughly.
- [ ] Remove old library once complete.
