# 🚀 Guia de Uso Rápido - FlashFood

## Início Rápido

### 1. Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd flashfood

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

---

## 📱 Usando os Aplicativos

### Acesso Rápido (Demo)

Na tela de login, clique em um dos botões de acesso rápido:

- **Cliente** → App do cliente completo
- **Restaurante** → Dashboard do restaurante
- **Entregador** → App do entregador

### Fluxo Completo do Cliente

```
1. Landing Page → Clique em "Pedir Agora"
   ↓
2. Login → Escolha "Cliente" ou use acesso demo
   ↓
3. Cardápio → Navegue, busque, adicione ao carrinho
   ↓
4. Carrinho → Revise itens, aplique cupom
   ↓
5. Checkout → Escolha pagamento, veja split Asaas
   ↓
6. Confirmação → Acompanhe o pedido
   ↓
7. Rastreamento → Veja entregador no mapa
   ↓
8. Entrega → Avalie o pedido
```

### Fluxo do Restaurante

```
1. Login → Escolha "Restaurante"
   ↓
2. Dashboard → Veja KPIs e gráficos
   ↓
3. Pedidos → Aceite e gerencie pedidos
   ↓
4. Cardápio → Adicione/edit itens
   ↓
5. Financeiro → Veja splits e ganhos
```

### Fluxo do Entregador

```
1. Login → Escolha "Entregador"
   ↓
2. Home → Fique online para receber pedidos
   ↓
3. Aceitar → Veja pedidos disponíveis
   ↓
4. Coletar → Vá até o restaurante
   ↓
5. Entregar → Navegue até o cliente
   ↓
6. Confirmar → Finalize a entrega
   ↓
7. Ganhos → Veja seus ganhos e saque
```

---

## 🎟️ Cupons Disponíveis

Teste estes cupons no carrinho:

| Código | Desconto | Condição |
|--------|----------|----------|
| `FLASH20` | 20% off | Min. R$ 50 |
| `PRIMEIRACOMPRA` | 15% off | - |
| `FRETEGRATIS` | Frete grátis | Min. R$ 30 |
| `VIP10` | 10% off | - |

---

## 💳 Testando Split Asaas

### No Checkout

1. Adicione itens ao carrinho
2. Vá para checkout
3. Observe a seção "Split Asaas"
4. Veja a divisão automática:
   - Restaurante: 80%
   - Entregador: 10%
   - Plataforma: 10%

### Exemplo

```
Pedido: R$ 100,00
├── Restaurante: R$ 80,00
├── Entregador: R$ 10,00
└── Plataforma: R$ 10,00
```

---

## 🗺️ Rastreamento em Tempo Real

### Visualizando o Mapa

1. Faça um pedido
2. Vá para "Acompanhar Pedido"
3. Veja o mapa animado com:
   - 🏪 Restaurante (laranja)
   - 🛵 Entregador (animado)
   - 📍 Você (verde)
   - 🛣️ Rota (linha laranja)

---

## ⭐ Programa de Fidelidade

### Ganhar Pontos

- Cada R$ 1 gasto = 1 ponto
- Pontos aparecem no perfil
- Troque por descontos futuros

### Verificar Pontos

1. Vá para "Perfil"
2. Veja "Programa de Fidelidade"
3. Total de pontos disponível

---

## ❤️ Favoritos

### Adicionar aos Favoritos

1. No cardápio, clique no ❤️ do item
2. Item fica vermelho quando favoritado
3. Acesse "Favoritos" no menu

### Remover dos Favoritos

1. Clique novamente no ❤️
2. Item volta ao estado normal

---

## 🔔 Notificações

### Tipos de Notificação

- 📦 **Pedido** - Status do pedido atualizado
- 💳 **Pagamento** - Split processado
- 🛵 **Entrega** - Entregador a caminho
- ⚡ **Sistema** - Cupons e promoções

### Ver Notificações

1. Clique no ícone de sino no header
2. Veja todas as notificações
3. Clique para marcar como lida

---

## 📊 Dashboard Restaurante

### KPIs Principais

- **Pedidos** - Total de pedidos hoje
- **Faturamento** - Valor total vendido
- **Ticket Médio** - Média por pedido
- **Pendentes** - Pedidos para processar

### Gráficos

- **Faturamento Semanal** - AreaChart
- **Categorias** - PieChart com distribuição

### Gerenciar Pedidos

1. Vá para "Pedidos"
2. Veja lista de pedidos
3. Clique em "Aceitar" para confirmar
4. Avance status: Preparando → Pronto → Entregue

---

## 💰 Ganhos do Entregador

### Ver Ganhos

1. Vá para "Meus Ganhos"
2. Veja saldo disponível
3. Histórico de entregas
4. Solicite saque via Asaas

### Métricas

- **Hoje** - Ganhos do dia
- **Semana** - Ganhos da semana
- **Total** - Saldo acumulado

---

## 🎨 Personalização

### Modo Escuro (Futuro)

```typescript
// No contexto
toggleTheme(); // Alterna entre light/dark
```

### Idioma (Futuro)

```typescript
// i18n support
setLanguage('pt-BR'); // Português
setLanguage('en-US'); // Inglês
setLanguage('es-ES'); // Espanhol
```

---

## 🐛 Troubleshooting

### Problemas Comuns

**Carrinho não atualiza**
- Recarregue a página
- Limpe o cache do navegador

**Cupom não funciona**
- Verifique se o código está correto
- Confira validade e condições
- Tente outro cupom

**Mapa não carrega**
- Verifique conexão com internet
- Recarregue a página

**Notificações não aparecem**
- Verifique permissões do navegador
- Recarregue a página

---

## 📞 Suporte

### Canais de Atendimento

- 📧 Email: suporte@flashfood.com
- 💬 Chat: Disponível no app
- 📱 WhatsApp: (11) 99999-0000
- 🌐 Site: www.flashfood.com

### Horário de Atendimento

- Segunda a Sexta: 8h às 22h
- Sábado e Domingo: 9h às 20h

---

## 🎓 Dicas Avançadas

### Para Clientes

1. **Use cupons** - Economize em todos os pedidos
2. **Acumule pontos** - Troque por descontos
3. **Favorite itens** - Acesse rapidamente
4. **Avalie pedidos** - Ajude a melhorar o serviço
5. **Endereços salvos** - Agilize o checkout

### Para Restaurantes

1. **Monitore KPIs** - Acompanhe performance
2. **Gerencie cardápio** - Mantenha atualizado
3. **Responda rápido** - Aceite pedidos em até 2min
4. **Analise splits** - Veja ganhos em tempo real
5. **Use gráficos** - Tome decisões baseadas em dados

### Para Entregadores

1. **Fique online** - Receba mais pedidos
2. **Mantenha avaliação** - Atendimento de qualidade
3. **Planeje rotas** - Otimize entregas
4. **Acompanhe ganhos** - Controle financeiro
5. **Saque regularmente** - Mantenha fluxo de caixa

---

## 🚀 Próximos Passos

### Em Desenvolvimento

- [ ] PWA (instalar no celular)
- [ ] Push notifications
- [ ] Chat em tempo real
- [ ] Avaliações com fotos
- [ ] Modo offline
- [ ] Multi-idioma

### Sugestões

Envie suas sugestões para: feedback@flashfood.com

---

<div align="center">

**Aproveite o FlashFood! 🚀**

[Dúvidas?](#) • [Suporte](#) • [Feedback](#)

</div>
