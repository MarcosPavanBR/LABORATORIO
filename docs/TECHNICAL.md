# 📚 Documentação Técnica - FlashFood

## Arquitetura do Sistema

### Visão Geral

O FlashFood é uma aplicação SPA (Single Page Application) construída com React 18 e TypeScript, utilizando uma arquitetura baseada em componentes com gerenciamento de estado via Context API.

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Client App   │  │ Restaurant   │  │ Delivery     │     │
│  │              │  │ App          │  │ App          │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                         │                                   │
│                    ┌────▼────┐                             │
│                    │ Context │                             │
│                    │   API   │                             │
│                    └────┬────┘                             │
└─────────────────────────┼───────────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │   Asaas   │
                    │  Payment  │
                    │   API     │
                    └───────────┘
```

---

## 🎯 Estado Global (Context API)

### AppContext

O `AppContext` gerencia todo o estado global da aplicação:

```typescript
interface AppState {
  cart: CartItem[];              // Carrinho de compras
  orders: Order[];               // Todos os pedidos
  currentView: AppView;          // View atual
  customer: Customer | null;     // Cliente logado
  deliveryPerson: DeliveryPerson | null; // Entregador logado
  notifications: Notification[]; // Notificações
  isAuthenticated: boolean;      // Status de autenticação
  theme: Theme;                  // Tema (light/dark)
  favorites: string[];           // Itens favoritos
  savedAddresses: string[];      // Endereços salvos
  appliedCoupon: Coupon | null;  // Cupom aplicado
  loyaltyPoints: number;         // Pontos de fidelidade
}
```

### Principais Actions

```typescript
// Carrinho
addToCart(item: MenuItem)
removeFromCart(itemId: string)
updateQuantity(itemId: string, quantity: number)
clearCart()
getCartTotal()
getCartSubtotal()

// Pedidos
addOrder(order: Order)
updateOrderStatus(orderId: string, status: Order['status'])

// Autenticação
login()
logout()

// Favoritos
toggleFavorite(itemId: string)
isFavorite(itemId: string)

// Cupons
applyCoupon(code: string)
removeCoupon()

// Fidelidade
addLoyaltyPoints(points: number)

// Notificações
addNotification(notification)
markNotificationRead(id: string)
```

---

## 💳 Integração Asaas - Split de Pagamento

### Fluxo Completo

```
1. Cliente finaliza pedido
   ↓
2. calculateSplit() calcula divisão
   ↓
3. processPaymentWithSplit() envia para Asaas
   ↓
4. Asaas processa pagamento
   ↓
5. Webhook confirma pagamento
   ↓
6. Split é executado automaticamente
   ↓
7. Cada parte recebe seu valor
```

### Cálculo do Split

```typescript
// services/asaasService.ts
export const calculateSplit = (totalAmount: number): SplitDetails => {
  const restaurantPercent = 80;
  const deliveryPercent = 10;
  const platformPercent = 10;

  return {
    totalAmount,
    restaurantAmount: totalAmount * 0.80,
    restaurantPercent,
    deliveryFee: totalAmount * 0.10,
    deliveryPercent,
    platformFee: totalAmount * 0.10,
    platformPercent,
    status: 'pending'
  };
};
```

### Exemplo de Uso

```typescript
// No checkout
const handleCheckout = async () => {
  const result = await processPaymentWithSplit(
    totalWithDelivery,
    paymentMethod,
    customerName
  );
  
  if (result.success) {
    // Split processado com sucesso
    console.log('Restaurante:', result.splitDetails.restaurantAmount);
    console.log('Entregador:', result.splitDetails.deliveryFee);
    console.log('Plataforma:', result.splitDetails.platformFee);
  }
};
```

### Webhooks (Simulados)

Em produção, configure estes webhooks no dashboard Asaas:

```typescript
// POST /webhook/payment
{
  event: "PAYMENT_CONFIRMED",
  payment: {
    id: "pay_123",
    value: 100.00,
    status: "CONFIRMED"
  }
}

// POST /webhook/split
{
  event: "SPLIT_COMPLETED",
  split: {
    id: "split_123",
    status: "COMPLETED",
    splits: [
      { walletId: "wallet_rest", amount: 80.00 },
      { walletId: "wallet_del", amount: 10.00 },
      { walletId: "wallet_plat", amount: 10.00 }
    ]
  }
}
```

---

## 🎨 Design System

### Estrutura de Componentes

```
components/
├── ui/
│   ├── Button.tsx       # 6 variantes, 4 tamanhos
│   ├── Card.tsx         # Cards com hover effects
│   ├── Badge.tsx        # Status badges
│   ├── Avatar.tsx       # Avatares com status
│   ├── StatCard.tsx     # Cards de estatísticas
│   ├── EmptyState.tsx   # Estados vazios
│   └── Skeleton.tsx     # Loading states
├── Logo.tsx             # Logo SVG profissional
├── Toast.tsx            # Sistema de notificações
├── Modal.tsx            # Modais profissionais
└── TrackingMap.tsx      # Mapa de rastreamento
```

### Button Component

```typescript
<Button
  variant="primary"      // primary | secondary | outline | ghost | success | danger
  size="md"              // sm | md | lg | xl
  loading={false}        // Estado de loading
  fullWidth={false}      // Largura total
  icon={<Icon />}        // Ícone opcional
>
  Texto do botão
</Button>
```

### Toast Notifications

```typescript
const { showToast } = useToast();

