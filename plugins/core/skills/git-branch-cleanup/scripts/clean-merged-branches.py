"""Safely detect and delete merged and squash-merged Git branches locally and remotely."""

import argparse
import json
import shutil
import subprocess
import sys
import urllib.parse


def run_cmd(cmd, check=True):
    res = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    if check and res.returncode != 0:
        raise RuntimeError(f"Command failed ({res.returncode}): {cmd}\n{res.stderr.strip()}")
    return res.stdout.strip()


def get_repo_nwo():
    try:
        return run_cmd("gh repo view --json nameWithOwner --jq .nameWithOwner")
    except Exception:
        return None


def get_default_branch():
    try:
        ref = run_cmd("git symbolic-ref refs/remotes/origin/HEAD")
        return ref.split("/")[-1]
    except Exception:
        for candidate in ("main", "master"):
            res = subprocess.run(f"git rev-parse --verify {candidate}", capture_output=True, shell=True)
            if res.returncode == 0:
                return candidate
        return "main"


def get_active_worktree_branches():
    branches = set()
    try:
        lines = run_cmd("git worktree list --porcelain").splitlines()
        for line in lines:
            if line.startswith("branch "):
                ref = line.split(" ", 1)[1].strip()
                branches.add(ref.replace("refs/heads/", ""))
    except Exception:
        pass
    return branches


def get_merged_pr_heads(base_branch, limit=500):
    cmd = f"gh pr list --state merged --base {base_branch} --limit {limit} --json headRefName,number"
    output = run_cmd(cmd)
    prs = json.loads(output)
    return {p["headRefName"]: p["number"] for p in prs if "headRefName" in p}


def get_remote_branches(repo_nwo):
    cmd = f"gh api repos/{repo_nwo}/branches --paginate --jq .[].name"
    return [b.strip() for b in run_cmd(cmd).splitlines() if b.strip()]


def get_local_branches():
    lines = run_cmd("git branch --list").splitlines()
    return [b.strip().lstrip("*+ ") for b in lines if b.strip()]


def delete_remote_branch(repo_nwo, branch_name):
    ref_encoded = "/".join(urllib.parse.quote(part, safe="") for part in branch_name.split("/"))
    cmd = f"gh api --method DELETE repos/{repo_nwo}/git/refs/heads/{ref_encoded}"
    res = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    return res.returncode == 0


def delete_local_branch(branch_name):
    res = subprocess.run(f'git branch -D "{branch_name}"', capture_output=True, text=True, shell=True)
    return res.returncode == 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Report candidates without deleting")
    parser.add_argument("--remote", action="store_true", help="Delete eligible remote branches on GitHub")
    parser.add_argument("--local", action="store_true", help="Delete eligible local branches")
    parser.add_argument("--all", action="store_true", help="Delete eligible branches both remotely and locally")
    parser.add_argument("--base", default=None, help="Base branch (default: auto-detected default branch)")
    parser.add_argument("--limit", type=int, default=500, help="Max merged PRs to inspect")
    parser.add_argument("--yes", "-y", action="store_true", help="Confirm deletion without interactive prompt")
    args = parser.parse_args()

    if not shutil.which("git"):
        parser.error("git must be installed and available on PATH")
    if not shutil.which("gh"):
        parser.error("gh (GitHub CLI) must be installed and authenticated on PATH")

    repo_nwo = get_repo_nwo()
    if not repo_nwo:
        parser.error("Unable to determine GitHub repository nameWithOwner; check gh auth status")

    base = args.base or get_default_branch()
    current_branch = run_cmd("git branch --show-current", check=False)
    worktree_branches = get_active_worktree_branches()

    protected = {"main", "master", base, current_branch} | worktree_branches

    print(f"Repository: {repo_nwo}")
    print(f"Base branch: {base}")
    print(f"Current branch: {current_branch}")
    print(f"Protected branches: {', '.join(sorted(b for b in protected if b))}")

    merged_prs = get_merged_pr_heads(base, limit=args.limit)
    print(f"Found {len(merged_prs)} merged pull requests into '{base}'.")

    remote_branches = get_remote_branches(repo_nwo)
    local_branches = get_local_branches()

    remote_candidates = [b for b in remote_branches if b in merged_prs and b not in protected]
    local_candidates = [b for b in local_branches if b in merged_prs and b not in protected]

    print(f"\nCandidate remote branches to delete ({len(remote_candidates)}):")
    for b in remote_candidates:
        print(f"  - {b} (PR #{merged_prs[b]})")

    print(f"\nCandidate local branches to delete ({len(local_candidates)}):")
    for b in local_candidates:
        print(f"  - {b} (PR #{merged_prs[b]})")

    delete_remote_target = args.all or args.remote
    delete_local_target = args.all or args.local

    if args.dry_run or not (delete_remote_target or delete_local_target):
        print("\nDry-run complete. Pass --all (or --remote / --local) to delete branches.")
        return 0

    if not args.yes:
        print("\nDeletion requires confirmation. Pass --yes to confirm.")
        return 1

    if delete_remote_target and remote_candidates:
        print(f"\nDeleting {len(remote_candidates)} remote branches...")
        success = 0
        for b in remote_candidates:
            if delete_remote_branch(repo_nwo, b):
                success += 1
            else:
                print(f"Failed to delete remote branch: {b}")
        print(f"Deleted {success}/{len(remote_candidates)} remote branches.")

    if delete_local_target and local_candidates:
        print(f"\nDeleting {len(local_candidates)} local branches...")
        success = 0
        for b in local_candidates:
            if delete_local_branch(b):
                success += 1
            else:
                print(f"Failed to delete local branch: {b}")
        print(f"Deleted {success}/{len(local_candidates)} local branches.")

    run_cmd("git fetch --prune", check=False)
    run_cmd("git worktree prune", check=False)
    print("\nPruned tracking references and worktrees.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
