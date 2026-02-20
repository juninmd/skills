#!/usr/bin/env python3
import sys
import argparse

def generate_component_docs(component_name):
    """Generates a markdown template for React Native component documentation."""
    template = f"""# Component: {component_name}

## Description
A reusable {component_name} component for React Native.

## Usage
```jsx
import {{ {component_name} }} from './components/{component_name}';

<{component_name} title="Press me" onPress={{handlePress}} />
```

## Props
| Name | Type | Default | Description |
|---|---|---|---|
| title | string | - | The button title |
| onPress | function | - | Callback when pressed |
| style | ViewStyle | {{}} | Custom styles |

## Accessibility
- Uses `accessibilityLabel` for screen readers.
- Supports `accessibilityRole` (e.g., 'button', 'image').
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate React Native component documentation template.")
    parser.add_argument("component_name", help="The name of the component.")
    args = parser.parse_args()

    print(generate_component_docs(args.component_name))

if __name__ == "__main__":
    main()
