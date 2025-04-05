import React from 'react';
import PostingPets from './PostingPets';
import AdoptingRequests from './AdoptingRequests';
import AdoptedHistory from './AdoptedHistory';
import ApprovedRequests from './ApprovedRequests';
import ListerUtilisateurs from './UserManagement'
import './AdminScreen.css';

const AdminScreen = ({ currentScreen }) => {
  return (
    <div className="admin-screen">
      <div className="welcome-container">
        <h2>Welcome</h2>
        <p>Responsable Name: Admin User</p>
      </div>

      <div className="admin-sections">
        <div className="pet-content">
          {currentScreen === 'postingPet' && <PostingPets />}
          {currentScreen === 'approvedRequests' && <ApprovedRequests />}
          {currentScreen === 'adoptingPet' && <AdoptingRequests />}
          {currentScreen === 'adoptedHistory' && <AdoptedHistory />}
          {currentScreen === 'ListerUtilisateurs' && <ListerUtilisateurs />}
          {currentScreen === 'postPet' && <PostingPets />}
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;