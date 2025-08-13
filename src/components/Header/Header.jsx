import { ShoppingCart, User } from 'react-feather';
import { Link } from 'react-router-dom';
import { useAuth } from '../UseAuth/useAuth';
import styles from './Header.module.css';

import vkIcon from '../../assets/vk.png';
import googleIcon from '../../assets/google.png';

export const Header = () => {
  const {
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
    login,
    openAuthModal,
    closeAuthModal,
    setAuthMode,
  } = useAuth();

  const handleProfileClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      openAuthModal('login');
    }
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/">Главная</Link>
        </nav>
        <div className={styles.actions}>
          <Link to="/cart" className={styles.iconLink} aria-label="Корзина">
            <ShoppingCart size={20} />
          </Link>
          <Link 
            to="/profile" 
            className={styles.iconLink} 
            aria-label="Профиль"
            onClick={handleProfileClick}
          >
            <User size={20} />
          </Link>
        </div>
      </header>

      {isAuthModalOpen && (
        <div className={styles.authModal}>
          <div className={styles.modalContent}>
            <button 
              className={styles.closeButton}
              onClick={closeAuthModal}
              disabled={isLoading}
            >
              &times;
            </button>
            
            <div className={styles.modalHeader}>
              <h3>{authMode === 'login' ? 'Вход' : 'Регистрация'}</h3>
            </div>
            
            <form className={styles.authForm} onSubmit={handleAuth}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  className={styles.formInput}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password">Пароль</label>
                <input
                  className={styles.formInput}
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
              </div>
              
              {authMode === 'register' && (
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <input
                    className={styles.formInput}
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  {passwordError && (
                    <p className={styles.errorMessage}>{passwordError}</p>
                  )}
                </div>
              )}
              
              <button 
                type="submit" 
                className={styles.authButton}
                disabled={isLoading}
              >
                {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>
            
            <div className={styles.authSwitch}>
              {authMode === 'login' ? (
                <p className={styles.authSwitchText}>
                  Нет аккаунта?{' '}
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('register')}
                    className={styles.switchButton}
                  >
                    Зарегистрироваться
                  </button>
                </p>
              ) : (
                <p className={styles.authSwitchText}>
                  Уже есть аккаунт?{' '}
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('login')}
                    className={styles.switchButton}
                  >
                    Войти
                  </button>
                </p>
              )}
            </div>
            
            <div className={styles.socialAuth}>
              <p className={styles.authSwitchText}>Или войти через:</p>
              <div className={styles.socialButtons}>
                <button 
                  type="button"
                  className={styles.socialButton}
                  onClick={() => login('VK')}
                  disabled={isLoading}
                >
                  <img src={vkIcon} alt="Вконтакте" width={40} height={40} />
                  VK
                </button>
                <button 
                  type="button"
                  className={styles.socialButton}
                  onClick={() => login('Google')}
                  disabled={isLoading}
                >
                  <img src={googleIcon} alt="Google" width={40} height={40} />
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};