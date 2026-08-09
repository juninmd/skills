# Design Style Guide

Match visual design to app category and audience, then apply concrete specs for colors, typography, spacing, elevation, shapes, and code-level styling.

## Style Selection

### Style Selection Principle

> **The visual style must match the app's purpose and audience.**
> A finance app should feel trustworthy, not playful.
> A children's app should feel fun, not corporate.

### Style Selection Matrix

| App Category | Visual Style | Color Palette | Typography | Interaction |
|--------------|--------------|---------------|------------|-------------|
| Utility/Tool | Minimalist | Neutral + 1 accent | Clean sans-serif | Direct, efficient |
| Finance/Banking | Professional Trust | Blue/Green/Navy | Conservative | Secure, deliberate |
| Health/Wellness | Calm & Natural | Soft greens, earth tones | Rounded, friendly | Gentle, encouraging |
| Kids (3-5) | Playful Simple | Bright primary colors | Large, rounded | Big targets, forgiving |
| Kids (6-12) | Fun & Engaging | Vibrant, varied | Bold, readable | Gamified feedback |
| Social/Entertainment | Expressive | Brand-driven | Dynamic | Gesture-rich |
| Productivity | Clean & Focused | Minimal, high contrast | Professional | Keyboard-friendly |
| E-commerce | Conversion-focused | Brand + CTA colors | Scannable | Quick actions |
| Gaming | Immersive | Theme-driven | Stylized | Custom gestures |

## Style Profiles

### Minimalist / iOS-like (Utility Apps)

**When to use**: Tools, utilities, calculators, file managers, settings apps

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | 2-3 colors max, neutral base |
| Whitespace | Generous, 24-48dp margins |
| Typography | Single font family, clear hierarchy |
| Icons | Line-based, consistent stroke |
| Shadows | Subtle or none |
| Borders | Thin (1dp) or none |
| Shapes | Subtle corners (8-12dp) |

**Interaction Style**:
- Direct manipulation
- Immediate feedback
- No unnecessary animations
- Efficient task completion

**Color Palette**:

| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Background | #FAFAFA | #1C1C1E |
| Surface | #FFFFFF | #2C2C2E |
| Primary | #007AFF | #0A84FF |
| Text | #000000 | #FFFFFF |
| Secondary | #8E8E93 | #8E8E93 |

**Reference Apps**: iOS Settings, Apple Notes, Google Calculator

### Professional Trust (Finance/Business)

**When to use**: Banking, investment, enterprise, B2B applications

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | Blues, greens, navy (trust colors) |
| Whitespace | Structured, grid-based |
| Typography | Formal, conservative weights |
| Icons | Filled or outlined, consistent |
| Data visualization | Clear, accurate charts |
| Security indicators | Prominent locks, badges |

**Interaction Style**:
- Confirmatory (double-check important actions)
- Deliberate (not rushed)
- Secure-feeling
- Clear feedback on transactions

**Color Palette**:

| Role | Color | Name |
|------|-------|------|
| Primary | #00695C or #1565C0 | Teal 800 / Blue 800 |
| Secondary | #37474F | Blue Grey 800 |
| Accent | #FFC107 | Amber |
| Background | #ECEFF1 | Blue Grey 50 |
| Success | #2E7D32 | Green 800 |
| Error | #C62828 | Red 800 |

**Key Patterns**:
- Balance summaries prominent
- Transaction history easily scannable
- Secure entry for sensitive data
- Biometric authentication prompts

**Reference Apps**: Banking apps, Trading platforms, Enterprise tools

### Calm & Wellness (Health Apps)

**When to use**: Meditation, fitness tracking, health monitoring, therapy

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | Soft, muted, natural |
| Whitespace | Abundant (breathing room) |
| Typography | Rounded, friendly fonts |
| Shapes | Organic, soft corners (16dp+) |
| Animation | Gentle, slow transitions |
| Imagery | Nature, soft gradients |

**Interaction Style**:
- Encouraging, not demanding
- Progress-oriented
- Gentle reminders
- Celebration of achievements

**Color Palette**:

