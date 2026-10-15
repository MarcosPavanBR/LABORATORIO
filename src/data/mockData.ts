import { MenuItem, Order, Customer, DeliveryPerson, Restaurant } from '../types';

export const mockRestaurant: Restaurant = {
  id: 'rest-001',
  name: 'FlashFood Kitchen',
  address: 'Rua das Flores, 123 - Centro, São Paulo',
  phone: '(11) 99999-0001',
  rating: 4.8,
  totalReviews: 1247,
  openTime: '10:00',
  closeTime: '23:00',
  categories: ['Hambúrgueres', 'Pizzas', 'Bebidas', 'Sobremesas'],
  deliveryTime: '25-40 min',
  deliveryFee: 7.99,
  minOrder: 20,
};

export const mockMenuItems: MenuItem[] = [
  {
    id: 'item-001', name: 'Flash Burger Classic', description: 'Pão brioche artesanal, blend 180g, queijo cheddar envelhecido, alface americana, tomate e molho especial da casa',
    price: 32.90, emoji: '🍔', category: 'Hambúrgueres', available: true, popular: true, prepTime: 15, rating: 4.9, soldCount: 342
  },
  {
    id: 'item-002', name: 'Flash Burger Bacon', description: 'Pão brioche, blend 180g, bacon crocante defumado, queijo cheddar, cebola caramelizada e maionese trufada',
    price: 38.90, emoji: '🥓', category: 'Hambúrgueres', available: true, popular: true, prepTime: 18, rating: 4.8, soldCount: 287
  },
  {
    id: 'item-003', name: 'Flash Burger Duplo Smash', description: 'Pão smash, 2x blend 150g prensados, queijo americano duplo, picles artesanal e ketchup house',
    price: 44.90, emoji: '🍔', category: 'Hambúrgueres', available: true, prepTime: 12, rating: 4.7, soldCount: 198
  },
  {
    id: 'item-004', name: 'Pizza Margherita DOP', description: 'Molho San Marzano, mussarela de búfala fresca, manjericão e azeite extra virgem importado',
    price: 54.90, emoji: '🍕', category: 'Pizzas', available: true, popular: true, prepTime: 20, rating: 4.9, soldCount: 456
  },
  {
    id: 'item-005', name: 'Pizza Pepperoni Artesanal', description: 'Molho de tomate caseiro, mussarela, pepperoni artesanal importado e orégano fresco',
    price: 59.90, emoji: '🍕', category: 'Pizzas', available: true, prepTime: 22, rating: 4.8, soldCount: 321
  },
  {
    id: 'item-006', name: 'Coca-Cola Original 350ml', description: 'Refrigerante Coca-Cola lata gelada 350ml',
    price: 6.90, emoji: '🥤', category: 'Bebidas', available: true, prepTime: 2, rating: 4.5, soldCount: 890
  },
  {
    id: 'item-007', name: 'Suco Natural de Laranja', description: 'Suco de laranja 100% natural, feito na hora, 500ml sem açúcar',
    price: 14.90, emoji: '🍊', category: 'Bebidas', available: true, prepTime: 5, rating: 4.7, soldCount: 234
  },
  {
    id: 'item-008', name: 'Brownie Belga com Sorvete', description: 'Brownie de chocolate belga 70% cacau com sorvete artesanal de baunilha e calda quente',
    price: 26.90, emoji: '🍫', category: 'Sobremesas', available: true, popular: true, prepTime: 8, rating: 4.9, soldCount: 567
  },
  {
    id: 'item-009', name: 'Açaí Premium 500ml', description: 'Açaí puro do Pará com granola caseira, banana, morango, leite em pó e mel orgânico',
    price: 28.90, emoji: '🫐', category: 'Sobremesas', available: true, prepTime: 6, rating: 4.8, soldCount: 445
  },
  {
    id: 'item-010', name: 'Flash Burger Vegano', description: 'Pão integral, hambúrguer de grão de bico e quinoa, rúcula, tomate seco, guacamole',
    price: 36.90, emoji: '🥬', category: 'Hambúrgueres', available: true, prepTime: 15, rating: 4.6, soldCount: 156
  },
  {
    id: 'item-011', name: 'Água Mineral 500ml', description: 'Água mineral sem gás gelada 500ml',
    price: 4.90, emoji: '💧', category: 'Bebidas', available: true, prepTime: 1, rating: 4.3, soldCount: 670
  },
  {
    id: 'item-012', name: 'Petit Gâteau', description: 'Bolo de chocolate com centro cremoso, sorvete de creme e frutas vermelhas',
    price: 29.90, emoji: '🎂', category: 'Sobremesas', available: true, prepTime: 10, rating: 4.9, soldCount: 389
  },
];

