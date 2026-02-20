# MLOps Engineer Reference

## Tools

### 1. `run_shell_command`
**Description:** Executes shell commands to interact with system tools.
**Usage:**
- **Docker:** `docker build -t my-model:v1 .`, `docker push my-model:v1`
- **Kubernetes:** `kubectl apply -f deployment.yaml`, `kubectl get pods`
- **Git:** `git add .`, `git commit -m "Update model config"`
- **Python:** `python3 scripts/validate_model.py`

### 2. `read_file` / `write_file`
**Description:** Reads and writes configuration files.
**Usage:**
- Reading `Dockerfile`, `requirements.txt`, Kubernetes manifests (`.yaml`).
- Writing/Updating pipeline configurations (`.github/workflows/deploy.yaml`).

### 3. `codebase_investigator`
**Description:** Analyzes the codebase to understand existing ML infrastructure and dependencies.
**Usage:**
- Use to map out where model artifacts are stored and how the current inference service is structured.

## Common CLI Tools (Assumed Available or Installable)
- `docker`
- `kubectl`
- `helm`
- `python3` (with `pip`)
- `git`
