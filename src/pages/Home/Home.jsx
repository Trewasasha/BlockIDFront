import { ProductCard } from '../../components/ProductCard/ProductCard';
import styles from './Home.module.css';
import design from '../../assets/2.jpg';
import video from '../../assets/video/1224.mp4';

// Импортируем все изображения товаров
import product1 from '../../assets/product/placeholder-product-1.jpg';
import product2 from '../../assets/product/placeholder-product-2.jpg';
import product3 from '../../assets/product/placeholder-product-3.jpg';
import product4 from '../../assets/product/placeholder-product-4.jpg';
import product5 from '../../assets/product/placeholder-product-5.jpg';
import product6 from '../../assets/product/placeholder-product-6.jpg';

// Массив с данными товаров
const products = [
  { id: 1, title: "Товар 1", image: product1 },
  { id: 2, title: "Товар 2", image: product2 },
  { id: 3, title: "Товар 3", image: product3 },
  { id: 4, title: "Товар 4", image: product4 },
  { id: 5, title: "Товар 5", image: product5 },
  { id: 6, title: "Товар 6", image: product6 },
];

export const Home = () => (
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
        {/* Первый ряд из 3 товаров */}
        <div className={styles.productsRow}>
          {products.slice(0, 3).map(product => (
            <ProductCard 
              key={product.id}
              title={product.title}
              image={product.image}
              horizontal
            />
          ))}
        </div>
        
        {/* Второй ряд из 3 товаров */}
        <div className={styles.productsRow}>
          {products.slice(3, 6).map(product => (
            <ProductCard 
              key={product.id}
              title={product.title}
              image={product.image}
              horizontal
            />
          ))}
        </div>
      </div>
    </section>
  </main>
);