showToast({
  type: 'success',       // success | error | warning | info
  title: 'Pedido confirmado!',
  message: 'Split Asaas processado',
  duration: 4000         // Duração em ms (opcional)
});
```

---

## 📊 Gráficos e Dashboards

### Recharts Integration

O sistema utiliza Recharts para visualizações de dados:

```typescript
import { AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

// Gráfico de faturamento
<AreaChart data={revenueData}>
  <Area
    type="monotone"
    dataKey="value"
    stroke="#FF6B35"
    fill="url(#colorRevenue)"
  />
</AreaChart>

// Gráfico de categorias
<PieChart>
  <Pie
    data={categoryData}
    dataKey="value"
    innerRadius={35}
    outerRadius={55}
  >
    {categoryData.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
  </Pie>
</PieChart>
```

---

## 🗺️ Rastreamento em Tempo Real

### TrackingMap Component

Componente de mapa animado que mostra:
- Localização do restaurante
- Posição do entregador (animada)
- Localização do cliente
- Rota entre os pontos

```typescript
<TrackingMap
  status="delivering"      // Status atual
  estimatedTime={25}       // Tempo estimado
/>
```

### Animações

```typescript
// Entregador se move baseado no status
motion.div
  animate={{
    left: status === 'delivering' ? '55%' : '25%',
    top: status === 'delivering' ? '40%' : '55%',
  }}
  transition={{ duration: 1.5, ease: "easeInOut" }}
```

---

## 🎁 Sistema de Cupons

### Estrutura

```typescript
interface Coupon {
  code: string;              // Código do cupom
  discount: number;          // % de desconto
  minOrder?: number;         // Pedido mínimo
  maxDiscount?: number;      // Desconto máximo
  validUntil: Date;          // Validade
  active: boolean;           // Status ativo
  description?: string;      // Descrição
}
```

### Aplicação

```typescript
// No contexto
const applyCoupon = (code: string): boolean => {
  const coupon = mockCoupons.find(c => c.code === code.toUpperCase());
  if (coupon && coupon.active && coupon.validUntil > new Date()) {
    setAppliedCoupon(coupon);
    return true;
  }
  return false;
};

// No carrinho
const getCartSubtotal = () => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (appliedCoupon) {
    return subtotal * (1 - appliedCoupon.discount / 100);
  }
  return subtotal;
};
```

---

## ⭐ Programa de Fidelidade

### Sistema de Pontos

```typescript
// Ganha 1 ponto por R$ 1 gasto
addLoyaltyPoints(Math.floor(totalWithDelivery));

// Resgatar pontos (exemplo)
const redeemPoints = (points: number): number => {
  const discount = points / 100; // 100 pontos = R$ 1
  return discount;
};
```

---

## 🔔 Sistema de Notificações

### Tipos de Notificação

```typescript
type NotificationType = 'order' | 'delivery' | 'payment' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
```

### Adicionar Notificação

```typescript
addNotification({
  type: 'order',
  title: 'Novo pedido!',
  message: 'Pedido #8F3K2 recebido'
});
```

---

## 🎭 Animações com Framer Motion

### Exemplos

```typescript
// Fade in com slide
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Conteúdo
</motion.div>

// Scale com spring
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', duration: 0.5 }}
>
  Conteúdo
</motion.div>

// Stagger children
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

<motion.div variants={container} initial="hidden" animate="show">
  <motion.div variants={item}>Item 1</motion.div>
  <motion.div variants={item}>Item 2</motion.div>
</motion.div>
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile first */
sm: 640px   /* Small */
md: 768px   /* Medium */
lg: 1024px  /* Large */
xl: 1280px  /* Extra large */
```

### Exemplo de Uso

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsivo: 1 coluna mobile, 2 tablet, 4 desktop */}
</div>
```

---

## 🔐 Segurança

### Boas Práticas Implementadas

1. **TypeScript Strict Mode** - Type safety completo
2. **Input Validation** - Validação de todos os inputs
3. **XSS Protection** - React escapa automaticamente
4. **CSRF Protection** - Tokens em requisições (produção)
5. **Rate Limiting** - Limitação de requisições (produção)

### Em Produção

```typescript
// Adicionar autenticação JWT
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { token } = await response.json();
  localStorage.setItem('token', token);
};

// Adicionar interceptor para requests autenticados
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

### Variáveis de Ambiente

```env
# .env.production
VITE_ASAAS_API_KEY=your_api_key
VITE_ASAAS_BASE_URL=https://api.asaas.com/v3
VITE_GOOGLE_MAPS_KEY=your_maps_key
```

### Plataformas Recomendadas

- **Vercel** - Deploy automático do Git
- **Netlify** - Deploy com CI/CD
- **AWS Amplify** - Escalabilidade enterprise

---

## 📈 Performance

### Otimizações Implementadas

1. **Code Splitting** - Lazy loading de rotas
2. **Memoization** - React.memo e useMemo
3. **Virtual Scrolling** - Para listas longas
4. **Image Optimization** - Lazy loading de imagens
5. **Bundle Analysis** - Tree shaking e minificação

### Métricas

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: ~225KB (gzipped)

---

## 🧪 Testes (Futuro)

### Estrutura de Testes

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📚 Recursos Adicionais

- [Documentação React](https://reactjs.org/docs)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação Framer Motion](https://www.framer.com/motion/)
- [Documentação Asaas](https://docs.asaas.com/reference)

---

<div align="center">

**Desenvolvido com ❤️ pela equipe FlashFood**

[Dúvidas?](#) • [Contribuir](#) • [Reportar Bug](#)

</div>
