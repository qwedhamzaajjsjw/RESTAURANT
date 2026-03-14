import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    api.getAdminOrders(filter || undefined)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const statuses = ['placed', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  const nextStatus = (current) => {
    const idx = statuses.indexOf(current);
    return idx < 4 ? statuses[idx + 1] : null;
  };

  return (
    <div>
      <h2>Orders</h2>
      <div className="filter-bar">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Orders</option>
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={loadOrders}>Refresh</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="admin-orders-list">
          {orders.length === 0 && <p>No orders found.</p>}
          {orders.map(order => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-header">
                <strong>{order.order_number}</strong>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </div>
              <p>{order.customer_name} - ${order.total.toFixed(2)}</p>
              <p className="order-time">{new Date(order.created_at).toLocaleString()}</p>
              <div className="admin-order-actions">
                {nextStatus(order.status) && (
                  <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order.id, nextStatus(order.status))}>
                    Mark as {nextStatus(order.status)}
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(order.id, 'cancelled')}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '' });

  useEffect(() => {
    Promise.all([api.getAdminMenu(), api.getCategories()])
      .then(([menuItems, cats]) => { setItems(menuItems); setCategories(cats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category_id: '' });
    setEditItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price), category_id: form.category_id ? parseInt(form.category_id) : null };
    try {
      if (editItem) {
        await api.updateMenuItem(editItem.id, data);
      } else {
        await api.addMenuItem(data);
      }
      const updated = await api.getAdminMenu();
      setItems(updated);
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: item.price.toString(), category_id: item.category_id ? item.category_id.toString() : '' });
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.deleteMenuItem(id);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      await api.updateMenuItem(item.id, { available: item.available ? 0 : 1 });
      const updated = await api.getAdminMenu();
      setItems(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="section-header">
        <h2>Menu Items</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Price *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
              <option value="">No Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">{editItem ? 'Update' : 'Add'} Item</button>
        </form>
      )}
      <div className="admin-menu-list">
        {items.map(item => (
          <div key={item.id} className={`admin-menu-card ${!item.available ? 'unavailable' : ''}`}>
            <div className="admin-menu-info">
              <strong>{item.name}</strong>
              <span>${item.price.toFixed(2)}</span>
              {!item.available && <span className="badge-unavailable">Unavailable</span>}
            </div>
            <div className="admin-menu-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => handleToggle(item)}>
                {item.available ? 'Disable' : 'Enable'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(item)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { admin, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!admin) return <Navigate to="/admin/login" />;

  return (
    <div className="container">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-info">
            <strong>{admin.name}</strong>
            <span>Admin</span>
          </div>
          <nav className="admin-nav">
            <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
            <Link to="/admin/menu" className="admin-nav-link">Menu</Link>
          </nav>
          <button className="btn btn-secondary btn-logout" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </aside>
        <div className="admin-content">
          <Routes>
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="*" element={<Navigate to="/admin/orders" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
