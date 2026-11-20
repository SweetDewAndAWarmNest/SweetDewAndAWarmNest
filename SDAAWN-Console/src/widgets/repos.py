"""
Repos widget for SDAAWN Console - Git integration and project management.
"""

import logging
from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QListWidget, QListWidgetItem
from PySide6.QtCore import QTimer, Qt
from pathlib import Path

logger = logging.getLogger(__name__)


class ReposWidget(QWidget):
    """Repos widget with Git integration and project management."""
    
    def __init__(self):
        super().__init__()
        self._init_ui()
        self._init_timers()
        
    def _init_ui(self):
        """Initialize the repos UI."""
        self.setMinimumSize(800, 600)
        self.layout = QVBoxLayout(self)
        self.layout.setContentsMargins(16, 16, 16, 16)
        self.layout.setSpacing(12)
        
        # Header
        header = QLabel("Projects & Repositories")
        header.setFont(QFont("Sans-Serif", 18, QFont.Weight.Bold))
        self.layout.addWidget(header)
        
        # Splitter for left (repo list) and right (repo details/actions)
        splitter = QSplitter(Qt.Orientation.Horizontal)
        self.layout.addWidget(splitter)
        
        # Left panel - Repo list
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_layout.setSpacing(8)
        
        repos_header = QLabel("Repository List")
        repos_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        left_layout.addWidget(repos_header)
        
        self.repos_list = QListWidget()
        self.repos_list.addItem("MentalHealthSanctuary")
        self.repos_list.addItem("SDAAWN-Console")
        self.repos_list.addItem("frameworm-framework")
        self.repos_list.addItem("sdaawn-website")
        self.repos_list.itemClicked.connect(self._on_repo_selected)
        left_layout.addWidget(self.repos_list)
        
        # Tools for repos
        tools_header = QLabel("Repository Actions")
        tools_header.setFont(QFont("Sans-Serif", 12, QFont.Weight.Bold))
        left_layout.addWidget(tools_header)
        
        self.btn_sync = QPushButton("Sync All")
        self.btn_sync.clicked.connect(self._sync_all)
        self.btn_pull = QPushButton("Pull All")
        self.btn_pull.clicked.connect(self._pull_all)
        self.btn_status = QPushButton("Git Status")
        self.btn_status.clicked.connect(self._git_status)
        self.btn_log = QPushButton("View Log")
        self.btn_log.clicked.connect(self._view_log)
        
        left_layout.addWidget(self.btn_sync)
        left_layout.addWidget(self.btn_pull)
        left_layout.addWidget(self.btn_status)
        left_layout.addWidget(self.btn_log)
        
        splitter.addWidget(left_panel)
        
        # Right panel - Repo details
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setSpacing(8)
        
        details_header = QLabel("Repository Details")
        details_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        right_layout.addWidget(details_header)
        
        self.details_label = QLabel("Select a repository to view details")
        self.details_label.setWordWrap(True)
        right_layout.addWidget(self.details_label)
        
        # Quick stats
        stats_layout = QHBoxLayout()
        self.repo_status = QLabel("Status: Not selected")
        self.repo_status.setFont(QFont("Sans-Serif", 11))
        stats_layout.addWidget(self.repo_status)
        self.repo_branch = QLabel("Branch: main")
        self.repo_branch.setFont(QFont("Sans-Serif", 11))
        stats_layout.addWidget(self.repo_branch)
        self.repo_commits = QLabel("Commits: 0")
        self.repo_commits.setFont(QFont("Sans-Serif", 11))
        stats_layout.addWidget(self.repo_commits)
        right_layout.addLayout(stats_layout)
        
        splitter.addWidget(right_panel)
        splitter.setSizes([300, 500])
        
    def _init_timers(self):
        """Initialize update timers."""
        self._timer = QTimer()
        self._timer.timeout.connect(self._refresh_repo_list)
        self._timer.start(5000)
        
    def _on_repo_selected(self, item):
        """Handle repository selection."""
        self.details_label.setText(f"Repository: {item.text()}\n\nSelect repository to view detailed status.")
        
    def _refresh_repo_list(self):
        """Refresh the repository list."""
        pass
    
    def _sync_all(self):
        """Sync all repositories."""
        pass
    
    def _pull_all(self):
        """Pull all repositories."""
        pass
    
    def _git_status(self):
        """Show Git status."""
        pass
    
    def _view_log(self):
        """View Git log."""
        pass
    
    def resizeEvent(self, event):
        """Handle resize events."""
        self._update_layout()
        
    def _update_layout(self):
        """Update layout on resize."""
        pass
