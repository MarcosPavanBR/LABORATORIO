export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';
  customer: Customer;
  deliveryPerson?: DeliveryPerson;
  restaurant: Restaurant;
  address: string;
  paymentMethod: string;
  splitDetails?: SplitDetails;
  createdAt: Date;
  estimatedTime?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  available: boolean;
  location?: { lat: number; lng: number };
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  openTime: string;
  closeTime: string;
  categories: string[];
}

export interface SplitDetails {
  totalAmount: number;
  restaurantAmount: number;
  deliveryFee: number;
  platformFee: number;
  asaasSplitId?: string;
  status: 'pending' | 'processed' | 'completed';
}
