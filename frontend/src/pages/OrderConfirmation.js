import React from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="container">
      <div className="confirmation-page">
        <div className="confirmation-icon">&#10003;</div>
        <h1>Order Placed!</h1>
        <p>Your order <strong>{orderNumber}</strong> has been received.</p>
        <p>We're preparing your food now.</p>
        <div className="confirmation-actions">
          <Link to={`/track/${orderNumber}`} className="btn btn-primary">Track Order</Link>
          <Link to="/" className="btn btn-secondary">Order More</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
