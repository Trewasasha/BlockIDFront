import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../api/cart';
import styles from './AdminPanel.module.css';
import { api } from '../UseAuth/useAuth';
import { useAuth } from '../UseAuth/useAuth';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productsAPI.getAllProductsAdmin(0, 100, true);
      setProducts(response.data);
    } catch (err) {
      setError('Ошибка загрузки товаров');
      throw err;
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Ошибка загрузки пользователей');
      throw err;
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const [productsStats, categoriesStats] = await Promise.all([
        productsAPI.getProductsStats(),
        productsAPI.getCategoriesStats()
      ]);
      setStats({
        products: productsStats.data,
        categories: categoriesStats.data
      });
    } catch (err) {
      setError('Ошибка загрузки статистики');
      throw err;
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      switch (activeTab) {
        case 'products':
          await fetchProducts();
          break;
        case 'users':
          await fetchUsers();
          break;
        case 'stats':
          await fetchStats();
          break;
        default:
          break;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Ошибка загрузки данных';
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, fetchProducts, fetchUsers, fetchStats]);

  const toggleProductActive = async (productId) => {
    try {
      await productsAPI.toggleProductActive(productId);
      await fetchProducts();
    } catch (err) {
      setError('Ошибка обновления товара');
      console.error('Fetch error:', err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить товар?')) return;
    
    try {
      await productsAPI.deleteProduct(productId);
      await fetchProducts();
    } catch (err) {
      setError('Ошибка удаления товара');
      console.error('Fetch error:', err);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      await fetchUsers();
    } catch (err) {
      setError('Ошибка обновления пользователя');
      console.error('Fetch error:', err);
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('edit-product');
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setActiveTab('products');
  };

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      alert('Доступ запрещен');
    } else if (user?.role === 'ADMIN') {
      fetchData();
    }
  }, [activeTab, user, navigate, fetchData]);

  if (user?.role !== 'ADMIN') {
    return <div className={styles.accessDenied}>Доступ запрещен</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.adminPanel}>
      <h1>Панель администратора</h1>
      
      {error && <div className={styles.error}>{error}</div>}

      <nav className={styles.tabs}>
        <button 
          className={activeTab === 'products' ? styles.active : ''}
          onClick={() => setActiveTab('products')}
        >
          Товары
        </button>
        <button 
          className={activeTab === 'users' ? styles.active : ''}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
        <button 
          className={activeTab === 'stats' ? styles.active : ''}
          onClick={() => setActiveTab('stats')}
        >
          Статистика
        </button>
        <button 
          className={activeTab === 'add-product' ? styles.active : ''}
          onClick={() => setActiveTab('add-product')}
        >
          Добавить товар
        </button>
      </nav>

      <div className={styles.content}>
        {activeTab === 'products' && (
          <ProductsTab 
            products={products}
            onToggleActive={toggleProductActive}
            onDelete={deleteProduct}
            onEdit={startEditProduct}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab 
            users={users}
            onUpdateRole={updateUserRole}
          />
        )}

        {activeTab === 'stats' && (
          <StatsTab stats={stats} />
        )}

        {activeTab === 'add-product' && (
          <AddProductTab onProductAdded={fetchProducts} />
        )}

        {activeTab === 'edit-product' && editingProduct && (
          <EditProductTab 
            product={editingProduct}
            onProductUpdated={fetchProducts}
            onCancel={cancelEdit}
          />
        )}
      </div>
    </div>
  );
};

