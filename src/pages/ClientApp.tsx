import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { mockMenuItems, mockRestaurant } from '../data/mockData';
import { processPaymentWithSplit } from '../services/asaasService';
import { CartItem, Order } from '../types';
import {
  ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Search,
  MapPin, CreditCard, Smartphone, Banknote, Check, Loader,
  ChevronRight, Star, Clock, X
} from 'lucide-react';

type ClientView = 'menu' | 'cart' | 'checkout' | 'tracking' | 'success';

const ClientApp: React.FC = () => {
  const { setView, cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, addOrder } = useApp();
  const [view, setClientView] = useState<ClientView>('menu');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const categories = ['Todos', ...mockRestaurant.categories];
  
  const filteredItems = mockMenuItems.filter(item => {
    const matchCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch && item.available;
  });

  const deliveryFee = getCartTotal() > 0 ? 8.00 : 0;
  const totalWithDelivery = getCartTotal() + deliveryFee;

  const handleCheckout = async () => {
    setProcessing(true);
    
    const result = await processPaymentWithSplit(
      totalWithDelivery,
      paymentMethod,
      'Cliente Demo'
    );

    if (result.success) {
      const order: Order = {
        id: `order-${Date.now()}`,
        items: [...cart],
        total: totalWithDelivery,
        status: 'pending',
        customer: {
          id: 'cust-demo',
          name: 'Cliente Demo',
          phone: '(11) 99999-0000',
          email: 'demo@email.com',
          address: 'Rua Demo, 123'
        },
        restaurant: mockRestaurant,
        address: 'Rua Demo, 123 - Centro',
        paymentMethod,
        splitDetails: result.splitDetails,
        createdAt: new Date(),
        estimatedTime: 35
      };
      
      addOrder(order);
      setCurrentOrder(order);
      setClientView('success');
      clearCart();
    }
    
    setProcessing(false);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  // MENU VIEW
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setView('landing')} className="flex items-center gap-1 text-gray-500 hover:text-[#FF6B35]">
              <ArrowLeft size={20} />
            </button>
            <Logo size="sm" />
            <button onClick={() => setClientView('cart')} className="relative">
              <ShoppingCart size={22} className="text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Restaurant Info */}
          <div className="bg-gradient-flash rounded-2xl p-5 text-white mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🍔</span>
              <div>
                <h1 className="font-brand font-bold text-xl">{mockRestaurant.name}</h1>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Star size={12} fill="white" /> {mockRestaurant.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> 25-40 min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar no cardápio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#FF6B35] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#FF6B35]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm card-hover flex gap-4">
                <div className="text-4xl flex-shrink-0 w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[#FF6B35]">
                      R$ {item.price.toFixed(2)}
                    </span>
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{getItemQuantity(item.id)}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-full bg-[#FF6B35] text-white flex items-center justify-center hover:bg-[#E55A2B]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-[#FF6B35] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#E55A2B] transition-colors"
                      >
                        Adicionar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Cart Button */}
          {cart.length > 0 && (
            <div className="fixed bottom-4 left-0 right-0 px-4 z-30">
              <div className="max-w-lg mx-auto">
                <button
                  onClick={() => setClientView('cart')}
                  className="w-full bg-[#FF6B35] text-white py-4 rounded-2xl shadow-lg flex items-center justify-between px-6 hover:bg-[#E55A2B] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} />
                    <span className="font-semibold">{cart.reduce((sum, i) => sum + i.quantity, 0)} itens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">R$ {getCartTotal().toFixed(2)}</span>
                    <ChevronRight size={20} />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CART VIEW
  if (view === 'cart') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setClientView('menu')} className="text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-brand font-bold text-lg">Meu Carrinho</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-bold text-lg text-gray-700 mb-2">Carrinho vazio</h3>
              <p className="text-gray-500 mb-6">Adicione itens do cardápio para começar</p>
              <button onClick={() => setClientView('menu')} className="btn-primary">
                Ver Cardápio
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="text-3xl w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                      <p className="text-[#FF6B35] font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center ml-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-[#FF6B35]" />
                  <span className="font-semibold text-sm">Endereço de entrega</span>
                </div>
                <p className="text-sm text-gray-600">Rua Demo, 123 - Centro, São Paulo</p>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <h3 className="font-semibold mb-3">Resumo</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de entrega</span>
                    <span className="text-[#2ECC71]">R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-[#FF6B35]">R$ {totalWithDelivery.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setClientView('checkout')}
                className="w-full btn-primary text-center py-4 text-lg"
              >
                Finalizar Pedido
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // CHECKOUT VIEW
  if (view === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setClientView('cart')} className="text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-brand font-bold text-lg">Pagamento</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <h3 className="font-semibold mb-3">Forma de pagamento</h3>
            <div className="space-y-2">
              {[
                { id: 'credit_card', label: 'Cartão de Crédito', icon: <CreditCard size={20} />, desc: 'Split automático via Asaas' },
                { id: 'pix', label: 'PIX', icon: <Smartphone size={20} />, desc: 'Pagamento instantâneo' },
                { id: 'debit', label: 'Cartão de Débito', icon: <CreditCard size={20} />, desc: 'Split automático via Asaas' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === method.id
                      ? 'border-[#FF6B35] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentMethod === method.id ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {method.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <Check size={18} className="text-[#FF6B35]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Split Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚡</span>
              <span className="font-semibold text-sm text-purple-800">Split de Pagamento Asaas</span>
            </div>
            <div className="space-y-1 text-xs text-purple-700">
              <div className="flex justify-between">
                <span>Restaurante (80%)</span>
                <span className="font-semibold">R$ {(totalWithDelivery * 0.80).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Entregador (10%)</span>
                <span className="font-semibold">R$ {(totalWithDelivery * 0.10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Plataforma (10%)</span>
                <span className="font-semibold">R$ {(totalWithDelivery * 0.10).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-3">Resumo do pedido</h3>
            <div className="space-y-2 text-sm">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-600">Entrega</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-[#FF6B35]">R$ {totalWithDelivery.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing}
            className="w-full btn-primary text-center py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader size={20} className="animate-spin" />
                Processando pagamento...
              </>
            ) : (
              <>
                Pagar R$ {totalWithDelivery.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS VIEW
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full text-center animate-bounce-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-[#2ECC71]" />
          </div>
          <h2 className="font-brand font-bold text-2xl text-gray-900 mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-4">
            Seu pedido foi recebido e está sendo preparado.
          </p>
          
          {currentOrder?.splitDetails && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-semibold text-gray-500 mb-2">SPLIT ASAAS PROCESSADO</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">🏪 Restaurante</span>
                  <span className="font-semibold">R$ {currentOrder.splitDetails.restaurantAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🛵 Entregador</span>
                  <span className="font-semibold">R$ {currentOrder.splitDetails.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">⚡ Plataforma</span>
                  <span className="font-semibold">R$ {currentOrder.splitDetails.platformFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">Tempo estimado</p>
            <p className="font-brand font-bold text-2xl text-[#FF6B35]">{currentOrder?.estimatedTime || 35} min</p>
          </div>

          <div className="space-y-3">
            <button onClick={() => setClientView('tracking')} className="w-full btn-primary py-3">
              Acompanhar Pedido
            </button>
            <button onClick={() => setView('landing')} className="w-full text-gray-500 py-2 text-sm">
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TRACKING VIEW
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => setClientView('menu')} className="text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-brand font-bold text-lg">Acompanhar Pedido</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500">Pedido</p>
              <p className="font-bold">#{currentOrder?.id?.slice(-6) || '000000'}</p>
            </div>
            <span className="badge-pending px-3 py-1 rounded-full text-xs font-semibold">
              Preparando
            </span>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {[
              { label: 'Pedido recebido', done: true, icon: '✓' },
              { label: 'Preparando seu pedido', done: true, icon: '👨‍🍳' },
              { label: 'Saiu para entrega', done: false, icon: '🛵' },
              { label: 'Entregue', done: false, icon: '🏠' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step.done ? 'bg-[#2ECC71] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-sm ${step.done ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-gray-500 text-sm mb-1">Tempo estimado de entrega</p>
          <p className="font-brand font-bold text-4xl text-[#FF6B35]">25 min</p>
        </div>
      </div>
    </div>
  );
};

export default ClientApp;
