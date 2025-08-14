import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для автоматического добавления токена
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

const PASSWORD_ERRORS = {
  MISMATCH: 'Пароли не совпадают',
  TOO_SHORT: 'Пароль должен содержать минимум 6 символов',
};

export const useAuth = () => {
  const [state, setState] = useState({
    isLoggedIn: false,
    isAuthChecking: true,
    isAuthModalOpen: false,
    authMode: 'login',
    email: '',
    password: '',
    confirmPassword: '',
    isLoading: false,
    error: null,
    passwordError: ''
  });

  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No token found');
      
      await api.get('/auth/me');
      setState(prev => ({ ...prev, isLoggedIn: true, isAuthChecking: false }));
    } catch (err) {
      console.error('Auth check error:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState(prev => ({ ...prev, isLoggedIn: false, isAuthChecking: false }));
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      setState(prev => ({ ...prev, isLoggedIn: false }));
      navigate('/');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  const validatePassword = () => {
    if (state.authMode === 'register') {
      if (state.password !== state.confirmPassword) {
        setState(prev => ({ ...prev, passwordError: PASSWORD_ERRORS.MISMATCH }));
        return false;
      }
      if (state.password.length < 6) {
        setState(prev => ({ ...prev, passwordError: PASSWORD_ERRORS.TOO_SHORT }));
        return false;
      }
    }
    setState(prev => ({ ...prev, passwordError: '' }));
    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (state.authMode === 'register' && !validatePassword()) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const endpoint = state.authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload = state.authMode === 'login'
        ? new URLSearchParams({ username: state.email, password: state.password })
        : { 
            email: state.email, 
            password: state.password, 
            confirm_password: state.confirmPassword 
          };

      const config = {
        headers: {
          'Content-Type': state.authMode === 'login' 
            ? 'application/x-www-form-urlencoded' 
            : 'application/json'
        }
      };

      const response = await api.post(endpoint, payload, config);

      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        setState(prev => ({ 
          ...prev, 
          isLoggedIn: true,
          isAuthModalOpen: false,
          isLoading: false,
          email: '',
          password: '',
          confirmPassword: ''
        }));
        navigate('/profile');
      } else {
        throw new Error('Не удалось получить токен авторизации');
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.detail || err.message || 'Произошла ошибка при аутентификации',
        isLoading: false
      }));
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState(prev => ({
        ...prev,
        isLoggedIn: false,
        email: '',
        password: '',
        confirmPassword: ''
      }));
      navigate('/');
    }
  };

  const openAuthModal = (mode = 'login') => {
    setState(prev => ({
      ...prev,
      authMode: mode,
      isAuthModalOpen: true,
      error: null,
      passwordError: '',
      email: '',
      password: '',
      confirmPassword: ''
    }));
  };

  const closeAuthModal = () => {
    setState(prev => ({
      ...prev,
      isAuthModalOpen: false,
      error: null,
      passwordError: ''
    }));
  };

  const loginWithProvider = (provider) => {
    window.location.href = `${api.defaults.baseURL}/auth/${provider.toLowerCase()}`;
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      return false;
    }
  };

  return {
    ...state,
    setEmail: (email) => setState(prev => ({ ...prev, email })),
    setPassword: (password) => setState(prev => ({ ...prev, password })),
    setConfirmPassword: (confirmPassword) => setState(prev => ({ ...prev, confirmPassword })),
    handleAuth,
    logout,
    loginWithProvider,
    openAuthModal,
    closeAuthModal,
    setAuthMode: (mode) => setState(prev => ({ ...prev, authMode: mode })),
    refreshToken
  };
};