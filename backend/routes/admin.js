const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// All admin routes require authentication
router.use(authenticateToken);

// GET /api/admin/orders - List orders for restaurant
router.get('/orders', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM orders WHERE restaurant_id = ?';
  const params = [req.admin.restaurant_id];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  const orders = db.prepare(query).all(...params);
  res.json(orders);
});

// GET /api/admin/orders/:id - Get order details
router.get('/orders/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND restaurant_id = ?')
    .get(req.params.id, req.admin.restaurant_id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = db.prepare(`
    SELECT oi.*, mi.name as item_name, mi.description as item_description
    FROM order_items oi
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    WHERE oi.order_id = ?
  `).all(order.id);

  res.json({ ...order, items });
});

// PATCH /api/admin/orders/:id - Update order status
router.patch('/orders/:id', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND restaurant_id = ?')
    .get(req.params.id, req.admin.restaurant_id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(status, req.params.id);

  res.json({ ...order, status, updated_at: new Date().toISOString() });
});

// GET /api/admin/menu - List menu items
router.get('/menu', (req, res) => {
  const items = db.prepare('SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category_id, name')
    .all(req.admin.restaurant_id);
  res.json(items);
});

// POST /api/admin/menu - Add menu item
router.post('/menu', (req, res) => {
  const { name, description, price, category_id, image_url } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const result = db.prepare(`
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.admin.restaurant_id, category_id || null, name, description || null, price, image_url || null);

  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(item);
});

// PUT /api/admin/menu/:id - Update menu item
router.put('/menu/:id', (req, res) => {
  const { name, description, price, category_id, image_url, available } = req.body;

  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ? AND restaurant_id = ?')
    .get(req.params.id, req.admin.restaurant_id);

  if (!existing) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  db.prepare(`
    UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, available = ?
    WHERE id = ?
  `).run(
    name || existing.name,
    description !== undefined ? description : existing.description,
    price != null ? price : existing.price,
    category_id !== undefined ? category_id : existing.category_id,
    image_url !== undefined ? image_url : existing.image_url,
    available != null ? available : existing.available,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/admin/menu/:id - Delete menu item
router.delete('/menu/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ? AND restaurant_id = ?')
    .get(req.params.id, req.admin.restaurant_id);

  if (!existing) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
  res.json({ message: 'Menu item deleted' });
});

// GET /api/admin/categories - List categories
router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories WHERE restaurant_id = ? ORDER BY sort_order')
    .all(req.admin.restaurant_id);
  res.json(categories);
});

// POST /api/admin/categories - Add category
router.post('/categories', (req, res) => {
  const { name, sort_order } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const result = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)')
    .run(req.admin.restaurant_id, name, sort_order || 0);

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(category);
});

module.exports = router;
