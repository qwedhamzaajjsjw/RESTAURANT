const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/menu/:id - Get a single menu item
router.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  res.json(item);
});

module.exports = router;
