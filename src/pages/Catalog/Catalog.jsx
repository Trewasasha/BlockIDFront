import styles from './Catalog.module.css';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../components/UseAuth/useAuth';
import { productsAPI } from '../../api/cart';
import block from '../../assets/product/placeholder-product-1.jpg';

export const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  
  const { addToCart, loading: cartLoading } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, sortBy, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const skip = (pagination.page - 1) * pagination.limit;
      const response = await productsAPI.getProducts(skip, pagination.limit);
      
      if (response.data) {
        // Обрабатываем разные форматы ответа API
        const productsData = response.data.products || response.data.items || response.data;
        
        if (Array.isArray(productsData)) {
          setProducts(productsData);
          
          
          // Обновляем пагинацию
          const totalItems = response.data.total || response.data.count || productsData.length;
          setPagination(prev => ({
            ...prev,
            total: totalItems,
            totalPages: Math.ceil(totalItems / prev.limit)
          }));
        } else {
          throw new Error('Неверный формат данных товаров');
        }
      } else {
        throw new Error('Пустой ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при загрузке товаров:', err);
      setError('Не удалось загрузить товары. Попробуйте позже.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await productsAPI.getProduct(productId);
      return response.data;
    } catch (err) {
      console.error('Ошибка при загрузке деталей товара:', err);
      // Возвращаем базовую информацию из списка, если детали не загрузились
      return products.find(p => p.id === productId) || {};
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Фильтрация по поиску
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    // Фильтрация по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product, qty = 1) => {
    if (!isLoggedIn) {
      alert('Пожалуйста, войдите в систему чтобы добавить товар в корзину');
      return;
    }

    try {
      await addToCart(product.id, qty);
      alert(`Товар "${product.name}" добавлен в корзину!`);
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message ||
                          'Произошла ошибка при добавлении товара в корзину';
      alert(errorMessage);
    }
  };

  const handleViewDetails = async (product) => {
    try {
      setLoading(true);
      const productDetails = await fetchProductDetails(product.id);
      setSelectedProduct(productDetails);
      setQuantity(1);
    } catch (err) {
      console.error('Ошибка при загрузке деталей товара:', err);
      // Используем базовую информацию, если детали не загрузились
      setSelectedProduct(product);
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, selectedProduct?.stock || 1));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Функция для безопасного форматирования цены
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return price.toLocaleString('ru-RU');
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.catalog}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Загрузка каталога...
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className={styles.catalog}>
        <div className={styles.emptyState}>
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button 
            className={styles.catalogButton}
            onClick={fetchProducts}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>Каталог товаров</h1>


      {/* Информация о результате */}
      <div className={styles.resultsInfo}>
        <p>Показано: {filteredProducts.length} из {pagination.total} товаров</p>
        {searchTerm && (
          <p>По запросу "{searchTerm}"</p>
        )}
        {selectedCategory !== 'all' && (
          <p>Категория: {selectedCategory}</p>
        )}
      </div>

      {/* Сетка товаров */}
      {filteredProducts.length > 0 ? (
        <>
          <div className={styles.productsGrid}>
            {filteredProducts.map(product => {
              const hasDiscount = product.original_price > product.price;
              const discountAmount = hasDiscount ? product.original_price - product.price : 0;
              const discountPercent = hasDiscount && product.original_price > 0
                ? Math.round((discountAmount / product.original_price) * 100)
                : 0;

              const inStock = product.stock > 0;
              const canAddToCart = inStock && isLoggedIn && !cartLoading;

              return (
                <div key={product.id} className={styles.productCard}>
                  <img
                    src={product.image_url || block}
                    alt={product.name}
                    className={styles.productImage}
                    onError={(e) => {
                      e.target.src = block;
                    }}
                  />
                  
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productCategory}>{product.category}</p>
                    <p className={styles.productDescription}>
                      {product.description?.substring(0, 100)}
                      {product.description?.length > 100 && '...'}
                    </p>
                    
                    <div className={styles.productPrice}>
                      {hasDiscount && (
                        <span className={styles.originalPrice}>
                          {formatPrice(product.original_price)} ₽
                        </span>
                      )}
                      <span className={styles.currentPrice}>
                        {formatPrice(product.price)} ₽
                      </span>
                      {hasDiscount && discountPercent > 0 && (
                        <span className={styles.discountBadge}>-{discountPercent}%</span>
                      )}
                    </div>

                    <div className={styles.productStock}>
                      {inStock ? (
                        <span className={styles.inStock}>
                          ✓ В наличии: {product.stock} шт.
                        </span>
                      ) : (
                        <span className={styles.outOfStock}>
                          ⚠️ Нет в наличии
                        </span>
                      )}
                    </div>

                    <div className={styles.productActions}>
                      <button
                        className={styles.addToCartBtn}
                        onClick={() => handleAddToCart(product)}
                        disabled={!canAddToCart}
                        title={!isLoggedIn ? 'Войдите чтобы добавить в корзину' : !inStock ? 'Товара нет в наличии' : ''}
                      >
                        {cartLoading ? '...' : isLoggedIn ? 'В корзину' : 'Войдите'}
                      </button>
                      <button
                        className={styles.viewDetailsBtn}
                        onClick={() => handleViewDetails(product)}
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Пагинация */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
              >
                ⟪
              </button>
              
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Назад
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`${styles.paginationButton} ${
                      pagination.page === pageNum ? styles.active : ''
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Вперед
              </button>
              
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
              >
                ⟫
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
          <button
            className={styles.catalogButton}
            onClick={resetFilters}
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {/* Модальное окно с деталями товара */}
      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              ×
            </button>
            
            <div className={styles.productDetail}>
              <div className={styles.detailGrid}>
                <div>
                  <img
                    src={selectedProduct.image_url || block}
                    alt={selectedProduct.name}
                    className={styles.detailImage}
                    onError={(e) => {
                      e.target.src = block;
                    }}
                  />
                </div>
                
                <div className={styles.detailInfo}>
                  <h2>{selectedProduct.name}</h2>
                  <p className={styles.detailCategory}>{selectedProduct.category}</p>
                  
                  <p className={styles.detailDescription}>{selectedProduct.description}</p>
                  
                  <div className={styles.detailPrice}>
                    {selectedProduct.original_price > selectedProduct.price && (
                      <span className={styles.detailOriginalPrice}>
                        {formatPrice(selectedProduct.original_price)} ₽
                      </span>
                    )}
                    <span className={styles.detailCurrentPrice}>
                      {formatPrice(selectedProduct.price)} ₽
                    </span>
                  </div>

                  <div className={styles.detailStock}>
                    {selectedProduct.stock > 0 ? (
                      <span className={styles.inStock}>
                        ✓ В наличии: {selectedProduct.stock} шт.
                      </span>
                    ) : (
                      <span className={styles.outOfStock}>
                        ⚠️ Товара нет в наличии
                      </span>
                    )}
                  </div>

                  {selectedProduct.stock > 0 && isLoggedIn && (
                    <div className={styles.quantityControl}>
                      <span>Количество:</span>
                      <button
                        className={styles.quantityButton}
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantityValue}>{quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={increaseQuantity}
                        disabled={quantity >= selectedProduct.stock}
                      >
                        +
                      </button>
                    </div>
                  )}

                  <div className={styles.detailActions}>
                    <button
                      className={styles.detailAddToCart}
                      onClick={() => handleAddToCart(selectedProduct, quantity)}
                      disabled={selectedProduct.stock === 0 || !isLoggedIn || cartLoading}
                      title={!isLoggedIn ? 'Войдите чтобы добавить в корзину' : selectedProduct.stock === 0 ? 'Товара нет в наличии' : ''}
                    >
                      {cartLoading ? 'Добавление...' : 
                       isLoggedIn ? `Добавить в корзину (${quantity})` : 'Войдите чтобы купить'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};