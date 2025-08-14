import styles from './Cart.module.css';
import { useState } from 'react';

import block from '../../assets/product/placeholder-product-1.jpg'

export const Cart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Название блока',
      price: 9999,
      originalPrice: 11999,
      image: block,
      count: 1,
      inStock: true,
      deliveryDate: 'Доставим завтра',
      seller: 'Все инструменты',
      isSelected: true
    },
    {
      id: 2,
      name: 'Название блока',
      price: 19990,
      originalPrice: 24990,
      image: block,
      count: 2,
      inStock: true,
      deliveryDate: 'Доставим послезавтра',
      seller: 'М.Видео',
      isSelected: true
    }
  ]);


  const totalItems = items.reduce((sum, item) => sum + (item.isSelected ? item.count : 0), 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.isSelected ? item.price * item.count : 0), 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.isSelected ? (item.originalPrice - item.price) * item.count : 0), 0);

  const handleQuantityChange = (id, newCount) => {
    if (newCount < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, count: newCount } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleSelect = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };


  return (
    <div className={styles.cart}>
      <h1 className={styles.title}>Корзина</h1>
      
      {items.length > 0 ? (
        <div className={styles.cartContent}>
          <div className={styles.itemsList}>
            {items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemSelect}>
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={() => handleToggleSelect(item.id)}
                  />
                </div>
                
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemSeller}>Продавец: {item.seller}</p>
                  <p className={styles.itemDelivery}>{item.deliveryDate}</p>
                  {!item.inStock && <p className={styles.outOfStock}>Нет в наличии</p>}
                </div>
                
                <div className={styles.itemPrice}>
                  <p className={styles.currentPrice}>{item.price.toLocaleString()} ₽</p>
                  {item.originalPrice > item.price && (
                    <p className={styles.originalPrice}>{item.originalPrice.toLocaleString()} ₽</p>
                  )}
                </div>
                
                <div className={styles.itemQuantity}>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.count - 1)}
                    disabled={item.count <= 1}
                  >
                    <span className={styles.quantitySymbol}>−</span>
                  </button>

                  <span className={styles.quantityValue}>{item.count}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.count + 1)}>
                    <span className={styles.quantitySymbol}>+</span>
                  </button>
                </div>
                
                <div className={styles.itemTotal}>
                  <p>{(item.price * item.count).toLocaleString()} ₽</p>
                </div>
                
                <div className={styles.itemActions}>
                  <button 
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Удалить
                  </button>
                  <button className={styles.favoriteButton}>В избранное</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.summary}>
            
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>{totalItems} товара</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              {totalDiscount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Скидка</span>
                  <span className={styles.discount}>−{totalDiscount.toLocaleString()} ₽</span>
                </div>
              )}
              
              <div className={styles.totalRow}>
                <span>Итого</span>
                <span className={styles.totalPrice}>
                </span>
              </div>
              
              <button className={styles.checkoutButton}>
                Перейти к оформлению
              </button>
              
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyCart}>
          <h2>Корзина пуста</h2>
          <p>Добавьте товары из каталога</p>
          <button className={styles.catalogButton}>Перейти в каталог</button>
        </div>
      )}
    </div>
  );
};