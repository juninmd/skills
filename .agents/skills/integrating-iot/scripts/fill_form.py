#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_iot_report(device_id):
    """Generates a markdown template for an IoT sensor report."""
    time_str = datetime.datetime.now().isoformat()
    template = f"""# IoT Sensor Report: {device_id}

## Timestamp
{time_str}

## Status
Online

## Readings
- **Temperature:** 24.5 C
- **Humidity:** 45%
- **Battery:** 88%

## Alerts
None
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate an IoT sensor report template.")
    parser.add_argument("device_id", help="The ID of the device.")
    args = parser.parse_args()

    print(generate_iot_report(args.device_id))

if __name__ == "__main__":
    main()
