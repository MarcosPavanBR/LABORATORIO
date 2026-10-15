import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui';
import { ArrowLeft, Mail, Lock, User, Store, Truck, ShoppingBag } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { setView, login } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'client' | 'restaurant' | 'delivery'>('client');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    login();
    setView(selectedRole);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-flash-gray-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <button onClick={() => setView('landing')} className="flex items-center gap-2 text-flash-gray-500 hover:text-flash-gray-900 mb-8 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Voltar</span>
          </button>

          <Logo size="md" className="mb-8" />

          <h1 className="font-display text-3xl font-bold text-flash-gray-900 mb-2">
            {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </h1>
          <p className="text-flash-gray-500 mb-8">
            {isRegister ? 'Preencha os dados para começar' : 'Entre com suas credenciais'}
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'client' as const, icon: <ShoppingBag size={16} />, label: 'Cliente' },
              { id: 'restaurant' as const, icon: <Store size={16} />, label: 'Restaurante' },
              { id: 'delivery' as const, icon: <Truck size={16} />, label: 'Entregador' },
            ].map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                  selectedRole === role.id
                    ? 'border-flash-orange bg-flash-orange-50 text-flash-orange'
                    : 'border-flash-gray-200 text-flash-gray-500 hover:border-flash-gray-300'
                }`}
              >
                {role.icon}
                <span className="text-xs font-semibold">{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-flash-gray-700 mb-1.5 block">Nome completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-flash-gray-400" />
                  <input type="text" placeholder="Seu nome" className="input-field pl-11" />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-flash-gray-700 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-flash-gray-400" />
                <input type="email" placeholder="seu@email.com" className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-flash-gray-700 mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-flash-gray-400" />
                <input type="password" placeholder="••••••••" className="input-field pl-11" />
              </div>
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-flash-gray-300 text-flash-orange focus:ring-flash-orange" />
                  <span className="text-sm text-flash-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-sm text-flash-orange font-medium hover:underline">Esqueci a senha</a>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              {isRegister ? 'Criar conta' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-flash-gray-500">
              {isRegister ? 'Já tem conta? ' : 'Não tem conta? '}
            </span>
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-flash-orange font-semibold hover:underline">
              {isRegister ? 'Fazer login' : 'Criar conta grátis'}
            </button>
          </div>

          {/* Demo access */}
          <div className="mt-8 p-4 bg-flash-orange-50 rounded-xl border border-flash-orange/10">
            <p className="text-xs text-flash-orange font-semibold mb-2">⚡ Acesso Demo Rápido</p>
            <p className="text-xs text-flash-gray-500 mb-3">Clique em um dos papéis para acessar diretamente:</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { login(); setView('client'); }}>Cliente</Button>
              <Button variant="outline" size="sm" onClick={() => { login(); setView('restaurant'); }}>Restaurante</Button>
              <Button variant="outline" size="sm" onClick={() => { login(); setView('delivery'); }}>Entregador</Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-flash-gray-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-flash-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-flash-purple/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="text-8xl mb-8 animate-float">⚡</div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            O delivery do <span className="gradient-text">futuro</span>
          </h2>
          <p className="text-flash-gray-400 leading-relaxed">
            Tecnologia de split payment via Asaas que garante que todos recebam sua parte de forma justa, rápida e transparente.
          </p>
          <div className="flex items-center justify-center gap-6 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50k+</p>
              <p className="text-xs text-flash-gray-400">Pedidos/mês</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">2k+</p>
              <p className="text-xs text-flash-gray-400">Restaurantes</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">5k+</p>
              <p className="text-xs text-flash-gray-400">Entregadores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