export const mockCustomers: Customer[] = [
  { id: 'cust-001', name: 'Maria Silva', phone: '(11) 98765-4321', email: 'maria@email.com', address: 'Av. Paulista, 1000 - Apto 42, Bela Vista', ordersCount: 23 },
  { id: 'cust-002', name: 'João Santos', phone: '(11) 91234-5678', email: 'joao@email.com', address: 'Rua Augusta, 500 - Consolação', ordersCount: 15 },
  { id: 'cust-003', name: 'Ana Oliveira', phone: '(11) 99876-5432', email: 'ana@email.com', address: 'Rua Oscar Freire, 200 - Jardins', ordersCount: 31 },
  { id: 'cust-004', name: 'Pedro Costa', phone: '(11) 98888-7777', email: 'pedro@email.com', address: 'Al. Santos, 800 - Paraíso', ordersCount: 8 },
];

export const mockDeliveryPersons: DeliveryPerson[] = [
  { id: 'dp-001', name: 'Carlos Mendes', phone: '(11) 97777-1111', vehicle: 'Honda CG 160 Titan', vehiclePlate: 'ABC-1D23', rating: 4.9, totalDeliveries: 1847, available: true, online: true, location: { lat: -23.5505, lng: -46.6333 }, earnings: 2450.80 },
  { id: 'dp-002', name: 'Pedro Alves', phone: '(11) 97777-2222', vehicle: 'Yamaha Fazer 250', vehiclePlate: 'DEF-4G56', rating: 4.7, totalDeliveries: 923, available: true, online: true, location: { lat: -23.5515, lng: -46.6343 }, earnings: 1280.50 },
  { id: 'dp-003', name: 'Lucas Ferreira', phone: '(11) 97777-3333', vehicle: 'Bicicleta Elétrica', vehiclePlate: 'N/A', rating: 4.8, totalDeliveries: 456, available: false, online: false, location: { lat: -23.5495, lng: -46.6323 }, earnings: 680.30 },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-8F3K2',
    items: [{ ...mockMenuItems[0], quantity: 2 }, { ...mockMenuItems[5], quantity: 2 }],
    subtotal: 79.60, deliveryFee: 7.99, total: 87.59,
    status: 'preparing',
    customer: mockCustomers[0],
    restaurant: mockRestaurant,
    address: 'Av. Paulista, 1000 - Apto 42, Bela Vista',
    paymentMethod: 'credit_card',
    splitDetails: { totalAmount: 87.59, restaurantAmount: 70.07, restaurantPercent: 80, deliveryFee: 8.76, deliveryPercent: 10, platformFee: 8.76, platformPercent: 10, status: 'completed', asaasSplitId: 'split_8f3k2a', processedAt: new Date(Date.now() - 14 * 60000) },
    createdAt: new Date(Date.now() - 15 * 60000),
    estimatedDelivery: 35
  },
  {
    id: 'ORD-2M9P7',
    items: [{ ...mockMenuItems[3], quantity: 1 }, { ...mockMenuItems[6], quantity: 1 }],
    subtotal: 69.80, deliveryFee: 7.99, total: 77.79,
    status: 'delivering',
    customer: mockCustomers[1],
    deliveryPerson: mockDeliveryPersons[0],
    restaurant: mockRestaurant,
    address: 'Rua Augusta, 500 - Consolação',
    paymentMethod: 'pix',
    splitDetails: { totalAmount: 77.79, restaurantAmount: 62.23, restaurantPercent: 80, deliveryFee: 7.78, deliveryPercent: 10, platformFee: 7.78, platformPercent: 10, status: 'completed', asaasSplitId: 'split_2m9p7b', processedAt: new Date(Date.now() - 28 * 60000) },
    createdAt: new Date(Date.now() - 30 * 60000),
    estimatedDelivery: 18
  },
  {
    id: 'ORD-5N1Q4',
    items: [{ ...mockMenuItems[7], quantity: 2 }, { ...mockMenuItems[8], quantity: 1 }],
    subtotal: 82.70, deliveryFee: 7.99, total: 90.69,
    status: 'pending',
    customer: mockCustomers[2],
    restaurant: mockRestaurant,
    address: 'Rua Oscar Freire, 200 - Jardins',
    paymentMethod: 'credit_card',
    splitDetails: { totalAmount: 90.69, restaurantAmount: 72.55, restaurantPercent: 80, deliveryFee: 9.07, deliveryPercent: 10, platformFee: 9.07, platformPercent: 10, status: 'pending', asaasSplitId: 'split_5n1q4c' },
    createdAt: new Date(Date.now() - 3 * 60000),
    estimatedDelivery: 40
  },
  {
    id: 'ORD-7R4T8',
    items: [{ ...mockMenuItems[1], quantity: 1 }, { ...mockMenuItems[10], quantity: 1 }, { ...mockMenuItems[11], quantity: 1 }],
    subtotal: 71.70, deliveryFee: 7.99, total: 79.69,
    status: 'delivered',
    customer: mockCustomers[3],
    deliveryPerson: mockDeliveryPersons[1],
    restaurant: mockRestaurant,
    address: 'Al. Santos, 800 - Paraíso',
    paymentMethod: 'debit_card',
    splitDetails: { totalAmount: 79.69, restaurantAmount: 63.75, restaurantPercent: 80, deliveryFee: 7.97, deliveryPercent: 10, platformFee: 7.97, platformPercent: 10, status: 'completed', asaasSplitId: 'split_7r4t8d', processedAt: new Date(Date.now() - 55 * 60000) },
    createdAt: new Date(Date.now() - 60 * 60000),
    estimatedDelivery: 30,
    rating: 5,
    review: 'Excelente! Comida chegou quentinha e muito saborosa.'
  },
];

