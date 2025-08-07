import { ProductCard } from '../../components/ProductCard/ProductCard';
import styles from './Home.module.css';

export const Home = () => (
  <main className={styles.home}>
    {/* Герой-секция с видео */}
    <section className={styles.hero}>
      <div className={styles.videoContainer}>
        <video autoPlay loop muted playsInline className={styles.heroVideo}>
          <source src="../../../public/video/1224.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </section>

    {/* Секция с характеристиками */}
    <section className={styles.parallaxSection}>
      <div className={styles.parallaxRow}>
        <div 
          className={styles.parallaxImage}
          style={{ backgroundImage: "url('../../../public/2.jpg')" }}
        />
        <div className={styles.featureCard}>
          <h3>Дизайн</h3>
          <p>Современные дизайнерские решения, которые подчеркнут стиль вашего интерьера</p>
        </div>
      </div>

      <div className={styles.parallaxRow}>
        <div 
          className={styles.parallaxImage}
          style={{ backgroundImage: "url('../../../public/2.jpg')" }}
        />
        <div className={styles.featureCard}>
          <h3>Скорость</h3>
          <p>Быстрая доставка и монтаж в кратчайшие сроки без потери качества</p>
        </div>
      </div>

      <div className={styles.parallaxRow}>
        <div 
          className={styles.parallaxImage}
          style={{ backgroundImage: "url('../../../public/2.jpg')" }}
        />
        <div className={styles.featureCard}>
          <h3>Качество</h3>
          <p>Используем только проверенные материалы от ведущих производителей</p>
        </div>
      </div>
    </section>

    {/* Секция с товарами */}
    <section className={styles.productsSection}>
      <h2 className={styles.sectionTitle}>Наши товары</h2>
      <div className={styles.productsGrid}>
        {[...Array(6)].map((_, i) => (
          <ProductCard 
            key={i}
            title={`Товар ${i+1}`}
            image={`/placeholder-product-${i+1}.jpg`}
          />
        ))}
      </div>
    </section>
  </main>
);