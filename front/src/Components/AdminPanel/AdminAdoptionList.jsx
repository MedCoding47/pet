import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminAdoptionList() {
  const [adoptions, setAdoptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const token = localStorage.getItem("admin-token");

        const response = await axios.get("http://localhost:8000/api/admin/adoptions", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        

        setAdoptions(response.data.requests);
      } catch (err) {
        console.error("Erreur API :", err.response?.data || err.message);

        setError("Erreur lors de la récupération des demandes.");
      }
    };

    fetchAdoptions();
  }, []);

  return (
    <div className="admin-adoption-list">
      <h2>📋 Demandes d'adoption</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Raison</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {adoptions.map((item) => (
            <tr key={item.id}>
              <td>{item.pet?.name || "N/A"}</td>
              <td>{item.user?.name || "Anonyme"}</td>
              <td>{item.contact_email}</td>
              <td>{item.contact_phone}</td>
              <td>{item.adoption_reason}</td>
              <td>{item.status}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAdoptionList;
