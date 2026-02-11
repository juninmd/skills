# Git Workflow Reference

## Essential Commands

### Branch Management
- `git checkout -b <branch-name>`: Create and switch to a new branch.
- `git branch -d <branch-name>`: Delete a local branch.
- `git push origin -d <branch-name>`: Delete a remote branch.

### Committing Changes
- `git add <file>`: Stage specific files.
- `git add .`: Stage all changes.
- `git commit -m "<message>"`: Create a commit.
- `git commit --amend`: Modify the last commit.

### Syncing
- `git fetch origin`: Download objects and refs from another repository.
- `git pull origin <branch>`: Fetch from and integrate with another repository or a local branch.
- `git push origin <branch>`: Update remote refs along with associated objects.

## Best Practices
- **Atomic Commits:** Each commit should contain one logical change.
- **Descriptive Names:** Use `feature/`, `bugfix/`, `hotfix/` prefixes for branches.
- **Linear History:** Prefer `rebase` over `merge` for feature branches when appropriate.
