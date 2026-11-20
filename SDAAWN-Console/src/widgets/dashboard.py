"""
Dashboard widget for SDAAWN Console - Data and telemetry visualization.
"""

import logging
from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton
from PySide6.QtCore import QTimer, Qt, QMetaObject, Q_ARG
from PySide6.QtGui import QFont
from PySide6.QtCharts import QtCharts

logger = logging.getLogger(__name__)


class DashboardWidget(QWidget):
    """Dashboard widget showing data and telemetry visualization."""
    
    def __init__(self):
        super().__init__()
        self._init_ui()
        self._init_timers()
        
    def _init_ui(self):
        """Initialize the dashboard UI."""
        self.setMinimumSize(800, 600)
        self.layout = QVBoxLayout(self)
        self.layout.setContentsMargins(16, 16, 16, 16)
        self.layout.setSpacing(12)
        
        # Header
        header = QLabel("SDAAWN Console Dashboard")
        header.setFont(QFont("Sans-Serif", 18, QFont.Weight.Bold))
        self.layout.addWidget(header)
        
        # Status indicators
        status_container = QWidget()
        status_layout = QHBoxLayout(status_container)
        status_layout.setSpacing(16)
        
        self.status_label = QLabel("Initializing...")
        self.status_label.setFont(QFont("Sans-Serif", 12))
        
        self.uptime_label = QLabel("0.0s uptime")
        self.uptime_label.setFont(QFont("Sans-Serif", 12))
        
        self.cpu_label = QLabel("CPU: 0%")
        self.cpu_label.setFont(QFont("Sans-Serif", 12))
        
        self.memory_label = QLabel("RAM: 0%")
        self.memory_label.setFont(QFont("Sans-Serif", 12))
        
        status_layout.addWidget(self.status_label)
        status_layout.addWidget(self.uptime_label)
        status_layout.addWidget(self.cpu_label)
        status_layout.addWidget(self.memory_label)
        self.layout.addWidget(status_container)
        
        # Charts
        charts_container = QWidget()
        charts_layout = QVBoxLayout(charts_container)
        self.layout.addWidget(charts_container)
        
        # Refresh timer
        self._timer = QTimer()
        self._timer.timeout.connect(self._refresh_data)
        self._timer.start(1000)
        
    def _init_timers(self):
        """Initialize update timers."""
        self._timer = QTimer()
        self._timer.timeout.connect(self._refresh_data)
        self._timer.start(1000)
        
    def _refresh_data(self):
        """Refresh dashboard data periodically."""
        self._update_status_labels()
        
    def _update_status_labels(self):
        """Update status indicators."""
        self.uptime_label.setText(f"Uptime: {self._get_uptime()}s")
        self.cpu_label.setText("CPU: 0.0% (sample)")
        self.memory_label.setText("RAM: 0.0% (sample)")
        
    def _get_uptime(self):
        """Get console uptime in seconds."""
        return self._get_system_uptime()
        
    def _get_system_uptime(self):
        """Get system uptime."""
        return 0.0

    def resizeEvent(self, event):
        """Handle resize events."""
        self._update_chart_dimensions()
