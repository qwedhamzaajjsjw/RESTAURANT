const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// POST /api/orders - Place a new order
router.post('/', (req, res) => {
  const { restaurant_id, customer_name, customer_email, customer_phone, items, notes } = req.body;

  if (!restaurant_id || !customer_name || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields: restaurant_id, customer_name, items' });
  }

  const restaurant = db.prepare('SELECT id FROM restaurants WHERE id = ?').get(restaurant_id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  // Validate menu items and calculate total
  let total = 0;
  const validatedItems = [];

  for (const item of items) {
    const menuItem = db.prepare('SELECT * FROM menu_items WHERE id = ? AND restaurant_id = ? AND available = 1')
      .get(item.menu_item_id, restaurant_id);

    if (!menuItem) {
      return res.status(400).json({ error: `Menu item ${item.menu_item_id} not found or unavailable` });
    }

    const quantity = item.quantity || 1;
    total += menuItem.price * quantity;
    validatedItems.push({ ...item, price: menuItem.price, quantity });
  }

  const orderNumber = 'ORD-' + uuidv4().split('-')[0].toUpperCase();

  const insertOrder = db.prepare(`
    INSERT INTO orders (restaurant_id, order_number, customer_name, customer_email, customer_phone, total, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions)
    VALUES (?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const result = insertOrder.run(
      restaurant_id, orderNumber, customer_name,
      customer_email || null, customer_phone || null,
      Math.round(total * 100) / 100, notes || null
    );

    for (const item of validatedItems) {
      insertOrderItem.run(
        result.lastInsertRowid, item.menu_item_id,
        item.quantity, item.price, item.special_instructions || null
      );
    }

    return result.lastInsertRowid;
  });

  const orderId = transaction();

  res.status(201).json({
    id: orderId,
    order_number: orderNumber,
    status: 'placed',
    total: Math.round(total * 100) / 100
  });
});

// GET /api/orders/:orderNumber - Get order by order number
router.get('/:orderNumber', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.orderNumber);
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

module.exports = router;
