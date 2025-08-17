import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContainer}>
      {/* Колонка "О компании" */}
      <div className={styles.footerColumn}>
        <h3>О КОМПАНИИ</h3>
        <ul>
          <li><a href="/about">О нас</a></li>
          <li><a href="/team">Команда</a></li>
          <li><a href="/career">Карьера</a></li>
        </ul>
      </div>

      {/* Колонка "Помощь" */}
      <div className={styles.footerColumn}>
        <h3>ПОМОЩЬ</h3>
        <ul>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/delivery">Доставка и оплата</a></li>
          <li><a href="/returns">Возврат</a></li>
        </ul>
      </div>

      {/* Колонка "Социальные сети" */}
      <div className={styles.footerColumn}>
        <h3>СОЦИАЛЬНЫЕ СЕТИ</h3>
        <ul>
          <li><a href="https://vk.com">Вконтакте</a></li>
          <li><a href="https://t.me">Телеграм</a></li>
        </ul>
      </div>

      {/* Колонка "Контакты" */}
      <div className={`${styles.footerColumn} ${styles.contacts}`}>
        <h3>КОНТАКТЫ</h3>
        <ul>
          <li><a href="tel:+79999999999">+7 (999) 999-99-99</a></li>
          <li><a href="mailto:info@example.com">info@example.com</a></li>
        </ul>
        <div className={styles.address}>
          <h3>Адрес</h3>
          <p>...</p>
        </div>
      </div>
    </div>

    {/* Нижняя часть подвала */}
    <div className={styles.bottomBar}>
      <p className={styles.copyright}>© 2025 Блок кухни. Все права защищены.</p>
      <div className={styles.legalLinks}>
        <a href="/privacy">Политика конфиденциальности</a>
        <a href="/terms">Условия использования</a>
      </div>
    </div>
  </footer>
);