const db = require('../config/database');
const bcrypt = require('bcryptjs');

console.log('Seeding database...');

const transaction = db.transaction(() => {
  // Clear existing data
  db.exec('DELETE FROM order_items');
  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM menu_items');
  db.exec('DELETE FROM categories');
  db.exec('DELETE FROM admins');
  db.exec('DELETE FROM restaurants');

  // Create restaurants
  const r1 = db.prepare(`
    INSERT INTO restaurants (name, slug, description, address, phone, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'Bella Italia', 'bella-italia',
    'Authentic Italian cuisine with fresh ingredients and traditional recipes',
    '123 Main Street, Downtown', '(555) 123-4567',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
  );

  const r2 = db.prepare(`
    INSERT INTO restaurants (name, slug, description, address, phone, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'Tokyo Ramen House', 'tokyo-ramen',
    'Authentic Japanese ramen and side dishes made fresh daily',
    '456 Oak Avenue, Midtown', '(555) 987-6543',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800'
  );

  // Categories for Bella Italia
  const cat1 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r1.lastInsertRowid, 'Appetizers', 1);
  const cat2 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r1.lastInsertRowid, 'Pasta', 2);
  const cat3 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r1.lastInsertRowid, 'Pizza', 3);
  const cat4 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r1.lastInsertRowid, 'Desserts', 4);
  const cat5 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r1.lastInsertRowid, 'Drinks', 5);

  // Categories for Tokyo Ramen
  const cat6 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r2.lastInsertRowid, 'Ramen', 1);
  const cat7 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r2.lastInsertRowid, 'Appetizers', 2);
  const cat8 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r2.lastInsertRowid, 'Rice Bowls', 3);
  const cat9 = db.prepare('INSERT INTO categories (restaurant_id, name, sort_order) VALUES (?, ?, ?)').run(r2.lastInsertRowid, 'Drinks', 4);

  // Menu items for Bella Italia
  const insertItem = db.prepare(`
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Appetizers
  insertItem.run(r1.lastInsertRowid, cat1.lastInsertRowid, 'Bruschetta', 'Toasted bread topped with fresh tomatoes, basil, and olive oil', 8.99, null);
  insertItem.run(r1.lastInsertRowid, cat1.lastInsertRowid, 'Caprese Salad', 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', 10.99, null);
  insertItem.run(r1.lastInsertRowid, cat1.lastInsertRowid, 'Garlic Bread', 'Freshly baked bread with garlic butter and herbs', 6.99, null);
  insertItem.run(r1.lastInsertRowid, cat1.lastInsertRowid, 'Calamari Fritti', 'Crispy fried calamari with marinara sauce', 11.99, null);

  // Pasta
  insertItem.run(r1.lastInsertRowid, cat2.lastInsertRowid, 'Spaghetti Carbonara', 'Classic Roman pasta with egg, pancetta, and parmesan', 15.99, null);
  insertItem.run(r1.lastInsertRowid, cat2.lastInsertRowid, 'Fettuccine Alfredo', 'Creamy parmesan sauce over fresh fettuccine', 14.99, null);
  insertItem.run(r1.lastInsertRowid, cat2.lastInsertRowid, 'Penne Arrabbiata', 'Spicy tomato sauce with garlic and red chili', 13.99, null);
  insertItem.run(r1.lastInsertRowid, cat2.lastInsertRowid, 'Lasagna Bolognese', 'Layered pasta with meat sauce, bechamel, and mozzarella', 16.99, null);

  // Pizza
  insertItem.run(r1.lastInsertRowid, cat3.lastInsertRowid, 'Margherita', 'San Marzano tomatoes, fresh mozzarella, basil', 13.99, null);
  insertItem.run(r1.lastInsertRowid, cat3.lastInsertRowid, 'Pepperoni', 'Classic pepperoni with mozzarella and tomato sauce', 15.99, null);
  insertItem.run(r1.lastInsertRowid, cat3.lastInsertRowid, 'Quattro Formaggi', 'Four cheese pizza with mozzarella, gorgonzola, parmesan, fontina', 16.99, null);
  insertItem.run(r1.lastInsertRowid, cat3.lastInsertRowid, 'Prosciutto e Rucola', 'Prosciutto, arugula, shaved parmesan, olive oil', 17.99, null);

  // Desserts
  insertItem.run(r1.lastInsertRowid, cat4.lastInsertRowid, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 8.99, null);
  insertItem.run(r1.lastInsertRowid, cat4.lastInsertRowid, 'Panna Cotta', 'Vanilla cream dessert with berry compote', 7.99, null);
  insertItem.run(r1.lastInsertRowid, cat4.lastInsertRowid, 'Cannoli', 'Crispy pastry shells filled with sweet ricotta cream', 6.99, null);

  // Drinks
  insertItem.run(r1.lastInsertRowid, cat5.lastInsertRowid, 'Espresso', 'Double shot Italian espresso', 3.99, null);
  insertItem.run(r1.lastInsertRowid, cat5.lastInsertRowid, 'San Pellegrino', 'Sparkling mineral water', 3.49, null);
  insertItem.run(r1.lastInsertRowid, cat5.lastInsertRowid, 'Limoncello', 'Traditional Italian lemon liqueur', 7.99, null);

  // Menu items for Tokyo Ramen
  // Ramen
  insertItem.run(r2.lastInsertRowid, cat6.lastInsertRowid, 'Tonkotsu Ramen', 'Rich pork bone broth with chashu, egg, nori, and green onions', 14.99, null);
  insertItem.run(r2.lastInsertRowid, cat6.lastInsertRowid, 'Shoyu Ramen', 'Soy sauce based broth with chicken, bamboo shoots, and egg', 13.99, null);
  insertItem.run(r2.lastInsertRowid, cat6.lastInsertRowid, 'Miso Ramen', 'Fermented soybean broth with corn, butter, bean sprouts', 14.49, null);
  insertItem.run(r2.lastInsertRowid, cat6.lastInsertRowid, 'Spicy Tantanmen', 'Spicy sesame broth with ground pork and bok choy', 15.49, null);
  insertItem.run(r2.lastInsertRowid, cat6.lastInsertRowid, 'Veggie Ramen', 'Vegetable broth with tofu, mushrooms, and seasonal vegetables', 12.99, null);

  // Appetizers
  insertItem.run(r2.lastInsertRowid, cat7.lastInsertRowid, 'Gyoza (6 pcs)', 'Pan-fried pork dumplings', 7.99, null);
  insertItem.run(r2.lastInsertRowid, cat7.lastInsertRowid, 'Edamame', 'Steamed soybeans with sea salt', 4.99, null);
  insertItem.run(r2.lastInsertRowid, cat7.lastInsertRowid, 'Karaage', 'Japanese fried chicken with mayo', 9.99, null);
  insertItem.run(r2.lastInsertRowid, cat7.lastInsertRowid, 'Takoyaki (6 pcs)', 'Octopus balls with bonito flakes and sauce', 8.99, null);

  // Rice Bowls
  insertItem.run(r2.lastInsertRowid, cat8.lastInsertRowid, 'Chashu Don', 'Braised pork belly over rice with egg', 13.99, null);
  insertItem.run(r2.lastInsertRowid, cat8.lastInsertRowid, 'Katsu Curry', 'Crispy pork cutlet with Japanese curry and rice', 14.99, null);

  // Drinks
  insertItem.run(r2.lastInsertRowid, cat9.lastInsertRowid, 'Green Tea', 'Hot Japanese green tea', 2.99, null);
  insertItem.run(r2.lastInsertRowid, cat9.lastInsertRowid, 'Ramune Soda', 'Japanese marble soda', 3.49, null);
  insertItem.run(r2.lastInsertRowid, cat9.lastInsertRowid, 'Asahi Beer', 'Japanese draft beer', 5.99, null);

  // Create admin users
  const passwordHash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (restaurant_id, email, password_hash, name) VALUES (?, ?, ?, ?)')
    .run(r1.lastInsertRowid, 'admin@bellaitalia.com', passwordHash, 'Marco Rossi');
  db.prepare('INSERT INTO admins (restaurant_id, email, password_hash, name) VALUES (?, ?, ?, ?)')
    .run(r2.lastInsertRowid, 'admin@tokyoramen.com', passwordHash, 'Yuki Tanaka');
});

transaction();
console.log('Database seeded successfully!');
console.log('Admin credentials:');
console.log('  Bella Italia: admin@bellaitalia.com / admin123');
console.log('  Tokyo Ramen: admin@tokyoramen.com / admin123');
