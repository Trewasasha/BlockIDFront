import { ShoppingCart, User, X } from 'react-feather';
import { Link } from 'react-router-dom';
import { useAuth } from '../UseAuth/useAuth';
import styles from './Header.module.css';

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
            {/* <span className={styles.badge}>0</span> */}
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
            <div className={styles.modalHeader}>
              <h3>{authMode === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}</h3>
              <button 
                className={styles.closeButton}
                onClick={closeAuthModal}
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <form onSubmit={handleAuth} className={styles.authForm}>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={isLoading}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  required
                  disabled={isLoading}
                  minLength={6}
                  className={styles.formInput}
                />
              </div>
              
              {authMode === 'register' && (
                <div className={styles.formGroup}>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Подтвердите пароль"
                    required
                    disabled={isLoading}
                    minLength={6}
                    className={styles.formInput}
                  />
                  {passwordError && (
                    <div className={styles.errorMessage}>{passwordError}</div>
                  )}
                </div>
              )}
              
              <button 
                type="submit" 
                className={styles.authButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.spinner}></span>
                ) : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>
            
            <div className={styles.authFooter}>
              <p className={styles.authSwitchText}>
                {authMode === 'login' ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className={styles.switchButton}
                >
                  {authMode === 'login' ? ' Зарегистрироваться' : ' Войти'}
                </button>
              </p>
              
              <div className={styles.socialAuth}>
                <div className={styles.divider}>
                  <span>или</span>
                </div>
                <div className={styles.socialButtons}>
                  <button 
                    type="button"
                    className={`${styles.socialButton} ${styles.vk}`}
                    onClick={() => login('VK')}
                    disabled={isLoading}
                  >
                    ВКонтакте
                  </button>
                  <button 
                    type="button"
                    className={`${styles.socialButton} ${styles.google}`}
                    onClick={() => login('Google')}
                    disabled={isLoading}
                  >
                    Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};