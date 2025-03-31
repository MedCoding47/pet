import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AdminNavBar = ({ setCurrentScreen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin authentication
    localStorage.removeItem('admin-token');
    // Redirect to admin login page
    navigate('/admin'); // Changed to redirect to /admin
  };

  return (
    <header className="admin-header">
      <div className="logo">
        <p><span>Admin</span>page</p>
      </div>
      <ul className="menu">
        <li><button onClick={() => setCurrentScreen('approvedRequests')}>Approved Pets</button></li>
        <li><button onClick={() => setCurrentScreen('adoptingPet')}>Adoption Requests</button></li>
        <li><button onClick={() => setCurrentScreen('adoptedHistory')}>Adopted History</button></li>
        <li><button onClick={() => setCurrentScreen('postPet')}>Post a Pet</button></li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </li>
      </ul>
    </header>
  );
};

export default AdminNavBar;