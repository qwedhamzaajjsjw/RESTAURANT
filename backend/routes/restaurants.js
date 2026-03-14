const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/restaurants - List all restaurants
router.get('/', (req, res) => {
  const restaurants = db.prepare('SELECT * FROM restaurants ORDER BY name').all();
  res.json(restaurants);
});

// GET /api/restaurants/:slug - Get restaurant by slug
router.get('/:slug', (req, res) => {
  const restaurant = db.prepare('SELECT * FROM restaurants WHERE slug = ?').get(req.params.slug);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.json(restaurant);
});

// GET /api/restaurants/:slug/menu - Get full menu for a restaurant
router.get('/:slug/menu', (req, res) => {
  const restaurant = db.prepare('SELECT * FROM restaurants WHERE slug = ?').get(req.params.slug);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  const categories = db.prepare(
    'SELECT * FROM categories WHERE restaurant_id = ? ORDER BY sort_order'
  ).all(restaurant.id);

  const menuItems = db.prepare(
    'SELECT * FROM menu_items WHERE restaurant_id = ? AND available = 1 ORDER BY category_id, name'
  ).all(restaurant.id);

  const menu = categories.map(cat => ({
    ...cat,
    items: menuItems.filter(item => item.category_id === cat.id)
  }));

  // Include uncategorized items
  const uncategorized = menuItems.filter(item => !item.category_id);
  if (uncategorized.length > 0) {
    menu.push({ id: null, name: 'Other', items: uncategorized });
  }

  res.json({ restaurant, menu });
});

module.exports = router;
