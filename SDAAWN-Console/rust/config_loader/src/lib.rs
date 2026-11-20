use pyo3::prelude::*;
use pyo3::pyclass;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use anyhow::{Context, Result};
use chrono::Utc;

#[pyclass]
#[derive(Clone)]
pub struct ConfigManager {
    config_path: PathBuf,
    env_vars: HashMap<String, String>,
    app_settings: HashMap<String, HashMap<String, String>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ConfigFile {
    env_vars: HashMap<String, String>,
    settings: HashMap<String, HashMap<String, String>>,
}

#[pymethods]
impl ConfigManager {
    #[new]
    fn new(config_path: Option<PathBuf>) -> Self {
        let config_path = config_path.unwrap_or_else(|| {
            PathBuf::from("config") .join("env_vars.yaml")
        });
        
        info!("Initializing ConfigManager at {:?}", config_path);
        
        let env_vars = match fs::read_to_string(&config_path) {
            Ok(content) => {
                if let Ok(cfg) = serde_yaml::from_str::<ConfigFile>(&content) {
                    cfg.env_vars
                } else {
                    HashMap::new()
                }
            }
            Err(_) => HashMap::new(),
        };
        
        let app_settings = match fs::read_to_string(&config_path) {
            Ok(content) => {
                if let Ok(cfg) = serde_yaml::from_str::<ConfigFile>(&content) {
                    cfg.settings
                } else {
                    HashMap::new()
                }
            }
            Err(_) => HashMap::new(),
        };
        
        Self {
            config_path,
            env_vars,
            app_settings,
        }
    }

    fn load_env_vars(&self) -> HashMap<String, String> {
        self.env_vars.clone()
    }

    fn get_env_var(&self, key: String) -> Option<String> {
        self.env_vars.get(&key).cloned()
    }

    fn set_env_var(&mut self, key: String, value: String) -> PyResult<()> {
        self.env_vars.insert(key, value);
        let config = ConfigFile {
            env_vars: self.env_vars.clone(),
            settings: self.app_settings.clone(),
        };
        let content = serde_yaml::to_string(&config)
            .context("Failed to serialize config")?;
        fs::write(&self.config_path, content)
            .context("Failed to write config")?;
        Ok(())
    }

    fn load_settings(&self) -> HashMap<String, HashMap<String, String>> {
        self.app_settings.clone()
    }

    fn get_setting(&self, section: String, key: String) -> Option<String> {
        self.app_settings.get(&section).and_then(|s| s.get(&key)).cloned()
    }

    fn save_setting(&mut self, section: String, key: String, value: String) -> PyResult<()> {
        self.app_settings.entry(section)
            .or_insert_with(HashMap::new)
            .insert(key, value);
        let config = ConfigFile {
            env_vars: self.env_vars.clone(),
            settings: self.app_settings.clone(),
        };
        let content = serde_yaml::to_string(&config)
            .context("Failed to serialize config")?;
        fs::write(&self.config_path, content)
            .context("Failed to write config")?;
        Ok(())
    }
}
