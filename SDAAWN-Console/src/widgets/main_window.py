"""
Main window widget for SDAAWN Console.
"""

import logging
from PySide6.QtWidgets import QWidget, QVBoxLayout, QTabWidget, QStatusBar
from PySide6.QtCore import QTimer, Qt
from pathlib import Path

logger = logging.getLogger(__name__)


class SDAAWNMainWindow(QWidget):
    """Main window widget for SDAAWN Console."""
    
    def __init__(self):
        super().__init__()
        self._init_ui()
        
    def _init_ui(self):
        """Initialize the user interface."""
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
        self.setLayout(QVBoxLayout(central_widget))
        self.layout().setContentsMargins(0, 0, 0, 0)
        
        # Create menu bar
        self._create_menu_bar()
        
        # Create tool bar
        self._create_toolbar()
        
        # Create status bar
        self.status_bar = QStatusBar()
        self.layout().addWidget(self.status_bar)
        self.status_bar.showMessage("Ready", 5000)
        
        # Create main content area with tab widget
        self.tab_widget = QTabWidget()
        self.tab_widget.setTabsClosable(False)
        self.tab_widget.setMovable(True)
        self.layout().addWidget(self.tab_widget)
        
        # Initialize services
        self._init_services()
        
        # Initialize tabs
        self._init_tabs()
        
        # Setup keyboard shortcuts
        self._setup_shortcuts()
        
        # Timer for updates
        self._timer = QTimer()
        self._timer.timeout.connect(self._on_timer_tick)
        self._timer.start(1000)
        
        logger.info("SDAAWN MainWindow initialized")
        
    def _create_menu_bar(self):
        """Create the menu bar."""
        menubar = self.menuBar()
        
        file_menu = menubar.addMenu("&File")
        file_menu.addAction("Save Config", self._save_config, 
                             Qt.KeyboardModifier.ControlModifier, Qt.KeySequence.Control_S)
        file_menu.addAction("Load Config", self._load_config, 
                             Qt.KeyboardModifier.ControlModifier, Qt.KeySequence.Control_O)
        file_menu.addSeparator()
        file_menu.addAction("Exit", self.close)
        
        view_menu = menubar.addMenu("&View")
        view_menu.addAction("Toggle Sidebar", self._toggle_sidebar)
        view_menu.addAction("Toggle Developer Tools", self._toggle_dev_tools)
        view_menu.addSeparator()
        view_menu.addAction("Zoom In", self.zoom_in, 
                           Qt.KeyboardModifier.ControlModifier, Qt.KeySequence.Control_Plus)
        view_menu.addAction("Zoom Out", self.zoom_out, 
                           Qt.KeyboardModifier.ControlModifier, Qt.KeySequence.Control_Minus)
        
        help_menu = menubar.addMenu("&Help")
        help_menu.addAction("Documentation", self._open_docs)
        help_menu.addAction("About", self._show_about)
        
    def _create_toolbar(self):
        """Create the main toolbar."""
        self.toolbar = QWidget(self)
        self.toolbar.setFixedHeight(40)
        self.layout().addWidget(self.toolbar)
        toolbar_layout = QVBoxLayout(self.toolbar)
        toolbar_layout.setContentsMargins(0, 0, 0, 0)
        
        tool_items = [
            ("Dashboard", "view-dashboard"),
            ("Tools", "tool-box"),
            ("Activity", "terminal"),
            ("Projects", "git-branch"),
            ("Cloudflare", "cloud"),
            ("Settings", "cog"),
        ]
        
        for text, icon in tool_items:
            button = QPushButton(text)
            button.setIcon(QIcon(f":/icons/{icon}.svg"))
            button.setToolTip(f"Open {text}")
            button.clicked.connect(self._on_tool_clicked)
            toolbar_layout.addWidget(button)
            
    def _init_services(self):
        """Initialize backend services."""
        self.git_service = GitService()
        self.cloudflare_service = CloudflareService()
        self.website_service = WebsiteService()
        self.cli_service = CLIService()
        self.telemetry_service = TelemetryService()
        self.env_config = EnvConfig()
        
    def _init_tabs(self):
        """Initialize all tab widgets."""
        from .tabs.dashboard import DashboardWidget
        self.dashboard = DashboardWidget()
        self.tab_widget.addTab(self.dashboard, "Dashboard")
        
        from .tabs.tools import ToolsWidget
        self.tools = ToolsWidget()
        self.tab_widget.addTab(self.tools, "Tools")
        
        from .tabs.activity import ActivityWidget
        self.activity = ActivityWidget()
        self.tab_widget.addTab(self.activity, "Activity")
        
        from .tabs.repos import ReposWidget
        self.repos = ReposWidget()
        self.tab_widget.addTab(self.repos, "Projects")
        
        from .tabs.cloudflare import CloudflareWidget
        self.cloudflare = CloudflareWidget()
        self.tab_widget.addTab(self.cloudflare, "Cloudflare")
        
        from .tabs.settings import SettingsWidget
        self.settings = SettingsWidget()
        self.tab_widget.addTab(self.settings, "Settings")
        
        from .tabs.cli_terminal import CLITerminalWidget
        self.cli_terminal = CLITerminalWidget()
        self.tab_widget.addTab(self.cli_terminal, "CLI Terminal")
        
    def _setup_shortcuts(self):
        """Setup global keyboard shortcuts."""
        self.terminal_shortcut = QShortcut(QKeySequence("Ctrl+Shift+T"), self)
        self.terminal_shortcut.activated.connect(self._open_terminal)
        
        self.cloudflare_shortcut = QShortcut(QKeySequence("Ctrl+Shift+C"), self)
        self.cloudflare_shortcut.activated.connect(self._open_cloudflare)
        
        self.repos_shortcut = QShortcut(QKeySequence("Ctrl+Shift+G"), self)
        self.repos_shortcut.activated.connect(self._open_repos)
        
        self.settings_shortcut = QShortcut(QKeySequence("Ctrl+Shift+S"), self)
        self.settings_shortcut.activated.connect(self._open_settings)
        
        self.dashboard_shortcut = QShortcut(QKeySequence("Ctrl+Shift+D"), self)
        self.dashboard_shortcut.activated.connect(self._open_dashboard)
        
    def _on_timer_tick(self):
        """Handle periodic timer tick."""
        if self.env_config.loaded:
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
        self.env_config.save_config()
        self.status_bar.showMessage("Configuration saved", 3000)
        
    def _load_config(self):
        """Load configuration."""
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
