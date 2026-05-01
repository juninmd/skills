# shadcn/ui: Typography & Layout

## Font Family
Update `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
}
```

## Border Radius
Update `--radius` in `globals.css` to change global roundedness:
- `0.5rem`: Default.
- `0`: Sharp edges.
- `1rem`: Extra rounded.

## Animation
Adjust `keyframes` and `animation` in `tailwind.config.js` to override defaults (e.g., accordion speed) or add new effects (e.g., `fade-in`).
