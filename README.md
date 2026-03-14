# SaaS Restaurant Ordering Platform

A full-stack restaurant ordering system with a Node.js/Express backend and React frontend.

## Features

- **Customer Ordering**: Browse menus, add items to cart, place orders
- **Admin Dashboard**: Manage menu items, view and update orders
- **Multi-restaurant Support**: SaaS architecture supporting multiple restaurants
- **Real-time Order Status**: Track order status from placed to delivered

## Tech Stack

- **Backend**: Node.js, Express, SQLite (via better-sqlite3)
- **Frontend**: React, React Router, Context API
- **Styling**: CSS Modules

## Getting Started

### Prerequisites
- Node.js 16+

### Installation

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install

# Seed the database
npm run seed

# Start both servers
cd .. && npm start
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```
PORT=4000
JWT_SECRET=your-secret-key
```

## API Endpoints

### Public
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id/menu` - Get menu for a restaurant
- `POST /api/orders` - Place an order
- `GET /api/orders/:id` - Get order status

### Admin (requires auth)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/orders` - List orders
- `PATCH /api/admin/orders/:id` - Update order status
- `POST /api/admin/menu` - Add menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
