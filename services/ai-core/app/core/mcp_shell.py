"""
NEXIA MCP Shell Server - Terminal/shell automation
Provides secure shell access via MCP protocol
"""
import asyncio
import subprocess
import logging
import json
import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class ShellResult:
    """Result of shell command execution"""
    stdout: str
    stderr: str
    return_code: int
    command: str
    execution_time: float

class MCPShellServer:
    """MCP-compliant shell server for NEXIA"""
    
    def __init__(self):
        self.allowed_commands = {
            # Basic navigation
            'ls', 'pwd', 'cd', 'find', 'which', 'tree',
            # File operations
            'cat', 'head', 'tail', 'grep', 'awk', 'sed', 'sort', 'uniq',
            # Git operations
            'git',
            # Package managers
            'npm', 'pnpm', 'yarn', 'pip', 'poetry', 'brew',
            # Development tools
            'node', 'python', 'python3', 'go', 'rustc', 'cargo',
            # System info
            'ps', 'top', 'df', 'du', 'free', 'uname', 'whoami',
            # Docker/containers
            'docker', 'kubectl',
            # Claude Code
            'claude'
        }
        
        self.blocked_commands = {
            'rm', 'rmdir', 'mv', 'cp', 'chmod', 'chown', 'sudo', 'su',
            'kill', 'killall', 'reboot', 'shutdown', 'halt', 'passwd',
            'dd', 'fdisk', 'mkfs', 'mount', 'umount'
        }
        
        self.current_directory = os.path.expanduser("~")
        self.max_execution_time = 30  # seconds
    
    async def execute_command(self, command: str, args: List[str] = None, cwd: str = None) -> ShellResult:
        """Execute shell command safely"""
        start_time = asyncio.get_event_loop().time()
        
        # Security checks
        if not self._is_command_allowed(command):
            return ShellResult(
                stdout="",
                stderr=f"Command '{command}' is not allowed for security reasons",
                return_code=1,
                command=f"{command} {' '.join(args or [])}",
                execution_time=0
            )
        
        # Prepare command
        cmd_args = [command] + (args or [])
        work_dir = cwd or self.current_directory
        
        try:
            # Execute with timeout
            process = await asyncio.create_subprocess_exec(
                *cmd_args,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=work_dir
            )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=self.max_execution_time
            )
            
            execution_time = asyncio.get_event_loop().time() - start_time
            
            # Update current directory if cd command
            if command == 'cd' and process.returncode == 0:
                if args:
                    new_dir = os.path.abspath(os.path.join(work_dir, args[0]))
                    if os.path.exists(new_dir):
                        self.current_directory = new_dir
            
            return ShellResult(
                stdout=stdout.decode('utf-8', errors='ignore'),
                stderr=stderr.decode('utf-8', errors='ignore'),
                return_code=process.returncode,
                command=' '.join(cmd_args),
                execution_time=execution_time
            )
            
        except asyncio.TimeoutError:
            return ShellResult(
                stdout="",
                stderr=f"Command timed out after {self.max_execution_time} seconds",
                return_code=124,
                command=' '.join(cmd_args),
                execution_time=self.max_execution_time
            )
        except Exception as e:
            execution_time = asyncio.get_event_loop().time() - start_time
            return ShellResult(
                stdout="",
                stderr=f"Execution error: {str(e)}",
                return_code=1,
                command=' '.join(cmd_args),
                execution_time=execution_time
            )
    
    def _is_command_allowed(self, command: str) -> bool:
        """Check if command is allowed"""
        base_command = command.split()[0] if ' ' in command else command
        
        # Explicitly blocked
        if base_command in self.blocked_commands:
            return False
        
        # Must be in allowed list
        return base_command in self.allowed_commands
    
    async def start_claude_code_session(self, project_path: str = None) -> ShellResult:
        """Start Claude Code session in specified project"""
        work_dir = project_path or self.current_directory
        
        # Ensure we're in a valid directory
        if not os.path.exists(work_dir):
            return ShellResult(
                stdout="",
                stderr=f"Directory does not exist: {work_dir}",
                return_code=1,
                command=f"claude code {work_dir}",
                execution_time=0
            )
        
        return await self.execute_command('claude', ['code'], cwd=work_dir)
    
    async def list_processes(self) -> ShellResult:
        """List running processes"""
        return await self.execute_command('ps', ['aux'])
    
    async def get_system_info(self) -> Dict[str, Any]:
        """Get system information"""
        info = {}
        
        # Current directory
        info['current_directory'] = self.current_directory
        
        # System info
        uname_result = await self.execute_command('uname', ['-a'])
        if uname_result.return_code == 0:
            info['system'] = uname_result.stdout.strip()
        
        # Disk usage
        df_result = await self.execute_command('df', ['-h'])
        if df_result.return_code == 0:
            info['disk_usage'] = df_result.stdout
        
        # Memory info (if available)
        free_result = await self.execute_command('free', ['-h'])
        if free_result.return_code == 0:
            info['memory'] = free_result.stdout
        
        return info
    
    def get_allowed_commands(self) -> List[str]:
        """Get list of allowed commands"""
        return list(self.allowed_commands)
    
    def get_current_directory(self) -> str:
        """Get current working directory"""
        return self.current_directory