use pyo3::prelude::*;
use pyo3::pyclass;
use std::process::Command;
use std::io::{BufRead, BufReader};
use std::process::Stdio;
use std::time::Duration;
use anyhow::{Context, Result};

#[pyclass]
pub struct CLIManager {
    started: std::time::Instant,
}

#[pymethods]
impl CLIManager {
    #[new]
    fn new() -> Self {
        info!("Initializing CLIManager");
        Self {
            started: std::time::Instant::now(),
        }
    }

    fn run_command(&self, cmd: Vec<String>, timeout: Option<u64>) -> Result<String, String> {
        info!("Running command: {:?}", cmd);
        
        let mut command = Command::new(&cmd[0]);
        command.args(&cmd[1..]);
        command.stdout(Stdio::piped());
        command.stderr(Stdio::piped());
        command.stdin(Stdio::null());
        
        let mut child = command
            .spawn()
            .with_context(|| format!("Failed to spawn command: {:?}", cmd))?;
        
        let timeout = timeout.unwrap_or(30);
        let status = child.wait_timeout(Duration::from_secs(timeout))
            .context("Command timed out")?;
        
        let output = match status {
            Some(s) => s,
            None => {
                return Err(format!("Command timed out after {} seconds", timeout));
            }
        };
        
        let stdout = child.stdout.take().unwrap_or_default();
        let stderr = child.stderr.take().unwrap_or_default();
        
        let stdout_str = String::from_utf8_lossy(&stdout).to_string();
        let stderr_str = String::from_utf8_lossy(&stderr).to_string();
        
        if output.success() {
            info!("Command succeeded: {:?}", cmd);
            Ok(stdout_str)
        } else {
            info!("Command failed (exit code: {})", output.status);
            Err(format!("{}: {}", stderr_str, output.status));
        }
    }

    fn execute_pipeline(&self, commands: Vec<Vec<String>>, timeout: Option<u64>) -> Result<String, String> {
        info!("Executing pipeline with {} commands", commands.len());
        
        let mut combined_output = String::new();
        
        for (i, cmd) in commands.iter().enumerate() {
            let result = self.run_command(cmd.clone(), timeout)?;
            combined_output.push_str(&result);
            combined_output.push('\n');
            
            if i < commands.len() - 1 {
                // Chain commands with newline separator
                combined_output.push_str(" | \n");
            }
        }
        
        Ok(combined_output)
    }

    fn is_command_available(&self, cmd: &str) -> bool {
        Command::new(cmd)
            .arg("--version")
            .output()
            .map(|out| out.status.success())
            .unwrap_or(false)
    }

    fn list_commands(&self) -> Vec<String> {
        vec!["git", "cf", "git", "python", "node", "npm", "cargo"]
            .iter()
            .filter(|cmd| self.is_command_available(cmd))
            .cloned()
            .collect()
    }

    fn get_uptime(&self) -> f64 {
        self.started.elapsed().as_secs_f64()
    }
}
