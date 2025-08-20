// AuthModal.jsx
import styles from './AuthModal.module.css';
import vkIcon from '../../assets/vk.png';
import googleIcon from '../../assets/google.png';
import yandexIcon from '../../assets/яндекс.png';

export const AuthModal = ({
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
  loginWithProvider,
  closeAuthModal,
  setAuthMode,
}) => {
  if (!isAuthModalOpen) return null;

  return (
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
              onClick={() => loginWithProvider('VK')}
              disabled={isLoading}
            >
              <img src={vkIcon} alt="Вконтакте" width={40} height={40} />
            </button>
            <button 
              type="button"
              className={styles.socialButton}
              onClick={() => loginWithProvider('Google')}
              disabled={isLoading}
            >
              <img src={googleIcon} alt="Google" width={40} height={40} />
            </button>
            <button 
              type="button"
              className={styles.socialButton}
              onClick={() => loginWithProvider('Yandex')}
              disabled={isLoading}
            >
              <img src={yandexIcon} alt="Yandex" width={40} height={40} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};