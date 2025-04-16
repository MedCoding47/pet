import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClientDashboard() {
  const [clientInfo, setClientInfo] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch client information
  useEffect(() => {
    const fetchClientInfo = async () => {
      const token = localStorage.getItem('client_token');
      if (!token) {
        setError("Vous devez être connecté pour voir vos informations.");
        setIsLoading(false);
        return;
      }
      
      try {
        // Utiliser la route profile au lieu de /users/{id}
        const res = await axios.get(`http://localhost:8000/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        
        setClientInfo(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          password: '',
          confirmPassword: ''
        });
        
        // Stocker l'ID utilisateur si ce n'est pas déjà fait
        if (!localStorage.getItem('user_id')) {
          localStorage.setItem('user_id', res.data.id);
        }
      } catch (err) {
        setError("Erreur lors du chargement de vos informations.");
        console.error("Erreur API:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientInfo();
  }, []);

  // Fetch adoption requests
  useEffect(() => {
    const fetchAdoptions = async () => {
      const token = localStorage.getItem('client_token');
      if (!token) {
        return;
      }
      
      try {
        const res = await axios.get("http://localhost:8000/api/client/adoptions", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        setAdoptionRequests(res.data.requests || []);
      } catch (err) {
        console.error("Erreur API:", err);
        // Ne pas afficher d'erreur ici pour ne pas interférer avec l'affichage du profil
      }
    };

    if (activeTab === 'adoptions') {
      fetchAdoptions();
    }
  }, [activeTab]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match if updating password
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const token = localStorage.getItem('client_token');
    const userId = localStorage.getItem('user_id');
    
    try {
      // Only send password if it's provided
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password })
      };
      
      await axios.put(`http://localhost:8000/api/users/${userId}`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      
      setSuccessMessage("Profil mis à jour avec succès!");
      setIsEditing(false);
      
      // Update the client info in state
      setClientInfo({
        ...clientInfo,
        name: formData.name,
        email: formData.email
      });
      
      // Clear password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Erreur lors de la mise à jour du profil.");
      } else {
        setError("Erreur lors de la mise à jour du profil.");
      }
      console.error("Erreur API:", err);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      const token = localStorage.getItem('client_token');
      const userId = localStorage.getItem('user_id');
      
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        
        // Clear token and redirect to login page
        localStorage.removeItem('client_token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
      } catch (err) {
        setError("Erreur lors de la suppression du compte.");
        console.error("Erreur API:", err);
      }
    }
  };

  const renderProfileContent = () => {
    if (isLoading) {
      return <div className="loading">Chargement des informations...</div>;
    }
    
    if (!clientInfo) {
      return (
        <div className="error-state">
          <p>Impossible de charger vos informations. Veuillez vous reconnecter.</p>
          <button onClick={() => window.location.href = '/login'} className="primary-button">
            Se connecter
          </button>
        </div>
      );
    }

    return isEditing ? (
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="button-group">
          <button type="submit" className="primary-button">Enregistrer</button>
          <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>Annuler</button>
        </div>
      </form>
    ) : (
      <div className="profile-info">
        <div className="info-row">
          <span className="info-label">Nom:</span>
          <span className="info-value">{clientInfo.name}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{clientInfo.email}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Administrateur:</span>
          <span className="info-value">{clientInfo.is_admin ? 'Oui' : 'Non'}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Membre depuis:</span>
          <span className="info-value">
            {clientInfo.created_at ? new Date(clientInfo.created_at).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        
        <div className="button-group">
          <button onClick={() => setIsEditing(true)} className="primary-button">Modifier mes informations</button>
          <button onClick={handleDeleteAccount} className="danger-button">Supprimer mon compte</button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <div className="profile-section">
          <h2>Vos informations personnelles</h2>
          {renderProfileContent()}
        </div>
      );
    } else if (activeTab === 'adoptions') {
      return (
        <div className="adoptions-section">
          <h2>Vos demandes d'adoption</h2>
          
          {adoptionRequests.length === 0 ? (
            <div className="empty-state">
              <p>Vous n'avez soumis aucune demande d'adoption pour le moment.</p>
            </div>
          ) : (
            <div className="adoption-cards">
              {adoptionRequests.map((request) => (
                <div key={request.id} className="adoption-card">
                  <div className="pet-name">🐾 {request.pet?.name || "Animal inconnu"}</div>
                  
                  <div className="request-details">
                    <div className="status-label">Statut:</div>
                    <div className={`status-value status-${request.status}`}>
                      {request.status === "approved" ? "Acceptée" : 
                       request.status === "rejected" ? "Refusée" : "En attente"}
                    </div>
                  </div>
                  
                  <div className="request-details">
                    <div className="date-label">Date de demande:</div>
                    <div className="date-value">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {request.admin_response && (
                    <div className="admin-response">
                      <div className="response-label">Message de l'administrateur:</div>
                      <div className="response-content">{request.admin_response}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="client-dashboard">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div className="user-info">
          <span>Bonjour, {clientInfo?.name || 'Client'}</span>
        </div>
      </header>
      
      <div className="dashboard-content">
        <nav className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Mon profil
          </button>
          <button 
            className={`tab-button ${activeTab === 'adoptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('adoptions')}
          >
            Mes demandes d'adoption
          </button>
        </nav>
        
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
      
      <style jsx>{`
        /* Reset et styles généraux */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .client-dashboard {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        
        h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        
        /* Messages d'erreur et succès */
        .error-message, .success-message {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }
        
        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }
        
        /* État d'erreur */
        .error-state {
          text-align: center;
          padding: 40px 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .error-state p {
          margin-bottom: 20px;
          color: #616161;
        }
        
        /* En-tête du dashboard */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 30px;
        }
        
        .dashboard-header h1 {
          font-size: 1.8rem;
          color: #1a237e;
        }
        
        .user-info {
          font-size: 1rem;
          font-weight: 500;
        }
        
        /* Navigation par onglets */
        .tab-navigation {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 30px;
        }
        
        .tab-button {
          padding: 12px 20px;
          font-size: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #616161;
          transition: all 0.2s ease;
        }
        
        .tab-button:hover {
          color: #1a237e;
        }
        
        .tab-button.active {
          color: #1a237e;
          border-bottom: 2px solid #1a237e;
        }
        
        /* Contenu principal */
        .main-content {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          padding: 30px;
        }
        
        /* Loading state */
        .loading {
          text-align: center;
          padding: 20px;
          color: #757575;
        }
        
        /* Section profil */
        .profile-section .form-group {
          margin-bottom: 20px;
        }
        
        .profile-section label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #424242;
        }
        
        .profile-section input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          transition: border 0.2s ease;
        }
        
        .profile-section input:focus {
          outline: none;
          border-color: #1a237e;
          box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
        }
        
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .primary-button, .secondary-button, .danger-button {
          padding: 10px 16px;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .primary-button {
          background-color: #1a237e;
          color: white;
        }
        
        .primary-button:hover {
          background-color: #0d1257;
        }
        
        .secondary-button {
          background-color: #e0e0e0;
          color: #424242;
        }
        
        .secondary-button:hover {
          background-color: #bdbdbd;
        }
        
        .danger-button {
          background-color: #f44336;
          color: white;
        }
        
        .danger-button:hover {
          background-color: #d32f2f;
        }
        
        /* Informations du profil */
        .profile-info {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 6px;
        }
        
        .info-row {
          margin-bottom: 12px;
          display: flex;
        }
        
        .info-label {
          min-width: 150px;
          font-weight: 500;
          color: #616161;
        }
        
        .info-value {
          color: #212121;
        }
        
        /* Section des demandes d'adoption */
        .empty-state {
          padding: 30px;
          text-align: center;
          color: #757575;
          background-color: #f5f5f5;
          border-radius: 6px;
        }
        
        .adoption-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .adoption-card {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border-left: 4px solid #1a237e;
        }
        
        .pet-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #212121;
          margin-bottom: 15px;
        }
        
        .request-details {
          display: flex;
          margin-bottom: 10px;
          align-items: center;
        }
        
        .status-label, .date-label {
          min-width: 110px;
          font-weight: 500;
          color: #616161;
        }
        
        .status-value {
          font-weight: 600;
        }
        
        .status-approved {
          color: #2e7d32;
        }
        
        .status-rejected {
          color: #c62828;
        }
        
        .status-pending {
          color: #f57f17;
        }
        
        .admin-response {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }
        
        .response-label {
          font-weight: 500;
          color: #616161;
          margin-bottom: 6px;
        }
        
        .response-content {
          background-color: #e8eaf6;
          padding: 10px;
          border-radius: 4px;
          font-style: italic;
          color: #283593;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .client-dashboard {
            padding: 15px;
          }
          
          .main-content {
            padding: 20px;
          }
          
          .button-group {
            flex-direction: column;
          }
          
          .adoption-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ClientDashboard;