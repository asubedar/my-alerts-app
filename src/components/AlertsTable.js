import React, { useState } from 'react';

// Utility function to format the date
function formatDate(dateString, timeZone = 'America/New_York') {
  if (!dateString) return ''; // Handle null or undefined dates

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timeZone, // Use the provided or default timeZone
  };

  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
}

function AlertsTable({ alerts, onUpdate, onDelete }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    symbol: '',
    alert_type: '',
    alert_direction: '',
    alert_level: null,
    fire_date: '',
    note: '',
    create_date: ''
  });

  // State to hold multiple sorting configurations
  const [sortConfig, setSortConfig] = useState([]);

  // Determine if sorting should be alphabetical or numerical
  const isAlphabetical = (key) => ['symbol', 'alert_type', 'alert_direction', 'note'].includes(key);

  const sortedAlerts = [...alerts].sort((a, b) => {
    for (let config of sortConfig) {
      let aValue = a[config.key];
      let bValue = b[config.key];
  
      // Handle null or undefined values
      aValue = aValue || '';
      bValue = bValue || '';
  
      if (isAlphabetical(config.key)) {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      } else if (config.key === 'fire_date' || config.key === 'create_date') {
        // Parse dates for sorting and handle invalid dates
        aValue = new Date(aValue);
        bValue = new Date(bValue);
  
        // Handle invalid dates (if the date is invalid, return it as a lower value)
        if (isNaN(aValue.getTime())) aValue = new Date(0); // Fallback to epoch time for invalid dates
        if (isNaN(bValue.getTime())) bValue = new Date(0); // Fallback to epoch time for invalid dates
      } else if (config.key === 'alert_level') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
  
      if (aValue < bValue) {
        return config.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return config.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  // Handle column header click to toggle sorting
  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      const existingConfig = prevSortConfig.find((config) => config.key === key);
      if (existingConfig) {
        // Toggle between ascending, descending, and unsorted
        if (existingConfig.direction === 'ascending') {
          return prevSortConfig.map((config) =>
            config.key === key
              ? { ...config, direction: 'descending' }
              : config
          );
        } else if (existingConfig.direction === 'descending') {
          // Remove the sorting configuration for the column (unsorted state)
          return prevSortConfig.filter((config) => config.key !== key);
        }
      } else {
        // Add the new column to the sort configuration in ascending order
        return [...prevSortConfig, { key, direction: 'ascending' }];
      }
    });
  };

  // Helper function to show sort indicators
  const getSortIndicator = (key) => {
    const config = sortConfig.find((config) => config.key === key);
    if (config) {
      return config.direction === 'ascending' ? '▲' : '▼';
    }
    return ''; // No indicator if the column is not being sorted
  };

  const handleFocus = (alert) => {
    if (editRowId !== alert.id) {
      setEditRowId(alert.id);
      setEditFormData({
        symbol: alert.symbol,
        alert_type: alert.alert_type,
        alert_direction: alert.alert_direction,
        alert_level: alert.alert_level,
        fire_date: alert.fire_date,
        note: alert.note || '',
        create_date: alert.create_date
      });
    }
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    onUpdate(editRowId, editFormData); // Call onUpdate prop with the ID and form data
    setEditRowId(null); // Exit editing mode
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th className="symbol" onClick={() => handleSort('symbol')}>
              Symbol {getSortIndicator('symbol')}
            </th>
            <th className="type" onClick={() => handleSort('alert_type')}>
              Type {getSortIndicator('alert_type')}
            </th>
            <th className="direction" onClick={() => handleSort('alert_direction')}>
              Direction {getSortIndicator('alert_direction')}
            </th>
            <th onClick={() => handleSort('alert_level')}>
              Level {getSortIndicator('alert_level')}
            </th>
            <th onClick={() => handleSort('fire_date')}>
              Fire Date {getSortIndicator('fire_date')}
            </th>
            <th onClick={() => handleSort('note')}>
              Note {getSortIndicator('note')}
            </th>
            <th>Actions</th>
            <th onClick={() => handleSort('create_date')}>
              Created {getSortIndicator('create_date')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAlerts.map((alert) => (
            <tr key={alert.id}>
              <td className="symbol">
                {editRowId === alert.id ? (
                  <input
                    type="text"
                    name="symbol"
                    value={editFormData.symbol}
                    onChange={handleEditFormChange}
                    onFocus={() => handleFocus(alert)}
                  />
                ) : (
                  <span>{alert.symbol}</span>
                )}
              </td>
              <td className="type">
                {editRowId === alert.id ? (
                  <input
                    type="text"
                    name="alert_type"
                    value={editFormData.alert_type}
                    onChange={handleEditFormChange}
                    onFocus={() => handleFocus(alert)}
                  />
                ) : (
                  <span>{alert.alert_type}</span>
                )}
              </td>
              <td className="direction">
                {editRowId === alert.id ? (
                  <input
                    type="text"
                    name="alert_direction"
                    value={editFormData.alert_direction}
                    onChange={handleEditFormChange}
                    onFocus={() => handleFocus(alert)}
                  />
                ) : (
                  <span>{alert.alert_direction}</span>
                )}
              </td>
              <td>
                {editRowId === alert.id ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    name="alert_level"
                    value={editFormData.alert_level}
                    onChange={handleEditFormChange}
                    onFocus={() => handleFocus(alert)}
                  />
                ) : (
                  <span>{alert.alert_level}</span>
                )}
              </td>
              <td>
                {editRowId === alert.id ? (
                  <input
                    type="datetime"
                    name="fire_date"
                    value={editFormData.fire_date || ''}
                    onChange={handleEditFormChange}
                    onFocus={() => handleFocus(alert)}
                  />
                ) : (
                  <span>{formatDate(alert.fire_date)}</span>
                )}
              </td>
              <td>
                {editRowId === alert.id ? (
                  <input
                    type="text"
                    name="note"
                    value={editFormData.note}
                    onChange={handleEditFormChange}
                    onFocus={() => handleFocus(alert)}
                  />
                ) : (
                  <span>{alert.note}</span>
                )}
              </td>
              <td>
                {editRowId === alert.id ? (
                  <button onClick={handleSaveClick}>Save</button>
                ) : (
                  <button onClick={() => onDelete(alert.id)}>Delete</button>
                )}
              </td>
              <td>
                {editRowId === alert.id ? (
                  <input
                    type="datetime"
                    name="create_date"
                    value={editFormData.create_date || ''}
                    onChange={handleEditFormChange}
                    onFocus={() => handleFocus(alert)}
                    readOnly
                  />
                ) : (
                  <span>{formatDate(alert.create_date)}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlertsTable;