# VS Code Linux Installation and Workflow

Guidelines for updating VS Code on Debian/Ubuntu systems.

## 1. Prerequisites
- **Architecture:** Debian/Ubuntu x86_64.
- **Tools:** `curl` or `wget`, `sudo`, `apt` or `dpkg`.
- **Disk:** Sufficient temporary space for the `.deb` package (~100MB).

## 2. Manual Update Workflow
1. **Verify:** `uname -m` (Must be `x86_64`).
2. **Download:** 
   ```bash
   curl -L -o /tmp/code_latest_amd64.deb "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"
   ```
3. **Install:** `sudo apt install -y ./code_latest_amd64.deb`.
4. **Verification:** `code --version`.

## 3. Alternative (Official Repository)
For managed fleets, prefer the Microsoft APT repository for automatic updates via `unattended-upgrades`.
- Artifact: `references/install-vscode-repo.sh`.
