import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getRestaurants()
      .then(setRestaurants)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span className="loading-text">Discovering restaurants...</span>
    </div>
  );

  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;

  return (
    <div>
      <div className="hero">
        <div className="container">
          <div className="hero-badge">&#9889; Fresh & Fast Delivery</div>
          <h1>
            Delicious Food,<br />
            <span className="highlight">Delivered to You</span>
          </h1>
          <p>
            Browse the best local restaurants and order your favorite meals.
            Fast, fresh, and always satisfying.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">{restaurants.length}+</div>
              <div className="hero-stat-label">Restaurants</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">30min</div>
              <div className="hero-stat-label">Avg. Delivery</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">4.9</div>
              <div className="hero-stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="restaurant-grid">
          {restaurants.map(restaurant => (
            <Link key={restaurant.id} to={`/restaurant/${restaurant.slug}`} className="restaurant-card">
              <div className="restaurant-card-img" style={{
                backgroundImage: restaurant.image_url ? `url(${restaurant.image_url})` : 'none',
                backgroundColor: '#f0f0f0'
              }} />
              <div className="restaurant-card-info">
                <h2>{restaurant.name}</h2>
                <p>{restaurant.description}</p>
                <span className="restaurant-address">&#128205; {restaurant.address}</span>
                <div className="restaurant-card-footer">
                  <span className="restaurant-card-badge">&#9733; Open Now</span>
                  <span className="view-menu-text">View Menu &#8594;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {restaurants.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">&#127869;</div>
            <p>No restaurants available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
