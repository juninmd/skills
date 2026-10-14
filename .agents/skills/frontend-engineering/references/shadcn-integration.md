# shadcn/ui Integration and Architecture

Pragmatic patterns for integrating, customizing, and scaling shadcn/ui components with Radix primitives and Tailwind CSS.

## Contents
- Component Discovery and Catalog
- Architecture and Class Merging
- Customization and Variants
- Installation and Dependency Management
- Blocks and Layout Composition
- Accessibility Guarantees

## Component Discovery and Catalog

shadcn/ui provides copy-paste primitives built on top of Radix UI and styled with Tailwind CSS. Categorize components by architectural responsibility:

| Category | Components | Purpose |
|---|---|---|
| **Layout** | Card, Tabs, Accordion, Collapsible, Separator, Aspect Ratio, Resizable | Structural containers and pane dividing |
| **Forms** | Button, Input, Select, Checkbox, Switch, Textarea, Radio Group, Slider, Form | User input, data entry, validation state |
| **Data Display** | Table, Badge, Avatar, Progress, Skeleton, Calendar | Rendering collections, entities, and status |
| **Navigation** | Navigation Menu, Breadcrumb, Pagination, Menubar | Route traversal and hierarchy wayfinding |
| **Overlays** | Dialog, Sheet, Popover, Tooltip, Alert Dialog, Hover Card, Drawer | Contextual layers, modals, slide-overs |
| **Feedback** | Alert, Toast, Sonner, Command, Context Menu, Dropdown Menu | System responses, quick-actions, toasts |

## Architecture and Class Merging

Components sit in user space under `components/ui/` rather than an opaque `node_modules` package.

### The `cn()` Utility
Class merging combines base styles with conditional overrides while resolving Tailwind class conflicts:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- `clsx` handles conditional expressions (`isActive && "bg-primary"`), objects, and arrays.
- `twMerge` resolves conflicting Tailwind utilities (e.g. `p-4` vs `p-2`), ensuring the last applied utility wins.

## Customization and Variants

### Variant Architecture with `cva`
Define component variants using `class-variance-authority`:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Theming via CSS Variables
Maintain design tokens in global stylesheet (`globals.css`):
- Declare HSL or OKLCH semantic color channels (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`).
- Invert tokens cleanly in `.dark` selector rather than hardcoding arbitrary colors in component markup.
- Extend or wrap components in `components/` (outside `ui/`) to preserve clean separation between base primitives and domain-specific compositions.

## Installation and Dependency Management

### CLI Workflow
Add primitives directly to the project:

```bash
npx shadcn@latest add [component-name]
```

This updates `components.json`, downloads the source into `components/ui/`, and installs needed peer dependencies (such as `@radix-ui/react-dialog`).

### Manual Workflow
1. Retrieve component source from the registry.
2. Place the file inside `components/ui/`.
3. Install peer Radix dependencies and icons explicitly with the project package manager.

## Blocks and Layout Composition

Blocks are full composed application templates (authentication flows, dashboard metrics, sidebar navigation) built from primitives:
- Discover available blocks via registry tools.
- Copy block compositions into feature directories rather than `ui/`.
- Wire data layers, form schemas (`react-hook-form` + `zod`), and server actions directly into the block shell.

## Accessibility Guarantees

shadcn/ui inherits accessibility from Radix UI primitives:
- **Keyboard Navigation:** Native focus traps, arrow key traversal inside menus/tabs, Escape dismissals.
- **ARIA States:** Managed `aria-expanded`, `aria-haspopup`, `aria-selected`, and `aria-controls`.
- **Portal Management:** Dialogs and popovers mount into root portals with scroll locking and focus restoration.
- **Rule:** When modifying primitives or creating compound wrappers, never strip Radix event handlers or ARIA props.
