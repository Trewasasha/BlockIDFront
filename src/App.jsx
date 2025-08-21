import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Cart } from './pages/Cart/Cart';
import { Catalog } from './pages/Catalog/Catalog';
import { Profile } from './pages/Profile/Profile';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { useAuth } from './components/UseAuth/useAuth';
import { CartProvider } from './context/CartContext'; 
import { AuthModal } from './components/AuthModal/AuthModal';
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

const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAuthChecking, user } = useAuth();
  
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
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

// Основной компонент приложения
const AppContent = () => {
  const auth = useAuth();

  return (
    <div className="app">
      <Header auth={auth} />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart auth={auth} />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      
      <AuthModal 
        isAuthModalOpen={auth.isAuthModalOpen}
        authMode={auth.authMode}
        email={auth.email}
        password={auth.password}
        confirmPassword={auth.confirmPassword}
        isLoading={auth.isLoading}
        error={auth.error}
        passwordError={auth.passwordError}
        setEmail={auth.setEmail}
        setPassword={auth.setPassword}
        setConfirmPassword={auth.setConfirmPassword}
        handleAuth={auth.handleAuth}
        loginWithProvider={auth.loginWithProvider}
        closeAuthModal={auth.closeAuthModal}
        setAuthMode={auth.setAuthMode}
      />
      
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <CartProvider> 
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
};