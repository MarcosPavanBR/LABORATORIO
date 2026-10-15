import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Order, MenuItem, Customer, DeliveryPerson } from '../types';

interface AppState {
  cart: CartItem[];
  orders: Order[];
  currentView: 'landing' | 'client' | 'restaurant' | 'delivery';
  customer: Customer | null;
  deliveryPerson: DeliveryPerson | null;
}

interface AppContextType extends AppState {
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setView: (view: AppState['currentView']) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setCustomer: (customer: Customer) => void;
  setDeliveryPerson: (dp: DeliveryPerson) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentView, setCurrentView] = useState<AppState['currentView']>('landing');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const setView = (view: AppState['currentView']) => setCurrentView(view);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <AppContext.Provider value={{
      cart, orders, currentView, customer, deliveryPerson,
      addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal,
      setView, addOrder, updateOrderStatus, setCustomer, setDeliveryPerson
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
