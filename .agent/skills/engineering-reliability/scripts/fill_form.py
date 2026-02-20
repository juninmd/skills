#!/usr/bin/env python3
import sys
import argparse
import datetime

def generate_post_mortem(incident_id):
    """Generates a markdown template for a post-mortem report."""
    date_str = datetime.date.today().isoformat()
    template = f"""# Post-Mortem Report: {incident_id}

## Overview
- **Date:** {date_str}
- **Severity:** SEV1
- **Status:** Resolved

## Impact
Checkout service was unavailable for 45 minutes. Estimated revenue loss: $50k.

## Root Cause
A database migration script locked the `orders` table, causing timeouts in the API.

## Timeline
- **10:00 UTC:** Migration started.
- **10:05 UTC:** Alerts fired for high error rate.
- **10:45 UTC:** Migration rolled back. Service restored.

## Action Items
- [ ] Implement non-blocking migrations (Owner: Database Team)
- [ ] Improve alerting for database locks (Owner: SRE Team)
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a post-mortem report template.")
    parser.add_argument("incident_id", help="The ID of the incident.")
    args = parser.parse_args()

    print(generate_post_mortem(args.incident_id))

if __name__ == "__main__":
    main()
