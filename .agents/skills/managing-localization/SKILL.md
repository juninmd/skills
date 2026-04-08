---
name: managing-localization
description: Manage application internationalization and localization, including string extraction, translation files, and locale-specific formatting.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Localization Specialist

## Description
This skill empowers the agent to manage internationalization (i18n) and localization (l10n) for applications. It includes extracting translatable strings, managing translation files, and locale-specific formatting (dates, numbers, and currency).

## Flow

### 1. Internationalization (i18n)
- Identify hardcoded strings in the codebase.
- Replace them with localization calls (e.g., `gettext`, `i18next.t`).
- Ensure layouts support text size variation.

### 2. String Extraction and Management
- Use tools to extract translatable strings into catalogs (e.g., `.po`, `.json` files).
- Organize translation files by locale (e.g., `en-US`, `pt-BR`, `ja-JP`).
- Maintain synchronization between keys and source text.

### 3. Translation (l10n)
- Provide context for translators.
- Translate into target languages (machine or human translation).
- Validate placeholders and formatting codes.

### 4. Formatting and Configuration
- Implement locale-sensitive formatting for dates, times, numbers, and currencies.
- Configure locale detection and switching based on user preference.

## Best Practices
- **Keys vs. Source:** Use meaningful keys (e.g., `welcome_message`) instead of the source text as the key.
- **Pluralization:** Correct rules for plurals, which vary between languages.
- **Context:** Always provide context for ambiguous terms (e.g., "Open" as a verb or an adjective).
