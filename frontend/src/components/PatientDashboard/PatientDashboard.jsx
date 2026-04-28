import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { deviceAPI, alertAPI } from '../../services/api';
import Map from '../common/Map';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showDeviceForm, setShowDeviceForm] = useState(false);
  const [newDevice, setNewDevice] = useState({ deviceId: '', deviceName: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
    fetchAlerts();
    const interval = setInterval(() => {
      fetchDevices();
      fetchAlerts();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await deviceAPI.getDevices();
      setDevices(response.data.devices);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await alertAPI.getAlerts();
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      await deviceAPI.registerDevice(newDevice.deviceId, newDevice.deviceName);
      setNewDevice({ deviceId: '', deviceName: '' });
      setShowDeviceForm(false);
      fetchDevices();
    } catch (error) {
      console.error('Failed to register device:', error);
      alert('Failed to register device');
    }
  };

  const handleMarkAsViewed = async (alertId) => {
    try {
      await alertAPI.markAsViewed(alertId);
      fetchAlerts();
    } catch (error) {
      console.error('Failed to mark alert as viewed:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="patient-dashboard">
      <h1>Welcome, {user?.name}! 👋</h1>
      
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Your Health Devices</h2>
          <button onClick={() => setShowDeviceForm(!showDeviceForm)} className="btn-primary">
            {showDeviceForm ? 'Cancel' : '+ Add Device'}
          </button>
        </div>

        {showDeviceForm && (
          <form onSubmit={handleAddDevice} className="device-form">
            <input
              type="text"
              placeholder="Device ID"
              value={newDevice.deviceId}
              onChange={(e) => setNewDevice({ ...newDevice, deviceId: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Device Name (e.g., Home Monitor)"
              value={newDevice.deviceName}
              onChange={(e) => setNewDevice({ ...newDevice, deviceName: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">Register Device</button>
          </form>
        )}

        <div className="devices-grid">
          {devices.length === 0 ? (
            <p className="empty-state">No devices registered yet</p>
          ) : (
            devices.map((device) => (
              <div key={device.id} className="device-card">
                <h3>{device.deviceName}</h3>
                <p className="device-id">ID: {device.deviceId}</p>
                {device.deviceData && device.deviceData.length > 0 && (
                  <div className="device-data">
                    {device.deviceData[0].temperature && (
                      <p>🌡️ {device.deviceData[0].temperature}°C</p>
                    )}
                    {device.deviceData[0].heartRate && (
                      <p>❤️ {device.deviceData[0].heartRate} bpm</p>
                    )}
                    {device.deviceData[0].spO2 && (
                      <p>🫁 {device.deviceData[0].spO2}% O₂</p>
                    )}
                  </div>
                )}
                <p className="last-updated">
                  Last updated: {device.deviceData?.[0]?.timestamp ? new Date(device.deviceData[0].timestamp).toLocaleString() : 'Never'}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Live Geolocation 📍</h2>
        <div className="map-container">
          {devices.some(d => d.deviceData?.[0]?.latitude) ? (
            <Map 
              center={[
                devices.find(d => d.deviceData?.[0]?.latitude).deviceData[0].latitude,
                devices.find(d => d.deviceData?.[0]?.longitude).deviceData[0].longitude
              ]}
              markers={devices
                .filter(d => d.deviceData?.[0]?.latitude)
                .map(d => ({
                  lat: d.deviceData[0].latitude,
                  lng: d.deviceData[0].longitude,
                  popup: `${d.deviceName} - Last seen: ${new Date(d.deviceData[0].timestamp).toLocaleString()}`
                }))
              }
              height="400px"
            />
          ) : (
            <p className="empty-state">No geolocation data available for your devices.</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Alerts 🚨</h2>
        <div className="alerts-list">
          {alerts.length === 0 ? (
            <p className="empty-state">No alerts at the moment</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`alert-item ${alert.severity}`}>
                <div className="alert-header">
                  <span className="alert-type">{alert.type}</span>
                  <span className={`alert-severity ${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                </div>
                <p className="alert-message">{alert.message}</p>
                
                {alert.latitude && alert.longitude && (
                  <div className="alert-location">
                    <span>📍 {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</span>
                    <a 
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      View on Map
                    </a>
                  </div>
                )}

                <p className="alert-time">{new Date(alert.createdAt).toLocaleString()}</p>
                {!alert.isViewed && (
                  <button onClick={() => handleMarkAsViewed(alert.id)} className="btn-secondary">
                    Mark as viewed
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
