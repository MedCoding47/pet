import React, { useState } from 'react';
import AdminNavBar from "./AdminNavBar";
import AdminScreen from './AdminScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './AdminPanel.css';

const AdminPanel = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const adminName = 'Admin User';

  return (
    <div className="admin-panel">
      <AdminNavBar setCurrentScreen={setCurrentScreen} />
      
      <div className="admin-content">
        <div className="top-bar">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Search" />
          </div>
          
          <div className="user-info">
            <div className="avatar">
              {adminName.charAt(0)}
            </div>
            <span>{adminName}</span>
          </div>
        </div>

        <AdminScreen currentScreen={currentScreen} />
      </div>
    </div>
  );
};

export default AdminPanel;