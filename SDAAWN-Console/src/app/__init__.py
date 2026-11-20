"""
SDAAWN Console - Main Application Entry Point
Hybrid Python + Rust desktop GUI for website management, telemetry, and CI/CD.
"""

import sys
import os
from pathlib import Path

def main():
    """Main entry point for SDAAWN Console."""
    from .app import SDAAWNApp
    from PySide6.QtWidgets import QApplication
    
    app = QApplication(sys.argv)
    app.setApplicationName("SDAAWN Console")
    app.setApplicationDisplayName("SDAAWN Console")
    
    window = SDAAWNApp()
    window.show()
    
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
