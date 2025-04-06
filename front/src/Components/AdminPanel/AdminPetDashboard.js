import React, { useState, useEffect } from 'react';
import api from '../../api';
import PostPetSection from './PostingPets';
import './AdminPetDashboard.css';

const AdminPetDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch pets from API
  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      const response = await api.get('/pets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPets(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Handle delete pet
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      await api.delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update pets list
      setPets(pets.filter(pet => pet.id !== id));
      setSuccessMessage('Pet deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError('Failed to delete pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a pet
  const startEdit = (pet) => {
    setEditingPet(pet);
    setView('edit');
  };

  // Handle pet add/edit completion
  const handlePetSaved = () => {
    setView('list');
    setEditingPet(null);
    fetchPets();
  };

  // Get image URL
  const getImageUrl = (pet) => {
    if (!pet.image) return '';
    if (pet.image.startsWith('http')) return pet.image;
    return `http://localhost:8000/storage/${pet.image.replace('storage/', '')}`;
  };

  // Filter pets based on search query
  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pet.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pet-management-dashboard">
      <div className="dashboard-header">
        <h1>Pet Management</h1>
        {view === 'list' && (
          <button className="add-button" onClick={() => setView('add')}>
            <span className="add-icon">+</span> Add New Pet
          </button>
        )}
      </div>
      
      {error && <div className="alert error">{error}</div>}
      {successMessage && <div className="alert success">{successMessage}</div>}

      {/* Pet listing view */}
      {view === 'list' && (
        <div className="content-card">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <i className="search-icon">🔍</i>
              <input 
                type="text" 
                placeholder="Search pets by name or type..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="responsive-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="id-column">ID</th>
                    <th className="img-column">IMAGE</th>
                    <th className="name-column">NAME</th>
                    <th className="email-column">TYPE</th>
                    <th className="role-column">AGE</th>
                    <th className="role-column">LOCATION</th>
                    <th className="actions-column">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">No pets found</td>
                    </tr>
                  ) : (
                    filteredPets.map(pet => (
                      <tr key={pet.id}>
                        <td>{pet.id}</td>
                        <td>
                          <img 
                            src={getImageUrl(pet)} 
                            alt={pet.name} 
                            className="pet-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                        </td>
                        <td>{pet.name}</td>
                        <td>
                          <span className={`type-badge ${pet.type.toLowerCase()}`}>
                            {pet.type}
                          </span>
                        </td>
                        <td>{pet.age}</td>
                        <td>{pet.location}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-icon-btn" 
                              onClick={() => startEdit(pet)}
                              title="Edit pet"
                            >
                              <i className="edit-icon">✏️</i>
                            </button>
                            <button 
                              className="delete-icon-btn"
                              onClick={() => handleDelete(pet.id)}
                              title="Delete pet"
                            >
                              <i className="delete-icon">🗑️</i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="refresh-section">
            <button className="refresh-btn" onClick={fetchPets} title="Refresh pet list">
              <i className="refresh-icon">🔄</i>
            </button>
          </div>
        </div>
      )}

      {/* Add new pet view */}
      {view === 'add' && (
        <div className="form-container">
          <PostPetSection onSuccess={handlePetSaved} />
          <button className="cancel-btn" onClick={() => setView('list')}>
            Cancel
          </button>
        </div>
      )}

      {/* Edit pet view */}
      {view === 'edit' && editingPet && (
        <div className="form-container">
          <EditPetForm pet={editingPet} onSuccess={handlePetSaved} />
          <button className="cancel-btn" onClick={() => setView('list')}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Edit Pet Form Component
const EditPetForm = ({ pet, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: pet.name || '',
    age: pet.age || '',
    location: pet.location || '',
    type: pet.type || 'Dog',
    breed: pet.breed || '',
    picture: null
  });
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({...formData, picture: selectedFile});
      setFileName(selectedFile.name);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate form fields
    if (!formData.name || !formData.age || !formData.location || formData.type === "None") {
      setFormError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("location", formData.location);
    data.append("type", formData.type);
    if (formData.breed) data.append("breed", formData.breed);
    if (formData.picture) data.append("picture", formData.picture);
    data.append("_method", "PUT"); // Laravel requires this for PUT requests

    try {
      const token = localStorage.getItem('admin-token');
      const response = await api.post(`/pets/${pet.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status !== 200) {
        throw new Error("Failed to update pet");
      }

      onSuccess();
    } catch (error) {
      console.error("Error updating pet:", error);
      setFormError(error.response?.data?.message || "Failed to update pet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-pet-container">
      <h2 className="section-title">Edit Pet</h2>

      {formError && <div className="alert error">{formError}</div>}

      <form onSubmit={handleSubmit} className="pet-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Pet Age *</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Breed</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Fish">Fish</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Change Picture (leave empty to keep current)</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <span className="file-input-text">
                {fileName || "Choose a New Picture"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input-hidden"
              />
            </label>
            {pet.image && (
              <div className="current-image">
                <p>Current image:</p>
                <img 
                  src={pet.image.startsWith('http') ? pet.image : `http://localhost:8000/storage/${pet.image.replace('storage/', '')}`}
                  alt={pet.name}
                  className="current-pet-image"
                />
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span> Updating...
            </>
          ) : (
            "Update Pet"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminPetDashboard;