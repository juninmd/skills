# shadcn/ui: Best Practices & Troubleshooting

## Best Practices
1. **Don't modify /ui directly.** Use wrappers.
2. **Compose, don't fork.** Favor composition over complex inheritance.
3. **Use the CLI.** `shadcn add` manages dependencies.
4. **Use `cn()` utility.** Consistently merge Tailwind classes.

## Troubleshooting
- **Module not found:** Check `tsconfig.json` path aliases (`@/*`).
- **Styles not applying:** Ensure `globals.css` is imported; check Tailwind config paths.
- **TS Errors:** Install Radix peer deps; check React types updates.
