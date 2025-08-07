import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Cart } from './pages/Cart/Cart';
import { Profile } from './pages/Profile/Profile';
import { useAuth } from './components/UseAuth/useAuth';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
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
    </BrowserRouter>
  );
};