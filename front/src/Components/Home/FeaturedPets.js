import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from '../../api';
import './FeaturedPets.css';

const FeaturedPets = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const response = await api.get("/pets?limit=3");
        setFeaturedPets(response.data.slice(0, 3)); // Prendre seulement 3 animaux
      } catch (err) {
        console.error("Error fetching featured pets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPets();
  }, []);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <section className="featured-pets-section">
      <h2>Nos compagnons à adopter</h2>
      <div className="featured-pets-grid">
        {featuredPets.map(pet => (
          <div key={pet.id} className="featured-pet-card">
            <div className="pet-image-container">
              {pet.image && (
                <img 
                  src={pet.image.startsWith('http') ? pet.image : `http://localhost:8000/storage/${pet.image}`}
                  alt={pet.name}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>
            <div className="pet-info">
              <h3>{pet.name}</h3>
              <p><span>Type:</span> {pet.type}</p>
              <p><span>Âge:</span> {pet.age}</p>
            </div>
            <Link to={`/pets`} className="adopt-button">
              Voir détails
            </Link>
          </div>
        ))}
      </div>
      <Link to="/pets" className="see-all-button">
        Voir tous les animaux
      </Link>
    </section>
  );
};

export default FeaturedPets;