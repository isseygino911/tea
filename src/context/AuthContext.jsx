import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const normalizeUser = (userData) => ({
  ...userData,
  is_admin: userData.is_admin === 1 || userData.is_admin === true,
});

const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const initialUser = loadUserFromStorage();
  const [user, setUser] = useState(initialUser);
  // Start with loading=true to block PrivateRoute until auth check completes
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  // Capture initial user synchronously to prevent dashboard flicker on re-validation
  const initialUserRef = useRef(initialUser);

  // Background token validation - only updates user if different
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setAuthChecked(true);
      return;
    }

    authAPI.getMe()
      .then((res) => {
        const userData = normalizeUser(res.data.user);

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
        setLoading(false);
        setAuthChecked(true);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const userData = normalizeUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.register({ email, password });
      const userData = normalizeUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
