import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/login', { email, password });
      localStorage.setItem('admin-token', response.data.token);
      if (rememberMe) {
        localStorage.setItem('admin-email', email);
      }
      navigate('/admin/panel');
    } catch (error) {
      setShowErrorMessage(true);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Sidebar with branding */}
      <div className="login-sidebar">
        <div className="sidebar-content">
          <div className="brand-header">
            <h1>PAWFINDS</h1>
          </div>
          <p className="brand-tagline">Admin Portal for Pet Adoption Management</p>
          
          <div className="dashboard-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Manage pet listings and applications</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Review adoption requests</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Access analytics and reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main login content */}
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h2>Admin Login</h2>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {showErrorMessage && (
              <div className="error-message">
                ⚠️ Invalid email or password. Please try again.
              </div>
            )}

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <a href="/admin/forgot-password" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;