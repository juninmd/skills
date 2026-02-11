#!/usr/bin/env python3
import sys
import argparse

def generate_vision_report(task):
    """Generates a markdown template for a computer vision analysis report."""
    template = f"""# Vision Analysis Report: {task}

## Input
`image.jpg`

## Detections
- **Person** (Confidence: 0.92) - [100, 50, 200, 300]
- **Bicycle** (Confidence: 0.85) - [220, 100, 300, 300]

## Extracted Text (OCR)
"STOP"

## Processed Image
`output_image.jpg`
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a vision analysis report template.")
    parser.add_argument("task", help="The vision task performed.")
    args = parser.parse_args()

    print(generate_vision_report(args.task))

if __name__ == "__main__":
    main()
