import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validatePassword = () => {
    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setPasswordError('Пароли не совпадают');
        return false;
      }
      if (password.length < 6) {
        setPasswordError('Пароль должен содержать минимум 6 символов');
        return false;
      }
    }
    setPasswordError('');
    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (authMode === 'register' && !validatePassword()) {
        return;
      }

      const endpoint = authMode === 'login' ? '/login' : '/register';
      const payload = authMode === 'login' 
        ? { email, password }
        : { 
            email, 
            password, 
            confirm_password: confirmPassword 
          };

      const response = await api.post(endpoint, payload);

      if (response.data.access_token) {
        setIsLoggedIn(true);
        localStorage.setItem('token', response.data.access_token);
        setIsAuthModalOpen(false);
        navigate('/profile');
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Произошла ошибка при аутентификации'
      );
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setError(null);
    setPasswordError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setError(null);
    setPasswordError('');
  };

  const login = (provider) => {
    window.location.href = `${api.defaults.baseURL}/auth/${provider.toLowerCase()}`;
  };

  return {
    isLoggedIn,
    isAuthModalOpen,
    authMode,
    email,
    password,
    confirmPassword,
    isLoading,
    error,
    passwordError,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleAuth,
    logout,
    login,
    openAuthModal,
    closeAuthModal,
    setAuthMode,
  };
};