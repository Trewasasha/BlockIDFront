import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../components/UseAuth/useAuth';
import styles from './Profile.module.css';

export const Profile = () => {
  const { isLoggedIn, logout, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/me');
        setUserData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || 
          'Не удалось загрузить данные пользователя'
        );
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoggedIn) {
      navigate('/');
    } else {
      fetchUserData();
    }
  }, [isLoggedIn, navigate, logout]);

  if (!isLoggedIn) return null;

  return (
    <div className={styles.profile}>
      <h1>Мой профиль</h1>
      
      {isLoading ? (
        <div className={styles.loading}>Загрузка профиля...</div>
      ) : error ? (
        <div className={styles.error}>
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className={styles.logoutButton}
            style={{ marginTop: '1rem' }}
          >
            Попробовать снова
          </button>
        </div>
      ) : (
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            <img
              src={userData?.avatar || '/default-avatar.jpg'}
              alt="Аватар пользователя"
            />
          </div>
          
          <div className={styles.details}>
            <h2>{userData?.email.split('@')[0] || 'Пользователь'}</h2>
            <p><strong>Email:</strong> {userData?.email}</p>
            <p>
              <strong>Дата регистрации:</strong> {new Date(userData?.created_at).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p>
              <strong>Статус:</strong> 
              <span style={{ color: userData?.is_active ? '#4CAF50' : '#F44336' }}>
                {userData?.is_active ? ' Активен' : ' Неактивен'}
              </span>
            </p>
            
            <button 
              onClick={logout} 
              className={styles.logoutButton}
              disabled={authLoading}
            >
              {authLoading ? 'Выход...' : 'Выйти'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};