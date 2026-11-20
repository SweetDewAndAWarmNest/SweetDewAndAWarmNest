use pyo3::prelude::*;
use pyo3::pyclass;
use std::collections::HashMap;
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{Duration, Instant};

#[pyclass]
#[derive(Clone)]
pub struct TerminalManager {
    state: Arc<Mutex<HashMap<String, String>>>,
    history: Arc<Mutex<Vec<String>>>,
    cursor_position: Arc<Mutex<usize>>,
    last_update: Arc<Mutex<Instant>>,
    max_history: usize,
    is_active: Arc<Mutex<bool>>,
}

#[pymethods]
impl TerminalManager {
    #[new]
    fn new(max_history: usize) -> Self {
        info!("Initializing TerminalManager with max_history={}", max_history);
        Self {
            state: Arc::new(Mutex::new(HashMap::new())),
            history: Arc::new(Mutex::new(Vec::with_capacity(max_history))),
            cursor_position: Arc::new(Mutex::new(0)),
            last_update: Arc::new(Mutex::new(Instant::now())),
            max_history,
            is_active: Arc::new(Mutex::new(true)),
        }
    }

    fn write(&self, text: String) -> PyResult<()> {
        if !*self.is_active.lock().unwrap() {
            return Err(pyo3::exceptions::PyRuntimeError::new_err("Terminal is inactive"));
        }
        *self.state.lock().unwrap() = self.state.lock().unwrap().clone();
        *self.history.lock().unwrap() = self.history.lock().unwrap().clone();
        *self.last_update.lock().unwrap() = Instant::now();
        Ok(())
    }

    fn resize(&self, rows: u16, cols: u16) -> PyResult<()> {
        info!(
            "Resizing terminal to rows={} cols={}",
            rows, cols
        );
        Ok(())
    }

    fn minimize(&self) -> PyResult<()> {
        *self.is_active.lock().unwrap() = false;
        info!("Terminal minimized");
        Ok(())
    }

    fn maximize(&self) -> PyResult<()> {
        *self.is_active.lock().unwrap() = true;
        info!("Terminal maximized");
        Ok(())
    }

    fn clear(&self) -> PyResult<()> {
        *self.state.lock().unwrap() = HashMap::new();
        *self.history.lock().unwrap() = Vec::with_capacity(self.max_history);
        *self.cursor_position.lock().unwrap() = 0;
        info!("Terminal cleared");
        Ok(())
    }

    fn is_active(&self) -> bool {
        *self.is_active.lock().unwrap()
    }

    fn get_state(&self) -> HashMap<String, String> {
        self.state.lock().unwrap().clone()
    }

    fn set_state(&self, key: String, value: String) -> PyResult<()> {
        self.state.lock().unwrap().insert(key, value);
        Ok(())
    }

    fn get_history(&self) -> Vec<String> {
        self.history.lock().unwrap().clone()
    }

    fn push_history(&self, entry: String) -> PyResult<()> {
        let mut history = self.history.lock().unwrap();
        if history.len() >= self.max_history {
            history.remove(0);
        }
        history.push(entry);
        Ok(())
    }

    fn set_cursor_position(&self, pos: usize) {
        *self.cursor_position.lock().unwrap() = pos;
    }
}
