import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import CartSidebar from '../components/CartSidebar';

function RestaurantMenu() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getRestaurantMenu(slug)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span className="loading-text">Loading menu...</span>
    </div>
  );

  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;

  const { restaurant, menu } = data;

  const handleAddItem = (item) => {
    addItem(item, restaurant.id, restaurant.name);
  };

  return (
    <div className="container">
      <div className="restaurant-header">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <div className="restaurant-meta">
          <span>&#128205; {restaurant.address}</span>
          {restaurant.phone && <span>&#128222; {restaurant.phone}</span>}
        </div>
      </div>
      <div className="menu-layout">
        <div className="menu-section">
          {menu.map(category => (
            <div key={category.id || 'other'} className="menu-category">
              <h2 className="category-title">{category.name}</h2>
              <div className="menu-items-grid">
                {category.items.map(item => (
                  <MenuItemCard key={item.id} item={item} onAdd={handleAddItem} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <CartSidebar />
      </div>
    </div>
  );
}

export default RestaurantMenu;
