# Docker Orchestrator Reference

## Commands (via `run_shell_command`)

### 1. `docker run`
**Description:** Runs a command in a new container.
**Common Flags:**
- `-d`: Detached mode.
- `-p [host]:[container]`: Port mapping.
- `-v [host]:[container]`: Volume mapping.
- `--name [name]`: Assign a name to the container.
- `-e [KEY]=[VALUE]`: Set environment variables.

### 2. `docker ps`
**Description:** Lists containers.
**Common Flags:**
- `-a`: Show all containers (default shows just running).
- `-q`: Only display container IDs.

### 3. `docker-compose up`
**Description:** Create and start containers defined in a `docker-compose.yml`.
**Common Flags:**
- `-d`: Detached mode.
- `--build`: Build images before starting containers.

### 4. `docker build`
**Description:** Build an image from a Dockerfile.
**Common Flags:**
- `-t [name]:[tag]`: Name and optionally a tag in the 'name:tag' format.

### 5. `docker inspect`
**Description:** Return low-level information on Docker objects.

### 6. `docker logs`
**Description:** Fetch the logs of a container.

### 7. `docker rm` / `docker rmi`
**Description:** Remove one or more containers / images.
