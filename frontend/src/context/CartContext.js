import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }
    case 'SET_RESTAURANT':
      return { ...state, restaurantId: action.payload.id, restaurantName: action.payload.name, items: [] };
    case 'CLEAR_CART':
      return { items: [], restaurantId: null, restaurantName: null };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], restaurantId: null, restaurantName: null });

  const addItem = (item, restaurantId, restaurantName) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        dispatch({ type: 'SET_RESTAURANT', payload: { id: restaurantId, name: restaurantName } });
      } else {
        return;
      }
    }
    if (!cart.restaurantId) {
      dispatch({ type: 'SET_RESTAURANT', payload: { id: restaurantId, name: restaurantName } });
    }
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