| Role | Color | Name |
|------|-------|------|
| Primary | #4CAF50 | Green 500 |
| Secondary | #81C784 | Green 300 |
| Tertiary | #B2DFDB | Teal 100 |
| Background | #F1F8E9 | Light Green 50 |
| Text | #33691E | Light Green 900 |
| Accent | #FFB74D | Orange 300 |

**Key Patterns**:
- Progress rings and charts
- Streak tracking
- Motivational messages
- Quiet notification style

**Reference Apps**: Headspace, Calm, Apple Fitness

### Playful & Kid-Friendly (Children's Apps)

**When to use**: Educational games, children's content, family apps

#### Ages 3-5

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | Bright, saturated primary colors |
| Touch targets | 56dp minimum, 64dp recommended |
| Shapes | Very rounded (full radius) |
| Typography | Large (18sp+ minimum), simple fonts |
| Icons | Large, colorful, recognizable |
| Animation | Frequent, rewarding |

**Interaction Style**:
- Simple gestures only (tap, drag)
- No multi-finger gestures
- Forgiving error handling
- Immediate, multi-sensory feedback (sound + visual + haptic)
- No text-only buttons

**Color Palette**:

| Role | Color | Name |
|------|-------|------|
| Primary | #F44336 | Red 500 |
| Secondary | #FFEB3B | Yellow 500 |
| Tertiary | #2196F3 | Blue 500 |
| Background | #FFFFFF | White or soft pastels |
| Accent | #4CAF50 | Green 500 |

#### Ages 6-12

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | Vibrant, varied palette |
| Touch targets | 48dp minimum |
| Shapes | Rounded but can be varied |
| Typography | Bold, readable, can include text |
| Icons | Stylized, character-driven |
| Animation | Gamified, achievement-based |

**Interaction Style**:
- Can introduce some complexity
- Gamification elements
- Progress and rewards
- Some text is acceptable

**Key Patterns for All Kids Apps**:
- Icon-based navigation (no text-only)
- Home button always visible
- Back navigation clear
- Parent gate for settings (math problem, hold button)
- Multi-sensory feedback
- Encouraging error states (no punishment)
- Joint engagement opportunities with parents

**Reference Apps**: PBS Kids, Khan Academy Kids, Duolingo ABC

### Expressive & Social (Entertainment Apps)

**When to use**: Social media, content creation, entertainment

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | Bold brand colors |
| Typography | Dynamic, personality-driven |
| Media | Rich, prominent |
| Animation | Expressive, delightful |
| Shapes | Brand-specific |

**Interaction Style**:
- Gesture-rich
- Quick actions
- Social interactions prominent
- Content-first design

**Key Patterns**:
- Feed-based layouts
- Quick action buttons (like, share, comment)
- Stories/ephemeral content
- Creation tools accessible
- Notification badges

**Reference Apps**: Instagram, TikTok, Snapchat

### Clean & Focused (Productivity Apps)

**When to use**: Note-taking, task management, email, documents

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | High contrast, minimal |
| Whitespace | Strategic, content-focused |
| Typography | Highly readable, clear hierarchy |
| Icons | Functional, consistent |
| Density | Adjustable (compact to comfortable) |

**Interaction Style**:
- Keyboard-friendly
- Batch operations
- Drag and drop
- Quick capture
- Search-centric

**Color Palette**:

| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Primary | #1976D2 | #64B5F6 |
| Background | #FFFFFF | #121212 |
| Surface | #F5F5F5 | #1E1E1E |
| Text | #212121 | #E0E0E0 |
| Accent/Priority | #FF5722 | #FF7043 |

**Key Patterns**:
- List views with swipe actions
- Quick add buttons
- Checkbox interactions
- Due dates and reminders
- Tags and categories

**Reference Apps**: Notion, Todoist, Google Tasks

### Conversion-Focused (E-commerce)

**When to use**: Shopping, marketplace, booking apps

**Visual Characteristics**:

| Element | Specification |
|---------|---------------|
| Colors | Brand + clear CTA colors |
| Images | High quality, zoomable |
| Typography | Scannable, price prominent |
| Cards | Product-focused |
| Badges | Sale, new, limited |