export const revenueData = [
  { day: 'Seg', value: 1240 },
  { day: 'Ter', value: 980 },
  { day: 'Qua', value: 1560 },
  { day: 'Qui', value: 1320 },
  { day: 'Sex', value: 2100 },
  { day: 'Sáb', value: 2450 },
  { day: 'Dom', value: 1890 },
];

export const categoryData = [
  { name: 'Hambúrgueres', value: 45, color: '#FF6B35' },
  { name: 'Pizzas', value: 28, color: '#6C5CE7' },
  { name: 'Bebidas', value: 15, color: '#3498DB' },
  { name: 'Sobremesas', value: 12, color: '#2ECC71' },
];

export const mockCoupons = [
  { code: 'FLASH20', discount: 20, minOrder: 50, validUntil: new Date('2026-12-31'), active: true, description: '20% de desconto em pedidos acima de R$ 50' },
  { code: 'PRIMEIRACOMPRA', discount: 15, validUntil: new Date('2026-12-31'), active: true, description: '15% de desconto na primeira compra' },
  { code: 'FRETEGRATIS', discount: 100, minOrder: 30, validUntil: new Date('2026-06-30'), active: true, description: 'Frete grátis em pedidos acima de R$ 30' },
  { code: 'VIP10', discount: 10, validUntil: new Date('2026-12-31'), active: true, description: '10% de desconto para clientes VIP' },
];
