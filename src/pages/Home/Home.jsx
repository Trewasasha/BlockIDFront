import { ProductCard } from '../../components/ProductCard/ProductCard';
import styles from './Home.module.css';

export const Home = () => (
  <main className={styles.home}>
    {/* Видео-секция */}
    <section className={styles.hero}>
      <div className={styles.videoContainer}>
        <video autoPlay loop muted playsInline className={styles.heroVideo}>
          <source src="/kitchen-video.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </section>

    {/* Секция с параллакс-эффектом и характеристиками */}
    <section className={styles.parallaxSection}>
      <div className={styles.parallaxRow}>
        <div className={styles.parallaxImage}></div>
        <div className={styles.featureCard}>
          <h3>Дизайн</h3>
          <div className={styles.featureBar}></div>
          <div className={styles.featureBar}></div>
          <div className={styles.featureBar}></div>
        </div>
      </div>

      <div className={styles.parallaxRow}>
        <div className={styles.parallaxImage}></div>
        <div className={styles.featureCard}>
          <h3>Скорость</h3>
          <div className={styles.featureBar}></div>
          <div className={styles.featureBar}></div>
          <div className={styles.featureBar}></div>
        </div>
      </div>

      <div className={styles.parallaxRow}>
        <div className={styles.parallaxImage}></div>
        <div className={styles.featureCard}>
          <h3>Качество</h3>
          <div className={styles.featureBar}></div>
          <div className={styles.featureBar}></div>
          <div className={styles.featureBar}></div>
        </div>
      </div>
    </section>

    {/* Сетка товаров */}
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
