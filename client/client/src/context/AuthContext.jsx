import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'; // this should be a configured axios instance
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(res.data.user); // expects { user: { name, email, role, ... } }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials); // returns { token, user }
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      navigate('/login');
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout'); // optional
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
