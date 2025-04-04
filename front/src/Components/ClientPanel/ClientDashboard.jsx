import { useClientAuth } from './ClientAuthContext';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const { client, logout } = useClientAuth();

  return (
    <div className="client-dashboard">
      <h2>Bienvenue, {client?.name}</h2>
      <div className="dashboard-actions">
        <Link to="/pets" className="btn btn-primary">
          Voir les animaux disponibles
        </Link>
        <button onClick={logout} className="btn btn-secondary">
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default ClientDashboard;