import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUsers, faUserCog } from '@fortawesome/free-solid-svg-icons';

const AdminNavBar = ({ setCurrentScreen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="logo">
        <p><span>Admin</span>Panel</p>
      </div>
      <ul className="menu">
        <li>
          <button onClick={() => setCurrentScreen('approvedRequests')}>
            Approved Pets
          </button>
        </li>
        <li>
          <button onClick={() => setCurrentScreen('adoptingPet')}>
            Adoption Requests
          </button>
        </li>
        <li>
          <button onClick={() => setCurrentScreen('adoptedHistory')}>
            Adopted History
          </button>
        </li>
        <li>
          <button onClick={() => setCurrentScreen('postPet')}>
            Post a Pet
          </button>
        </li>
        <li>
          <button onClick={() => setCurrentScreen('userManagement')}>
            <FontAwesomeIcon icon={faUsers} /> User Management
          </button>
        </li>
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