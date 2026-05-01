# Migration: From Material-UI (MUI)

## Component Mapping
| MUI | shadcn/ui | Notes |
|-----|-----------|-------|
| Button | Button | Similar API |
| TextField | Input + Label | Separate items |
| Drawer | Sheet | Side panel |
| Card | Card | Very similar |

## Key Differences & Theming
- **Imports:** From `@mui/material` to `@/components/ui`.
- **Styling:** From `sx` prop to Tailwind `className`.
- **Theming:** From `ThemeProvider` to `globals.css` variables.

## Example: Login Form
Replace MUI `Box` and `TextField` with standard `form`, `Label`, and `Input` from shadcn/ui using Tailwind for spacing.