const ProductsTab = ({ products, onToggleActive, onDelete, onEdit }) => (
  <div className={styles.tabContent}>
    <h2>Управление товарами ({products.length})</h2>
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Изображение</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>На складе</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className={styles.productThumb}
                  />
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.price} ₽</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
                <span className={product.is_active ? styles.active : styles.inactive}>
                  {product.is_active ? 'Активен' : 'Неактивен'}
                </span>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button 
                    onClick={() => onEdit(product)}
                    className={styles.editBtn}
                  >
                    Редактировать
                  </button>
                  <button 
                    onClick={() => onToggleActive(product.id)}
                    className={styles.actionBtn}
                  >
                    {product.is_active ? 'Деактивировать' : 'Активировать'}
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className={styles.deleteBtn}
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UsersTab = ({ users, onUpdateRole }) => (
  <div className={styles.tabContent}>
    <h2>Управление пользователями ({users.length})</h2>
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.is_active ? 'Активен' : 'Неактивен'}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <select 
                  value={user.role}
                  onChange={(e) => onUpdateRole(user.id, e.target.value)}
                  className={styles.roleSelect}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatsTab = ({ stats }) => (
  <div className={styles.tabContent}>
    <h2>Статистика</h2>
    
    {stats ? (
      <>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Товары</h3>
            <p>Всего: {stats.products.total_products}</p>
            <p>Активных: {stats.products.active_products}</p>
            <p>Неактивных: {stats.products.inactive_products}</p>
            <p>С низким запасом: {stats.products.low_stock_products}</p>
          </div>

          <div className={styles.statCard}>
            <h3>По категориям</h3>
            {stats.categories.map(cat => (
              <p key={cat.category}>
                {cat.category}: {cat.product_count} товаров
              </p>
            ))}
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>Товары по категориям</h3>
          <ul>
            {Object.entries(stats.products.products_by_category).map(([category, count]) => (
              <li key={category}>
                {category}: {count} товаров
              </li>
            ))}
          </ul>
        </div>
      </>
    ) : (
      <p>Загрузка статистики...</p>
    )}
  </div>
);

const AddProductTab = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    sku: '',
    weight: '',
    dimensions: '',
    is_active: true
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Добавляем все поля в FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (image) {
        formDataToSend.append('image', image);
      }

      await productsAPI.createProduct(formDataToSend);

      // Сброс формы
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        sku: '',
        weight: '',
        dimensions: '',
        is_active: true
      });
      setImage(null);
      onProductAdded();
      alert('Товар успешно добавлен!');
    } catch (err) {
      setError('Ошибка добавления товара: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={styles.tabContent}>
      <h2>Добавить новый товар</h2>
      
      <form onSubmit={handleSubmit} className={styles.productForm}>
        <div className={styles.formRow}>
          <label>
            Название:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Цена:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Количество на складе:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Категория:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Артикул (SKU):
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Вес (кг):
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Размеры:
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="10x20x30"
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Изображение:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Активный товар
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Добавление...' : 'Добавить товар'}
        </button>
      </form>
    </div>
  );
};

const EditProductTab = ({ product, onProductUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    category: product.category,
    sku: product.sku || '',
    weight: product.weight || 0,
    dimensions: product.dimensions || '',
    is_active: product.is_active
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Подготавливаем данные для отправки (убираем пустые значения)
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
          updateData[key] = formData[key];
        }
      });

      // 2. Обновляем основные данные товара через PUT (JSON)
      await productsAPI.updateProduct(product.id, updateData);

      // 3. Если есть новое изображение, обновляем его через PATCH (multipart/form-data)
      if (image) {
        await productsAPI.updateProductImage(product.id, image);
      }

      onProductUpdated();
      alert('Товар успешно обновлен!');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Ошибка обновления товара';
      setError(errorMessage);
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={styles.tabContent}>
      <h2>Редактировать товар: {product.name}</h2>
      
      <form onSubmit={handleSubmit} className={styles.productForm}>
        <div className={styles.formRow}>
          <label>
            Название:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Цена:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Количество на складе:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Категория:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Артикул (SKU):
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Вес (кг):
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Размеры:
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="10x20x30"
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Новое изображение:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          {product.image_url && (
            <div className={styles.currentImage}>
              <p>Текущее изображение:</p>
              <img src={product.image_url} alt={product.name} className={styles.productImage} />
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Активный товар
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Отмена
          </button>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Обновление...' : 'Обновить товар'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;