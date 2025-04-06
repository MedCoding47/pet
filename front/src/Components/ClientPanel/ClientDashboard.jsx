import { useClientAuth } from './ClientAuthContext';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const { client, logout } = useClientAuth();

  // Protection si client est null
  if (!client) {
    return (
      <div className="container py-5 text-center">
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar / Left Column */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white mx-auto"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {client.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="h4 mb-1">{client.name}</h3>
              <p className="text-muted mb-4">{client.email}</p>
              
              <Link to="/pets" className="btn btn-outline-primary w-100 mb-3">
                Voir les animaux disponibles
              </Link>
              <button 
                onClick={logout} 
                className="btn btn-outline-secondary w-100"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content / Right Column */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h2 className="h4 mb-0">Bienvenue sur votre espace personnel</h2>
            </div>
            <div className="card-body p-4">
              <div className="alert alert-success">
                <h4 className="alert-heading">Bonjour, {client.name}!</h4>
                <p>Vous êtes maintenant connecté à votre espace client. Vous pouvez consulter les animaux disponibles à l'adoption.</p>
              </div>
              
              <div className="card mb-3">
                <div className="card-body">
                  <h5>Dernières adoptions</h5>
                  <p className="text-muted">Aucune adoption récente.</p>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <h5>Nos conseils pour vous</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">Consultez régulièrement les nouveaux animaux disponibles</li>
                    <li className="list-group-item px-0">Complétez votre profil pour faciliter les démarches d'adoption</li>
                    <li className="list-group-item px-0">N'hésitez pas à nous contacter pour plus d'informations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;