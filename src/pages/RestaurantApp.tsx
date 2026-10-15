import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Button, Card, Badge, Avatar, StatCard } from '../components/ui';
import { mockOrders, mockMenuItems, mockRestaurant, revenueData, categoryData } from '../data/mockData';
import { Order } from '../types';
import {
  ArrowLeft, Bell, Clock, CheckCircle, Package, DollarSign,
  TrendingUp, ShoppingBag, Settings, BarChart3, MapPin,
  ChefHat, Plus, Star, Users, Receipt, PieChart as PieChartIcon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type RestView = 'dashboard' | 'orders' | 'menu' | 'finance';

const RestaurantApp: React.FC = () => {
  const { setView, orders, updateOrderStatus } = useApp();
  const [view, setRestView] = useState<RestView>('dashboard');
  const allOrders = orders;

  const stats = {
    totalOrders: allOrders.length,
    revenue: allOrders.reduce((sum, o) => sum + o.total, 0),
    avgTicket: allOrders.length > 0 ? allOrders.reduce((sum, o) => sum + o.total, 0) / allOrders.length : 0,
    pendingOrders: allOrders.filter(o => o.status === 'pending' || o.status === 'preparing').length,
    restaurantEarnings: allOrders.reduce((sum, o) => sum + (o.splitDetails?.restaurantAmount || 0), 0),
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const getStatusConfig = (status: Order['status']) => {
    const configs: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'purple' }> = {
      pending: { label: 'Novo', variant: 'warning' },
      confirmed: { label: 'Confirmado', variant: 'info' },
      preparing: { label: 'Preparando', variant: 'info' },
      ready: { label: 'Pronto', variant: 'success' },
      delivering: { label: 'Em entrega', variant: 'purple' },
      delivered: { label: 'Entregue', variant: 'success' },
      cancelled: { label: 'Cancelado', variant: 'danger' },
    };
    return configs[status] || configs.pending;
  };

  const getNextAction = (status: Order['status']): { label: string; nextStatus: Order['status'] } | null => {
    const flow: Record<string, { label: string; nextStatus: Order['status'] }> = {
      pending: { label: '✓ Aceitar', nextStatus: 'confirmed' },
      confirmed: { label: '👨‍🍳 Preparar', nextStatus: 'preparing' },
      preparing: { label: '✓ Pronto', nextStatus: 'ready' },
      ready: { label: '🛵 Enviar', nextStatus: 'delivering' },
      delivering: { label: '✓ Entregue', nextStatus: 'delivered' },
    };
    return flow[status] || null;
  };

  // DASHBOARD
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-flash-gray-50">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('landing')} className="text-flash-gray-400"><ArrowLeft size={20} /></button>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <button className="relative w-9 h-9 bg-flash-gray-50 rounded-xl flex items-center justify-center">
                <Bell size={16} className="text-flash-gray-600" />
                {stats.pendingOrders > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-flash-red text-white text-[9px] rounded-full flex items-center justify-center font-bold">{stats.pendingOrders}</span>}
              </button>
              <button onClick={() => setRestView('menu')} className="w-9 h-9 bg-flash-gray-50 rounded-xl flex items-center justify-center">
                <Settings size={16} className="text-flash-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-5">
          {/* Welcome */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-flash-gray-900">Bom dia, {mockRestaurant.name} 👋</h1>
            <p className="text-flash-gray-500 text-sm">Aqui está o resumo do seu restaurante hoje</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard icon={<ShoppingBag size={18} />} label="Pedidos" value={stats.totalOrders.toString()} change="12% vs ontem" changeType="up" color="orange" />
            <StatCard icon={<DollarSign size={18} />} label="Faturamento" value={`R$ ${stats.revenue.toFixed(0)}`} change="8% vs ontem" changeType="up" color="green" />
            <StatCard icon={<TrendingUp size={18} />} label="Ticket Médio" value={`R$ ${stats.avgTicket.toFixed(0)}`} color="purple" />
            <StatCard icon={<Clock size={18} />} label="Pendentes" value={stats.pendingOrders.toString()} color="blue" />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Faturamento Semanal</h3>
                <Badge variant="success">+18%</Badge>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7B7B9D' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B7B9D' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#FF6B35" strokeWidth={2.5} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-sm mb-4">Categorias</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-flash-gray-600">{cat.name}</span>
                    </div>
                    <span className="font-semibold">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg">Pedidos Recentes</h2>
              <button onClick={() => setRestView('orders')} className="text-flash-orange text-sm font-semibold">Ver todos →</button>
            </div>
            <div className="space-y-3">
              {allOrders.slice(0, 3).map(order => {
                const statusConfig = getStatusConfig(order.status);
                const action = getNextAction(order.status);
                return (
                  <Card key={order.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">#{order.id}</span>
                        <Badge variant={statusConfig.variant} dot>{statusConfig.label}</Badge>
                      </div>
                      <span className="text-xs text-flash-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-flash-gray-600 mb-1">{order.customer.name}</p>
                    <p className="text-xs text-flash-gray-400 flex items-center gap-1 mb-3">
                      <MapPin size={10} /> {order.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-flash-orange">R$ {order.total.toFixed(2)}</span>
                      {action && (
                        <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(order.id, action.nextStatus)}>
                          {action.label}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setRestView('orders')} className="card p-4 text-left hover:-translate-y-1 transition-all">
              <Package size={22} className="text-flash-orange mb-2" />
              <p className="font-semibold text-sm">Gerenciar Pedidos</p>
              <p className="text-xs text-flash-gray-500">{stats.pendingOrders} pendentes</p>
            </button>
            <button onClick={() => setRestView('finance')} className="card p-4 text-left hover:-translate-y-1 transition-all">
              <BarChart3 size={22} className="text-flash-green mb-2" />
              <p className="font-semibold text-sm">Financeiro & Splits</p>
              <p className="text-xs text-flash-gray-500">R$ {stats.restaurantEarnings.toFixed(0)} recebido</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ORDERS VIEW
  if (view === 'orders') {
    return (
      <div className="min-h-screen bg-flash-gray-50">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setRestView('dashboard')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Pedidos</h1>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {['Todos', 'Novos', 'Preparando', 'Em entrega', 'Finalizados'].map(tab => (
              <button key={tab} className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-flash-gray-200 whitespace-nowrap hover:border-flash-orange transition-colors">
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {allOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const action = getNextAction(order.status);
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">#{order.id}</span>
                        <Badge variant={statusConfig.variant} dot>{statusConfig.label}</Badge>
                      </div>
                      <span className="text-xs text-flash-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="font-semibold text-sm">{order.customer.name}</p>
                      <p className="text-xs text-flash-gray-500 flex items-center gap-1"><MapPin size={10} /> {order.address}</p>
                    </div>

                    <div className="bg-flash-gray-50 rounded-xl p-3 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-0.5">
                          <span className="text-flash-gray-600">{item.quantity}x {item.name}</span>
                          <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t border-flash-gray-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                        <span>Total</span>
                        <span className="text-flash-orange">R$ {order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.splitDetails && (
                      <div className="bg-purple-50 rounded-xl p-3 mb-3 border border-purple-100">
                        <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-2">⚡ Split Asaas</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div><p className="text-purple-500">Restaurante</p><p className="font-bold text-purple-900">R$ {order.splitDetails.restaurantAmount.toFixed(2)}</p></div>
                          <div><p className="text-purple-500">Entregador</p><p className="font-bold text-purple-900">R$ {order.splitDetails.deliveryFee.toFixed(2)}</p></div>
                          <div><p className="text-purple-500">Plataforma</p><p className="font-bold text-purple-900">R$ {order.splitDetails.platformFee.toFixed(2)}</p></div>
                        </div>
                      </div>
                    )}

                    {action && (
                      <Button variant="primary" fullWidth onClick={() => handleUpdateStatus(order.id, action.nextStatus)}>
                        {action.label}
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // MENU VIEW
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-flash-gray-50">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setRestView('dashboard')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Cardápio</h1>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-flash-gray-500">{mockMenuItems.length} itens cadastrados</p>
            <Button variant="primary" size="sm"><Plus size={14} /> Novo Item</Button>
          </div>

          <div className="space-y-2">
            {mockMenuItems.map(item => (
              <Card key={item.id} hover className="flex items-center gap-4">
                <div className="text-3xl w-12 h-12 bg-flash-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    {item.popular && <span className="text-[9px] font-bold bg-flash-orange-50 text-flash-orange px-1.5 py-0.5 rounded-full">POPULAR</span>}
                  </div>
                  <p className="text-xs text-flash-gray-500">{item.category} • {item.soldCount} vendidos</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-flash-orange">R$ {item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={10} fill="#F39C12" className="text-flash-yellow" />
                    <span className="text-xs text-flash-gray-500">{item.rating}</span>
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${item.available ? 'bg-flash-green' : 'bg-flash-red'}`} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // FINANCE VIEW
  if (view === 'finance') {
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const totalRestaurantShare = allOrders.reduce((sum, o) => sum + (o.splitDetails?.restaurantAmount || 0), 0);
    const totalPlatformFee = allOrders.reduce((sum, o) => sum + (o.splitDetails?.platformFee || 0), 0);
    const totalDeliveryFee = allOrders.reduce((sum, o) => sum + (o.splitDetails?.deliveryFee || 0), 0);

    return (
      <div className="min-h-screen bg-flash-gray-50">
        <header className="bg-white sticky top-0 z-30 border-b border-flash-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setRestView('dashboard')} className="text-flash-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="font-display font-bold text-lg">Financeiro</h1>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-flash-orange to-flash-orange-light rounded-2xl p-5 text-white">
              <DollarSign size={20} className="mb-2 opacity-80" />
              <p className="text-2xl font-bold font-display">R$ {totalRevenue.toFixed(2)}</p>
              <p className="text-xs opacity-80">Total vendido</p>
            </div>
            <div className="bg-gradient-to-br from-flash-green to-flash-green-dark rounded-2xl p-5 text-white">
              <TrendingUp size={20} className="mb-2 opacity-80" />
              <p className="text-2xl font-bold font-display">R$ {totalRestaurantShare.toFixed(2)}</p>
              <p className="text-xs opacity-80">Seu recebível</p>
            </div>
          </div>

          {/* Split Distribution */}
          <Card className="mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span>⚡</span> Distribuição via Asaas Split
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Restaurante (80%)', value: totalRestaurantShare, color: 'bg-flash-orange', percent: 80 },
                { label: 'Entregador (10%)', value: totalDeliveryFee, color: 'bg-flash-green', percent: 10 },
                { label: 'Plataforma (10%)', value: totalPlatformFee, color: 'bg-flash-purple', percent: 10 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-flash-gray-600">{item.label}</span>
                    <span className="font-bold">R$ {item.value.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-flash-gray-100 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`${item.color} h-2.5 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Transactions */}
          <Card>
            <h3 className="font-semibold mb-4">Últimas Transações</h3>
            <div className="space-y-3">
              {allOrders.filter(o => o.splitDetails).map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-flash-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                      <Receipt size={16} className="text-flash-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">#{order.id}</p>
                      <p className="text-xs text-flash-gray-500">{order.customer.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-flash-green">+R$ {(order.splitDetails?.restaurantAmount || 0).toFixed(2)}</p>
                    <p className="text-[10px] text-flash-gray-400">
                      {order.splitDetails?.status === 'completed' ? '✓ Transferido' : 'Processando'}
                    </p>
                  </div>
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

export default RestaurantApp;
