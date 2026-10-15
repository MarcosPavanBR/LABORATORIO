import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order, MenuItem, Customer, DeliveryPerson, Notification, Coupon } from '../types';
import { mockOrders, mockCoupons } from '../data/mockData';

type AppView = 'landing' | 'login' | 'client' | 'restaurant' | 'delivery' | 'admin';
type Theme = 'light' | 'dark';

interface AppState {
  cart: CartItem[];
  orders: Order[];
  currentView: AppView;
  customer: Customer | null;
  deliveryPerson: DeliveryPerson | null;
  notifications: Notification[];
  isAuthenticated: boolean;
  theme: Theme;
  favorites: string[];
  savedAddresses: string[];
  appliedCoupon: Coupon | null;
  loyaltyPoints: number;
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
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  toggleTheme: () => void;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  addAddress: (address: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addLoyaltyPoints: (points: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<string[]>(['Av. Paulista, 1000 - Apto 42, Bela Vista']);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(2450);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'order', title: 'Novo pedido!', message: 'Pedido #8F3K2 recebido com sucesso', read: false, createdAt: new Date(Date.now() - 300000) },
    { id: '2', type: 'payment', title: 'Pagamento confirmado', message: 'Split Asaas processado - R$ 70,07', read: false, createdAt: new Date(Date.now() - 600000) },
    { id: '3', type: 'delivery', title: 'Entrega concluída', message: 'Pedido #2M9P7 entregue com sucesso', read: true, createdAt: new Date(Date.now() - 1800000) },
    { id: '4', type: 'system', title: 'Cupom disponível!', message: 'Use FLASH20 e ganhe 20% de desconto', read: false, createdAt: new Date(Date.now() - 3600000) },
  ]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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
  
  const getCartSubtotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (appliedCoupon) {
      return subtotal * (1 - appliedCoupon.discount / 100);
    }
    return subtotal;
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 0 ? subtotal + 7.99 : 0;
  };

  const setView = (view: AppView) => setCurrentView(view);
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    // Add notification for status change
    const order = orders.find(o => o.id === orderId);
    if (order) {
      addNotification({
        type: 'order',
        title: `Pedido ${orderId} atualizado`,
        message: `Status: ${status}`,
      });
    }
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => { setIsAuthenticated(false); setCurrentView('landing'); };
  
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);
  
  const addAddress = (address: string) => {
    setSavedAddresses(prev => [...prev, address]);
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = mockCoupons.find((c: any) => c.code === code.toUpperCase());
    if (coupon && coupon.active && coupon.validUntil > new Date()) {
      setAppliedCoupon(coupon);
      addNotification({
        type: 'system',
        title: 'Cupom aplicado!',
        message: `${coupon.discount}% de desconto aplicado`,
      });
      return true;
    }
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);
  
  const addLoyaltyPoints = (points: number) => {
    setLoyaltyPoints(prev => prev + points);
  };

  return (
    <AppContext.Provider value={{
      cart, orders, currentView, customer, deliveryPerson, notifications, isAuthenticated,
      theme, favorites, savedAddresses, appliedCoupon, loyaltyPoints,
      addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartSubtotal,
      setView, addOrder, updateOrderStatus, setCustomer, setDeliveryPerson, login, logout,
      markNotificationRead, addNotification, toggleTheme, toggleFavorite, isFavorite,
      addAddress, applyCoupon, removeCoupon, addLoyaltyPoints
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
