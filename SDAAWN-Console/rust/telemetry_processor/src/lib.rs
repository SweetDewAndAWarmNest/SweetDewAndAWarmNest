use pyo3::prelude::*;
use pyo3::pyclass;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{Duration, Instant};

#[pyclass]
#[derive(Clone)]
pub struct TelemetryTracker {
    events: Arc<Mutex<Vec<TelemetryEvent>>>,
    metrics: Arc<Mutex<HashMap<String, Metric>>>,
    max_events: usize,
    started: Arc<Mutex<Instant>>,
}

#[pyclass]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryEvent {
    pub timestamp: u64,
    pub event_type: String,
    pub category: String,
    pub message: String,
    pub details: HashMap<String, String>,
}

#[pyclass]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Metric {
    pub value: f64,
    pub unit: String,
    pub timestamp: u64,
    pub source: String,
}

#[pymethods]
impl TelemetryTracker {
    #[new]
    fn new(max_events: usize) -> Self {
        info!("Initializing TelemetryTracker with max_events={}", max_events);
        Self {
            events: Arc::new(Mutex::new(Vec::with_capacity(max_events))),
            metrics: Arc::new(Mutex::new(HashMap::new())),
            max_events,
            started: Arc::new(Mutex::new(Instant::now())),
        }
    }

    fn track_event(&self, event_type: String, category: String, message: String, details: HashMap<String, String>) -> PyResult<()> {
        let now = Instant::now();
        let event = TelemetryEvent {
            timestamp: now.elapsed().as_millis() as u64,
            event_type,
            category,
            message,
            details,
        };
        
        {
            let mut events = self.events.lock().unwrap();
            if events.len() >= self.max_events {
                events.remove(0);
            }
            events.push(event);
        }
        
        info!("Tracked event: [{}] {} - {}", category, event_type, message);
        Ok(())
    }

    fn record_metric(&self, name: String, value: f64, unit: String, source: String) -> PyResult<()> {
        let now = Instant::now();
        let metric = Metric {
            value,
            unit,
            timestamp: now.elapsed().as_millis() as u64,
            source,
        };
        
        let mut metrics = self.metrics.lock().unwrap();
        metrics.insert(name, metric);
        Ok(())
    }

    fn get_events(&self) -> Vec<TelemetryEvent> {
        self.events.lock().unwrap().clone()
    }

    fn get_metrics(&self) -> HashMap<String, Metric> {
        self.metrics.lock().unwrap().clone()
    }

    fn get_uptime(&self) -> f64 {
        self.started.lock().unwrap().elapsed().as_secs_f64()
    }

    fn reset(&self) -> PyResult<()> {
        *self.events.lock().unwrap() = Vec::new();
        *self.metrics.lock().unwrap() = HashMap::new();
        Ok(())
    }

    fn get_summary(&self) -> HashMap<String, String> {
        let events = self.events.lock().unwrap();
        let metrics = self.metrics.lock().unwrap();
        let uptime = self.get_uptime();
        
        let mut summary = HashMap::new();
        summary.insert("events_count".to_string(), events.len().to_string());
        summary.insert("metrics_count".to_string(), metrics.len().to_string());
        summary.insert("uptime_seconds".to_string(), uptime.to_string());
        summary
    }
}
