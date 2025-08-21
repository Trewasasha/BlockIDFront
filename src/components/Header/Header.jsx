import { ShoppingCart, User, Settings } from 'react-feather';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export const Header = ({ auth }) => {
  const { isLoggedIn, openAuthModal, user } = auth;

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
        <Link to="/catalog">Каталог</Link>
      </nav>
      
      <div className={styles.actions}>
        <Link to="/cart" className={styles.iconLink} aria-label="Корзина">
          <ShoppingCart size={20} />
        </Link>
        
        {user?.role === 'ADMIN' && (
          <Link to="/admin" className={styles.iconLink} aria-label="Админка">
            <Settings size={20} />
          </Link>
        )}
        
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