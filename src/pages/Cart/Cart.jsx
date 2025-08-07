import styles from './Cart.module.css';

export const Cart = () => (
  <div className={styles.cart}>
    <h2 className={styles.title}>Корзина</h2>
    <div className={styles.summary}>
      <h3 className={styles.subtitle}>Ваш заказ</h3>
      <div className={styles.item}>
        <p>Прямо</p>
        <p className={styles.price}>9 999 ₽</p>
      </div>
      <div className={styles.total}>
        <p>Итого:</p>
        <p className={styles.price}>9 999 ₽</p>
      </div>
      <button className={styles.checkoutBtn}>Оформить заказ</button>
    </div>
    <div className={styles.payment}>
      <h3 className={styles.subtitle}>Способ оплаты</h3>
      <select className={styles.select}>
        <option>Выберите способ оплаты</option>
        <option>Электронный кошелек</option>
        <option>Наличные при получении</option>
      </select>
      <button className={styles.payBtn}>Оплатить сейчас</button>
    </div>
  </div>
);