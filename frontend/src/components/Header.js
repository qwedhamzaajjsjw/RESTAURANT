import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { itemCount, total } = useCart();
  const { admin } = useAuth();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">&#127860;</span>
          FoodOrder
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Restaurants</Link>
          {admin && <Link to="/admin/orders" className="nav-link">Dashboard</Link>}
          {!admin && <Link to="/admin/login" className="nav-link">Admin</Link>}
          <Link to="/checkout" className="nav-link cart-link">
            &#128722; Cart ({itemCount}) - ${total.toFixed(2)}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
