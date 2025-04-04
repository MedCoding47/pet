import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientAuthContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
});

export const ClientAuthProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('client_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configuration des headers axios
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.defaults.headers.common['Accept'] = 'application/json';
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const loadClient = async () => {
    try {
      const { data } = await api.get('/api/user');
      if (!data.is_admin) {
        setClient(data);
      } else {
        await logout(); // Utilisation correcte de la fonction logout
      }
    } catch (error) {
      console.error('Erreur chargement client:', error);
      await logout(); // Utilisation correcte de la fonction logout
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadClient();
    else setLoading(false);
  }, [token]);

  const register = async (name, email, password, password_confirmation) => {
    try {
      const { data } = await api.post('/api/client/register', {
        name,
        email, 
        password,
        password_confirmation
      });
      
      localStorage.setItem('client_token', data.token);
      setToken(data.token);
      setClient(data.user);
      navigate('/client/dashboard');
    } catch (error) {
      console.error('Erreur inscription:', error.response?.data);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/client/login', { email, password });
      localStorage.setItem('client_token', data.token);
      setToken(data.token);
      setClient(data.user);
      navigate('/client/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } finally {
      localStorage.removeItem('client_token');
      delete api.defaults.headers.common['Authorization'];
      setClient(null);
      setToken(null);
      navigate('/client/login');
    }
  };

  return (
    <ClientAuthContext.Provider value={{
      client,
      token,
      register,
      login, // Fonction bien définie maintenant
      logout, // Fonction bien définie maintenant
      loading,
      isAuthenticated: !!client
    }}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);