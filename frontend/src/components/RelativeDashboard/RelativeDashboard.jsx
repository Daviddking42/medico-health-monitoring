import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './RelativeDashboard.css';

const RelativeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="relative-dashboard">
      <h1>Relative Dashboard 👨‍👩‍👧</h1>
      <p>Welcome, {user?.name}!</p>
      
      <section className="dashboard-section">
        <h2>Your Patient Monitoring</h2>
        <p>Keep track of your loved one's health metrics.</p>
        <div className="feature-list">
          <div className="feature-item">
            <span>📍</span>
            <h3>Location Tracking</h3>
            <p>Real-time geolocation updates</p>
          </div>
          <div className="feature-item">
            <span>🚨</span>
            <h3>Alert Notifications</h3>
            <p>Receive alerts for health emergencies</p>
          </div>
          <div className="feature-item">
            <span>❤️</span>
            <h3>Health Status</h3>
            <p>Monitor current health readings</p>
          </div>
          <div className="feature-item">
            <span>🗺️</span>
            <h3>Map View</h3>
            <p>See your loved one on the map</p>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Connected Patients</h2>
        <p className="info-text">View the patients you're connected to as a relative.</p>
      </section>
    </div>
  );
};

export default RelativeDashboard;
