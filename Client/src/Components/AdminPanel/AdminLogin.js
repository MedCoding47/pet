import React, { useState } from "react";
import api from '../../api'; // Ensure this path is correct
import AdminPanel from "./AdminPanel";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post('/admin/login', {
        email, // Ensure this matches the backend expectation
        password, // Ensure this matches the backend expectation
      });

      localStorage.setItem('admin-token', response.data.token); // Store the token
      setLoginSuccess(true);
      setShowErrorMessage(false);
    } catch (error) {
      setLoginSuccess(false);
      setShowErrorMessage(true);
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      {loginSuccess ? (
        <AdminPanel />
      ) : (
        <div className="login-body">
          <div className="login-container">
            <h2>Admin Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showErrorMessage && (
              <p className="error-message">Incorrect email or password</p>
            )}
            <button className="float-right" onClick={handleLogin}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;