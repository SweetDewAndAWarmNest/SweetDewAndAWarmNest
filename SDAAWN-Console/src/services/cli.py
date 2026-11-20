"""
CLIService - Built-in CLI terminal service for SDAAWN Console.
"""

import logging
import subprocess
import threading
import time
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class CLIService:
    """Built-in CLI terminal service for SDAAWN Console."""
    
    def __init__(self, base_path: Optional[Path] = None):
        self.base_path = base_path or Path(__file__).parent.parent.parent
        self.process = None
        self.running = False
        self.output_buffer = []
        
    def start(self):
        """Start the CLI terminal session."""
        self.running = True
        self.output_buffer = []
        self._output_thread = threading.Thread(target=self._output_handler, daemon=True)
        self._output_thread.start()
        
    def run_command(self, cmd: str, timeout: int = 30) -> str:
        """Run a command and return output."""
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=self.base_path,
            )
            output = result.stdout or result.stderr or "(no output)"
            self.output_buffer.append({
                "timestamp": time.time(),
                "command": cmd,
                "output": output,
                "success": result.returncode == 0,
            })
            return output
        except subprocess.TimeoutExpired:
            return "Error: Command timed out"
        except Exception as e:
            return f"Error: {e}"
    
    def execute_pipeline(self, commands: list, timeout: int = 30) -> str:
        """Execute a pipeline of commands."""
        result = ""
        for cmd in commands:
            result += self.run_command(cmd, timeout)
            result += "\n"
        return result
        
    def is_command_available(self, cmd: str) -> bool:
        """Check if a command is available."""
        try:
            subprocess.run(cmd, shell=True, capture_output=True, timeout=5, check=False)
            return True
        except Exception:
            return False
        
    def list_commands(self) -> list:
        """List available commands."""
        return [
            cmd for cmd in ["git", "cf", "python", "node", "npm", "cargo", "pip"]
            if self.is_command_available(cmd)
        ]
    
    def _output_handler(self):
        """Handle output from commands."""
        while self.running:
            time.sleep(0.1)
            
    def stop(self):
        """Stop the CLI terminal session."""
        self.running = False
        if self.process:
            self.process.terminate()
