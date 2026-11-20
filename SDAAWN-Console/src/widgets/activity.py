"""
Activity widget for SDAAWN Console - CLI terminal with error and debugging information.
"""

import logging
from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QTextEdit, QSplitter
from PySide6.QtCore import QTimer, Qt, QProcess
from PySide6.QtGui import QColor, QFont, QTextCharFormat
from pyte import Screen
import threading
import time
import subprocess
import sys

logger = logging.getLogger(__name__)


class ActivityWidget(QWidget):
    """Activity widget with CLI terminal, error/debug info, and activity log."""
    
    def __init__(self):
        super().__init__()
        self._init_ui()
        self._init_timers()
        
    def _init_ui(self):
        """Initialize the activity/terminal widget."""
        self.setMinimumSize(800, 600)
        self.layout = QVBoxLayout(self)
        self.layout.setContentsMargins(16, 16, 16, 16)
        self.layout.setSpacing(12)
        
        # Header
        header = QLabel("Activity Console")
        header.setFont(QFont("Sans-Serif", 18, QFont.Weight.Bold))
        self.layout.addWidget(header)
        
        # Top row: Terminal + Log
        top_row = QWidget()
        top_layout = QHBoxLayout(top_row)
        top_layout.setSpacing(12)
        
        # Terminal pane
        terminal_container = QWidget()
        term_layout = QVBoxLayout(terminal_container)
        term_layout.setContentsMargins(4, 4, 4, 4)
        
        self.terminal = QTextEdit()
        self.terminal.setReadOnly(True)
        self.terminal.setFont(QFont("Consolas", 10))
        term_layout.addWidget(self.terminal)
        
        terminal_buttons = QWidget()
        term_buttons_layout = QHBoxLayout(terminal_buttons)
        term_buttons_layout.setContentsMargins(4, 4, 4, 4)
        
        self.btn_clear = QPushButton("Clear")
        self.btn_clear.clicked.connect(self.terminal.clear)
        self.btn_resize = QPushButton("Resize")
        self.btn_resize.clicked.connect(self._on_resize)
        self.btn_scrollback = QPushButton("Scrollback")
        self.btn_scrollback.clicked.connect(self._on_scrollback)
        
        term_buttons_layout.addWidget(self.btn_clear)
        term_buttons_layout.addWidget(self.btn_resize)
        term_buttons_layout.addWidget(self.btn_scrollback)
        term_layout.addWidget(terminal_buttons)
        
        top_layout.addWidget(terminal_container)
        
        # Log pane
        log_container = QWidget()
        log_layout = QVBoxLayout(log_container)
        
        log_header = QLabel("Activity Log / Debug")
        log_header.setFont(QFont("Sans-Serif", 12, QFont.Weight.Bold))
        log_layout.addWidget(log_header)
        
        self.log_text = QTextEdit()
        self.log_text.setReadOnly(True)
        self.log_text.setFont(QFont("Consolas", 9))
        log_layout.addWidget(self.log_text)
        
        log_buttons = QWidget()
        log_buttons_layout = QHBoxLayout(log_buttons)
        log_buttons_layout.setContentsMargins(4, 4, 4, 4)
        
        self.btn_clear_log = QPushButton("Clear Log")
        self.btn_clear_log.clicked.connect(self._clear_log)
        self.btn_export_log = QPushButton("Export")
        self.btn_export_log.clicked.connect(self._export_log)
        
        log_buttons_layout.addWidget(self.btn_clear_log)
        log_buttons_layout.addWidget(self.btn_export_log)
        log_layout.addWidget(log_buttons)
        
        top_layout.addWidget(log_container)
        
        self.layout.addWidget(top_row)
        
        # Bottom row: Quick commands
        bottom_row = QWidget()
        bottom_layout = QHBoxLayout(bottom_row)
        bottom_layout.setSpacing(8)
        
        commands_header = QLabel("Quick Commands")
        commands_header.setFont(QFont("Sans-Serif", 12, QFont.Weight.Bold))
        bottom_layout.addWidget(commands_header)
        
        self.cmd_input = QTextEdit()
        self.cmd_input.setMaximumHeight(60)
        self.cmd_input.setFont(QFont("Consolas", 10))
        self.cmd_input.setPlaceholderText("Type command and press Enter...")
        self.cmd_input.returnPressed.connect(self._on_cmd_submit)
        bottom_layout.addWidget(self.cmd_input)
        
        self.layout.addWidget(bottom_row)
        
    def _init_timers(self):
        """Initialize update timers."""
        self._log_timer = QTimer()
        self._log_timer.timeout.connect(self._update_log_display)
        self._log_timer.start(1000)
        
        self._tick_timer = QTimer()
        self._tick_timer.timeout.connect(self._tick_timer_event)
        self._tick_timer.start(500)
        
    def _tick_timer_event(self):
        """Handle periodic tick for terminal updates and metrics."""
        self._update_activity_bars()
        self._update_telemetry_preview()
        
    def _update_telemetry_preview(self):
        """Update telemetry preview display."""
        pass
    
    def _update_activity_bars(self):
        """Update activity bars and metrics."""
        pass
    
    def _on_cmd_submit(self):
        """Handle command submission."""
        cmd = self.cmd_input.toPlainText().strip()
        if cmd:
            self.terminal.append(f"$ {cmd}")
            self._execute_command(cmd)
            self.cmd_input.clear()
            
    def _execute_command(self, cmd: str):
        """Execute a shell command and display output."""
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=10,
                cwd=Path(__file__).parent.parent.parent
            )
            output = result.stdout or result.stderr or "(no output)"
            self.terminal.append(output[:5000])  # Limit output length
        except subprocess.TimeoutExpired:
            self.terminal.append("Error: Command timed out")
        except Exception as e:
            self.terminal.append(f"Error: {e}")
            
    def _update_log_display(self):
        """Update the activity log display."""
        pass
    
    def _clear_log(self):
        """Clear the activity log."""
        self.log_text.clear()
        
    def _export_log(self):
        """Export the activity log to a file."""
        from datetime import datetime
        import os
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = f"activity_log_{timestamp}.txt"
        with open(filepath, "w") as f:
            f.write(self.log_text.toPlainText())
        self.status_bar.showMessage(f"Log exported to {filepath}", 3000)
        
    def _on_resize(self):
        """Handle terminal resize."""
        pass
    
    def _on_scrollback(self):
        """Handle scrollback view."""
        self.terminal.setReadOnly(False)
        self.terminal.setTextInteractionFlags(Qt.TextInteractionFlag.TextEditable)
        self.terminal.setReadOnly(True)
        
    def resizeEvent(self, event):
        """Handle resize events."""
        self._update_layout()
        
    def _update_layout(self):
        """Update layout on resize."""
        pass
    
    def setup_logger(self):
        """Setup logging to the activity log."""
        pass
