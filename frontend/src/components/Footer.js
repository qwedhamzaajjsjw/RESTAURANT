import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: 12 }}>&#127860; FoodOrder</div>
            <p>
              The best way to order food from your favorite local restaurants.
              Fast delivery, fresh food, and an amazing experience.
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Restaurants</Link></li>
              <li><Link to="/checkout">Cart</Link></li>
              <li><Link to="/admin/login">Admin Portal</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} FoodOrder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
