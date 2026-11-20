"""
TelemetryService - Telemetry and analytics tracking for SDAAWN Console.
"""

import logging
import time
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict

logger = logging.getLogger(__name__)


class TelemetryService:
    """Telemetry and analytics tracking service."""
    
    def __init__(self):
        self.events = []
        self.metrics = defaultdict(list)
        self.start_time = time.time()
        self.stats = {
            "events_count": 0,
            "metrics_count": 0,
            "uptime_seconds": 0,
            "errors": 0,
            "successes": 0,
        }
        
    def track_event(self, event_type: str, category: str, message: str, details: dict = None):
        """Track an event."""
        event = {
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "category": category,
            "message": message,
            "details": details or {},
        }
        self.events.append(event)
        self.stats["events_count"] += 1
        logger.debug(f"Tracked event: [{category}] {event_type} - {message}")
        
    def record_metric(self, name: str, value: float, unit: str = "auto", source: str = "console"):
        """Record a metric."""
        self.metrics[name].append({
            "timestamp": datetime.now().isoformat(),
            "value": value,
            "unit": unit,
            "source": source,
        })
        self.stats["metrics_count"] += 1
        
    def get_events(self, limit: int = 100) -> List[dict]:
        """Get recent events."""
        return self.events[-limit:] if len(self.events) > limit else self.events
    
    def get_metrics(self, name: str = None) -> dict:
        """Get metrics as dictionary."""
        if name:
            return {"name": name, "data": self.metrics.get(name, [])}
        return {"metrics": dict(self.metrics)}
    
    def get_summary(self) -> dict:
        """Get telemetry summary."""
        self.stats["uptime_seconds"] = time.time() - self.start_time
        return self.stats
    
    def reset(self):
        """Reset telemetry storage."""
        self.events = []
        self.metrics = defaultdict(list)
        self.stats = {
            "events_count": 0,
            "metrics_count": 0,
            "uptime_seconds": 0,
            "errors": 0,
            "successes": 0,
        }
        self.start_time = time.time()
