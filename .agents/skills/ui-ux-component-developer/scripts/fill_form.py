#!/usr/bin/env python3
import sys
import argparse

def generate_component_docs(component_name):
    """Generates a markdown template for component documentation."""
    template = f"""# Component: {component_name}

## Description
A reusable {component_name} component.

## Usage
```jsx
import {{ {component_name} }} from './{component_name}';

<{component_name} label="Click me" onClick={{handleClick}} />
```

## Props
| Name | Type | Default | Description |
|---|---|---|---|
| label | string | - | The text to display |
| onClick | function | - | Callback function |
| disabled | boolean | false | Whether the component is disabled |

## Accessibility
- Supports keyboard navigation (Tab).
- Uses `aria-label` if no text is provided.
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate component documentation template.")
    parser.add_argument("component_name", help="The name of the component.")
    args = parser.parse_args()

    print(generate_component_docs(args.component_name))

if __name__ == "__main__":
    main()
