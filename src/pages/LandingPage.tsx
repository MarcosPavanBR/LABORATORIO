import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui';
import { Zap, Store, Truck, ShoppingBag, Shield, Clock, Star, ArrowRight, ChevronRight, Smartphone, CreditCard, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setView } = useApp();

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-flash-gray-600 hover:text-flash-orange transition-colors">Recursos</a>
            <a href="#apps" className="text-sm font-medium text-flash-gray-600 hover:text-flash-orange transition-colors">Aplicativos</a>
            <a href="#split" className="text-sm font-medium text-flash-gray-600 hover:text-flash-orange transition-colors">Split Asaas</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView('login')}>Entrar</Button>
            <Button variant="primary" size="sm" onClick={() => setView('client')}>
              Pedir Agora <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-flash-orange/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-flash-purple/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-flash-orange/[0.02] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div variants={container} initial="hidden" animate="show" className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 bg-flash-orange-50 text-flash-orange px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-flash-orange/10">
                <Zap size={14} fill="currentColor" />
                <span>Entrega em até 30 minutos</span>
              </div>
              <h1 className="font-display text-5xl lg:text-7xl font-extrabold text-flash-gray-900 leading-[1.1] mb-6">
                Comida boa,{' '}
                <span className="gradient-text">na velocidade</span>{' '}
                de um raio
              </h1>
              <p className="text-lg text-flash-gray-500 mb-8 leading-relaxed max-w-lg">
                Peça, pague e receba. Com split de pagamento automático via Asaas, 
                garantindo que todos recebam sua parte de forma justa e instantânea.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="xl" onClick={() => setView('client')}>
                  <ShoppingBag size={20} /> Fazer Pedido
                </Button>
                <Button variant="outline" size="xl" onClick={() => setView('restaurant')}>
                  <Store size={20} /> Sou Restaurante
                </Button>
              </div>
              
              {/* Social proof */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-flash-gray-200">
                <div>
                  <p className="text-2xl font-bold text-flash-gray-900">50k+</p>
                  <p className="text-xs text-flash-gray-500">Pedidos/mês</p>
                </div>
                <div className="w-px h-10 bg-flash-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-flash-gray-900">4.9</p>
                  <p className="text-xs text-flash-gray-500 flex items-center gap-1">
                    <Star size={10} fill="#F39C12" className="text-flash-yellow" /> Avaliação
                  </p>
                </div>
                <div className="w-px h-10 bg-flash-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-flash-gray-900">2min</p>
                  <p className="text-xs text-flash-gray-500">Split Asaas</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div variants={item} className="relative">
              <div className="relative">
                {/* Main card */}
                <div className="bg-gradient-to-br from-flash-orange to-flash-orange-light rounded-3xl p-8 text-white shadow-2xl shadow-flash-orange/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">MAIS PEDIDO</span>
                      <span className="text-xs opacity-80">⭐ 4.9</span>
                    </div>
                    <div className="text-7xl mb-4 animate-float">🍔</div>
                    <h3 className="font-display text-2xl font-bold mb-1">Flash Burger Classic</h3>
                    <p className="text-white/70 text-sm mb-6">Blend 180g, cheddar, molho especial</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold">R$ 32,90</span>
                      </div>
                      <button className="bg-white text-flash-orange font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-all shadow-lg">
                        Adicionar +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-flash-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <Truck size={18} className="text-flash-green" />
                    </div>
                    <div>
                      <p className="text-[10px] text-flash-gray-500 uppercase tracking-wide">Entrega</p>
                      <p className="font-bold text-sm text-flash-gray-900">25 min</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-flash-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <CreditCard size={18} className="text-flash-purple" />
                    </div>
                    <div>
                      <p className="text-[10px] text-flash-gray-500 uppercase tracking-wide">Split Asaas</p>
                      <p className="font-bold text-sm text-flash-green">✓ Processado</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-flash-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-flash-orange font-semibold text-sm uppercase tracking-wider">Por que FlashFood?</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-flash-gray-900 mt-3 mb-4">
              Tecnologia que conecta <span className="gradient-text">todos</span>
            </h2>
            <p className="text-flash-gray-500 text-lg max-w-2xl mx-auto">
              Uma plataforma completa que garante rapidez, segurança e transparência para clientes, restaurantes e entregadores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap size={24} />, title: 'Ultra Rápido', desc: 'Entregas em até 30 minutos com rastreamento em tempo real via GPS', color: 'flash-orange', bg: 'flash-orange-50' },
              { icon: <Shield size={24} />, title: 'Split Asaas', desc: 'Pagamento dividido automaticamente entre restaurante, entregador e plataforma', color: 'flash-green', bg: 'green-50' },
              { icon: <Star size={24} />, title: 'Qualidade Premium', desc: 'Restaurantes verificados e entregadores avaliados pela comunidade', color: 'flash-purple', bg: 'purple-50' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-8 hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-${feature.bg} rounded-2xl flex items-center justify-center mb-5 text-${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-flash-gray-900 mb-2">{feature.title}</h3>
                <p className="text-flash-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section id="apps" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-flash-orange font-semibold text-sm uppercase tracking-wider">Ecossistema Completo</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-flash-gray-900 mt-3 mb-4">
              Três apps, uma experiência
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '📱', title: 'App do Cliente', desc: 'Peça comida, acompanhe em tempo real e pague com segurança via PIX, cartão ou split', color: 'flash-orange', action: () => setView('client'), btnText: 'Pedir Agora' },
              { emoji: '🏪', title: 'App do Restaurante', desc: 'Gerencie pedidos, cardápio, financeiro com splits automáticos e relatórios completos', color: 'flash-green', action: () => setView('restaurant'), btnText: 'Gerenciar' },
              { emoji: '🛵', title: 'App do Entregador', desc: 'Aceite entregas, navegue com GPS e receba sua taxa instantaneamente via Asaas', color: 'flash-purple', action: () => setView('delivery'), btnText: 'Entregar' },
            ].map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-8 text-center group cursor-pointer hover:-translate-y-2 transition-all duration-300"
                onClick={app.action}
              >
                <div className="text-6xl mb-5 group-hover:scale-110 transition-transform">{app.emoji}</div>
                <h3 className="font-display font-bold text-xl text-flash-gray-900 mb-2">{app.title}</h3>
                <p className="text-flash-gray-500 text-sm mb-6 leading-relaxed">{app.desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-${app.color} font-semibold text-sm group-hover:gap-3 transition-all`}>
                  {app.btnText} <ChevronRight size={16} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Payment Section */}
      <section id="split" className="py-24 bg-flash-gray-900 text-white relative overflow-hidden noise-bg">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-flash-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-flash-purple/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-flash-orange font-semibold text-sm uppercase tracking-wider">Pagamento Inteligente</span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold mt-3 mb-6">
                Split de Pagamento via <span className="gradient-text">Asaas</span>
              </h2>
              <p className="text-flash-gray-400 text-lg mb-8 leading-relaxed">
                Cada pagamento é dividido automaticamente entre todos os envolvidos na transação. 
                Sem atrasos, sem burocracia, sem preocupação.
              </p>
              
              <div className="space-y-5">
                {[
                  { emoji: '🏪', label: 'Restaurante', percent: '80%', desc: 'Recebe a maior parte do valor', color: 'flash-orange' },
                  { emoji: '🛵', label: 'Entregador', percent: '10%', desc: 'Taxa de entrega justa', color: 'flash-green' },
                  { emoji: '⚡', label: 'Plataforma', percent: '10%', desc: 'Taxa de serviço e manutenção', color: 'flash-purple' },
                ].map((split, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className={`w-12 h-12 bg-${split.color}/20 rounded-xl flex items-center justify-center text-xl`}>
                      {split.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{split.label}</p>
                      <p className="text-sm text-flash-gray-400">{split.desc}</p>
                    </div>
                    <span className={`text-xl font-bold text-${split.color}`}>{split.percent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Split visualization */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-flash-green rounded-full animate-pulse" />
                <span className="text-sm text-flash-gray-400">Split em tempo real</span>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-5 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-flash-gray-400">Pedido #ORD-8F3K2</span>
                  <span className="text-xs text-flash-green font-semibold bg-flash-green/10 px-2 py-0.5 rounded-full">✓ Processado</span>
                </div>
                <p className="text-3xl font-bold font-display">R$ 87,59</p>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-flash-gray-400">Restaurante (80%)</span>
                      <span className="text-white font-semibold">R$ 70,07</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-flash-orange h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-flash-gray-400">Entregador (10%)</span>
                      <span className="text-white font-semibold">R$ 8,76</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-flash-green h-2 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-flash-gray-400">Plataforma (10%)</span>
                      <span className="text-white font-semibold">R$ 8,76</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-flash-purple h-2 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-flash-gray-400">
                <Clock size={12} />
                <span>Processado em 1.8s via API Asaas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-flash-gray-900 mb-6">
            Pronto para começar?
          </h2>
          <p className="text-flash-gray-500 text-lg mb-10 max-w-xl mx-auto">
            Junte-se a milhares de clientes, restaurantes e entregadores que já usam o FlashFood.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="xl" onClick={() => setView('client')}>
              <ShoppingBag size={20} /> Fazer meu primeiro pedido
            </Button>
            <Button variant="outline" size="xl" onClick={() => setView('login')}>
              <Users size={20} /> Criar conta grátis
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-flash-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <Logo size="md" variant="white" />
              <p className="text-flash-gray-400 text-sm mt-4 leading-relaxed">
                O delivery mais rápido do Brasil. Tecnologia de ponta para conectar todos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-flash-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Para restaurantes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Para entregadores</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Split Asaas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-flash-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-3">
                {['instagram', 'facebook', 'twitter', 'youtube'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-flash-orange/20 transition-colors">
                    <i className={`fab fa-${social} text-sm text-flash-gray-400`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-flash-gray-500">© 2026 FlashFood. Todos os direitos reservados. Pagamentos via Asaas.</p>
            <div className="flex items-center gap-2 text-xs text-flash-gray-500">
              <Shield size={12} />
              <span>Ambiente seguro com criptografia SSL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