**Interaction Style**:
- Quick add to cart
- Easy checkout flow
- Comparison features
- Reviews accessible
- Wishlist/save for later

**Key Patterns**:
- Grid and list view toggle
- Filter and sort
- Product detail with gallery
- Cart always accessible
- One-tap purchase options

**Reference Apps**: Amazon, Shopify apps, Booking.com

## Consistency Principles

### Match Style to Subject Matter

| App Purpose | Style Should Feel |
|-------------|-------------------|
| Utility | Efficient, invisible |
| Finance | Trustworthy, secure |
| Health | Supportive, calm |
| Kids | Safe, fun |
| Social | Expressive, personal |
| Productivity | Focused, powerful |
| Shopping | Exciting, trustworthy |

### Internal Consistency Rules

| Rule | Implementation |
|------|----------------|
| Same icon style | All outlined OR all filled |
| Consistent color meaning | Red = destructive, Green = success |
| Uniform spacing | Use 8dp grid |
| Predictable interaction | Same gesture = same result |
| Typography system | Use M3 type scale |

## Anti-Patterns: Style Mismatch

| Mismatch | Problem |
|----------|---------|
| Playful colors in banking app | Undermines trust |
| Complex gestures in kids app | Frustrates young users |
| Cluttered UI in wellness app | Defeats calming purpose |
| Boring visuals in entertainment | Fails to engage |
| Aggressive CTAs in health app | Feels manipulative |
| Childish design in professional tool | Lacks credibility |
| Dense information in casual app | Overwhelms users |

## Implementation Checklist

- [ ] Identified app category and target audience
- [ ] Selected appropriate style profile
- [ ] Color palette matches style
- [ ] Typography matches style
- [ ] Interaction patterns match style
- [ ] Touch targets appropriate for audience
- [ ] Animation style consistent
- [ ] Internal consistency maintained
- [ ] No style mismatches
- [ ] Tested with target users

## Visual Specifications (Material Design 3)

Detailed specifications for colors, typography, spacing, elevation, and shapes in Material Design 3.

### Color System

#### Color Roles (Tokens)

Material Design 3 uses a token-based color system with three accent groups:

| Role | Usage |
|------|-------|
| **Primary** | Key components, FAB, prominent buttons |
| **Secondary** | Less prominent components, filters, chips |
| **Tertiary** | Accent, complementary elements |
| **Error** | Error states, destructive actions |
| **Surface** | Backgrounds, cards, dialogs |

Each role includes variants: base color, onColor, container, onContainer.

#### Color Contrast Requirements

| Element | Minimum Contrast Ratio | Notes |
|---------|----------------------|-------|
| Body text | **4.5:1** | WCAG AA compliance |
| Large text (18sp+) | **3:1** | 14sp bold also qualifies |
| UI components | **3:1** | Icons, borders, controls |
| Focus indicators | **3:1** | Must be clearly visible |

#### Recommended Color Palettes

##### Modern Professional (Business Apps)

| Role | Color | Name |
|------|-------|------|
| Primary | #1976D2 | Blue 700 |
| Secondary | #455A64 | Blue Grey 700 |
| Tertiary | #00897B | Teal 600 |
| Background | #FAFAFA | Grey 50 |

##### Vibrant & Playful (Consumer Apps)

| Role | Color | Name |
|------|-------|------|
| Primary | #6200EE | Deep Purple |
| Secondary | #03DAC6 | Teal Accent |
| Tertiary | #FF5722 | Deep Orange |
| Background | #FFFFFF | White |

##### Dark & Elegant (Premium Apps)

| Role | Color | Name |
|------|-------|------|
| Primary | #BB86FC | Purple 200 |
| Secondary | #03DAC6 | Teal 200 |
| Tertiary | #CF6679 | Red 200 |
| Background | #121212 | Dark surface |

##### Nature & Wellness (Health Apps)

| Role | Color | Name |
|------|-------|------|
| Primary | #4CAF50 | Green 500 |
| Secondary | #8BC34A | Light Green 500 |
| Tertiary | #FFEB3B | Yellow 500 |
| Background | #F1F8E9 | Light Green 50 |

