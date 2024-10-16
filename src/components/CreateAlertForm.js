import React, { useState } from 'react';

function CreateAlertForm({ onCreate }) {
    const [formData, setFormData] = useState({
      symbol: '',
      alert_type: 'price',
      alert_direction: '<=',
      alert_level: 0.00,
      note: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onCreate(formData);
      // Optionally reset form here
      setFormData({
        symbol: '',
        alert_type: 'price',
        alert_direction: '<=',
        alert_level: 0.00,
        note: '',
      });

      //force reload
      window.location.reload();
    };
  
    return (
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="Symbol"
            />
            {/* Other inputs with className="form-input" */}
    
            <select
              className="form-select"
              name="alert_type"
              value={formData.alert_type}
              onChange={handleChange}
            >
              <option value="price">Price</option>
              <option value="volume">Volume</option>
            </select>
            <select
              className="form-select"
              name="alert_direction"
              value={formData.alert_direction}
              onChange={handleChange}
            >
              <option value=">=">&gt;=</option>
              <option value=">">&gt;</option>
              <option value="<=">&lt;=</option>
              <option value="<">&lt;</option>
            </select>
            <input
              className="form-input"
              name="alert_level"
              inputmode="decimal"
              value={formData.level}
              onChange={handleChange}
              placeholder="Level"
            />
            {/* Other form elements */}
    
            <button type="submit" className="form-button">Create Alert</button>
          </form>
        </div>
      );
  }

  export default CreateAlertForm;
