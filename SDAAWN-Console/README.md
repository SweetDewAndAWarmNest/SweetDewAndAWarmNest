# SDAAWN Console

**SDAAWN Console** is a hybrid Python + Rust desktop GUI application that serves as a central management console for the SDAAWN website ecosystem. It provides data and telemetry visualization, website interaction tools, automation pipelines, settings management, a built-in CLI terminal, and Cloudflare integration.

## Features

### Core Dashboard
- Real-time data and telemetry visualization (CPU, memory, uptime, events)
- Status indicators and performance monitoring
- Interactive charts and graphs

### Tools & Automation
- System features and automation tools
- Pipeline management for CI/CD workflows
- Git integration (sync, pull, push, status, log)
- Cloudflare management (Accounts, Pages, Workers, DNS, Cache)
- Website monitoring (health checks, sitemap, robots.txt, CSP)

### Built-in CLI Terminal
- Fully resizable, minimize/maximize capable terminal
- Multi-line command execution with history support
- Auto-scroll and scrollback navigation
- Color-coded output with error highlighting
- Quick command palette

### Activity & Debugging
- Real-time activity log with severity levels
- Error and debugging information dashboard
- Log export to file
- Activity bars and telemetry preview

### Settings & Configuration
- Environment variables management
- General settings (theme, auto-update, notifications, language)
- CLI configuration (terminal emulator, key bindings, history)
- Cloudflare configuration (account ID, API token, pages project, workers namespace)

### Production Grade Quality
- Structured logging with structured logging
- Configuration management with YAML
- Data visualization with PySide6 charts
- Keyboard shortcuts and navigation
- Window management (resize, minimize, maximize)
- Status bar with live updates
- Activity timer for background updates

## Prerequisites

- Python >= 3.11
- Rust (cargo)
- Qt6 development libraries

### Installing Dependencies

```bash
# Using poetry
poetry install

# Or using pip
pip install -r requirements.txt
```

### Rust Dependencies

The Rust components use `pyo3` for Python bindings. Build them with:

```bash
cargo build --release
```

## Usage

### Running SDAAWN Console

```bash
python console.py
```

### Running Tests

```bash
pytest tests/
```

### Running with Poetry

```bash
poetry run python console.py
```

## Architecture

```
SDAAWN-Console/
├── src/
│   ├── app/          # Application initialization
│   ├── widgets/      # GUI components and tabs
│   ├── services/     # Backend services (Git, Cloudflare, Telemetry, etc.)
│   ├── config/       # Environment and configuration management
│   ├── rust/         # Rust performance-critical components
│   └── utils/        # Utility functions
├── rust/             # Rust source code
├── tests/            # Unit tests
├── pyproject.toml    # Python project configuration
└── Cargo.toml        # Rust project configuration
```

## Key Technologies

- **GUI Framework**: PySide6 (Qt6)
- **Rust Integration**: pyo3, tokio
- **HTTP/Web**: requests, httpx
- **Git**: GitPython
- **Logging**: structlog
- **Charts**: pyqtgraph
- **Terminal**: pyte
- **IPC**: zeromq, crossbeam-channel

## Deployment

```bash
# Build Python package
poetry build

# Build Rust components
cargo build --release
```

## License

MIT
