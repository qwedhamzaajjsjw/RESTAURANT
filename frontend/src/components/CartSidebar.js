import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartSidebar() {
  const { cart, updateQuantity, removeItem, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <div className="cart-sidebar">
        <h3>&#128722; Your Cart</h3>
        <div className="empty-state" style={{ padding: '24px 0' }}>
          <div className="empty-state-icon">&#128722;</div>
          <p className="cart-empty">Your cart is empty.<br />Add items to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-sidebar">
      <h3>&#128722; Your Cart</h3>
      {cart.restaurantName && <p className="cart-restaurant">From: {cart.restaurantName}</p>}
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div className="cart-item-controls">
              <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span className="cart-item-qty">{item.quantity}</span>
              <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className="btn-remove" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
      <button className="btn btn-primary btn-checkout" onClick={() => navigate('/checkout')}>
        Proceed to Checkout &#8594;
      </button>
    </div>
  );
}

export default CartSidebar;
