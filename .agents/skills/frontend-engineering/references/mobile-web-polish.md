# Mobile Web Polish and Native Feel

Technical requirements for eliminating web-browser artifacts on mobile devices to achieve native-feeling interactions.

## Contents
- Dynamic Viewport Units and Address Bar Resizing
- Eliminating Sticky Hover on Touch Devices
- Safe Area Insets and Display Cutouts
- Input Zoom Prevention
- Scroll Chaining and Overscroll Containment
- Touch Response and Highlight Suppression

## Dynamic Viewport Units and Address Bar Resizing

Classic `100vh` fails on mobile browsers because it does not account for the URL address bar expanding and collapsing during scroll:

```css
/* Defective: Bottom UI gets hidden beneath mobile browser bars */
.screen-container {
  height: 100vh;
}

/* Correct: Uses Dynamic Viewport Height */
.screen-container {
  min-height: 100vh; /* Fallback for legacy browsers */
  min-height: 100dvh;
}
```

- `100dvh`: Adjusts dynamically as browser chrome expands or contracts.
- `100svh`: Small viewport height (browser chrome expanded, safe minimal height).
- `100lvh`: Large viewport height (browser chrome collapsed).

## Eliminating Sticky Hover on Touch Devices

When a mobile user taps an element with standard `:hover` styles, mobile browsers retain the hover state until the user taps somewhere else:

```css
/* Defective: Button stays highlighted after finger lift */
.action-button:hover {
  background-color: var(--accent);
}

/* Correct: Scoped strictly to devices with fine pointing cursors */
@media (hover: hover) and (pointer: fine) {
  .action-button:hover {
    background-color: var(--accent);
  }
}

/* Instant active press for touch devices */
.action-button:active {
  transform: scale(0.97);
  background-color: var(--accent-active);
}
```

## Safe Area Insets and Display Cutouts

To support notches, Dynamic Islands, and home indicator bars:

1. Enable full bleed in HTML meta viewport:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

2. Apply safe area environment variables with defensive fallbacks:
```css
.bottom-bar {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}

.top-bar {
  padding-top: max(12px, env(safe-area-inset-top));
}
```

## Input Zoom Prevention

iOS Safari automatically zooms into any form input with a font size smaller than `16px`, breaking responsive page framing:

```css
/* Maintain at least 16px font-size on all mobile inputs */
input,
select,
textarea {
  font-size: 16px;
}

@media (min-width: 768px) {
  input,
  select,
  textarea {
    font-size: 14px; /* Scaled down only on desktop where zoom is not triggered */
  }
}
```

## Scroll Chaining and Overscroll Containment

Prevent dragging inside a modal or drawer from inadvertently pulling or rubber-banding the underlying page:

```css
.modal-scroll-area {
  overflow-y: auto;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}
```

## Touch Response and Highlight Suppression

Remove default browser touch indicators and enable immediate tap response:

```css
/* Suppress gray tap overlay on mobile Safari/WebKit */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Remove 300ms double-tap delay on interactive elements */
button,
a,
input,
[role="button"] {
  touch-action: manipulation;
}
```
