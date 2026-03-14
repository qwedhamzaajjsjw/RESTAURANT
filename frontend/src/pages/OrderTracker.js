import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const STATUS_STEPS = ['placed', 'confirmed', 'preparing', 'ready', 'delivered'];
const STATUS_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered'
};

function OrderTracker() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getOrder(orderNumber)
      .then(setOrder)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span className="loading-text">Loading your order...</span>
    </div>
  );

  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container">
      <h1 className="page-title">Order {order.order_number}</h1>
      <p className="page-subtitle">
        {order.status === 'delivered' ? 'Your order has been delivered!' :
         order.status === 'cancelled' ? 'This order was cancelled.' :
         'Track your order status in real-time'}
      </p>

      {order.status === 'cancelled' ? (
        <div className="order-cancelled">
          <p>&#10060; This order has been cancelled.</p>
        </div>
      ) : (
        <div className="order-tracker">
          <div className="status-steps">
            {STATUS_STEPS.map((step, idx) => (
              <div key={step} className={`status-step ${idx <= currentStep ? 'active' : ''} ${idx === currentStep ? 'current' : ''}`}>
                <div className="step-dot" />
                <span className="step-label">{STATUS_LABELS[step]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="order-details">
        <h2>Order Details</h2>
        <div className="order-info-grid">
          <div className="order-info-item">
            <span className="order-info-label">Customer</span>
            <span className="order-info-value">{order.customer_name}</span>
          </div>
          <div className="order-info-item">
            <span className="order-info-label">Placed At</span>
            <span className="order-info-value">{new Date(order.created_at).toLocaleString()}</span>
          </div>
          {order.notes && (
            <div className="order-info-item">
              <span className="order-info-label">Notes</span>
              <span className="order-info-value">{order.notes}</span>
            </div>
          )}
        </div>
        <h3>Items</h3>
        <div className="order-items-list">
          {order.items.map(item => (
            <div key={item.id} className="order-item-row">
              <span>{item.quantity}x {item.item_name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total: ${order.total.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

export default OrderTracker;
