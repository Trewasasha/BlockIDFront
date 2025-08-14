import styles from './ProductCard.module.css';

export const ProductCard = ({ title, image, horizontal = false }) => {
  if (horizontal) {
    return (
      <div className={styles.horizontalCard}>
        <img src={image} alt={title} className={styles.horizontalImage} />
        <div className={styles.horizontalContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>Название блока</p>
          <button className={styles.button}>Добавить в корзину</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.subtitle}>Название блока</p>
      <button className={styles.button}>Добавить в корзину</button>
    </div>
  );
};