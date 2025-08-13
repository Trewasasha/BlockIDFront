// Profile.jsx
import { useEffect, useState } from 'react';
import { useAuth, api } from '../../components/UseAuth/useAuth';
import styles from './Profile.module.css';

export const Profile = () => {
  const { logout, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }

  return (
    <div className={styles.profile}>
      <h1 className={styles.title}>Мой профиль</h1>
      
      {error ? (
        <div className={styles.error}>
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Попробовать снова
          </button>
        </div>
      ) : (
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              <img
                src={userData?.avatar || '/default-avatar.jpg'}
                alt="Аватар пользователя"
              />
            </div>
          </div>
          
          <div className={styles.details}>
            <h2 className={styles.username}>{userData?.email.split('@')[0] || 'Пользователь'}</h2>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{userData?.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Дата регистрации:</span>
              <span className={styles.infoValue}>
                {new Date(userData?.created_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Статус:</span>
              <span className={styles.infoValue} style={{ color: userData?.is_active ? '#4CAF50' : '#F44336' }}>
                {userData?.is_active ? 'Активен' : 'Неактивен'}
              </span>
            </div>
            
            <button 
              onClick={logout} 
              className={styles.logoutButton}
              disabled={authLoading}
            >
              {authLoading ? 'Выход...' : 'Выйти из аккаунта'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};