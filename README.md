# 🚀 FlashFood - Sistema de Delivery Completo

<div align="center">

![FlashFood](https://img.shields.io/badge/FlashFood-Delivery%20System-FF6B35?style=for-the-badge&logo=lightning)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite)

**Sistema profissional de delivery com split de pagamento via Asaas**

[Demo](#) • [Documentação](#) • [Suporte](#)

</div>

---

## 📋 Visão Geral

FlashFood é um sistema completo de delivery que conecta **clientes**, **restaurantes** e **entregadores** em uma plataforma unificada com tecnologia de ponta e split de pagamento automático via Asaas.

### ✨ Features Principais

- 🎯 **3 Aplicativos Web Completos** (Cliente, Restaurante, Entregador)
- 💳 **Split de Pagamento Asaas** (80% restaurante, 10% entregador, 10% plataforma)
- 🗺️ **Rastreamento em Tempo Real** com mapa animado
- 🎨 **Design System Profissional** com componentes reutilizáveis
- 🌙 **Modo Escuro** suportado
- 🎁 **Sistema de Cupons** e descontos
- ⭐ **Programa de Fidelidade** com pontos
- ❤️ **Favoritos** e histórico completo
- 🔔 **Notificações em Tempo Real**
- 📊 **Dashboards com Gráficos** (Recharts)
- 🎭 **Animações Profissionais** (Framer Motion)
- 📱 **100% Responsivo** e mobile-first

---

## 🏗️ Arquitetura

```
flashfood/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Design system (Button, Card, Badge, etc)
│   │   ├── Logo.tsx        # Logo SVG profissional
│   │   ├── Toast.tsx       # Sistema de notificações
│   │   ├── Modal.tsx       # Modais profissionais
│   │   └── TrackingMap.tsx # Mapa de rastreamento animado
│   ├── context/            # Estado global
│   │   └── AppContext.tsx  # Context API com todas as features
│   ├── data/               # Dados mock
│   │   └── mockData.ts     # Restaurantes, pedidos, cupons, etc
│   ├── pages/              # Páginas principais
│   │   ├── LandingPage.tsx # Landing page profissional
│   │   ├── LoginPage.tsx   # Login/Cadastro com seleção de papel
│   │   ├── ClientApp.tsx   # App do cliente completo
│   │   ├── RestaurantApp.tsx # App do restaurante com dashboards
│   │   └── DeliveryApp.tsx # App do entregador
│   ├── services/           # Serviços
│   │   └── asaasService.ts # Integração com Asaas (split payment)
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Interfaces completas
│   ├── App.tsx             # Componente raiz
│   ├── main.tsx            # Entry point
│   └── index.css           # Design system global
└── public/                 # Assets públicos
```

---

## 🎨 Design System

### Cores da Marca

```css
--flash-orange: #FF6B35      /* Cor principal */
--flash-green: #2ECC71       /* Sucesso/Entregador */
--flash-purple: #6C5CE7      /* Plataforma */
--flash-dark: #0F0F1A        /* Texto principal */
```

### Tipografia

- **Display**: Poppins (títulos)
- **Body**: Inter (textos)

### Componentes UI

- `Button` - 6 variantes (primary, secondary, outline, ghost, success, danger)
- `Card` - Cards com hover effects
- `Badge` - Status badges com dots animados
- `Avatar` - Avatares com status online
- `StatCard` - Cards de estatísticas
- `Modal` - Modais profissionais
- `Toast` - Notificações toast

---

## 💳 Split de Pagamento Asaas

### Como Funciona

Cada pagamento é automaticamente dividido:

```
Pedido: R$ 100,00
├── Restaurante (80%): R$ 80,00
├── Entregador (10%): R$ 10,00
└── Plataforma (10%): R$ 10,00
```

### Integração

```typescript
// services/asaasService.ts
const splitDetails = calculateSplit(totalAmount);
const result = await processPaymentWithSplit(total, paymentMethod, customerName);
```

### Webhooks (Simulados)

- `payment.confirmed` - Pagamento confirmado
- `split.completed` - Split processado
- `transfer.completed` - Transferência realizada

---

## 📱 Aplicativos

### 1. App do Cliente

**Features:**
- 🍔 Cardápio completo com busca e filtros
- 🔥 Itens populares em destaque
- ❤️ Sistema de favoritos
- 🛒 Carrinho inteligente
- 🎟️ Aplicação de cupons
- 💳 Checkout com múltiplas formas de pagamento
- 📊 Visualização do split Asaas
- 🗺️ Rastreamento em tempo real com mapa animado
- 📋 Histórico de pedidos
- ⭐ Programa de fidelidade
- 👤 Perfil completo

### 2. App do Restaurante

**Features:**
- 📊 Dashboard com KPIs (pedidos, faturamento, ticket médio)
- 📈 Gráficos de faturamento semanal (AreaChart)
- 🥧 Gráfico de categorias (PieChart)
- 📦 Gestão completa de pedidos
- 👨‍🍳 Fluxo de status (pendente → confirmado → preparando → pronto → entregue)
- 💰 Dashboard financeiro com splits
- 📋 Gestão de cardápio
- 🔔 Notificações de novos pedidos
- ⚡ Visualização de splits Asaas por pedido

### 3. App do Entregador

**Features:**
- 🟢 Status online/offline
- 📍 Mapa de rastreamento
- 📦 Pedidos disponíveis para aceitar
- 🗺️ Navegação até o cliente
- 💰 Ganhos em tempo real
- 📊 Histórico de entregas
- 💳 Saque via Asaas
- 📱 Contato com cliente (telefone/chat)
- ⭐ Avaliação do entregador

---

## 🚀 Como Executar

### Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Requisitos

- Node.js 18+
- npm 9+

---

## 🎯 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.2 | Framework UI |
| TypeScript | 5.7 | Type safety |
| Vite | 6.3 | Build tool |
| Tailwind CSS | 4.1 | Styling |
| Framer Motion | 11.16 | Animações |
| Recharts | 2.10 | Gráficos |
| Lucide React | 0.294 | Ícones |
| Canvas Confetti | 1.9 | Efeitos visuais |

---

## 📊 Dados Mock

O sistema inclui dados mock completos para demonstração:

- **Restaurante**: FlashFood Kitchen (4.8★, 1247 avaliações)
- **Cardápio**: 12 itens (hambúrgueres, pizzas, bebidas, sobremesas)
- **Pedidos**: 4 pedidos com diferentes status
- **Clientes**: 4 clientes mock
- **Entregadores**: 3 entregadores com veículos e avaliações
- **Cupons**: 4 cupons ativos (FLASH20, PRIMEIRACOMPRA, etc)

---

## 🔐 Segurança

- ✅ Validação de tipos com TypeScript
- ✅ Sanitização de inputs
- ✅ Tokens de autenticação (simulados)
- ✅ HTTPS ready
- ✅ CORS configurado

---

## 🌐 Integração com Asaas (Produção)

Para integrar com Asaas real:

```typescript
// 1. Configure suas credenciais
const ASAAS_CONFIG = {
  baseUrl: 'https://api.asaas.com/v3',
  apiKey: 'YOUR_API_KEY',
};

// 2. Crie as wallets
// 3. Configure webhooks
// 4. Implemente o split payment
```

**Documentação Asaas**: https://docs.asaas.com/reference

---

## 📈 Próximas Features

- [ ] PWA (Progressive Web App)
- [ ] Push notifications
- [ ] Chat em tempo real (WebSocket)
- [ ] Integração com mapas reais (Google Maps/Mapbox)
- [ ] Sistema de avaliações com fotos
- [ ] Modo offline
- [ ] Multi-idioma (i18n)
- [ ] Analytics avançado
- [ ] A/B testing
- [ ] Integração com gateways adicionais (Stripe, PayPal)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores

- **FlashFood Team** - _Initial work_ - [FlashFood](#)

---

## 🙏 Agradecimentos

- [Asaas](https://www.asaas.com/) - Split de pagamento
- [React](https://reactjs.org/) - Framework UI
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animações
- [Lucide](https://lucide.dev/) - Ícones

---

<div align="center">

**Feito com ❤️ pela equipe FlashFood**

[⭐ Star este repo](#) • [🐛 Reportar bug](#) • [💡 Sugerir feature](#)

</div>
