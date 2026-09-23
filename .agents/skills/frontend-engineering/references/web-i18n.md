# Web Internationalization (i18n)

Open when a web UI must ship in more than one language or locale: extracting strings, plurals, dates, currency, right-to-left layouts, locale routing. Flutter and native mobile localization belong to `mobile-engineering`.

## Contents

- Decide first
- Messages
- Formatting with Intl
- Layout and RTL
- Routing, SEO, and negotiation
- Verify

## Decide first

| Question | Default |
|---|---|
| Message format | ICU MessageFormat, so plurals, select, and placeholders live in the translation, not in code |
| Library | Next.js App Router: `next-intl`. Other React apps: `react-intl` (FormatJS). Keep the one already in the repo |
| Source of truth | One catalog per locale (`messages/en.json`, `messages/pt-BR.json`), keys by feature (`checkout.total`), never by English text |
| Fallback | Missing key falls back to the default locale and is logged in development; CI fails on keys missing from the default catalog |
| Locale identifiers | BCP 47 tags (`pt-BR`, `es-419`); never infer locale from country or IP alone |

## Messages

- Never concatenate translated fragments: `t("hello") + name` breaks word order. Use one message with placeholders: `"greeting": "Olá, {name}"`.
- Plurals go through ICU `plural`, not `count === 1 ? … : …`. Languages have up to six plural categories (`zero`, `one`, `two`, `few`, `many`, `other`); always supply `other`.
- Gender and variants use ICU `select`.
- Rich text uses tag placeholders (`<link>terms</link>`) rendered by the library, never `dangerouslySetInnerHTML` on translated strings: a translation is untrusted input.
- Give translators context: a description per key, max length where the layout is tight, and a screenshot for ambiguous words.
- Keep user-generated content out of catalogs; it is data, not UI text.

## Formatting with Intl

Format at render time with the active locale. Never hand-build dates, numbers, or currency.

```ts
const locale = "pt-BR";
new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(1234.5); // "R$ 1.234,50"
new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(date);
new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-1, "day"); // "ontem"
new Intl.ListFormat(locale, { type: "conjunction" }).format(["a", "b", "c"]); // "a, b e c"
new Intl.PluralRules(locale).select(2); // "other"
```

- Store instants in UTC; format with an explicit `timeZone`. A server render without one uses the server's zone and causes hydration mismatches.
- Currency comes from the data (the order's currency), not from the viewer's locale.
- Sort user-visible lists with `Intl.Collator(locale)`, not `Array.prototype.sort()` default ordering.

## Layout and RTL

- Set `<html lang="…" dir="…">` per locale; `dir="rtl"` for Arabic, Hebrew, Persian, Urdu.
- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`) and Tailwind's logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`) instead of left/right.
- Mirror directional icons (arrows, chevrons) in RTL; never mirror logos, media controls, or numbers.
- Budget for text expansion: German and Portuguese often run 30% longer than English. No fixed-width buttons around text.

## Routing, SEO, and negotiation

- Put the locale in the URL (`/pt-BR/checkout`) so pages are shareable and cacheable; a cookie alone is invisible to crawlers and caches.
- Negotiate the first visit from `Accept-Language`, then respect the user's explicit choice over it.
- Emit `<link rel="alternate" hreflang="…">` for every locale plus `x-default`.
- Vary caches on the locale segment, not on `Accept-Language`.

## Verify

1. Pseudo-localize (accented, 30–40% longer strings) and walk every screen: truncation and hard-coded text show immediately.
2. Run one RTL locale end to end.
3. Check that every key in the default catalog exists in each shipped locale, in CI.
4. Snapshot formatted dates, numbers, and currency per locale in unit tests, with a fixed `timeZone`.
5. Screen reader check: `lang` matches the content so speech uses the right voice.
