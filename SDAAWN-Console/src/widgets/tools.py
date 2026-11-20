"""
Tools widget for SDAAWN Console - System features, automation tools, and pipelines.
"""

import logging
from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QListWidget, QListWidgetItem, QSplitter
from PySide6.QtCore import QTimer
from pathlib import Path

logger = logging.getLogger(__name__)


class ToolsWidget(QWidget):
    """Tools widget with system features, automation tools, and pipelines."""
    
    def __init__(self):
        super().__init__()
        self._init_ui()
        self._init_timers()
        
    def _init_ui(self):
        """Initialize the tools UI."""
        self.setMinimumSize(800, 600)
        self.layout = QVBoxLayout(self)
        self.layout.setContentsMargins(16, 16, 16, 16)
        self.layout.setSpacing(12)
        
        # Header
        header = QLabel("Tools & Pipelines")
        header.setFont(QFont("Sans-Serif", 18, QFont.Weight.Bold))
        self.layout.addWidget(header)
        
        # Splitter for left panel (tools list) and right panel (tool details)
        splitter = QSplitter(Qt.Orientation.Horizontal)
        self.layout.addWidget(splitter)
        
        # Left panel - Tools list
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_layout.setSpacing(8)
        
        tools_header = QLabel("Available Tools")
        tools_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        left_layout.addWidget(tools_header)
        
        self.tools_list = QListWidget()
        self.tools_list.addItem("CLI Terminal")
        self.tools_list.addItem("Website Monitor")
        self.tools_list.addItem("Git Sync")
        self.tools_list.addItem("Cloudflare Deploy")
        self.tools_list.addItem("Telemetry Dashboard")
        self.tools_list.addItem("Config Manager")
        self.tools_list.addItem("Environment Variables")
        self.tools_list.addItem("Activity Logger")
        self.tools_list.addItem("Backup / Restore")
        self.tools_list.itemClicked.connect(self._on_tool_selected)
        left_layout.addWidget(self.tools_list)
        
        # Right panel - Tool details
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setSpacing(8)
        
        details_header = QLabel("Tool Details")
        details_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        right_layout.addWidget(details_header)
        
        self.details_label = QLabel("Select a tool to see details")
        self.details_label.setWordWrap(True)
        right_layout.addWidget(self.details_label)
        
        splitter.addWidget(left_panel)
        splitter.addWidget(right_panel)
        splitter.setSizes([300, 500])
        
    def _init_timers(self):
        """Initialize update timers."""
        self._timer = QTimer()
        self._timer.timeout.connect(self._refresh_tool_list)
        self._timer.start(5000)
        
    def _on_tool_selected(self, item):
        """Handle tool selection."""
        self.details_label.setText(f"Selected: {item.text()}\n\nUse Ctrl+Shift+E to execute or open the CLI terminal for advanced operations.")
        
    def _refresh_tool_list(self):
        """Refresh the tools list."""
        pass
    
    def resizeEvent(self, event):
        """Handle resize events."""
        self._update_layout()
