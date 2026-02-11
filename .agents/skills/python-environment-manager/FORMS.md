# Form Filling Guide: Python Environment Manager

## Environment Setup Form
To set up a new Python environment, provide the following information:

| Field | Description | Example |
|-------|-------------|---------|
| Python Version | Target Python version | "3.9", "3.11" |
| Tool | Dependency manager to use | "venv", "poetry", "uv" |
| Name | Environment name | ".venv", "env" |

## Package Installation Form
To install packages into an environment:

| Field | Description | Example |
|-------|-------------|---------|
| Packages | List of packages to install | "requests", "numpy pandas" |
| Version Spec | Version constraints | ">=2.0.0", "==1.4.5" |
| Dev Dependency | Install as dev dependency? | "true", "false" |
