import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import './AdminLogin.css'; // Create this CSS file

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/login', { email, password });
      localStorage.setItem('admin-token', response.data.token);
      navigate('/admin/panel');
    } catch (error) {
      setShowErrorMessage(true);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="brand-header">
          <h1>PAWFINDS</h1>
          <h2>Login Account</h2>
        </div>
        
        <div className="welcome-message">
          <h3>Welcome Back</h3>
          <p>
            Manage your pet adoption platform, review applications,
            and oversee all administrative activities in one place.
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {showErrorMessage && (
            <p className="error-message">Incorrect email or password</p>
          )}

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;