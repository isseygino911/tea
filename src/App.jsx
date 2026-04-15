import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Tea } from './pages/Tea';
import { Flight } from './pages/Flight';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import Tools from './pages/Tools';
import { Regions } from './pages/Regions';
import { Pricing } from './pages/Pricing';
import { Wholesale } from './pages/Wholesale';
import { Footer } from './components/Footer';

function App() {
  const { user } = useAuth();

  return (
    <CartProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#F4EDE0' }}>
        <Navbar />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/tea" element={<Tea />} />
          <Route path="/flight" element={<Flight />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
