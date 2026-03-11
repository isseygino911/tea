import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage immediately (no loading state!)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const initialUserRef = useRef(null);

  // Store initial user to prevent dashboard switching during validation
  useEffect(() => {
    if (!authChecked) {
      initialUserRef.current = user;
    }
  }, [user, authChecked]);

  // Background token validation - only updates user if different
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthChecked(true);
      return;
    }

    authAPI.getMe()
      .then((res) => {
        const userData = res.data.user;
        // Ensure is_admin is boolean
        userData.is_admin = userData.is_admin === 1 || userData.is_admin === true;
        
        // Only update if user has actually changed
        const currentUser = initialUserRef.current;
        const hasChanged = !currentUser || 
          currentUser.id !== userData.id || 
          currentUser.is_admin !== userData.is_admin;
        
        if (hasChanged) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      })
      .catch(() => {
        // Token invalid - clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const userData = res.data.user;
    userData.is_admin = userData.is_admin === 1 || userData.is_admin === true;
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const register = async (email, password) => {
    const res = await authAPI.register({ email, password });
    const userData = res.data.user;
    userData.is_admin = userData.is_admin === 1 || userData.is_admin === true;
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
