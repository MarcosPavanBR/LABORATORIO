import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Zap, Store, Truck, ShoppingBag, Shield, Clock, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setView('client')} className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">
              Pedir Agora
            </button>
            <button onClick={() => setView('restaurant')} className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">
              Sou Restaurante
            </button>
            <button onClick={() => setView('delivery')} className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">
              Sou Entregador
            </button>
          </nav>
          <button
            onClick={() => setView('client')}
            className="btn-primary text-sm px-4 py-2"
          >
            Peça Agora
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-[#FF6B35] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Zap size={16} />
                Entrega em até 30 minutos
              </div>
              <h1 className="font-brand text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Sua comida favorita,{' '}
                <span className="text-[#FF6B35]">na velocidade</span> de um raio ⚡
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Peça, pague e receba. Simples assim. Com split de pagamento automático 
                via Asaas, garantindo que todos recebam sua parte instantaneamente.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setView('client')} className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  <ShoppingBag size={20} />
                  Fazer Pedido
                </button>
                <button onClick={() => setView('restaurant')} className="bg-white border-2 border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all flex items-center gap-2">
                  <Store size={20} />
                  Sou Restaurante
                </button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img 
                src="https://image.qwenlm.ai/generated-images/7c0d985a-56cd-4e9a-8bdf-42d45bc7092f/_result.png" 
                alt="FlashFood Delivery" 
                className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-3xl"
              />
              <div className="bg-gradient-flash rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <div className="text-6xl mb-4">🍔</div>
                  <h3 className="text-2xl font-bold mb-2">Flash Burger Classic</h3>
                  <p className="text-white/80 mb-4">Blend 180g, cheddar, molho especial</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">R$ 32,90</span>
                    <button className="bg-white text-[#FF6B35] font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce-in">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck size={20} className="text-[#2ECC71]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Entrega</p>
                    <p className="font-bold text-sm">25 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-brand text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o <span className="text-[#FF6B35]">FlashFood</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tecnologia de ponta para conectar restaurantes, entregadores e clientes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-[#FF6B35]" />
              </div>
              <h3 className="font-bold text-xl mb-2">Ultra Rápido</h3>
              <p className="text-gray-600">Entregas em até 30 minutos com rastreamento em tempo real</p>
            </div>
            <div className="card-hover bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-[#2ECC71]" />
              </div>
              <h3 className="font-bold text-xl mb-2">Split Asaas</h3>
              <p className="text-gray-600">Pagamento dividido automaticamente entre restaurante, entregador e plataforma</p>
            </div>
            <div className="card-hover bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-[#6C5CE7]" />
              </div>
              <h3 className="font-bold text-xl mb-2">Qualidade</h3>
              <p className="text-gray-600">Restaurantes verificados e entregadores avaliados pela comunidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-brand text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Três aplicativos, uma experiência completa
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div
              onClick={() => setView('client')}
              className="card-hover cursor-pointer bg-white rounded-2xl p-8 border border-gray-100 text-center"
            >
              <div className="text-5xl mb-4">📱</div>
              <h3 className="font-brand font-bold text-xl mb-2">App do Cliente</h3>
              <p className="text-gray-600 text-sm mb-4">Peça comida, acompanhe em tempo real e pague com segurança</p>
              <span className="inline-flex items-center gap-1 text-[#FF6B35] font-semibold text-sm">
                Acessar <ShoppingBag size={14} />
              </span>
            </div>
            <div
              onClick={() => setView('restaurant')}
              className="card-hover cursor-pointer bg-white rounded-2xl p-8 border border-gray-100 text-center"
            >
              <div className="text-5xl mb-4">🏪</div>
              <h3 className="font-brand font-bold text-xl mb-2">App do Restaurante</h3>
              <p className="text-gray-600 text-sm mb-4">Gerencie pedidos, cardápio e receba pagamentos automaticamente</p>
              <span className="inline-flex items-center gap-1 text-[#2ECC71] font-semibold text-sm">
                Acessar <Store size={14} />
              </span>
            </div>
            <div
              onClick={() => setView('delivery')}
              className="card-hover cursor-pointer bg-white rounded-2xl p-8 border border-gray-100 text-center"
            >
              <div className="text-5xl mb-4">🛵</div>
              <h3 className="font-brand font-bold text-xl mb-2">App do Entregador</h3>
              <p className="text-gray-600 text-sm mb-4">Aceite entregas, navegue e receba sua taxa automaticamente</p>
              <span className="inline-flex items-center gap-1 text-[#6C5CE7] font-semibold text-sm">
                Acessar <Truck size={14} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Split Payment Info */}
      <section className="py-16 bg-gradient-dark text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-brand text-3xl md:text-4xl font-bold mb-6">
                Split de Pagamento via <span className="text-[#FF6B35]">Asaas</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Nosso sistema utiliza a tecnologia de split payment do Asaas para dividir 
                automaticamente cada pagamento entre todos os envolvidos na transação.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div>
                    <p className="font-semibold">Restaurante</p>
                    <p className="text-gray-400 text-sm">Recebe 80% do valor do pedido</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2ECC71]/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🛵</span>
                  </div>
                  <div>
                    <p className="font-semibold">Entregador</p>
                    <p className="text-gray-400 text-sm">Recebe a taxa de entrega</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#6C5CE7]/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <p className="font-semibold">Plataforma</p>
                    <p className="text-gray-400 text-sm">Recebe 10% como taxa de serviço</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-[#FF6B35]" />
                <span className="text-sm text-gray-400">Split em tempo real</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Pedido #1234</span>
                    <span className="text-sm text-[#2ECC71]">✓ Processado</span>
                  </div>
                  <p className="text-2xl font-bold">R$ 79,60</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Restaurante</span>
                      <span className="text-white">R$ 63,68</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Entregador</span>
                      <span className="text-white">R$ 8,00</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Plataforma</span>
                      <span className="text-white">R$ 7,92</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" variant="colored" />
          <p className="text-sm text-gray-500">
            © 2026 FlashFood. Todos os direitos reservados. Pagamentos processados por Asaas.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
              <i className="fab fa-twitter text-xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