##### Finance & Trust (Banking Apps)

| Role | Color | Name |
|------|-------|------|
| Primary | #00695C | Teal 800 |
| Secondary | #37474F | Blue Grey 800 |
| Tertiary | #FFC107 | Amber 500 |
| Background | #ECEFF1 | Blue Grey 50 |

#### Dark Theme Requirements

- Background: #121212 or darker
- Surface colors use elevation-based tonal overlay
- Primary colors should be lighter variants (200-300 range)
- Maintain contrast ratios in dark mode
- Test all states (hover, focus, pressed) in dark mode

### Typography System

#### Type Scale

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display Large | 57sp | 400 | 64sp | Hero text |
| Display Medium | 45sp | 400 | 52sp | Large headers |
| Display Small | 36sp | 400 | 44sp | Section headers |
| Headline Large | 32sp | 400 | 40sp | Screen titles |
| Headline Medium | 28sp | 400 | 36sp | Subsection titles |
| Headline Small | 24sp | 400 | 32sp | Card titles |
| Title Large | 22sp | 400 | 28sp | App bar titles |
| Title Medium | 16sp | 500 | 24sp | List item titles |
| Title Small | 14sp | 500 | 20sp | Tabs |
| Body Large | 16sp | 400 | 24sp | Primary body text |
| Body Medium | 14sp | 400 | 20sp | Secondary body text |
| Body Small | 12sp | 400 | 16sp | Captions |
| Label Large | 14sp | 500 | 20sp | Button text |
| Label Medium | 12sp | 500 | 16sp | Navigation labels |
| Label Small | 11sp | 500 | 16sp | Badges |

#### Recommended Fonts

| Category | Fonts |
|----------|-------|
| Primary | Roboto (system default) |
| Display | Roboto Serif, Google Sans |
| Monospace | Roboto Mono, JetBrains Mono |

#### Text Readability

- **Line length**: 45-75 characters per line (including spaces)
- **Paragraph spacing**: 1.5x line height between paragraphs
- **Letter spacing**: Use default unless brand requires adjustment
- **Text alignment**: Left-aligned for body text (LTR languages)

### Spacing & Layout

#### 8dp Grid System

All spacing values should be multiples of 8dp (with 4dp for fine adjustments).

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4dp | Icon padding, fine adjustments |
| sm | 8dp | Tight spacing, inline elements |
| md | 16dp | Default padding, card content |
| lg | 24dp | Section spacing |
| xl | 32dp | Large gaps, group separation |
| xxl | 48dp | Screen margins, major sections |

#### Component Dimensions

| Component | Height | Min Width | Notes |
|-----------|--------|-----------|-------|
| Button | 40dp | 64dp | Touch target 48dp |
| FAB | 56dp | 56dp | Standard size |
| Mini FAB | 40dp | 40dp | Secondary actions |
| Extended FAB | 56dp | 80dp | With text label |
| Text Field | 56dp | 280dp | Including label |
| App Bar | 64dp | - | Top app bar |
| Bottom Nav | 80dp | - | With labels |
| Nav Rail | - | 80dp | Tablet/desktop |
| List Item | 56-88dp | - | Depends on content |
| Chip | 32dp | - | Filter/action chips |

#### Touch Targets

| Type | Size | Notes |
|------|------|-------|
| Minimum | 48 × 48dp | WCAG requirement |
| Recommended | 56 × 56dp | Primary actions |
| Kids apps | 56dp+ | Larger for motor skills |
| Spacing | 8dp minimum | Between adjacent targets |

### Elevation & Shadows

#### Elevation Levels

| Level | Elevation | Usage |
|-------|-----------|-------|
| Level 0 | 0dp | Flat surfaces |
| Level 1 | 1dp | Cards, elevated buttons |
| Level 2 | 3dp | FAB (resting), raised elements |
| Level 3 | 6dp | Navigation drawer, bottom sheet |
| Level 4 | 8dp | FAB (pressed), menus |
| Level 5 | 12dp | Dialogs, modal surfaces |

