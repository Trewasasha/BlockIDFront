import styles from './Cart.module.css';

export const Cart = () => (
  <div className={styles.cart}>
    <h2>Корзина</h2>
    <div className={styles.summary}>
      <p>Прямо</p>
      <p>Стоимость: 9999 ₽</p>
      <button>Оформить</button>
    </div>
    <div className={styles.payment}>
      <h3>Выбор карты</h3>
      <select>
        <option>Способ получения</option>
      </select>
      <button>оплатить</button>
    </div>
  </div>
);