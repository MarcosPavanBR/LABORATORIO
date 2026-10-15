import { MenuItem, Order, Customer, DeliveryPerson, Restaurant } from '../types';

export const mockRestaurant: Restaurant = {
  id: 'rest-001',
  name: 'FlashFood Kitchen',
  address: 'Rua das Flores, 123 - Centro',
  phone: '(11) 99999-0001',
  rating: 4.8,
  openTime: '10:00',
  closeTime: '23:00',
  categories: ['Hambúrgueres', 'Pizzas', 'Bebidas', 'Sobremesas']
};

export const mockMenuItems: MenuItem[] = [
  {
    id: 'item-001',
    name: 'Flash Burger Classic',
    description: 'Pão brioche, blend 180g, queijo cheddar, alface, tomate e molho especial',
    price: 32.90,
    image: '🍔',
    category: 'Hambúrgueres',
    available: true
  },
  {
    id: 'item-002',
    name: 'Flash Burger Bacon',
    description: 'Pão brioche, blend 180g, bacon crocante, queijo, cebola caramelizada',
    price: 38.90,
    image: '🍔',
    category: 'Hambúrgueres',
    available: true
  },
  {
    id: 'item-003',
    name: 'Flash Burger Duplo',
    description: 'Pão brioche, 2x blend 150g, queijo duplo, picles e ketchup',
    price: 42.90,
    image: '🍔',
    category: 'Hambúrgueres',
    available: true
  },
  {
    id: 'item-004',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela de búfala, manjericão fresco',
    price: 49.90,
    image: '🍕',
    category: 'Pizzas',
    available: true
  },
  {
    id: 'item-005',
    name: 'Pizza Pepperoni',
    description: 'Molho de tomate, mussarela, pepperoni artesanal',
    price: 54.90,
    image: '🍕',
    category: 'Pizzas',
    available: true
  },
  {
    id: 'item-006',
    name: 'Coca-Cola 350ml',
    description: 'Refrigerante Coca-Cola lata gelada',
    price: 6.90,
    image: '🥤',
    category: 'Bebidas',
    available: true
  },
  {
    id: 'item-007',
    name: 'Suco Natural Laranja',
    description: 'Suco de laranja 100% natural 500ml',
    price: 12.90,
    image: '🧃',
    category: 'Bebidas',
    available: true
  },
  {
    id: 'item-008',
    name: 'Brownie com Sorvete',
    description: 'Brownie de chocolate com sorvete de baunilha e calda quente',
    price: 22.90,
    image: '🍫',
    category: 'Sobremesas',
    available: true
  },
  {
    id: 'item-009',
    name: 'Açaí 500ml',
    description: 'Açaí cremoso com granola, banana e leite condensado',
    price: 24.90,
    image: '🫐',
    category: 'Sobremesas',
    available: true
  },
  {
    id: 'item-010',
    name: 'Flash Burger Vegano',
    description: 'Pão integral, hambúrguer de grão de bico, rúcula, tomate seco',
    price: 34.90,
    image: '🥬',
    category: 'Hambúrgueres',
    available: true
  }
];

export const mockCustomers: Customer[] = [
  { id: 'cust-001', name: 'Maria Silva', phone: '(11) 98765-4321', email: 'maria@email.com', address: 'Av. Paulista, 1000 - Apto 42' },
  { id: 'cust-002', name: 'João Santos', phone: '(11) 91234-5678', email: 'joao@email.com', address: 'Rua Augusta, 500' },
  { id: 'cust-003', name: 'Ana Oliveira', phone: '(11) 99876-5432', email: 'ana@email.com', address: 'Rua Oscar Freire, 200' },
];

export const mockDeliveryPersons: DeliveryPerson[] = [
  { id: 'dp-001', name: 'Carlos Mendes', phone: '(11) 97777-1111', vehicle: 'Moto Honda CG 160', rating: 4.9, available: true, location: { lat: -23.5505, lng: -46.6333 } },
  { id: 'dp-002', name: 'Pedro Alves', phone: '(11) 97777-2222', vehicle: 'Moto Yamaha Fazer 250', rating: 4.7, available: true, location: { lat: -23.5515, lng: -46.6343 } },
  { id: 'dp-003', name: 'Lucas Ferreira', phone: '(11) 97777-3333', vehicle: 'Bicicleta Elétrica', rating: 4.8, available: false, location: { lat: -23.5495, lng: -46.6323 } },
];

export const mockOrders: Order[] = [
  {
    id: 'order-001',
    items: [{ ...mockMenuItems[0], quantity: 2 }, { ...mockMenuItems[5], quantity: 2 }],
    total: 79.60,
    status: 'preparing',
    customer: mockCustomers[0],
    restaurant: mockRestaurant,
    address: 'Av. Paulista, 1000 - Apto 42',
    paymentMethod: 'credit_card',
    splitDetails: {
      totalAmount: 79.60,
      restaurantAmount: 63.68,
      deliveryFee: 8.00,
      platformFee: 7.92,
      status: 'processed'
    },
    createdAt: new Date(Date.now() - 15 * 60000),
    estimatedTime: 35
  },
  {
    id: 'order-002',
    items: [{ ...mockMenuItems[3], quantity: 1 }, { ...mockMenuItems[6], quantity: 1 }],
    total: 62.80,
    status: 'delivering',
    customer: mockCustomers[1],
    deliveryPerson: mockDeliveryPersons[0],
    restaurant: mockRestaurant,
    address: 'Rua Augusta, 500',
    paymentMethod: 'pix',
    splitDetails: {
      totalAmount: 62.80,
      restaurantAmount: 50.24,
      deliveryFee: 6.28,
      platformFee: 6.28,
      status: 'processed'
    },
    createdAt: new Date(Date.now() - 30 * 60000),
    estimatedTime: 20
  },
  {
    id: 'order-003',
    items: [{ ...mockMenuItems[7], quantity: 2 }, { ...mockMenuItems[8], quantity: 1 }],
    total: 70.70,
    status: 'pending',
    customer: mockCustomers[2],
    restaurant: mockRestaurant,
    address: 'Rua Oscar Freire, 200',
    paymentMethod: 'credit_card',
    splitDetails: {
      totalAmount: 70.70,
      restaurantAmount: 56.56,
      deliveryFee: 7.07,
      platformFee: 7.07,
      status: 'pending'
    },
    createdAt: new Date(Date.now() - 5 * 60000),
    estimatedTime: 40
  }
];
