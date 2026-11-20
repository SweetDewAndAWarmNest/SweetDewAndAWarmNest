"""
EnvConfig - Environment variable and configuration management for SDAAWN Console.
"""

import logging
import yaml
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class EnvConfig:
    """Environment variable and configuration management."""
    
    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path or Path("config/env_vars.yaml")
        self.env_vars = {}
        self.app_settings = {}
        self._load()
        
    def _load(self):
        """Load configuration from disk."""
        try:
            if self.config_path.exists():
                with open(self.config_path, "r") as f:
                    config = yaml.safe_load(f) or {}
                self.env_vars = config.get("env_vars", {})
                self.app_settings = config.get("settings", {})
                logger.info(f"Loaded config from {self.config_path}")
            else:
                logger.info(f"Config file not found at {self.config_path}, using defaults")
                self.env_vars = {}
                self.app_settings = {}
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            self.env_vars = {}
            self.app_settings = {}
            
    def load_config(self):
        """Load configuration from disk."""
        self._load()
        self.loaded = True
        return self.env_vars
        
    def save_config(self):
        """Save configuration to disk."""
        try:
            config = {
                "env_vars": self.env_vars,
                "settings": self.app_settings,
            }
            with open(self.config_path, "w") as f:
                yaml.dump(config, f, default_flow_style=False, sort_keys=False)
            logger.info(f"Saved config to {self.config_path}")
        except Exception as e:
            logger.error(f"Failed to save config: {e}")
            
    def get(self, section: str, key: str, default=None):
        """Get a configuration value."""
        if section == "env":
            return self.env_vars.get(key, default)
        return self.app_settings.get(section, {}).get(key, default)
        
    def set(self, section: str, key: str, value):
        """Set a configuration value."""
        if section == "env":
            self.env_vars[key] = value
        else:
            self.app_settings.setdefault(section, {})[key] = value
        self.save_config()
        
    @property
    def loaded(self):
        """Check if config is loaded."""
        return bool(self.env_vars)
