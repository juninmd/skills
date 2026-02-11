#!/usr/bin/env python3
import sys
import argparse

def generate_l10n_report(project_name):
    """Generates a markdown template for a localization status report."""
    template = f"""# Localization Status Report: {project_name}

## Overview
- **Default Locale:** en-US
- **Supported Locales:**
    - en-US
    - es-ES
    - fr-FR

## Translation Coverage
- **es-ES:** 100%
- **fr-FR:** 85%

## Missing Keys
### fr-FR
- `welcome_message`
- `error_404`

## Next Steps
- Complete French translations.
- Add support for pt-BR.
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a localization status report template.")
    parser.add_argument("project_name", help="The name of the project.")
    args = parser.parse_args()

    print(generate_l10n_report(args.project_name))

if __name__ == "__main__":
    main()
