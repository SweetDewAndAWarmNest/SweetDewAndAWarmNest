"""
GitService - Git operations and repository management for SDAAWN Console.
"""

import logging
from pathlib import Path
from git import Repo, InvalidGitRepositoryError, GitCommandError
from typing import Optional

logger = logging.getLogger(__name__)


class GitService:
    """Git operations and repository management."""
    
    def __init__(self, base_path: Optional[Path] = None):
        self.base_path = base_path or Path(__file__).parent.parent.parent
        self.repos = {}
        
    def discover_repositories(self) -> list:
        """Discover Git repositories in the project."""
        repos = []
        for path in self.base_path.rglob(".git"):
            repo_path = path.parent
            try:
                repo = Repo(repo_path)
                if repo.bare:
                    continue
                repos.append({
                    "path": str(repo_path),
                    "name": repo_path.name,
                    "branch": repo.active_branch.name,
                    "is_dirty": repo.is_dirty(),
                    "status": "clean" if not repo.is_dirty() else "dirty",
                    "commit_count": len(list(repo.iter_commits("master"))),
                })
            except (InvalidGitRepositoryError, GitCommandError):
                continue
        return repos
    
    def get_repo_status(self, repo_path: Path) -> dict:
        """Get detailed status of a repository."""
        try:
            repo = Repo(repo_path)
            return {
                "path": str(repo_path),
                "name": repo_path.name,
                "branch": repo.active_branch.name,
                "is_dirty": repo.is_dirty(),
                "status": "dirty" if repo.is_dirty() else "clean",
                "commit_count": len(list(repo.iter_commits("master"))),
                "untracked_files": len(repo.untracked_files),
                "staged_changes": len(repo.index.diff("HEAD")),
                "last_commit": str(repo.head.commit)[:8] if repo.head.commit else "None",
            }
        except (InvalidGitRepositoryError, GitCommandError) as e:
            return {"error": str(e)}
    
    def pull(self, repo_path: Path) -> str:
        """Pull latest changes from remote."""
        try:
            repo = Repo(repo_path)
            origin = repo.remotes.origin
            origin.pull()
            return "Pull successful"
        except (InvalidGitRepositoryError, GitCommandError) as e:
            return f"Pull failed: {e}"
    
    def push(self, repo_path: Path) -> str:
        """Push changes to remote."""
        try:
            repo = Repo(repo_path)
            origin = repo.remotes.origin
            origin.push()
            return "Push successful"
        except (InvalidGitRepositoryError, GitCommandError) as e:
            return f"Push failed: {e}"
    
    def fetch(self, repo_path: Path) -> str:
        """Fetch latest changes from remote."""
        try:
            repo = Repo(repo_path)
            origin = repo.remotes.origin
            origin.fetch()
            return "Fetch successful"
        except (InvalidGitRepositoryError, GitCommandError) as e:
            return f"Fetch failed: {e}"
    
    def commit(self, repo_path: Path, message: str) -> str:
        """Commit changes to repository."""
        try:
            repo = Repo(repo_path)
            repo.index.add([str(p) for p in repo.untracked_files])
            repo.index.commit(message)
            return "Commit successful"
        except (InvalidGitRepositoryError, GitCommandError) as e:
            return f"Commit failed: {e}"
    
    def sync_all(self) -> dict:
        """Sync all discovered repositories."""
        repos = self.discover_repositories()
        results = {}
        for repo in repos:
            status = self.get_repo_status(Path(repo["path"]))
            results[repo["name"]] = status
        return results
