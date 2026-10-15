import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Button, Card, Badge, Avatar, StatCard } from '../components/ui';
import { mockOrders, mockDeliveryPersons } from '../data/mockData';
import { Order } from '../types';
import {
  ArrowLeft, MapPin, Navigation, Phone, Star, Clock,
  DollarSign, Package, CheckCircle, Truck, Wallet,
  TrendingUp, Power, Route, MessageCircle, ChevronRight
} from 'lucide-react';

type DeliveryView = 'home' | 'active' | 'earnings' | 'history';

const DeliveryApp: React.FC = () => {
  const { setView, orders } = useApp();
  const [view, setDelView] = useState<DeliveryView>('home');
  const [isOnline, setIsOnline] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);
  const [completedDeliveries, setCompletedDeliveries] = useState<Order[]>([]);

  const dp = mockDeliveryPersons[0];
  const availableOrders = orders.filter(o => o.status === 'ready');
  const todayEarnings = completedDeliveries.reduce((sum, o) => sum + (o.splitDetails?.deliveryFee || 8), 0);

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
      <div className="min-h-screen bg-flash-gray-50 pb-6">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('landing')} className="text-flash-gray-400"><ArrowLeft size={20} /></button>
              <Logo size="sm" />
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isOnline ? 'bg-green-50 text-flash-green border border-green-200' : 'bg-flash-gray-100 text-flash-gray-500 border border-flash-gray-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-flash-green animate-pulse' : 'bg-flash-gray-400'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </motion.button>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Profile Card */}
          <Card className="mb-4">
            <div className="flex items-center gap-4">
              <Avatar name={dp.name} size="lg" online={isOnline} />
              <div className="flex-1">
                <h2 className="font-display font-bold text-lg">{dp.name}</h2>
                <div className="flex items-center gap-3 text-xs text-flash-gray-500 mt-0.5">
                  <span className="flex items-center gap-1"><Star size={11} fill="#F39C12" className="text-flash-yellow" /> {dp.rating}</span>
                  <span>•</span>
                  <span>{dp.totalDeliveries} entregas</span>
                  <span>•</span>
                  <span>{dp.vehicle}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Online Status */}
          <AnimatePresence mode="wait">
            {isOnline ? (
              <motion.div key="online" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3"
              >
                <div className="w-3 h-3 bg-flash-green rounded-full animate-pulse" />
                <div>
                  <p className="font-semibold text-flash-green text-sm">Você está online</p>
                  <p className="text-xs text-green-600">Recebendo pedidos na sua região</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="offline" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-flash-gray-100 border border-flash-gray-200 rounded-xl p-4 mb-4 flex items-center gap-3"
              >
                <div className="w-3 h-3 bg-flash-gray-400 rounded-full" />
                <div>
                  <p className="font-semibold text-flash-gray-700 text-sm">Você está offline</p>
                  <p className="text-xs text-flash-gray-500">Fique online para receber pedidos</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Today Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard icon={<DollarSign size={16} />} label="Ganhos" value={`R$ ${(todayEarnings + 85.50).toFixed(0)}`} color="green" />
            <StatCard icon={<Package size={16} />} label="Entregas" value={`${completedDeliveries.length + 6}`} color="orange" />
            <StatCard icon={<Clock size={16} />} label="Online" value="4.2h" color="purple" />
          </div>

          {/* Available Orders */}
          {isOnline && availableOrders.length > 0 && (
            <div className="mb-6">
              <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-flash-orange rounded-full animate-pulse" />
                Pedidos Disponíveis
              </h3>
              <div className="space-y-3">
                {availableOrders.map(order => (
                  <motion.div key={order.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="border-flash-orange/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm">#{order.id}</span>
                        <span className="text-flash-green font-bold text-lg">
                          R$ {(order.splitDetails?.deliveryFee || 8).toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-flash-gray-600">
                          <div className="w-6 h-6 bg-flash-orange-50 rounded-lg flex items-center justify-center">
                            <Package size={12} className="text-flash-orange" />
                          </div>
                          <span className="truncate">{order.restaurant.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-flash-gray-600">
                          <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                            <MapPin size={12} className="text-flash-blue" />
                          </div>
                          <span className="truncate">{order.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-flash-gray-600">
                          <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Route size={12} className="text-flash-purple" />
                          </div>
                          <span>~3.2 km • ~12 min</span>
                        </div>
                      </div>
                      <Button variant="success" fullWidth onClick={() => handleAcceptDelivery(order)}>
                        Aceitar Entrega
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setDelView('earnings')} className="card p-4 text-left hover:-translate-y-1 transition-all">
              <Wallet size={22} className="text-flash-green mb-2" />
              <p className="font-semibold text-sm">Meus Ganhos</p>
              <p className="text-xs text-flash-gray-500">Ver saldo e sacar</p>
            </button>
            <button onClick={() => setDelView('history')} className="card p-4 text-left hover:-translate-y-1 transition-all">
              <TrendingUp size={22} className="text-flash-purple mb-2" />
              <p className="font-semibold text-sm">Histórico</p>
              <p className="text-xs text-flash-gray-500">{completedDeliveries.length + 6} entregas</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE DELIVERY VIEW
  if (view === 'active' && activeDelivery) {
    return (
      <div className="min-h-screen bg-flash-gray-50">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setDelView('home')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Entrega Ativa</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Map */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl h-48 flex items-center justify-center mb-4 relative overflow-hidden border border-blue-100">
            <div className="absolute inset-0 opacity-20">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%` }} />
              ))}
            </div>
            <div className="text-center z-10">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Navigation size={32} className="text-flash-orange mx-auto mb-2" />
              </motion.div>
              <p className="font-semibold text-flash-gray-700 text-sm">Navegando para o cliente</p>
              <p className="text-xs text-flash-gray-500">~3.2 km • 12 min</p>
            </div>
          </div>

          {/* Progress */}
          <Card className="mb-4">
            <div className="space-y-4">
              {[
                { label: 'Pedido coletado', sublabel: activeDelivery.restaurant.name, done: true },
                { label: 'A caminho do cliente', sublabel: 'Tempo estimado: 12 min', done: true, active: true },
                { label: 'Entrega concluída', sublabel: activeDelivery.address, done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.active ? 'bg-flash-orange text-white animate-pulse' : step.done ? 'bg-flash-green text-white' : 'bg-flash-gray-100 text-flash-gray-400'
                  }`}>
                    {step.done || step.active ? <CheckCircle size={16} /> : <MapPin size={16} />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${step.done || step.active ? 'text-flash-gray-900' : 'text-flash-gray-400'}`}>{step.label}</p>
                    <p className="text-xs text-flash-gray-500">{step.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer */}
          <Card className="mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={activeDelivery.customer.name} size="md" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{activeDelivery.customer.name}</p>
                <p className="text-xs text-flash-gray-500 truncate">{activeDelivery.address}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center"><Phone size={14} className="text-flash-green" /></button>
                <button className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center"><MessageCircle size={14} className="text-flash-blue" /></button>
              </div>
            </div>
          </Card>

          {/* Earnings */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-flash-green uppercase tracking-wider">VOCÊ VAI RECEBER</p>
                <p className="text-3xl font-bold font-display text-flash-green-dark">
                  R$ {(activeDelivery.splitDetails?.deliveryFee || 8).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-medium">Via Asaas Split</p>
                <p className="text-[10px] text-green-500">Transferência automática</p>
              </div>
            </div>
          </div>

          <Button variant="success" size="xl" fullWidth onClick={handleCompleteDelivery}>
            <CheckCircle size={18} /> Confirmar Entrega
          </Button>
        </div>
      </div>
    );
  }

  // EARNINGS VIEW
  if (view === 'earnings') {
    const totalBalance = todayEarnings + 85.50;
    return (
      <div className="min-h-screen bg-flash-gray-50">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setDelView('home')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Meus Ganhos</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="bg-gradient-to-br from-flash-green to-flash-green-dark rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-sm opacity-80 mb-1">Saldo disponível</p>
            <p className="text-4xl font-bold font-display mb-1">R$ {totalBalance.toFixed(2)}</p>
            <p className="text-xs opacity-70">Na sua conta Asaas</p>
            <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/20">
              <div><p className="text-xs opacity-80">Hoje</p><p className="font-bold">R$ {(todayEarnings + 85.50).toFixed(2)}</p></div>
              <div><p className="text-xs opacity-80">Semana</p><p className="font-bold">R$ {(totalBalance + 125.80).toFixed(2)}</p></div>
            </div>
          </div>

          <Button variant="success" fullWidth size="lg" className="mb-6">
            <Wallet size={18} /> Sacar para conta bancária
          </Button>

          <Card>
            <h3 className="font-semibold mb-4">Últimas entregas</h3>
            <div className="space-y-3">
              {[...completedDeliveries, ...mockOrders.filter(o => o.status === 'delivered')].slice(0, 5).map((order, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-flash-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                      <CheckCircle size={16} className="text-flash-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">#{order.id}</p>
                      <p className="text-xs text-flash-gray-500">{order.customer.name}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-flash-green">+R$ {(order.splitDetails?.deliveryFee || 8).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // HISTORY VIEW
  if (view === 'history') {
    return (
      <div className="min-h-screen bg-flash-gray-50">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setDelView('home')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Histórico</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card p-3 text-center">
              <p className="text-xl font-bold text-flash-gray-900">{completedDeliveries.length + 6}</p>
              <p className="text-[10px] text-flash-gray-500">Total</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-xl font-bold text-flash-green">4.9</p>
              <p className="text-[10px] text-flash-gray-500">Avaliação</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-xl font-bold text-flash-orange">98%</p>
              <p className="text-[10px] text-flash-gray-500">No prazo</p>
            </div>
          </div>

          <Card>
            <h3 className="font-semibold mb-4">Todas as entregas</h3>
            <div className="space-y-3">
              {[...completedDeliveries, ...mockOrders.filter(o => o.status === 'delivered')].map((order, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-flash-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                      <Truck size={16} className="text-flash-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">#{order.id}</p>
                      <p className="text-xs text-flash-gray-500">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-flash-green">+R$ {(order.splitDetails?.deliveryFee || 8).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default DeliveryApp;
