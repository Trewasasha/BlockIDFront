// Header.jsx
import { ShoppingCart, User } from 'react-feather';
import { Link } from 'react-router-dom';
// import { useAuth } from '../UseAuth/useAuth';
import styles from './Header.module.css';

export const Header = ({ auth }) => {
  const { isLoggedIn, openAuthModal } = auth;

  const handleProfileClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      openAuthModal('login');
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/">Block Кухни</Link>
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
  );
};