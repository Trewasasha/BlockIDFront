import { ProductCard } from '../../components/ProductCard/ProductCard';
import styles from './Home.module.css';
import design from '../../assets/2.jpg';
import video from '../../assets/video/1224.mp4';
import { useState, useEffect } from 'react';
import { productsAPI } from '../../api/cart';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка товаров...</div>;
  }

  return (
    <main className={styles.home}>
      {/* Герой-секция с видео */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.videoContainer}>
            <video autoPlay loop muted playsInline className={styles.heroVideo}>
              <source src={video} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        </div>
      </section>

      {/* Секция с характеристиками */}
      <section className={styles.parallaxSection}>
        <div className={styles.parallaxGrid}>
          <div className={styles.parallaxColumn}>
            <div 
              className={styles.parallaxImage}
              style={{ backgroundImage: `url(${design})`}}
            />
            <div className={styles.featureCard}>
              <h3>Дизайн</h3>
              <p>Современные дизайнерские решения, которые подчеркнут стиль вашего интерьера</p>
            </div>
          </div>

          <div className={styles.parallaxColumn}>
            <div 
              className={styles.parallaxImage}
              style={{ backgroundImage: `url(${design})`}}
            />
            <div className={styles.featureCard}>
              <h3>Скорость</h3>
              <p>Быстрая доставка и монтаж в кратчайшие сроки без потери качества</p>
            </div>
          </div>

          <div className={styles.parallaxColumn}>
            <div 
              className={styles.parallaxImage}
              style={{ backgroundImage: `url(${design})` }}
            />
            <div className={styles.featureCard}>
              <h3>Качество</h3>
              <p>Используем только проверенные материалы от ведущих производителей</p>
            </div>
          </div>
        </div>
      </section>

      {/* Секция с товарами */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Наши товары</h2>
        <div className={styles.productsContainer}>
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              horizontal={true}
            />
          ))}
        </div>
      </section>
    </main>
  );
};