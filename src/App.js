// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import AlertsTable from './components/AlertsTable';
import CreateAlertForm from './components/CreateAlertForm';

function App() {
  const [alerts, setAlerts] = useState([]);

  const baseApiUrl = "http://abmini02:5005"

  useEffect(() => {
    fetch(baseApiUrl+'/alerts')
      .then(response => response.json())
      .then(data => setAlerts(data))
      .catch(error => console.error("There was an error!", error));
  }, []);

  const handleUpdateAlert = (id, updatedAlert) => {
    fetch(baseApiUrl+`/alerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAlert),
    })
      .then(response => response.json())
      .then(() => {
        const newAlerts = alerts.map(alert => 
          alert.id === id ? { ...alert, ...updatedAlert } : alert
        );
        setAlerts(newAlerts); // Properly update the alerts state
      })
      .catch(error => console.error('Error:', error));
  };

  const handleDelete = (id) => {
    fetch(baseApiUrl+`/alerts/${id}`, { method: 'DELETE' })
      .then(() => {
        // Remove the alert from the state to update the UI
        setAlerts(alerts.filter(alert => alert.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleCreateAlert = (newAlert) => {
    fetch(baseApiUrl+'/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAlert),
    })
    .then(response => response.json())
    .then(data => {
      setAlerts(prevAlerts => [...prevAlerts, data]); // Assuming 'data' is the newly created alert
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Alerts</h2>
        <CreateAlertForm onCreate={handleCreateAlert} />
        <AlertsTable alerts={alerts} onUpdate={handleUpdateAlert} onDelete={handleDelete} />
      </header>
    </div>
  );
}

export default App;
