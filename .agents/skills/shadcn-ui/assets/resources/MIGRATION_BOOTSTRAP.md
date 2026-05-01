# Migration: From Bootstrap

## Component Mapping
| Bootstrap | shadcn/ui | Notes |
|-----------|-----------|-------|
| btn | Button | Similar |
| form-control | Input | Similar |
| card | Card | Very similar |
| alert | Alert | Similar |

## Key Differences
- **Classes vs Components:** Bootstrap is class-driven; shadcn/ui is component-composition driven.
- **Form Groups:** Replace Bootstrap `.mb-3` and `.form-label` with shadcn `div` spacing and `Label` component.
