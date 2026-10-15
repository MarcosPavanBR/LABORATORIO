import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { mockOrders, mockMenuItems, mockRestaurant } from '../data/mockData';
import { Order } from '../types';
import {
  ArrowLeft, Bell, Clock, CheckCircle, ChefHat, Package,
  DollarSign, TrendingUp, Users, ShoppingBag, Settings,
  BarChart3, AlertCircle, MapPin
} from 'lucide-react';

type RestaurantView = 'dashboard' | 'orders' | 'menu' | 'finance';

const RestaurantApp: React.FC = () => {
  const { setView, orders, updateOrderStatus } = useApp();
  const [view, setRestView] = useState<RestaurantView>('dashboard');
  const [allOrders, setAllOrders] = useState<Order[]>([...mockOrders, ...orders]);

  const stats = {
    totalOrders: allOrders.length,
    revenue: allOrders.reduce((sum, o) => sum + o.total, 0),
    avgTicket: allOrders.length > 0 ? allOrders.reduce((sum, o) => sum + o.total, 0) / allOrders.length : 0,
    pendingOrders: allOrders.filter(o => o.status === 'pending' || o.status === 'preparing').length,
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: { label: 'Pendente', class: 'badge-pending' },
      confirmed: { label: 'Confirmado', class: 'badge-preparing' },
      preparing: { label: 'Preparando', class: 'badge-preparing' },
      ready: { label: 'Pronto', class: 'badge-delivery' },
      delivering: { label: 'Em entrega', class: 'badge-delivery' },
      delivered: { label: 'Entregue', class: 'badge-done' },
    };
    const badge = badges[status];
    return <span className={`${badge.class} px-2 py-1 rounded-full text-xs font-semibold`}>{badge.label}</span>;
  };

  const getNextStatus = (current: Order['status']): Order['status'] | null => {
    const flow: Record<string, Order['status']> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivering',
      delivering: 'delivered',
    };
    return flow[current] || null;
  };

  // DASHBOARD
  if (view === 'dashboard') {
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
            <div className="flex items-center gap-3">
              <button className="relative">
                <Bell size={20} className="text-gray-600" />
                {stats.pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
              <button onClick={() => setRestView('menu')}>
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-4 max-w-4xl mx-auto">
          {/* Welcome */}
          <div className="mb-6">
            <h1 className="font-brand font-bold text-2xl text-gray-900">
              Olá, {mockRestaurant.name} 👋
            </h1>
            <p className="text-gray-500 text-sm">Aqui está o resumo do seu dia</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <ShoppingBag size={18} className="text-[#FF6B35]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-xs text-gray-500">Pedidos hoje</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <DollarSign size={18} className="text-[#2ECC71]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">R$ {stats.revenue.toFixed(0)}</p>
              <p className="text-xs text-gray-500">Faturamento</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <TrendingUp size={18} className="text-[#6C5CE7]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">R$ {stats.avgTicket.toFixed(0)}</p>
              <p className="text-xs text-gray-500">Ticket médio</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                <Clock size={18} className="text-[#F39C12]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-500">Pendentes</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Pedidos Recentes</h2>
              <button onClick={() => setRestView('orders')} className="text-[#FF6B35] text-sm font-semibold">
                Ver todos
              </button>
            </div>
            <div className="space-y-3">
              {allOrders.slice(0, 3).map(order => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">#{order.id.slice(-6)}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin size={10} /> {order.address}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-[#FF6B35]">R$ {order.total.toFixed(2)}</span>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status)!)}
                        className="bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#E55A2B]"
                      >
                        {order.status === 'pending' ? 'Aceitar' : 'Avançar'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRestView('orders')}
              className="bg-white rounded-xl p-4 shadow-sm text-left card-hover"
            >
              <Package size={24} className="text-[#FF6B35] mb-2" />
              <p className="font-semibold text-sm">Gerenciar Pedidos</p>
              <p className="text-xs text-gray-500">{stats.pendingOrders} pendentes</p>
            </button>
            <button
              onClick={() => setRestView('finance')}
              className="bg-white rounded-xl p-4 shadow-sm text-left card-hover"
            >
              <BarChart3 size={24} className="text-[#2ECC71] mb-2" />
              <p className="font-semibold text-sm">Financeiro</p>
              <p className="text-xs text-gray-500">Ver splits Asaas</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ORDERS VIEW
  if (view === 'orders') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setRestView('dashboard')} className="text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-brand font-bold text-lg">Pedidos</h1>
          </div>
        </header>

        <div className="px-4 py-4 max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['Todos', 'Pendentes', 'Preparando', 'Em entrega', 'Finalizados'].map(tab => (
              <button key={tab} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 whitespace-nowrap hover:border-[#FF6B35]">
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {allOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">#{order.id.slice(-6)}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="font-semibold text-sm">{order.customer.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {order.address}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#FF6B35]">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>

                {order.splitDetails && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-purple-700 mb-1">💰 SPLIT ASAAS</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-purple-600">Restaurante</p>
                        <p className="font-bold">R$ {order.splitDetails.restaurantAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Entregador</p>
                        <p className="font-bold">R$ {order.splitDetails.deliveryFee.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Plataforma</p>
                        <p className="font-bold">R$ {order.splitDetails.platformFee.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {getNextStatus(order.status) && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status)!)}
                    className="w-full btn-primary text-sm py-2"
                  >
                    {order.status === 'pending' ? '✓ Aceitar Pedido' : 
                     order.status === 'preparing' ? '✓ Marcar como Pronto' :
                     order.status === 'ready' ? '✓ Enviar para Entrega' :
                     '✓ Finalizar'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // MENU MANAGEMENT VIEW
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setRestView('dashboard')} className="text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-brand font-bold text-lg">Cardápio</h1>
          </div>
        </header>

        <div className="px-4 py-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{mockMenuItems.length} itens cadastrados</p>
            <button className="btn-primary text-sm px-4 py-2">+ Novo Item</button>
          </div>

          <div className="space-y-3">
            {mockMenuItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className="text-3xl w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.category}</p>
                  <p className="font-bold text-[#FF6B35] text-sm mt-1">R$ {item.price.toFixed(2)}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setRestView('dashboard')} className="text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-brand font-bold text-lg">Financeiro</h1>
          </div>
        </header>

        <div className="px-4 py-4 max-w-4xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-flash rounded-xl p-4 text-white">
              <DollarSign size={20} className="mb-2 opacity-80" />
              <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
              <p className="text-xs opacity-80">Total vendido</p>
            </div>
            <div className="bg-gradient-green rounded-xl p-4 text-white">
              <TrendingUp size={20} className="mb-2 opacity-80" />
              <p className="text-2xl font-bold">R$ {totalRestaurantShare.toFixed(2)}</p>
              <p className="text-xs opacity-80">Seu recebível</p>
            </div>
          </div>

          {/* Split Summary */}
          <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="text-lg">⚡</span> Distribuição via Asaas Split
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Restaurante (80%)</span>
                  <span className="font-bold">R$ {totalRestaurantShare.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#FF6B35] h-3 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Entregador (10%)</span>
                  <span className="font-bold">R$ {totalDeliveryFee.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#2ECC71] h-3 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Plataforma (10%)</span>
                  <span className="font-bold">R$ {totalPlatformFee.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#6C5CE7] h-3 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4">Últimas Transações</h3>
            <div className="space-y-3">
              {allOrders.filter(o => o.splitDetails).map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-sm">#{order.id.slice(-6)}</p>
                    <p className="text-xs text-gray-500">{order.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#2ECC71]">
                      +R$ {(order.splitDetails?.restaurantAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.splitDetails?.status === 'completed' ? '✓ Transferido' : 'Processando'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RestaurantApp;
