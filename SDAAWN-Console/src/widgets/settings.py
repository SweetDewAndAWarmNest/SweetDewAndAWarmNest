"""
Settings widget for SDAAWN Console - Settings and Environment Variables.
"""

import logging
from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QTextEdit, QListWidget, QListWidgetItem
from PySide6.QtCore import QTimer, QMetaObject, Q_ARG
from pathlib import Path

logger = logging.getLogger(__name__)


class SettingsWidget(QWidget):
    """Settings widget with environment variables and configuration settings."""
    
    def __init__(self):
        super().__init__()
        self._init_ui()
        self._init_timers()
        
    def _init_ui(self):
        """Initialize the settings UI."""
        self.setMinimumSize(800, 600)
        self.layout = QVBoxLayout(self)
        self.layout.setContentsMargins(16, 16, 16, 16)
        self.layout.setSpacing(12)
        
        # Header
        header = QLabel("Settings & Configuration")
        header.setFont(QFont("Sans-Serif", 18, QFont.Weight.Bold))
        self.layout.addWidget(header)
        
        # Tabs for different settings sections
        self.tabs = QWidget()
        self.tabs_layout = QVBoxLayout(self.tabs)
        self.tabs_layout.setSpacing(12)
        
        # Tab buttons
        self.tab_env = QPushButton("Environment Variables")
        self.tab_env.clicked.connect(lambda: self._switch_tab("env"))
        self.tab_env.setCheckable(True)
        
        self.tab_general = QPushButton("General Settings")
        self.tab_general.clicked.connect(lambda: self._switch_tab("general"))
        self.tab_general.setCheckable(True)
        
        self.tab_cli = QPushButton("CLI Configuration")
        self.tab_cli.clicked.connect(lambda: self._switch_tab("cli"))
        self.tab_cli.setCheckable(True)
        
        self.tab_cloud = QPushButton("Cloudflare Config")
        self.tab_cloud.clicked.connect(lambda: self._switch_tab("cloud"))
        self.tab_cloud.setCheckable(True)
        
        self.tabs_layout.addWidget(self.tab_env)
        self.tabs_layout.addWidget(self.tab_general)
        self.tabs_layout.addWidget(self.tab_cli)
        self.tabs_layout.addWidget(self.tab_cloud)
        
        self.tabs_layout.addWidget(QLabel("Selected: Environment Variables (default)"))
        
        self.layout.addWidget(self.tabs)
        
        # Content area
        self.content_area = QWidget()
        self.content_layout = QVBoxLayout(self.content_area)
        self.content_layout.setSpacing(12)
        self.layout.addWidget(self.content_area)
        
        # Initialize tab content
        self._init_env_tab()
        self._init_general_tab()
        self._init_cli_tab()
        self._init_cloud_tab()
        
        self._switch_tab("env")
        
    def _switch_tab(self, tab_name: str):
        """Switch between settings tabs."""
        # Update button states
        for btn, name in [(self.tab_env, "env"), (self.tab_general, "general"), 
                          (self.tab_cli, "cli"), (self.tab_cloud, "cloud")]:
            btn.setChecked(name == tab_name)
        
        # Show/hide content
        if tab_name == "env":
            self._show_env_tab()
        elif tab_name == "general":
            self._show_general_tab()
        elif tab_name == "cli":
            self._show_cli_tab()
        elif tab_name == "cloud":
            self._show_cloud_tab()
            
    def _init_env_tab(self):
        """Initialize environment variables tab."""
        env_section = QWidget()
        env_layout = QVBoxLayout(env_section)
        env_layout.setSpacing(8)
        
        env_header = QLabel("Environment Variables")
        env_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        env_layout.addWidget(env_header)
        
        self.env_vars_list = QListWidget()
        self.env_vars_list.addItem("API_KEY - API key for services")
        self.env_vars_list.addItem("CLOUDFLARE_TOKEN - Cloudflare API token")
        self.env_vars_list.addItem("DATABASE_URL - Database connection string")
        self.env_vars_list.addItem("LOG_LEVEL - Logging level (DEBUG, INFO, WARNING, ERROR)")
        self.env_vars_list.addItem("GITHUB_TOKEN - GitHub API token")
        self.env_vars_list.itemClicked.connect(self._on_env_var_selected)
        env_layout.addWidget(self.env_vars_list)
        
        self.env_var_detail = QTextEdit()
        self.env_var_detail.setReadOnly(True)
        self.env_var_detail.setFont(QFont("Consolas", 10))
        env_layout.addWidget(self.env_var_detail)
        
        self.env_layout = env_layout
        self.content_layout.addWidget(env_section)
        
    def _init_general_tab(self):
        """Initialize general settings tab."""
        general_section = QWidget()
        general_layout = QVBoxLayout(general_section)
        general_layout.setSpacing(8)
        
        general_header = QLabel("General Settings")
        general_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        general_layout.addWidget(general_header)
        
        self.general_fields = QListWidget()
        self.general_fields.addItem("Console Theme - Theme mode (Light/Dark)")
        self.general_fields.addItem("Auto-update - Enable/disable auto-updates")
        self.general_fields.addItem("Notification - Enable/disable notifications")
        self.general_fields.addItem("Language - UI language")
        self.general_fields.itemClicked.connect(self._on_general_selected)
        general_layout.addWidget(self.general_fields)
        
        self.general_detail = QTextEdit()
        self.general_detail.setReadOnly(True)
        self.general_detail.setFont(QFont("Consolas", 10))
        general_layout.addWidget(self.general_detail)
        
        self.content_layout.addWidget(general_section)
        
    def _init_cli_tab(self):
        """Initialize CLI configuration tab."""
        cli_section = QWidget()
        cli_layout = QVBoxLayout(cli_section)
        cli_layout.setSpacing(8)
        
        cli_header = QLabel("CLI Configuration")
        cli_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        cli_layout.addWidget(cli_header)
        
        self.cli_fields = QListWidget()
        self.cli_fields.addItem("Default Terminal - Default terminal emulator")
        self.cli_fields.addItem("Auto-save - Auto-save terminal sessions")
        self.cli_fields.addItem("Max history - Maximum history entries")
        self.cli_fields.addItem("Key handling - Terminal key binding system")
        self.cli_fields.itemClicked.connect(self._on_cli_selected)
        cli_layout.addWidget(self.cli_fields)
        
        self.cli_detail = QTextEdit()
        self.cli_detail.setReadOnly(True)
        self.cli_detail.setFont(QFont("Consolas", 10))
        cli_layout.addWidget(self.cli_detail)
        
        self.content_layout.addWidget(cli_section)
        
    def _init_cloud_tab(self):
        """Initialize Cloudflare config tab."""
        cloud_section = QWidget()
        cloud_layout = QVBoxLayout(cloud_section)
        cloud_layout.setSpacing(8)
        
        cloud_header = QLabel("Cloudflare Configuration")
        cloud_header.setFont(QFont("Sans-Serif", 14, QFont.Weight.Bold))
        cloud_layout.addWidget(cloud_header)
        
        self.cloud_fields = QListWidget()
        self.cloud_fields.addItem("Account ID - Cloudflare account ID")
        self.cloud_fields.addItem("API Token - Cloudflare API token")
        self.cloud_fields.addItem("Pages Project - Pages project name")
        self.cloud_fields.addItem("Workers Namespace - Workers namespace ID")
        self.cloud_fields.addItem("DNS Zone - DNS zone name")
        self.cloud_fields.itemClicked.connect(self._on_cloud_selected)
        cloud_layout.addWidget(self.cloud_fields)
        
        self.cloud_detail = QTextEdit()
        self.cloud_detail.setReadOnly(True)
        self.cloud_detail.setFont(QFont("Consolas", 10))
        cloud_layout.addWidget(self.cloud_detail)
        
        self.content_layout.addWidget(cloud_section)
        
    def _show_env_tab(self):
        """Show environment variables tab content."""
        self.env_var_detail.setText("API_KEY=your_api_key_here\nCLOUDFLARE_TOKEN=your_cloudflare_token_here\nDATABASE_URL=postgresql://localhost:5432/sdaawn\nLOG_LEVEL=INFO\nGITHUB_TOKEN=your_github_token_here")
        self.env_var_detail.setPlainText("API_KEY=your_api_key_here\nCLOUDFLARE_TOKEN=your_cloudflare_token_here\nDATABASE_URL=postgresql://localhost:5432/sdaawn\nLOG_LEVEL=INFO\nGITHUB_TOKEN=your_github_token_here")
        
    def _show_general_tab(self):
        """Show general settings tab content."""
        self.general_detail.setText("Theme: Light\nAuto-update: Enabled\nNotifications: Enabled\nLanguage: English")
        
    def _show_cli_tab(self):
        """Show CLI configuration tab content."""
        self.cli_detail.setText("Default Terminal: PowerShell\nAuto-save: Enabled\nMax History: 1000\nKey Handling: Bind to Ctrl+Shift+T")
        
    def _show_cloud_tab(self):
        """Show Cloudflare config tab content."""
        self.cloud_detail.setText("Account ID: account_id_here\nAPI Token: cloudflare_token_here\nPages Project: sdaawn\nWorkers Namespace: worker_ns_id\nDNS Zone: example.com")
        
    def _on_env_var_selected(self, item):
        """Handle environment variable selection."""
        self.env_var_detail.setText(item.text())
        
    def _on_general_selected(self, item):
        """Handle general setting selection."""
        self.general_detail.setText(item.text())
        
    def _on_cli_selected(self, item):
        """Handle CLI setting selection."""
        self.cli_detail.setText(item.text())
        
    def _on_cloud_selected(self, item):
        """Handle Cloudflare config selection."""
        self.cloud_detail.setText(item.text())
        
    def _switch_tab(self, tab_name: str):
        """Switch between settings tabs."""
        for btn, name in [(self.tab_env, "env"), (self.tab_general, "general"), 
                          (self.tab_cli, "cli"), (self.tab_cloud, "cloud")]:
            btn.setChecked(name == tab_name)
        
        if tab_name == "env":
            self._show_env_tab()
        elif tab_name == "general":
            self._show_general_tab()
        elif tab_name == "cli":
            self._show_cli_tab()
        elif tab_name == "cloud":
            self._show_cloud_tab()
            
    def _init_timers(self):
        """Initialize update timers."""
        self._timer = QTimer()
        self._timer.timeout.connect(self._refresh_settings)
        self._timer.start(5000)
        
    def _refresh_settings(self):
        """Refresh settings data."""
        pass
    
    def resizeEvent(self, event):
        """Handle resize events."""
        self._update_layout()
        
    def _update_layout(self):
        """Update layout on resize."""
        pass
