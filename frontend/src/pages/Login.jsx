import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && role === 'RELATIVE' && !patientName.trim()) {
      setError('Please enter the name of the patient you are related to.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await register(email, name, password, role, role === 'RELATIVE' ? patientName.trim() : undefined);
        alert('Registration successful! Please log in.');
        setIsRegister(false);
        setPassword('');
        setPatientName('');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form glass-card">
        <h1>Medico 🏥</h1>
        <h2>{isRegister ? 'Create Account' : 'Login'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="PATIENT">🤒 Patient</option>
                  <option value="DOCTOR">👨‍⚕️ Doctor</option>
                  <option value="RELATIVE">👨‍👩‍👧 Relative</option>
                </select>
              </div>

              {role === 'RELATIVE' && (
                <div className="form-group patient-link-box">
                  <label className="patient-link-label">👤 Patient Name</label>
                  <p className="patient-link-hint">
                    Enter the exact full name of the patient you are related to. 
                    The patient must already be registered in the system.
                  </p>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="patient-name-input"
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Loading...' : isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setPatientName('');
            }}
            className="toggle-btn"
          >
            {isRegister ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
