import React, { useState } from "react";
import api from '../../api';
import './PostPetSection.css'; // Create this CSS file

const PostPetSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    type: "Dog",
    picture: null
  });
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");

    // Validate form fields
    if (!formData.name || !formData.age || !formData.location || formData.type === "None" || !formData.picture) {
      setFormError("Please fill out all fields correctly.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("location", formData.location);
    data.append("type", formData.type);
    data.append("picture", formData.picture);

    try {
      const token = localStorage.getItem('admin-token');
      const response = await api.post("/pets", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status !== 201) {
        throw new Error("Failed to submit form");
      }

      // Reset form
      setFormData({
        name: "",
        age: "",
        location: "",
        type: "Dog",
        picture: null
      });
      setFileName("");
      setSuccessMessage("Pet posted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(error.response?.data?.message || "Failed to post pet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-pet-container">
      <h2 className="section-title">Post a Pet for Adoption</h2>

      {formError && <div className="alert error">{formError}</div>}
      {successMessage && <div className="alert success">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="pet-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            required
          />
        </div>

        <div className="form-group">
          <label>Picture *</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <span className="file-input-text">
                {fileName || "Choose a Picture"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
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

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span> Submitting...
            </>
          ) : (
            "Submit Your Pet"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostPetSection;