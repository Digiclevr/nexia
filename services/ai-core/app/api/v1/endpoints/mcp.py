"""
MCP (Model Context Protocol) API endpoints
Provides access to shell, git, and other system tools
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging

from app.core.ai_engine import NexiaEngine

logger = logging.getLogger(__name__)
router = APIRouter()

# Request/Response models
class ShellCommandRequest(BaseModel):
    command: str
    args: Optional[List[str]] = None
    cwd: Optional[str] = None

class ShellCommandResponse(BaseModel):
    stdout: str
    stderr: str
    return_code: int
    command: str
    execution_time: float

class GitStatusResponse(BaseModel):
    branch: str
    is_clean: bool
    staged_files: List[str]
    modified_files: List[str]
    untracked_files: List[str]
    commits_ahead: int
    commits_behind: int

class GitActionRequest(BaseModel):
    action: str  # commit, push, pull, add, etc.
    files: Optional[List[str]] = None
    message: Optional[str] = None
    branch: Optional[str] = None
    remote: Optional[str] = "origin"
    repo_path: Optional[str] = None

@router.post("/shell/execute", response_model=ShellCommandResponse)
async def execute_shell_command(request: ShellCommandRequest):
    """Execute a shell command safely"""
    try:
        engine = NexiaEngine()
        result = await engine.mcp_shell.execute_command(
            command=request.command,
            args=request.args,
            cwd=request.cwd
        )
        
        return ShellCommandResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            return_code=result.return_code,
            command=result.command,
            execution_time=result.execution_time
        )
    except Exception as e:
        logger.error(f"Shell command error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/shell/info")
async def get_shell_info():
    """Get shell and system information"""
    try:
        engine = NexiaEngine()
        info = await engine.mcp_shell.get_system_info()
        info['allowed_commands'] = engine.mcp_shell.get_allowed_commands()
        return info
    except Exception as e:
        logger.error(f"Shell info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/shell/claude-code")
async def start_claude_code(request: ShellCommandRequest):
    """Start Claude Code session"""
    try:
        engine = NexiaEngine()
        result = await engine.mcp_shell.start_claude_code_session(request.cwd)
        
        return ShellCommandResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            return_code=result.return_code,
            command=result.command,
            execution_time=result.execution_time
        )
    except Exception as e:
        logger.error(f"Claude Code start error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/git/status", response_model=GitStatusResponse)
async def get_git_status(repo_path: Optional[str] = None):
    """Get git repository status"""
    try:
        engine = NexiaEngine()
        status = await engine.mcp_git.get_status(repo_path)
        
        return GitStatusResponse(
            branch=status.branch,
            is_clean=status.is_clean,
            staged_files=status.staged_files,
            modified_files=status.modified_files,
            untracked_files=status.untracked_files,
            commits_ahead=status.commits_ahead,
            commits_behind=status.commits_behind
        )
    except Exception as e:
        logger.error(f"Git status error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/git/action")
async def execute_git_action(request: GitActionRequest):
    """Execute git action (commit, push, pull, add, etc.)"""
    try:
        engine = NexiaEngine()
        
        if request.action == "add":
            if not request.files:
                raise HTTPException(status_code=400, detail="Files required for add action")
            result = await engine.mcp_git.add_files(request.files, request.repo_path)
        
        elif request.action == "commit":
            if not request.message:
                raise HTTPException(status_code=400, detail="Message required for commit action")
            result = await engine.mcp_git.commit(request.message, request.repo_path)
        
        elif request.action == "push":
            result = await engine.mcp_git.push(request.remote, request.branch, request.repo_path)
        
        elif request.action == "pull":
            result = await engine.mcp_git.pull(request.remote, request.branch, request.repo_path)
        
        elif request.action == "log":
            result = await engine.mcp_git.get_log(10, request.repo_path)
        
        elif request.action == "diff":
            result = await engine.mcp_git.get_diff(False, request.repo_path)
        
        elif request.action == "diff-staged":
            result = await engine.mcp_git.get_diff(True, request.repo_path)
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown git action: {request.action}")
        
        return ShellCommandResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            return_code=result.return_code,
            command=result.command,
            execution_time=result.execution_time
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Git action error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tools/available")
async def get_available_tools():
    """Get list of available MCP tools"""
    return {
        "shell": {
            "commands": [
                "execute", "info", "claude-code"
            ],
            "description": "Shell command execution and system info"
        },
        "git": {
            "commands": [
                "status", "add", "commit", "push", "pull", "log", "diff"
            ],
            "description": "Git repository operations"
        },
        "claude_bridge": {
            "commands": [
                "ask", "status"
            ],
            "description": "Direct access to Claude.ai via browser automation"
        }
    }