#### Shadow Guidelines

- Use elevation consistently for same component types
- Higher elevation = more important/prominent
- In dark theme, use surface tint instead of shadows
- Avoid excessive elevation (keeps UI grounded)

### Shape System

#### Corner Radius

| Size | Radius | Usage |
|------|--------|-------|
| None | 0dp | Sharp edges, dividers |
| Extra Small | 4dp | Badges, small chips |
| Small | 8dp | Buttons, chips, small cards |
| Medium | 12dp | Cards, dialogs, text fields |
| Large | 16dp | FAB, bottom sheets |
| Extra Large | 28dp | Large sheets, expanded cards |
| Full | 50% | Pills, avatars, circular buttons |

#### M3 Expressive Shapes

Material 3 Expressive introduces 35 new decorative shapes:
- Organic curves
- Asymmetric corners
- Cut corners
- Scalloped edges

Use sparingly for brand differentiation and visual interest.

#### Shape Consistency Rules

- Same component type = same shape
- Related components should share shape family
- Don't mix too many shape styles on one screen
- Consider shape in dark/light theme transitions

### Icons

#### Size Specifications

| Size | Dimensions | Usage |
|------|------------|-------|
| Small | 20 × 20dp | Compact UI, inline |
| Standard | 24 × 24dp | Default for most uses |
| Large | 40 × 40dp | Emphasis, empty states |

#### Icon Guidelines

- **Touch target**: Always wrap in 48dp minimum clickable area
- **Style**: Outlined (default), Filled (selected/active states)
- **Stroke width**: 2dp for outlined icons
- **Optical alignment**: May need visual adjustments
- **Color**: Use semantic colors (primary, error, etc.)

#### Recommended Icon Sets

| Set | Usage |
|-----|-------|
| Material Symbols | Recommended, variable font support |
| Material Icons | Legacy, still widely used |

#### Adaptive Icons (App Icon)

| Property | Value |
|----------|-------|
| Canvas size | 108 × 108dp |
| Safe zone | 66 × 66dp (centered circle) |
| Logo size | 48-66dp |
| Max display | 72 × 72dp |
| Layers | Foreground + Background (both 108dp) |
| Android 13+ | Include monochrome layer for theming |

## Styling in Code (Expo/React Native)

StyleSheet, NativeWind/Tailwind, platform-specific styles, and theming for Expo/React Native.

### StyleSheet

```tsx
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  text: { fontSize: 16, fontWeight: "600" },
});
```

Prefer `StyleSheet.create` over inline style objects — it validates styles at creation time and enables potential future optimizations.

### Platform-Specific Styles

```tsx
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    android: { elevation: 4 },
  }),
});
```

Since React Native 0.76+, `boxShadow` is supported as a unified cross-platform shadow API. Prefer it over platform-specific shadow properties when targeting New Architecture.

### NativeWind / Tailwind CSS

For existing projects, check which NativeWind version is in `package.json` and follow the corresponding docs. For new projects, use NativeWind v4 (stable).

#### Installation (NativeWind v4)

```bash
npx expo install nativewind tailwindcss@3 \
  tailwind-merge clsx
```

#### Configuration

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

```js
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
};
```

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
// app/_layout.tsx
import "../global.css";
```

#### Usage

```tsx
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-semibold text-gray-900">Title</Text>
  <Pressable className="mt-4 rounded-lg bg-blue-500 px-4 py-2">
    <Text className="text-center text-white font-medium">Button</Text>
  </Pressable>
</View>
```

#### Conditional Classes

```tsx
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

<View className={cn("p-4", isActive && "bg-blue-500", isDisabled && "opacity-50")} />
```

### Theming and Dark Mode

For apps using NativeWind, use Tailwind's `dark:` variant:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">Adaptive text</Text>
</View>
```

For StyleSheet-based projects, read the system color scheme and map it to a theme object:

```tsx
import { useColorScheme } from "react-native";

const colorScheme = useColorScheme(); // "light" | "dark"
```

Keep color tokens in a central `constants/colors.ts` file with light and dark variants. Pass the active palette via React Context or a Zustand store.
