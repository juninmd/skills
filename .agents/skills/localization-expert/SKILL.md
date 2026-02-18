---
name: localization-expert
description: Manage application internationalization and localization including string extraction, translation files, and locale-specific formatting
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Localization Expert Skill

## Description
This skill enables the agent to manage the internationalization (i18n) and localization (l10n) of applications. It handles extraction of translatable strings, management of translation files, and implementation of locale-specific formatting (dates, numbers, currency).

## Workflow

### 1. Internationalize (i18n)
- Identify hardcoded strings in the codebase.
- Replace hardcoded strings with calls to localization functions (e.g., `gettext`, `i18next.t`).
- Ensure UI layouts can accommodate variable text lengths.

### 2. Extract & Manage Strings
- Use tools to extract translatable strings into message catalogs (e.g., `.po`, `.json` files).
- Organize translation files by locale (e.g., `en-US`, `pt-BR`, `ja-JP`).
- Keep source strings and keys synchronized.

### 3. Translate (l10n)
- Provide context for translators.
- Translate strings into target languages (using machine translation or human input).
- Validate translations for placeholders and formatting codes.

### 4. Format & Configure
- Implement locale-aware formatting for dates, times, numbers, and currencies.
- Configure the application to detect and switch locales based on user preference.

## Best Practices
- **Keys vs. Source:** Use meaningful keys for translations (e.g., `welcome_message`) rather than the source text itself if possible.
- **Pluralization:** Handle plural forms correctly, as they vary significantly between languages.
- **Context:** Always provide context for ambiguous terms (e.g., "Open" as a verb vs. an adjective).
