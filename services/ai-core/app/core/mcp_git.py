"""
NEXIA MCP Git Server - Git operations automation
Provides safe git operations via MCP protocol
"""
import asyncio
import os
import json
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from .mcp_shell import MCPShellServer, ShellResult

logger = logging.getLogger(__name__)

@dataclass
class GitStatus:
    """Git repository status"""
    branch: str
    is_clean: bool
    staged_files: List[str]
    modified_files: List[str]
    untracked_files: List[str]
    commits_ahead: int
    commits_behind: int

class MCPGitServer:
    """MCP-compliant git server for NEXIA"""
    
    def __init__(self, shell_server: MCPShellServer):
        self.shell = shell_server
    
    async def get_status(self, repo_path: str = None) -> GitStatus:
        """Get git repository status"""
        work_dir = repo_path or self.shell.current_directory
        
        # Check if it's a git repository
        if not await self._is_git_repo(work_dir):
            raise ValueError(f"Directory is not a git repository: {work_dir}")
        
        # Get current branch
        branch_result = await self.shell.execute_command('git', ['branch', '--show-current'], cwd=work_dir)
        current_branch = branch_result.stdout.strip() if branch_result.return_code == 0 else "unknown"
        
        # Get status
        status_result = await self.shell.execute_command('git', ['status', '--porcelain'], cwd=work_dir)
        
        staged_files = []
        modified_files = []
        untracked_files = []
        
        if status_result.return_code == 0:
            for line in status_result.stdout.strip().split('\n'):
                if not line:
                    continue
                status_code = line[:2]
                filename = line[3:]
                
                if status_code[0] != ' ':  # Staged
                    staged_files.append(filename)
                if status_code[1] != ' ':  # Modified
                    modified_files.append(filename)
                if status_code == '??':  # Untracked
                    untracked_files.append(filename)
        
        # Check if working tree is clean
        is_clean = len(staged_files) == 0 and len(modified_files) == 0 and len(untracked_files) == 0
        
        # Get ahead/behind info
        ahead_behind = await self._get_ahead_behind_count(work_dir)
        
        return GitStatus(
            branch=current_branch,
            is_clean=is_clean,
            staged_files=staged_files,
            modified_files=modified_files,
            untracked_files=untracked_files,
            commits_ahead=ahead_behind['ahead'],
            commits_behind=ahead_behind['behind']
        )
    
    async def add_files(self, files: List[str], repo_path: str = None) -> ShellResult:
        """Add files to staging area"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git add", 0)
        
        return await self.shell.execute_command('git', ['add'] + files, cwd=work_dir)
    
    async def commit(self, message: str, repo_path: str = None) -> ShellResult:
        """Create a commit"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git commit", 0)
        
        return await self.shell.execute_command('git', ['commit', '-m', message], cwd=work_dir)
    
    async def push(self, remote: str = 'origin', branch: str = None, repo_path: str = None) -> ShellResult:
        """Push commits to remote"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git push", 0)
        
        args = ['push', remote]
        if branch:
            args.append(branch)
        
        return await self.shell.execute_command('git', args, cwd=work_dir)
    
    async def pull(self, remote: str = 'origin', branch: str = None, repo_path: str = None) -> ShellResult:
        """Pull changes from remote"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git pull", 0)
        
        args = ['pull', remote]
        if branch:
            args.append(branch)
        
        return await self.shell.execute_command('git', args, cwd=work_dir)
    
    async def create_branch(self, branch_name: str, repo_path: str = None) -> ShellResult:
        """Create and switch to new branch"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git checkout", 0)
        
        return await self.shell.execute_command('git', ['checkout', '-b', branch_name], cwd=work_dir)
    
    async def switch_branch(self, branch_name: str, repo_path: str = None) -> ShellResult:
        """Switch to existing branch"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git checkout", 0)
        
        return await self.shell.execute_command('git', ['checkout', branch_name], cwd=work_dir)
    
    async def get_log(self, limit: int = 10, repo_path: str = None) -> ShellResult:
        """Get git log"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git log", 0)
        
        return await self.shell.execute_command(
            'git', 
            ['log', '--oneline', f'-{limit}'], 
            cwd=work_dir
        )
    
    async def get_diff(self, staged: bool = False, repo_path: str = None) -> ShellResult:
        """Get git diff"""
        work_dir = repo_path or self.shell.current_directory
        
        if not await self._is_git_repo(work_dir):
            return ShellResult("", "Not a git repository", 1, "git diff", 0)
        
        args = ['diff']
        if staged:
            args.append('--staged')
        
        return await self.shell.execute_command('git', args, cwd=work_dir)
    
    async def clone_repository(self, repo_url: str, target_dir: str = None) -> ShellResult:
        """Clone a git repository"""
        args = ['clone', repo_url]
        if target_dir:
            args.append(target_dir)
        
        return await self.shell.execute_command('git', args, cwd=self.shell.current_directory)
    
    async def _is_git_repo(self, path: str) -> bool:
        """Check if directory is a git repository"""
        git_dir = os.path.join(path, '.git')
        return os.path.exists(git_dir)
    
    async def _get_ahead_behind_count(self, repo_path: str) -> Dict[str, int]:
        """Get commits ahead/behind remote"""
        result = await self.shell.execute_command(
            'git', 
            ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'], 
            cwd=repo_path
        )
        
        if result.return_code == 0 and result.stdout.strip():
            try:
                ahead, behind = map(int, result.stdout.strip().split())
                return {'ahead': ahead, 'behind': behind}
            except:
                pass
        
        return {'ahead': 0, 'behind': 0}