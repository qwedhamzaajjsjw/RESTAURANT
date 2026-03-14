import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

function Checkout() {
  const { cart, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (itemCount === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <div className="empty-state-icon">&#128722;</div>
          <h2 style={{ marginBottom: 12, color: '#1a1a2e' }}>Your cart is empty</h2>
          <p>Browse restaurants to add items to your cart.</p>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>
            Browse Restaurants &#8594;
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim()) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        restaurant_id: cart.restaurantId,
        customer_name: form.customer_name,
        customer_email: form.customer_email || undefined,
        customer_phone: form.customer_phone || undefined,
        notes: form.notes || undefined,
        items: cart.items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      };
      const result = await api.placeOrder(orderData);
      clearCart();
      navigate(`/order-confirmation/${result.order_number}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Complete your order from {cart.restaurantName}</p>
      <div className="checkout-layout">
        <div className="checkout-form-section">
          <h2>Your Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input id="name" type="text" required placeholder="Enter your name" value={form.customer_name}
                onChange={e => setForm({ ...form, customer_name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="your@email.com" value={form.customer_email}
                  onChange={e => setForm({ ...form, customer_email: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.customer_phone}
                  onChange={e => setForm({ ...form, customer_phone: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Special Instructions</label>
              <textarea id="notes" rows="3" placeholder="Any special requests or dietary requirements..." value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary btn-checkout" type="submit" disabled={submitting}>
              {submitting ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <p className="cart-restaurant">&#127860; {cart.restaurantName}</p>
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
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
