import { useState } from 'react';
import { useClientAuth } from './ClientAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './ClientAuth.css';

const ClientRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const { register } = useClientAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation
      );
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="client-auth-container">
      <div className="client-auth-card">
        <h2>Inscription Client</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength="8"
              className="form-control"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            S'inscrire
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Déjà un compte ? <Link to="/client/login">Se connecter</Link></p>
          <p><Link to="/">Retour à l'accueil</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ClientRegister;