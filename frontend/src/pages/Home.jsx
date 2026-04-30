import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import heroImage from '../assets/medico_hero_landing.png';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-brand">🏥 Medico</div>
        <div className="nav-links">
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/login" className="nav-register btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Your Health, <span className="highlight">Monitored Real-Time.</span></h1>
          <p>
            The next generation of health monitoring. Connect your devices, 
            track your vitals, and keep your loved ones safe with real-time 
            alerts and geolocation.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary lg">Start Monitoring Now</Link>
            <button className="btn-secondary lg">Learn More</button>
          </div>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Real-time</span>
              <span className="stat-label">Alerts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Global</span>
              <span className="stat-label">GPS Support</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Medico Platform" className="glass-card" />
        </div>
      </main>

      <section className="features-grid">
        <div className="feature-card glass-card">
          <span className="feature-icon"><i className="fas fa-heartbeat"></i></span>
          <h3>Vital Tracking</h3>
          <p>Monitor heart rate, SpO2, and temperature with clinical precision.</p>
        </div>
        <div className="feature-card glass-card">
          <span className="feature-icon"><i className="fas fa-bell"></i></span>
          <h3>Smart Alerts</h3>
          <p>Get instant notifications when readings cross your custom safety thresholds.</p>
        </div>
        <div className="feature-card glass-card">
          <span className="feature-icon"><i className="fas fa-map-marker-alt"></i></span>
          <h3>GPS Geolocation</h3>
          <p>Know exactly where your loved ones are during an emergency.</p>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>🏥 Medico</h3>
            <p>Advanced Health Monitoring Solutions</p>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p><i className="fas fa-envelope"></i> davidkingmark425@gmail.com</p>
            <p><i className="fas fa-phone"></i> +237 691 33 48 90 / +1(33) 025 256 258</p>
            <p><i className="fas fa-map-marker-alt"></i> Douala, Nyalla</p>
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="mailto:davidkingmark425@gmail.com"><i className="fab fa-google"></i></a>
              <a href="#!"><i className="fab fa-facebook"></i></a>
              <a href="#!"><i className="fab fa-twitter"></i></a>
              <a href="#!"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Medico Health Monitoring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
