import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Cart } from './pages/Cart/Cart';
import { Catalog } from './pages/Catalog/Catalog';
import { Profile } from './pages/Profile/Profile';
import { useAuth } from './components/UseAuth/useAuth';
import { CartProvider } from './context/CartContext'; 
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAuthChecking } = useAuth();
  
  if (isAuthChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Проверка авторизации...</div>
      </div>
    );
  }
  
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <CartProvider> 
        <div className="app">
          <Header />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog/> } />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};