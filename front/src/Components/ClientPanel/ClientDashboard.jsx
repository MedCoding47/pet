import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClientDashboard() {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdoptions = async () => {
      const token = localStorage.getItem('client_token');

      if (!token) {
        setError("Vous devez être connecté pour voir vos demandes.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/client/adoptions", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        setAdoptionRequests(res.data.requests);
      } catch (err) {
        setError("Erreur lors du chargement de vos demandes.");
      }
    };

    fetchAdoptions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mon tableau de bord</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {adoptionRequests.length === 0 && !error && (
        <p className="text-gray-500">Vous n’avez soumis aucune demande d’adoption pour le moment.</p>
      )}

      <div className="space-y-4">
        {adoptionRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
          >
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              🐾 {request.pet?.name || "Nom de l’animal inconnu"}
            </h4>

            <div className="mb-1">
              <span className="font-medium text-gray-600">Statut:</span>{" "}
              <span className={
                request.status === "approved"
                  ? "text-green-600 font-semibold"
                  : request.status === "rejected"
                  ? "text-red-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }>
                {request.status === "approved" ? "Acceptée" : request.status === "rejected" ? "Refusée" : "En attente"}
              </span>
            </div>

            {request.admin_response && (
              <div className="mt-2 text-sm text-gray-700 bg-gray-50 border-l-4 border-blue-400 px-3 py-2 rounded">
                <strong>Réponse admin :</strong> {request.admin_response}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientDashboard;
