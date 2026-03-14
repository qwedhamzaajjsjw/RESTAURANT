import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const STATUS_STEPS = ['placed', 'confirmed', 'preparing', 'ready', 'delivered'];

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

  if (loading) return <div className="container"><p>Loading order...</p></div>;
  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container">
      <h1>Order {order.order_number}</h1>
      {order.status === 'cancelled' ? (
        <div className="order-cancelled">
          <p>This order has been cancelled.</p>
        </div>
      ) : (
        <div className="order-tracker">
          <div className="status-steps">
            {STATUS_STEPS.map((step, idx) => (
              <div key={step} className={`status-step ${idx <= currentStep ? 'active' : ''} ${idx === currentStep ? 'current' : ''}`}>
                <div className="step-dot" />
                <span className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="order-details">
        <h2>Order Details</h2>
        <p><strong>Customer:</strong> {order.customer_name}</p>
        <p><strong>Placed:</strong> {new Date(order.created_at).toLocaleString()}</p>
        {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
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
