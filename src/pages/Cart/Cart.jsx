import styles from './Cart.module.css';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../components/UseAuth/useAuth';
import block from '../../assets/product/placeholder-product-1.jpg';
import { useNavigate } from 'react-router-dom';

export const Cart = ({auth}) => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const { cartItems, loading, updateCartItem, removeFromCart, refreshCart } = useCart();
  const { isLoggedIn, openAuthModal } = auth || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length > 0) {
      console.log('First item structure:', cartItems[0]);
    }
  }, [cartItems]);

  useEffect(() => {
    if (isLoggedIn) {
      refreshCart();
    }
  }, [isLoggedIn, refreshCart]);

  const handleQuantityChange = async (id, newCount) => {
    if (newCount < 1) return;
    
    try {
      await updateCartItem(id, newCount);
    } catch (error) {
      console.error('Ошибка при изменении количества:', error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length && cartItems.length > 0) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  if (loading) {
    return (
      <div className={styles.cart}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Загрузка корзины...
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.cart}>
        <h1 className={styles.title}>Корзина</h1>
        <div className={styles.emptyCart}>
          <h2>🔒 Необходима авторизация</h2>
          <p>Войдите в систему для просмотра корзины</p>
          <button 
            className={styles.catalogButton}
            onClick={() => openAuthModal('login')}
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
  
  const totalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = selectedCartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const totalDiscount = selectedCartItems.reduce((sum, item) => {
    const originalPrice = item.product?.original_price || item.product?.price || 0;
    const currentPrice = item.product?.price || 0;
    return sum + (originalPrice - currentPrice) * item.quantity;
  }, 0);

  const goToCatalog = () => {
    navigate('/catalog');
  };

  const handleCheckout = () => {
    if (selectedItems.size > 0) {
      console.log('Checkout:', { totalItems, totalPrice, totalDiscount });
      // Здесь будет переход к оформлению заказа
    }
  };

  return (
    <div className={styles.cart}>
      <h1 className={styles.title}>Корзина</h1>
      
      {cartItems.length > 0 ? (
        <>
          <div className={styles.cartHeader}>
            <div className={styles.selectAll}>
              <input
                type="checkbox"
                checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                onChange={handleSelectAll}
                disabled={cartItems.length === 0}
              />
              <span>Выбрать все ({cartItems.length} товаров)</span>
            </div>
          </div>

          <div className={styles.cartContent}>
            <div className={styles.itemsList}>
              {cartItems.map((item) => {
                const productName = item.product?.name || 'Товар';
                const productPrice = item.product?.price || 0;
                const originalPrice = item.product?.original_price || productPrice;
                const imageUrl = item.product?.image_url || block;
                const category = item.product?.category || '';
                const inStock = item.product?.stock > 0;

                return (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemSelect}>
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleToggleSelect(item.id)}
                        disabled={!inStock}
                      />
                    </div>
                    
                    <div className={styles.itemImage}>
                      <img src={imageUrl} alt={productName} />
                    </div>
                    
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{productName}</h3>
                      <p className={styles.itemCategory}>{category}</p>
                      {!inStock && <p className={styles.outOfStock}>Нет в наличии</p>}
                    </div>
                    
                    <div className={styles.itemPrice}>
                      <p className={styles.currentPrice}>{productPrice.toLocaleString()} ₽</p>
                      {originalPrice > productPrice && (
                        <p className={styles.originalPrice}>{originalPrice.toLocaleString()} ₽</p>
                      )}
                    </div>
                    
                    <div className={styles.itemQuantity}>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || !inStock}
                        aria-label="Уменьшить количество"
                      >
                        <span className={styles.quantitySymbol}>−</span>
                      </button>

                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={!inStock}
                        aria-label="Увеличить количество"
                      >
                        <span className={styles.quantitySymbol}>+</span>
                      </button>
                    </div>
                    
                    <div className={styles.itemTotal}>
                      <p>{(productPrice * item.quantity).toLocaleString()} ₽</p>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <button 
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Удалить товар"
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className={styles.summary}>
              
              <div className={styles.orderSummary}>
                <h3 style={{margin: '0 0 20px 0', color: '#2d3748', fontSize: '20px'}}>
                  Итог заказа
                </h3>
                
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
                    {totalPrice.toLocaleString()} ₽
                  </span>
                </div>
                
                <button 
                  className={styles.checkoutButton}
                  disabled={selectedItems.size === 0}
                  onClick={handleCheckout}
                  aria-label="Перейти к оформлению заказа"
                >
                  🛒 Перейти к оформлению
                </button>
                
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyCart}>
          <h2>🛒 Ваша корзина пуста</h2>
          <p>Добавьте товары из нашего каталога, чтобы сделать покупки</p>
          <button 
            className={styles.catalogButton} 
            onClick={goToCatalog}
            aria-label="Перейти в каталог"
          >
            📦 Перейти в каталог
          </button>
        </div>
      )}
    </div>
  );
};