import React, { useState } from 'react';
import AdminNavBar from "./AdminNavBar";
import AdminFooter from "./AdminFooter";
import AdminScreen from './AdminScreen';
import './AdminPanel.css';

const AdminPanel = () => {
  const [currentScreen, setCurrentScreen] = useState('postingPet');

  return (
    <div className="admin-panel">
      <AdminNavBar setCurrentScreen={setCurrentScreen} />
      <div className="admin-content">
        <AdminScreen currentScreen={currentScreen} />
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminPanel;