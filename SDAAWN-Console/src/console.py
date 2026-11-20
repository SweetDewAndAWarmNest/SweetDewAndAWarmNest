"""
SDAAWN Console - Entry point for the hybrid Python/Rust desktop GUI.

This is a production-grade desktop GUI application built with:
- Python (PySide6) - GUI framework
- Rust (via pyo3) - Performance-critical components
- Git - Repository management
- Cloudflare - Cloud integration
- WebSocket - Real-time telemetry
"""

import sys
from pathlib import Path

def main():
    """Main entry point for SDAAWN Console."""
    from src.app.main_window import SDAAWNMainWindow
    
    from PySide6.QtWidgets import QApplication
    
    app = QApplication(sys.argv)
    app.setApplicationName("SDAAWN Console")
    app.setApplicationDisplayName("SDAAWN Console")
    
    window = SDAAWNMainWindow()
    window.show()
    
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
