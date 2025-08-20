import styles from './ProductCard.module.css';
import { ShoppingCart } from 'react-feather';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../UseAuth/useAuth';

export const ProductCard = ({ product, horizontal = false }) => {
  const { isLoggedIn, openAuthModal } = useAuth();
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      alert('Товар добавлен в корзину!');
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
      alert(error.response?.data?.detail || 'Ошибка при добавлении в корзину');
    }
  };

  if (horizontal) {
    return (
      <div className={styles.horizontalCard}>
        <img src={product.image_url || product.image} alt={product.name} className={styles.horizontalImage} />
        <div className={styles.horizontalContent}>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.subtitle}>{product.category}</p>
          <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
          <div 
            className={`${styles.cartIcon} ${loading ? styles.disabled : ''}`} 
            onClick={handleAddToCart}
          >
            <ShoppingCart size={40} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <img src={product.image_url || product.image} alt={product.name} className={styles.image} />
      <h3 className={styles.title}>{product.name}</h3>
      <p className={styles.subtitle}>{product.category}</p>
      <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
      <div 
        className={`${styles.cartIcon} ${loading ? styles.disabled : ''}`} 
        onClick={handleAddToCart}
      >
        <ShoppingCart size={20} />
      </div>
    </div>
  );
};