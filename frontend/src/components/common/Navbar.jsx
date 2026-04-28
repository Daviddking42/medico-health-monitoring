import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>🏥 Medico</h1>
          </Link>
        </div>
        {user && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="nav-link-item">Dashboard</Link>
            <span className="user-info">
              {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
