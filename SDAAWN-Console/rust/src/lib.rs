// SDAAWN Console - Rust hybrid engine
// Performance-critical components for CLI terminal and telemetry processing

pub mod terminal_engine;
pub mod telemetry_processor;
pub mod config_loader;
pub mod cli;

use pyo3::prelude::*;
use tracing::{info, warn};

#[pyfunction]
fn version() -> String {
    "1.0.0".to_string()
}

#[pyfunction]
fn health_check() -> bool {
    true
}

#[pymodule]
fn sdaawn_console_rs(m: &Bound<'_, PyModule>) -> PyResult<()> {
    info!("Loading SDAAWN Console Rust engine");
    
    m.add_function(wrap_pyfunction!(version, m)?)?;
    m.add_function(wrap_pyfunction!(health_check, m)?)?;
    
    // Register submodules
    m.add_submodule(termeng_module())?;
    m.add_submodule(telem_proc_module())?;
    m.add_submodule(config_loader_module())?;
    m.add_submodule(cli_module())?;
    
    Ok(())
}

fn termeng_module() -> PyResult<()> {
    // Terminal engine module
    m.add_class::<terminal_engine::TerminalManager>()?;
    Ok(())
}

fn telem_proc_module() -> PyResult<()> {
    // Telemetry processor module
    m.add_class::<telemetry_processor::TelemetryTracker>()?;
    Ok(())
}

fn config_loader_module() -> PyResult<()> {
    // Config loader module
    m.add_class::<config_loader::ConfigManager>()?;
    Ok(())
}

fn cli_module() -> PyResult<()> {
    // CLI module
    m.add_class::<cli::CLIManager>()?;
    Ok(())
}
