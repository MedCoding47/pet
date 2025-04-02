import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import Pets from "./Components/Pets/Pets";
import AdoptForm from "./Components/AdoptForm/AdoptForm";
import AdminLogin from "./Components/AdminPanel/AdminLogin";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import axios from 'axios';
import PetsViewer from './Components/Pets/PetsViewer';
import { useEffect, useState } from 'react';
import "./App.css";
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('admin-token');
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

const Layout = ({ children }) => (
  <>
    <Navbar title="PawFinds" />
    {children}
    <Footer title="PawFinds" />
  </>
);

const App = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/pets')
      .then(response => {
        // Vérifie que la réponse est bien un tableau
        if (Array.isArray(response.data)) {
          setPets(response.data);
        } else {
          console.error("Erreur : la réponse n'est pas un tableau.");
        }
      })
      .catch(error => {
        console.error("Erreur lors du chargement des animaux :", error);
      });
  }, []);
  return (<>
    
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout>
              <Home description="Ensure you are fully prepared to provide proper care and attention to your pet before welcoming them into your home." />
            </Layout>
          } 
        />
        <Route 
          path="/pets" 
          element={
            <Layout>
              <PetsViewer pets={pets} />
            </Layout>
          } 
        />
        <Route 
          path="/adopt-form" 
          element={
            <Layout>
              <AdoptForm />
            </Layout>
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route 
          path="/admin/panel" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect any unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    
    </>

  );
};

export default App;