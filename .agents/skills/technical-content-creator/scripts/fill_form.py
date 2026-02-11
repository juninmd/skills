#!/usr/bin/env python3
import sys
import argparse

def generate_article_draft(topic):
    """Generates a markdown template for a technical article."""
    template = f"""# Guide: How to Master {topic}

## Introduction
In this tutorial, we will explore the fundamentals of {topic} and build a simple application.

## Prerequisites
- Basic knowledge of Python
- {topic} installed

## Step 1: Installation
Run the following command:
```bash
pip install {topic.lower()}
```

## Step 2: Hello World
Create a file named `main.py` and add:
```python
import {topic.lower()}
print("Hello {topic}!")
```

## Conclusion
You have successfully set up your first {topic} project.
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a technical article draft template.")
    parser.add_argument("topic", help="The topic of the article.")
    args = parser.parse_args()

    print(generate_article_draft(args.topic))

if __name__ == "__main__":
    main()
