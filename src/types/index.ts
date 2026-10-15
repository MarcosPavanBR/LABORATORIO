export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  emoji: string;
  category: string;
  available: boolean;
  popular?: boolean;
  prepTime?: number;
  rating?: number;
  soldCount?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  customer: Customer;
  deliveryPerson?: DeliveryPerson;
  restaurant: Restaurant;
  address: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'cash';
  splitDetails?: SplitDetails;
  createdAt: Date;
  estimatedDelivery?: number;
  rating?: number;
  review?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  avatar?: string;
  ordersCount?: number;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  vehiclePlate: string;
  rating: number;
  totalDeliveries: number;
  available: boolean;
  online: boolean;
  location?: { lat: number; lng: number };
  earnings?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalReviews: number;
  openTime: string;
  closeTime: string;
  categories: string[];
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  banner?: string;
}

export interface SplitDetails {
  totalAmount: number;
  restaurantAmount: number;
  restaurantPercent: number;
  deliveryFee: number;
  deliveryPercent: number;
  platformFee: number;
  platformPercent: number;
  asaasSplitId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: Date;
}

export interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
