"""
Main application window for SDAAWN Console.
"""

from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                                 QHBoxLayout, QTabWidget, QStatusBar, QMenuBar,
                                 QAction, QToolBar, QShortcut, QSplitter)
from PySide6.QtCore import Qt, Signal, QTimer
from PySide6.QtGui import QIcon, QKeySequence, QActionGroup
from pathlib import Path
import sys
import logging

from ..widgets.main_window import SDAAWNMainWindow
from ..services.git import GitService
from ..services.cloudflare import CloudflareService
from ..services.telemetry import TelemetryService
from ..services.website import WebsiteService
from ..config.env_vars import EnvConfig
from ..services.cli import CLIService

logger = logging.getLogger(__name__)


class SDAAWNApp(QMainWindow):
    """Main application window for SDAAWN Console."""
    
    def __init__(self):
        super().__init__()
        
        # Configuration
        self.config = EnvConfig.load_config()
        self.is_config_loaded = True
        self.is_initialized = False
        self._init_ui()
        
    def _init_ui(self):
        """Initialize the user interface."""
        logger.info("Initializing SDAAWN Console UI")
        
        self.setWindowTitle("SDAAWN Console")
        self.setMinimumSize(1200, 800)
        self.setWindowFlags(
            Qt.WindowType.Window | 
            Qt.WindowType.WindowSystemMenuHint |
            Qt.WindowType.WindowMinimizeButtonHint |
            Qt.WindowType.WindowMaximizeButtonHint
        )
        
        # Create central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        
        # Create menu bar
        self._create_menu_bar()
        
        # Create tool bar
        self._create_toolbar()
        
        # Create status bar
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)
        self.status_bar.showMessage("Ready", 5000)
        
        # Create main content area with tab widget
        self.tab_widget = QTabWidget()
        self.tab_widget.setTabsClosable(False)
        self.tab_widget.setMovable(True)
        main_layout.addWidget(self.tab_widget)
        
        # Initialize services
        self._init_services()
        
        # Initialize tabs
        self._init_tabs()
        
        # Setup keyboard shortcuts
        self._setup_shortcuts()
        
        # Initialize activity tab
        self.activity_tab = self.tab_widget.widget(5) if hasattr(self, 'activity_tab') else None
        if self.activity_tab:
            self._init_activity_tab()
        
        # Timer for updates
        self._timer = QTimer()
        self._timer.timeout.connect(self._on_timer_tick)
        self._timer.start(1000)
        
        self.is_initialized = True
        logger.info("SDAAWN Console UI initialized successfully")
        
    def _create_menu_bar(self):
        """Create the menu bar."""
        menubar = self.menuBar()
        
        # File menu
        file_menu = menubar.addMenu("&File")
        file_menu.addAction("Save Config", self._save_config, Qt.Modifier.ControlModifier | Qt.KeySequence.Control_S)
        file_menu.addAction("Load Config", self._load_config, Qt.Modifier.ControlModifier | Qt.KeySequence.Control_O)
        file_menu.addSeparator()
        file_menu.addAction("Exit", self.close)
        
        # View menu
        view_menu = menubar.addMenu("&View")
        view_menu.addAction("Toggle Sidebar", self._toggle_sidebar)
        view_menu.addAction("Toggle Developer Tools", self._toggle_dev_tools)
        view_menu.addSeparator()
        view_menu.addAction("Zoom In", self.zoom_in, Qt.KeySequence.ControlPlus)
        view_menu.addAction("Zoom Out", self.zoom_out, Qt.KeySequence.ControlMinus)
        
        # Help menu
        help_menu = menubar.addMenu("&Help")
        help_menu.addAction("Documentation", self._open_docs)
        help_menu.addAction("About", self._show_about)
        
    def _create_toolbar(self):
        """Create the main toolbar."""
        toolbar = QToolBar("Main Toolbar")
        toolbar.setObjectName("MainToolbar")
        self.addToolBar(toolbar)
        
        # Tool buttons
        self.add_tool_action("Dashboard", "view-dashboard")
        self.add_tool_action("Tools", "tool-box")
        self.add_tool_action("Activity/Terminal", "terminal")
        self.add_tool_action("Repos", "git-branch")
        self.add_tool_action("Cloudflare", "cloud")
        self.add_tool_action("Settings", "cog")
        
    def add_tool_action(self, text: str, icon: str):
        """Add a tool action to the toolbar."""
        action = QAction(text, self)
        action.setToolTip(f"Open {text}")
        action.setIcon(QIcon(f":/icons/{icon}.svg"))
        action.triggered.connect(self._on_tool_clicked)
        self.toolbar.addAction(action)
        self.toolbar.setMovable(False)
        
    def _init_services(self):
        """Initialize backend services."""
        logger.info("Initializing services")
        
        self.git_service = GitService()
        self.cloudflare_service = CloudflareService()
        self.website_service = WebsiteService()
        self.cli_service = CLIService()
        self.telemetry_service = TelemetryService()
        self.env_config = EnvConfig()
        
    def _init_tabs(self):
        """Initialize all tab widgets."""
        # Dashboard tab
        from ..widgets.dashboard import DashboardWidget
        self.dashboard = DashboardWidget()
        self.tab_widget.addTab(self.dashboard, "Dashboard")
        
        # Tools tab
        from ..widgets.tools import ToolsWidget
        self.tools = ToolsWidget()
        self.tab_widget.addTab(self.tools, "Tools")
        
        # Activity tab
        from ..widgets.activity import ActivityWidget
        self.activity = ActivityWidget()
        self.activity_tab = self.activity
        self.tab_widget.addTab(self.activity, "Activity")
        
        # Repos tab
        from ..widgets.repos import ReposWidget
        self.repos = ReposWidget()
        self.tab_widget.addTab(self.repos, "Projects")
        
        # Cloudflare tab
        from ..widgets.cloudflare import CloudflareWidget
        self.cloudflare = CloudflareWidget()
        self.tab_widget.addTab(self.cloudflare, "Cloudflare")
        
        # Settings tab
        from ..widgets.settings import SettingsWidget
        self.settings = SettingsWidget()
        self.tab_widget.addTab(self.settings, "Settings")
        
        # CLI Terminal tab
        from ..widgets.cli_terminal import CLITerminalWidget
        self.cli_terminal = CLITerminalWidget()
        self.tab_widget.addTab(self.cli_terminal, "CLI Terminal")
        
    def _setup_shortcuts(self):
        """Setup global keyboard shortcuts."""
        # Ctrl+Shift+T for terminal
        self.terminal_shortcut = QShortcut(QKeySequence("Ctrl+Shift+T"), self)
        self.terminal_shortcut.activated.connect(self._open_terminal)
        
        # Ctrl+Shift+C for cloudflare
        self.cloudflare_shortcut = QShortcut(QKeySequence("Ctrl+Shift+C"), self)
        self.cloudflare_shortcut.activated.connect(self._open_cloudflare)
        
        # Ctrl+Shift+G for repos
        self.repos_shortcut = QShortcut(QKeySequence("Ctrl+Shift+G"), self)
        self.repos_shortcut.activated.connect(self._open_repos)
        
        # Ctrl+Shift+S for settings
        self.settings_shortcut = QShortcut(QKeySequence("Ctrl+Shift+S"), self)
        self.settings_shortcut.activated.connect(self._open_settings)
        
        # Ctrl+Shift+D for dashboard
        self.dashboard_shortcut = QShortcut(QKeySequence("Ctrl+Shift+D"), self)
        self.dashboard_shortcut.activated.connect(self._open_dashboard)
        
    def _init_activity_tab(self):
        """Initialize the activity tab with logging."""
        self.activity_tab.setup_logger()
        
    def _on_timer_tick(self):
        """Handle periodic timer tick."""
        if self.is_config_loaded and self.env_config.loaded:
            self._update_status_bar()
        
    def _update_status_bar(self):
        """Update the status bar with current state."""
        uptime = round(self.env_config.get("console", "uptime", default=0.0), 1)
        self.status_bar.showMessage(f"Ready | SDAAWN Console v1.0.0 | Uptime: {uptime}s")
        
    def _on_tool_clicked(self):
        """Handle toolbar tool click."""
        pass
    
    def _open_terminal(self):
        """Open the CLI terminal."""
        self.tab_widget.setCurrentWidget(self.cli_terminal)
        
    def _open_cloudflare(self):
        """Open Cloudflare dashboard."""
        self.tab_widget.setCurrentWidget(self.cloudflare)
        
    def _open_repos(self):
        """Open repositories tab."""
        self.tab_widget.setCurrentWidget(self.repos)
        
    def _open_settings(self):
        """Open settings tab."""
        self.tab_widget.setCurrentWidget(self.settings)
        
    def _open_dashboard(self):
        """Open dashboard."""
        self.tab_widget.setCurrentWidget(self.dashboard)
        
    def _save_config(self):
        """Save configuration."""
        logger.info("Saving configuration")
        self.env_config.save_config()
        self.status_bar.showMessage("Configuration saved", 3000)
        
    def _load_config(self):
        """Load configuration."""
        logger.info("Loading configuration")
        self.env_config.load_config()
        self.status_bar.showMessage("Configuration loaded", 3000)
        
    def _toggle_sidebar(self):
        """Toggle sidebar."""
        pass
    
    def _toggle_dev_tools(self):
        """Toggle developer tools."""
        pass
    
    def zoom_in(self):
        """Zoom in."""
        pass
    
    def zoom_out(self):
        """Zoom out."""
        pass
    
    def _open_docs(self):
        """Open documentation."""
        pass
    
    def _show_about(self):
        """Show about dialog."""
        pass
