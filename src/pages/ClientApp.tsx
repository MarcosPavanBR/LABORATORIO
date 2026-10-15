import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Button, Card, Badge, Avatar } from '../components/ui';
import { mockMenuItems, mockRestaurant, mockCustomers } from '../data/mockData';
import { processPaymentWithSplit } from '../services/asaasService';
import { Order } from '../types';
import {
  ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Search, MapPin,
  CreditCard, Smartphone, Banknote, Check, Loader, Star, Clock,
  X, Home, Receipt, User, ChevronRight, Navigation, Phone, MessageCircle
} from 'lucide-react';

type ClientView = 'menu' | 'cart' | 'checkout' | 'tracking' | 'success' | 'orders' | 'profile';

const ClientApp: React.FC = () => {
  const { setView, cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartSubtotal, addOrder, orders } = useApp();
  const [view, setClientView] = useState<ClientView>('menu');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'pix' | 'cash'>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const categories = ['Todos', ...mockRestaurant.categories];
  const filteredItems = mockMenuItems.filter(item => {
    const matchCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch && item.available;
  });

  const subtotal = getCartSubtotal();
  const deliveryFee = subtotal > 0 ? mockRestaurant.deliveryFee : 0;
  const totalWithDelivery = subtotal + deliveryFee;

  const handleCheckout = async () => {
    setProcessing(true);
    const result = await processPaymentWithSplit(totalWithDelivery, paymentMethod, 'Cliente Demo');
    if (result.success) {
      const order: Order = {
        id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        items: [...cart],
        subtotal, deliveryFee, total: totalWithDelivery,
        status: 'pending',
        customer: mockCustomers[0],
        restaurant: mockRestaurant,
        address: 'Av. Paulista, 1000 - Apto 42, Bela Vista',
        paymentMethod,
        splitDetails: result.splitDetails,
        createdAt: new Date(),
        estimatedDelivery: 35
      };
      addOrder(order);
      setCurrentOrder(order);
      setClientView('success');
      clearCart();
    }
    setProcessing(false);
  };

  const getItemQuantity = (itemId: string) => cart.find(i => i.id === itemId)?.quantity || 0;

  const getStatusConfig = (status: Order['status']) => {
    const configs: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'purple' }> = {
      pending: { label: 'Pendente', variant: 'warning' },
      confirmed: { label: 'Confirmado', variant: 'info' },
      preparing: { label: 'Preparando', variant: 'info' },
      ready: { label: 'Pronto', variant: 'success' },
      delivering: { label: 'A caminho', variant: 'purple' },
      delivered: { label: 'Entregue', variant: 'success' },
      cancelled: { label: 'Cancelado', variant: 'danger' },
    };
    return configs[status] || configs.pending;
  };

  // Bottom Navigation
  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-flash-gray-200 z-40 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {[
          { id: 'menu' as const, icon: <Home size={20} />, label: 'Início' },
          { id: 'cart' as const, icon: <ShoppingCart size={20} />, label: 'Carrinho', badge: cart.length },
          { id: 'orders' as const, icon: <Receipt size={20} />, label: 'Pedidos' },
          { id: 'profile' as const, icon: <User size={20} />, label: 'Perfil' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setClientView(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all relative ${
              view === tab.id ? 'text-flash-orange' : 'text-flash-gray-400'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -top-0.5 right-2 w-4 h-4 bg-flash-orange text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );

  // MENU VIEW
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-flash-gray-50 pb-20">
        {/* Header */}
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setView('landing')} className="text-flash-gray-400 hover:text-flash-gray-600">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <p className="text-xs text-flash-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> Entregar em
                  </p>
                  <p className="text-sm font-semibold text-flash-gray-900">Av. Paulista, 1000</p>
                </div>
              </div>
              <Logo size="xs" showText={false} />
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-flash-gray-400" />
              <input
                type="text"
                placeholder="Buscar no cardápio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-flash-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-flash-orange/20 focus:bg-white border border-transparent focus:border-flash-orange/30 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Restaurant Banner */}
          <div className="bg-gradient-to-br from-flash-orange to-flash-orange-light rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🍔</span>
                <div>
                  <h1 className="font-display font-bold text-xl">{mockRestaurant.name}</h1>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="flex items-center gap-1"><Star size={12} fill="white" /> {mockRestaurant.rating}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {mockRestaurant.deliveryTime}</span>
                    <span>• {mockRestaurant.totalReviews} avaliações</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="bg-white/20 px-2.5 py-1 rounded-full">Frete R$ {mockRestaurant.deliveryFee.toFixed(2)}</span>
                <span className="bg-white/20 px-2.5 py-1 rounded-full">Mín. R$ {mockRestaurant.minOrder.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-flash-gray-900 text-white shadow-md'
                    : 'bg-white text-flash-gray-600 border border-flash-gray-200 hover:border-flash-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Popular Items */}
          {activeCategory === 'Todos' && !searchTerm && (
            <div className="mb-6">
              <h2 className="font-display font-bold text-lg text-flash-gray-900 mb-3 flex items-center gap-2">
                🔥 Mais Pedidos
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {mockMenuItems.filter(i => i.popular).slice(0, 4).map(item => (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(item)}
                    className="flex-shrink-0 w-36 bg-white rounded-2xl p-3 border border-flash-gray-100 cursor-pointer hover:border-flash-orange/30 transition-all"
                  >
                    <div className="text-4xl text-center mb-2">{item.emoji}</div>
                    <p className="text-xs font-semibold text-flash-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs font-bold text-flash-orange mt-1">R$ {item.price.toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <h2 className="font-display font-bold text-lg text-flash-gray-900 mb-3">
            {activeCategory === 'Todos' ? 'Cardápio Completo' : activeCategory}
          </h2>
          <div className="space-y-3">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-flash-gray-100 flex gap-4 hover:border-flash-orange/20 transition-all"
              >
                <div className="text-4xl w-16 h-16 bg-flash-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-flash-gray-900">{item.name}</h3>
                      <p className="text-xs text-flash-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                    {item.popular && (
                      <span className="text-[9px] font-bold bg-flash-orange-50 text-flash-orange px-2 py-0.5 rounded-full whitespace-nowrap">POPULAR</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-flash-orange text-sm">R$ {item.price.toFixed(2)}</span>
                      {item.rating && (
                        <span className="text-xs text-flash-gray-400 flex items-center gap-0.5">
                          <Star size={10} fill="#F39C12" className="text-flash-yellow" /> {item.rating}
                        </span>
                      )}
                    </div>
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2 bg-flash-orange-50 rounded-full px-1 py-0.5">
                        <button onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-flash-gray-100">
                          <Minus size={12} />
                        </button>
                        <span className="font-bold text-xs w-4 text-center text-flash-orange">{getItemQuantity(item.id)}</span>
                        <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-flash-orange text-white flex items-center justify-center shadow-sm hover:bg-flash-orange-dark">
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(item)}
                        className="bg-flash-orange text-white px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-flash-orange-dark transition-colors"
                      >
                        Adicionar
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Cart Button */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-20 left-0 right-0 px-4 z-30"
            >
              <div className="max-w-lg mx-auto">
                <button
                  onClick={() => setClientView('cart')}
                  className="w-full bg-flash-gray-900 text-white py-4 rounded-2xl shadow-2xl flex items-center justify-between px-6 hover:bg-flash-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-flash-orange rounded-lg flex items-center justify-center">
                      <ShoppingCart size={16} />
                    </div>
                    <span className="font-semibold text-sm">{cart.reduce((sum, i) => sum + i.quantity, 0)} itens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    );
  }

  // CART VIEW
  if (view === 'cart') {
    return (
      <div className="min-h-screen bg-flash-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setClientView('menu')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Meu Carrinho</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-display font-bold text-xl text-flash-gray-900 mb-2">Carrinho vazio</h3>
              <p className="text-flash-gray-500 mb-6">Adicione itens deliciosos do cardápio</p>
              <Button variant="primary" onClick={() => setClientView('menu')}>Ver Cardápio</Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-5">
                {cart.map(item => (
                  <motion.div key={item.id} layout className="bg-white rounded-2xl p-4 border border-flash-gray-100 flex items-center gap-3">
                    <div className="text-3xl w-12 h-12 bg-flash-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-flash-gray-900">{item.name}</h4>
                      <p className="text-flash-orange font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-flash-gray-100 flex items-center justify-center hover:bg-flash-gray-200 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-flash-orange text-white flex items-center justify-center hover:bg-flash-orange-dark transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Delivery Address */}
              <Card className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-flash-orange-50 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-flash-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-flash-gray-500">Entregar em</p>
                    <p className="text-sm font-semibold text-flash-gray-900">Av. Paulista, 1000 - Apto 42</p>
                  </div>
                  <ChevronRight size={16} className="text-flash-gray-400" />
                </div>
              </Card>

              {/* Summary */}
              <Card className="mb-5">
                <h3 className="font-semibold text-sm mb-3">Resumo do pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-flash-gray-500">Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-flash-gray-500">Taxa de entrega</span><span className="text-flash-green">R$ {deliveryFee.toFixed(2)}</span></div>
                  <div className="border-t border-flash-gray-100 pt-2 flex justify-between font-bold">
                    <span>Total</span><span className="text-flash-orange text-lg">R$ {totalWithDelivery.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              <Button variant="primary" size="xl" fullWidth onClick={() => setClientView('checkout')}>
                Finalizar Pedido <ChevronRight size={18} />
              </Button>
            </>
          )}
        </div>
        <BottomNav />
      </div>
    );
  }

  // CHECKOUT VIEW
  if (view === 'checkout') {
    return (
      <div className="min-h-screen bg-flash-gray-50 pb-8">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setClientView('cart')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Pagamento</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Payment Methods */}
          <Card className="mb-4">
            <h3 className="font-semibold text-sm mb-3">Forma de pagamento</h3>
            <div className="space-y-2">
              {[
                { id: 'credit_card' as const, label: 'Cartão de Crédito', icon: <CreditCard size={18} />, desc: 'Split automático via Asaas' },
                { id: 'pix' as const, label: 'PIX', icon: <Smartphone size={18} />, desc: 'Aprovação instantânea' },
                { id: 'debit_card' as const, label: 'Cartão de Débito', icon: <CreditCard size={18} />, desc: 'Split automático via Asaas' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                    paymentMethod === method.id ? 'border-flash-orange bg-flash-orange-50' : 'border-flash-gray-200 hover:border-flash-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-flash-orange text-white' : 'bg-flash-gray-100 text-flash-gray-600'}`}>
                    {method.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{method.label}</p>
                    <p className="text-xs text-flash-gray-500">{method.desc}</p>
                  </div>
                  {paymentMethod === method.id && <Check size={18} className="text-flash-orange" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Split Info */}
          <Card className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⚡</span>
              <span className="font-semibold text-sm text-purple-800">Split Asaas - Divisão Automática</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-purple-600">🏪 Restaurante (80%)</span><span className="font-bold text-purple-900">R$ {(totalWithDelivery * 0.80).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-purple-600">🛵 Entregador (10%)</span><span className="font-bold text-purple-900">R$ {(totalWithDelivery * 0.10).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-purple-600">⚡ Plataforma (10%)</span><span className="font-bold text-purple-900">R$ {(totalWithDelivery * 0.10).toFixed(2)}</span></div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="mb-6">
            <h3 className="font-semibold text-sm mb-3">Itens do pedido</h3>
            <div className="space-y-2 text-sm">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-flash-gray-600">{item.quantity}x {item.name}</span>
                  <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-flash-gray-100 pt-2 flex justify-between">
                <span className="text-flash-gray-500">Entrega</span><span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-flash-gray-100 pt-2 flex justify-between font-bold">
                <span>Total</span><span className="text-flash-orange text-lg">R$ {totalWithDelivery.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Button variant="primary" size="xl" fullWidth loading={processing} onClick={handleCheckout}>
            {processing ? 'Processando...' : `Pagar R$ ${totalWithDelivery.toFixed(2)}`}
          </Button>
        </div>
      </div>
    );
  }

  // SUCCESS VIEW
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-flash-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-flash-green" />
          </motion.div>
          <h2 className="font-display font-bold text-2xl text-flash-gray-900 mb-2">Pedido Confirmado!</h2>
          <p className="text-flash-gray-500 text-sm mb-6">Seu pedido foi recebido e está sendo preparado com carinho.</p>
          
          {currentOrder?.splitDetails && (
            <div className="bg-flash-gray-50 rounded-xl p-4 mb-5 text-left border border-flash-gray-100">
              <p className="text-[10px] font-bold text-flash-gray-400 uppercase tracking-wider mb-2">⚡ Split Asaas Processado</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-flash-gray-600">🏪 Restaurante</span><span className="font-bold">R$ {currentOrder.splitDetails.restaurantAmount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-flash-gray-600">🛵 Entregador</span><span className="font-bold">R$ {currentOrder.splitDetails.deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-flash-gray-600">⚡ Plataforma</span><span className="font-bold">R$ {currentOrder.splitDetails.platformFee.toFixed(2)}</span></div>
              </div>
            </div>
          )}

          <div className="bg-flash-orange-50 rounded-xl p-4 mb-6 border border-flash-orange/10">
            <p className="text-xs text-flash-gray-500 mb-1">Tempo estimado de entrega</p>
            <p className="font-display font-bold text-3xl text-flash-orange">{currentOrder?.estimatedDelivery || 35} min</p>
          </div>

          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={() => setClientView('tracking')}>Acompanhar Pedido</Button>
            <Button variant="ghost" fullWidth onClick={() => setClientView('menu')}>Fazer novo pedido</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // TRACKING VIEW
  if (view === 'tracking') {
    return (
      <div className="min-h-screen bg-flash-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setClientView('orders')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Acompanhar Pedido</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Map placeholder */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl h-44 flex items-center justify-center mb-4 relative overflow-hidden border border-blue-100">
            <div className="absolute inset-0 opacity-30">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }} />
              ))}
            </div>
            <div className="text-center z-10">
              <Navigation size={28} className="text-flash-orange mx-auto mb-2 animate-pulse" />
              <p className="font-semibold text-flash-gray-700 text-sm">Entregador a caminho</p>
              <p className="text-xs text-flash-gray-500">Previsão: 25 min</p>
            </div>
          </div>

          <Card className="mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-flash-gray-500">Pedido</p>
                <p className="font-bold text-flash-gray-900">#{currentOrder?.id || 'ORD-XXXXX'}</p>
              </div>
              <Badge variant="info" dot>Pedindo sendo preparado</Badge>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Pedido recebido', done: true, time: '14:32' },
                { label: 'Preparando seu pedido', done: true, time: '14:35' },
                { label: 'Saiu para entrega', done: false, time: '' },
                { label: 'Entregue', done: false, time: '' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step.done ? 'bg-flash-green text-white' : 'bg-flash-gray-100 text-flash-gray-400'}`}>
                    {step.done ? <Check size={14} /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${step.done ? 'font-semibold text-flash-gray-900' : 'text-flash-gray-400'}`}>{step.label}</p>
                    {step.time && <p className="text-xs text-flash-gray-400">{step.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery person */}
          <Card className="mb-4">
            <div className="flex items-center gap-3">
              <Avatar name="Carlos Mendes" size="md" online />
              <div className="flex-1">
                <p className="font-semibold text-sm">Carlos Mendes</p>
                <p className="text-xs text-flash-gray-500">Honda CG 160 • ABC-1D23</p>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 bg-flash-green-50 rounded-full flex items-center justify-center"><Phone size={14} className="text-flash-green" /></button>
                <button className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center"><MessageCircle size={14} className="text-flash-blue" /></button>
              </div>
            </div>
          </Card>

          <div className="bg-flash-orange-50 rounded-2xl p-5 text-center border border-flash-orange/10">
            <p className="text-xs text-flash-gray-500 mb-1">Tempo estimado</p>
            <p className="font-display font-bold text-4xl text-flash-orange">25 min</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ORDERS VIEW
  if (view === 'orders') {
    return (
      <div className="min-h-screen bg-flash-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="font-display font-bold text-lg">Meus Pedidos</h1>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-bold text-flash-gray-900 mb-1">Nenhum pedido ainda</h3>
              <p className="text-sm text-flash-gray-500">Faça seu primeiro pedido!</p>
            </div>
          ) : (
            orders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <Card key={order.id} hover>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-sm">#{order.id}</p>
                      <p className="text-xs text-flash-gray-500">{new Date(order.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <Badge variant={statusConfig.variant} dot>{statusConfig.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{order.items[0]?.emoji}</span>
                    <p className="text-sm text-flash-gray-600">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-flash-orange">R$ {order.total.toFixed(2)}</span>
                    <Button variant="outline" size="sm" onClick={() => { setCurrentOrder(order); setClientView('tracking'); }}>
                      Acompanhar
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
        <BottomNav />
      </div>
    );
  }

  // PROFILE VIEW
  if (view === 'profile') {
    return (
      <div className="min-h-screen bg-flash-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="font-display font-bold text-lg">Meu Perfil</h1>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4 py-4">
          <Card className="text-center mb-4">
            <Avatar name="Maria Silva" size="lg" />
            <h3 className="font-display font-bold text-xl mt-3">Maria Silva</h3>
            <p className="text-sm text-flash-gray-500">maria@email.com</p>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-flash-gray-100">
              <div className="text-center">
                <p className="font-bold text-lg">{orders.length}</p>
                <p className="text-xs text-flash-gray-500">Pedidos</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">R$ {orders.reduce((s, o) => s + o.total, 0).toFixed(0)}</p>
                <p className="text-xs text-flash-gray-500">Gasto total</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">⭐ 4.9</p>
                <p className="text-xs text-flash-gray-500">Avaliação</p>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <h3 className="font-semibold text-sm mb-3">Endereço principal</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-flash-orange-50 rounded-xl flex items-center justify-center">
                <MapPin size={18} className="text-flash-orange" />
              </div>
              <div>
                <p className="text-sm font-semibold">Av. Paulista, 1000 - Apto 42</p>
                <p className="text-xs text-flash-gray-500">Bela Vista, São Paulo - SP</p>
              </div>
            </div>
          </Card>

          <Button variant="outline" fullWidth onClick={() => { setView('landing'); }}>Sair da conta</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return null;
};

export default ClientApp;
