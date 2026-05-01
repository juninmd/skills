#!/bin/bash
# create_venv.sh
if command -v uv &> /dev/null; then
    uv venv .venv && source .venv/bin/activate && uv pip install -r requirements.txt
else
    python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
fi
