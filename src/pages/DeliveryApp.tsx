import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { mockOrders, mockDeliveryPersons } from '../data/mockData';
import { Order } from '../types';
import {
  ArrowLeft, MapPin, Navigation, Phone, Star, Clock,
  DollarSign, Package, CheckCircle, Truck, AlertCircle,
  Wallet, TrendingUp, Power, ChevronRight, Route
} from 'lucide-react';

type DeliveryView = 'home' | 'available' | 'active' | 'earnings';

const DeliveryApp: React.FC = () => {
  const { setView, orders } = useApp();
  const [view, setDelView] = useState<DeliveryView>('home');
  const [isOnline, setIsOnline] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);
  const [completedDeliveries, setCompletedDeliveries] = useState<Order[]>([]);

  const dp = mockDeliveryPersons[0];
  const availableOrders = mockOrders.filter(o => o.status === 'ready' || o.status === 'delivering');
  const allOrders = [...availableOrders, ...orders.filter(o => o.status === 'delivering')];

  const todayEarnings = completedDeliveries.reduce((sum, o) => sum + (o.splitDetails?.deliveryFee || 8), 0);
  const totalDeliveries = completedDeliveries.length;

  const handleAcceptDelivery = (order: Order) => {
    setActiveDelivery(order);
    setDelView('active');
  };

  const handleCompleteDelivery = () => {
    if (activeDelivery) {
      setCompletedDeliveries(prev => [...prev, activeDelivery]);
      setActiveDelivery(null);
      setDelView('home');
    }
  };

  // HOME VIEW
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('landing')} className="text-gray-500">
                <ArrowLeft size={20} />
              </button>
              <Logo size="sm" />
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Power size={14} />
              {isOnline ? 'Online' : 'Offline'}
            </button>
          </div>
        </header>

        <div className="px-4 py-4 max-w-lg mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-flash rounded-full flex items-center justify-center text-white font-bold text-xl">
                {dp.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{dp.name}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500" fill="currentColor" /> {dp.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck size={12} /> {dp.vehicle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {isOnline ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="font-semibold text-green-800 text-sm">Você está online</p>
                <p className="text-xs text-green-600">Recebendo pedidos na sua região</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <div>
                <p className="font-semibold text-gray-700 text-sm">Você está offline</p>
                <p className="text-xs text-gray-500">Fique online para receber pedidos</p>
              </div>
            </div>
          )}

          {/* Today Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <DollarSign size={18} className="text-[#2ECC71] mx-auto mb-1" />
              <p className="font-bold text-lg">R$ {todayEarnings.toFixed(0)}</p>
              <p className="text-xs text-gray-500">Ganhos hoje</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <Package size={18} className="text-[#FF6B35] mx-auto mb-1" />
              <p className="font-bold text-lg">{totalDeliveries}</p>
              <p className="text-xs text-gray-500">Entregas</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <Clock size={18} className="text-[#6C5CE7] mx-auto mb-1" />
              <p className="font-bold text-lg">4.2h</p>
              <p className="text-xs text-gray-500">Horas online</p>
            </div>
          </div>

          {/* Available Orders */}
          {isOnline && availableOrders.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-[#FF6B35]" />
                Pedidos Disponíveis
              </h3>
              <div className="space-y-3">
                {availableOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm card-hover">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">#{order.id.slice(-6)}</span>
                      <span className="text-[#2ECC71] font-bold">
                        R$ {(order.splitDetails?.deliveryFee || 8).toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package size={14} className="text-gray-400" />
                        <span>{order.restaurant.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={14} className="text-[#FF6B35]" />
                        <span className="truncate">{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Route size={14} className="text-[#6C5CE7]" />
                        <span>~3.2 km</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAcceptDelivery(order)}
                      className="w-full btn-green text-sm py-2.5 mt-3"
                    >
                      Aceitar Entrega
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDelView('earnings')}
              className="bg-white rounded-xl p-4 shadow-sm text-left card-hover"
            >
              <Wallet size={24} className="text-[#2ECC71] mb-2" />
              <p className="font-semibold text-sm">Meus Ganhos</p>
              <p className="text-xs text-gray-500">Ver histórico</p>
            </button>
            <button
              onClick={() => setDelView('available')}
              className="bg-white rounded-xl p-4 shadow-sm text-left card-hover"
            >
              <TrendingUp size={24} className="text-[#6C5CE7] mb-2" />
              <p className="font-semibold text-sm">Histórico</p>
              <p className="text-xs text-gray-500">{completedDeliveries.length} entregas</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE DELIVERY VIEW
  if (view === 'active' && activeDelivery) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setDelView('home')} className="text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-brand font-bold text-lg">Entrega Ativa</h1>
          </div>
        </header>

        <div className="px-4 py-4 max-w-lg mx-auto">
          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl h-48 flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-8 w-2 h-2 bg-blue-500 rounded-full" />
              <div className="absolute top-12 left-20 w-2 h-2 bg-blue-500 rounded-full" />
              <div className="absolute top-8 right-16 w-2 h-2 bg-blue-500 rounded-full" />
              <div className="absolute bottom-12 left-12 w-2 h-2 bg-blue-500 rounded-full" />
              <div className="absolute bottom-8 right-24 w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="text-center z-10">
              <Navigation size={32} className="text-[#FF6B35] mx-auto mb-2 animate-pulse" />
              <p className="font-semibold text-gray-700">Navegando...</p>
              <p className="text-sm text-gray-500">~3.2 km • 12 min</p>
            </div>
          </div>

          {/* Delivery Progress */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#2ECC71] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Coleta realizada</p>
                  <p className="text-xs text-gray-500">{activeDelivery.restaurant.name}</p>
                  <p className="text-xs text-gray-400">{activeDelivery.restaurant.address}</p>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-gray-200 h-6" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Navigation size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#FF6B35]">A caminho do cliente</p>
                  <p className="text-xs text-gray-500">Tempo estimado: 12 min</p>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-gray-200 h-6" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-400">Entrega</p>
                  <p className="text-xs text-gray-400">{activeDelivery.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <h3 className="font-semibold text-sm mb-3">Dados do Cliente</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{activeDelivery.customer.name}</p>
                <p className="text-sm text-gray-500">{activeDelivery.address}</p>
              </div>
              <button className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-[#2ECC71]" />
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <h3 className="font-semibold text-sm mb-3">Itens do Pedido</h3>
            <div className="space-y-2">
              {activeDelivery.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earning Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-semibold">VOCÊ VAI RECEBER</p>
                <p className="text-2xl font-bold text-green-800">
                  R$ {(activeDelivery.splitDetails?.deliveryFee || 8).toFixed(2)}
                </p>
              </div>
              <div className="text-right text-xs text-green-600">
                <p>Via Asaas Split</p>
                <p>Transferência automática</p>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleCompleteDelivery}
            className="w-full bg-[#2ECC71] text-white font-bold py-4 rounded-xl text-lg hover:bg-[#27AE60] transition-colors shadow-lg"
          >
            ✓ Confirmar Entrega
          </button>
        </div>
      </div>
    );
  }

  // EARNINGS VIEW
  if (view === 'earnings') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setDelView('home')} className="text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-brand font-bold text-lg">Meus Ganhos</h1>
          </div>
        </header>

        <div className="px-4 py-4 max-w-lg mx-auto">
          {/* Earnings Card */}
          <div className="bg-gradient-green rounded-2xl p-6 text-white mb-6">
            <p className="text-sm opacity-80 mb-1">Saldo disponível</p>
            <p className="text-4xl font-bold mb-4">R$ {(todayEarnings + 45.50).toFixed(2)}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs opacity-80">Hoje</p>
                <p className="font-bold">R$ {todayEarnings.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs opacity-80">Esta semana</p>
                <p className="font-bold">R$ {(todayEarnings + 125.80).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Withdraw Button */}
          <button className="w-full btn-green py-3 mb-6 flex items-center justify-center gap-2">
            <Wallet size={18} />
            Sacar para conta Asaas
          </button>

          {/* Transaction History */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold mb-4">Histórico de Entregas</h3>
            <div className="space-y-3">
              {completedDeliveries.length === 0 ? (
                <div className="text-center py-8">
                  <Truck size={40} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Nenhuma entrega concluída ainda</p>
                </div>
              ) : (
                completedDeliveries.map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={18} className="text-[#2ECC71]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">#{order.id.slice(-6)}</p>
                        <p className="text-xs text-gray-500">{order.customer.name}</p>
                      </div>
                    </div>
                    <p className="font-bold text-[#2ECC71]">
                      +R$ {(order.splitDetails?.deliveryFee || 8).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AVAILABLE/HISTORY VIEW
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => setDelView('home')} className="text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-brand font-bold text-lg">Histórico</h1>
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="text-center py-12">
          <Package size={48} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-gray-700 mb-1">Suas entregas</h3>
          <p className="text-gray-500 text-sm mb-6">
            {completedDeliveries.length} entregas realizadas hoje
          </p>
          <button onClick={() => setDelView('home')} className="btn-primary">
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryApp;
