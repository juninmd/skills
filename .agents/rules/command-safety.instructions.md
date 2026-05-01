---
name: command-safety
description: "Use when running destructive commands, managing processes, or handling risky file operations in development workflows. Triggers: destructive command, command safety, process cleanup, risky file operation."
applyTo: '**/*.sh, **/Makefile, **/.github/workflows/*.yml, **/Dockerfile'
---

# Rule: Command Safety

> **Mission:** Verify before destroy. Dry-run first. Least privilege always.

## Restricted Commands

### rm -rf (MAXIMUM DANGER)

```bash
# ❌ NEVER with variables
rm -rf $DIR/
rm -rf ${VAR}/
rm -rf $1/  # function argument without validation

# ✅ ALWAYS with full path validation
if [[ -d "/safe/path" ]]; then
  rm -rf /safe/path
fi

# ✅ DRY RUN FIRST
echo "Would delete:"
find . -name "*.log" -type f
```

### sudo (Use Sparingly)

```bash
# ✅ Only for system packages
sudo apt-get update && sudo apt-get install -y nginx

# ❌ NEVER for npm/bun/pip (breaks system env)
sudo npm install -g <package>
sudo pip install <package>
```

### pkill / kill (Process Control)

```bash
# ✅ Find first, then kill
ps aux | grep node
kill -15 <pid>  # SIGTERM (graceful)

# ✅ pkill with pattern (safer)
pkill -f "node.*server"  # only if truly needed

# ❌ NEVER SIGKILL (-9) without trying SIGTERM first
kill -9 <pid>
```

### chmod (Permissions)

```bash
# ❌ NEVER 777
chmod 777 file

# ✅ Least privilege
chmod 644 file      # files
chmod 755 directory # executables
chmod 600 .env      # secrets
chmod 400 *.key     # private keys
```

### git push --force (ALERT LEVEL: MAXIMUM)

```bash
# ❌ NEVER on main/master/shared branches
git push --force origin main

# ✅ Only on personal dev branches
git push --force origin feature/my-branch

# ✅ Prefer force-with-lease (safer)
git push --force-with-lease origin feature/my-branch
```

### mv (Move/Rename)

```bash
# ✅ Always verify destination
mv source.txt /backup/$(basename source.txt)
if [[ -f "/backup/source.txt" ]]; then
  echo "Move successful"
fi

# ❌ Avoid overwriting
mv file1 file2  # overwrites without warning
```

## Confirmation Protocol

### Batch Destructive Commands

```bash
# ALWAYS dry-run first
find . -name "*.log" -type f -delete --dry-run

# Echo instead of execute
for f in *.tmp; do echo "Would delete: $f"; done

# Real execution after confirmation
read -p "Delete above files? (y/n) " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
  find . -name "*.tmp" -type f -delete
fi
```

## PowerShell Safety (Windows)

```powershell
# ❌ DANGER: rm -rf equivalent
Remove-Item -Recurse -Force $dir

# ✅ Safe: confirm first
Remove-Item -Recurse -Force $dir -WhatIf

# ✅ Validate path exists
if (Test-Path $dir) {
  Remove-Item -Recurse -Force $dir
}

# ❌ NEVER with variable expansion
Remove-Item -Recurse -Force "$$env:VARIABLE"
```

## Security Alert Format

When suggesting dangerous commands, always format as:

````markdown
## ⚠️ SECURITY ALERT

**Command:** `rm -rf $DIR/`

**Risk:** Permanently deletes files at `$DIR/`

**Safety Check:**
- [ ] `$DIR` is a full absolute path
- [ ] You have verified contents are safe to delete
- [ ] No unexpanded variables remain

**Safe Alternative:**
```bash
echo "Files to delete:"
ls -la $DIR/
read -p "Proceed? (y/n) " confirm
```
````

## Checklist

- [ ] `rm -rf` always has full path (no variables)
- [ ] Dry-run before destructive operations
- [ ] No `sudo npm` or `sudo pip`
- [ ] `chmod` uses least privilege (644/755/600/400)
- [ ] `git push --force` only on personal branches
- [ ] `kill` uses SIGTERM before SIGKILL
