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
  const [authChecked, setAuthChecked] = useState(false);
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
      console.log('Chargement du client...');
      const { data } = await api.get('/api/user');
      console.log('Réponse de l\'API:', data);
      
      if (!data.is_admin) {
        setClient(data);
        console.log('Client chargé avec succès:', data);
      } else {
        console.log('Utilisateur est un admin, déconnexion...');
        await silentLogout();
      }
    } catch (error) {
      console.error('Erreur chargement client:', error.response?.data || error.message);
      
      // Si l'erreur n'est pas 401, ne déconnectez pas l'utilisateur
      if (error.response?.status === 401) {
        console.log('Token invalide, déconnexion silencieuse');
        await silentLogout();
      }
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  // Vérification d'authentification initiale
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        await loadClient();
      } else {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [token]); // Exécuter chaque fois que le token change

  // Déconnexion silencieuse sans navigation
  const silentLogout = async () => {
    localStorage.removeItem('client_token');
    setToken(null);
    setClient(null);
  };

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
      // Utilisez l'endpoint correct selon votre API
      await api.post('/api/logout');
    } catch (error) {
      console.error('Erreur de déconnexion:', error.response?.data || error.message);
    } finally {
      await silentLogout();
      navigate('/client/login');
    }
  };

  return (
    <ClientAuthContext.Provider value={{
      client,
      token,
      register,
      login,
      logout,
      loading,
      authChecked,
      isAuthenticated: !!client
    }}>
      {!authChecked ? null : children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);