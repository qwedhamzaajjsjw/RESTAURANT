import React from 'react';

function MenuItemCard({ item, onAdd }) {
  return (
    <div className="menu-item-card">
      <div className="menu-item-info">
        <h3 className="menu-item-name">{item.name}</h3>
        {item.description && <p className="menu-item-desc">{item.description}</p>}
        <span className="menu-item-price">${item.price.toFixed(2)}</span>
      </div>
      <button className="btn btn-primary btn-sm btn-add" onClick={() => onAdd(item)}>
        + Add
      </button>
    </div>
  );
}

export default MenuItemCard;
