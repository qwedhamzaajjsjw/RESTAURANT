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

  if (loading) return <div className="container"><p>Loading restaurants...</p></div>;
  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;

  return (
    <div className="container">
      <div className="hero">
        <h1>Order Food Online</h1>
        <p>Browse restaurants and order your favorite meals for pickup or delivery.</p>
      </div>
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
              <span className="restaurant-address">{restaurant.address}</span>
            </div>
          </Link>
        ))}
      </div>
      {restaurants.length === 0 && <p>No restaurants available yet.</p>}
    </div>
  );
}

export default Home;
