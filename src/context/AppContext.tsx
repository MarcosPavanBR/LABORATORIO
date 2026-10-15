import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Order, MenuItem, Customer, DeliveryPerson, Notification } from '../types';
import { mockOrders } from '../data/mockData';

type AppView = 'landing' | 'login' | 'client' | 'restaurant' | 'delivery';

interface AppState {
  cart: CartItem[];
  orders: Order[];
  currentView: AppView;
  customer: Customer | null;
  deliveryPerson: DeliveryPerson | null;
  notifications: Notification[];
  isAuthenticated: boolean;
}

interface AppContextType extends AppState {
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  setView: (view: AppView) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setCustomer: (customer: Customer) => void;
  setDeliveryPerson: (dp: DeliveryPerson) => void;
  login: () => void;
  logout: () => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'order', title: 'Novo pedido!', message: 'Pedido #8F3K2 recebido com sucesso', read: false, createdAt: new Date(Date.now() - 300000) },
    { id: '2', type: 'payment', title: 'Pagamento confirmado', message: 'Split Asaas processado - R$ 70,07', read: false, createdAt: new Date(Date.now() - 600000) },
    { id: '3', type: 'delivery', title: 'Entrega concluída', message: 'Pedido #2M9P7 entregue com sucesso', read: true, createdAt: new Date(Date.now() - 1800000) },
  ]);

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
    if (quantity <= 0) { removeFromCart(itemId); return; }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal > 0 ? subtotal + 7.99 : 0;
  };
  const getCartSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const setView = (view: AppView) => setCurrentView(view);
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };
  const login = () => setIsAuthenticated(true);
  const logout = () => { setIsAuthenticated(false); setCurrentView('landing'); };
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      cart, orders, currentView, customer, deliveryPerson, notifications, isAuthenticated,
      addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartSubtotal,
      setView, addOrder, updateOrderStatus, setCustomer, setDeliveryPerson, login, logout, markNotificationRead
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
