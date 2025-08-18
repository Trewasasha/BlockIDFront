import styles from './ProductCard.module.css';
import { ShoppingCart } from 'react-feather'; // Импортируем иконку корзины

export const ProductCard = ({ title, image, horizontal = false }) => {
  if (horizontal) {
    return (
      <div className={styles.horizontalCard}>
        <img src={image} alt={title} className={styles.horizontalImage} />
        <div className={styles.horizontalContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>Название блока</p>
          <div className={styles.cartIcon}>
            <ShoppingCart size={40} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.subtitle}>Название блока</p>
      <div className={styles.cartIcon}>
        <ShoppingCart size={20} />
      </div>
    </div>
  );
};