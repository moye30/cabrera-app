// Types para el sistema de mobiliaria

export interface Product {
  id: string
  name: string
  category: string
  totalStock: number
  availableStock: number
  rentedStock: number
  unitPrice: number           
  acquisitionCost: number
  lossCost: number
  image?: string
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  discountPercentage: number;
  totalOrders: number;
  createdAt: string;
}

export interface RentalItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Rental {
  id: string;
  customerId: string;
  customerName: string;
  items: RentalItem[];
  rentalDate: string;
  returnDate: string;
  eventDate: string;
  status: 'pending' | 'active' | 'returned' | 'overdue';
  subtotal: number;
  discount: number;
  total: number;
  deposit: number;
  notes: string;
  archived?: boolean;
}

export interface LossItem {
  productId: string;
  productName: string;
  quantity: number;
  lossType: 'broken' | 'lost';
  unitPrice: number;
  totalLoss: number;
}

export interface Loss {
  id: string;
  rentalId: string;
  customerName: string;
  items: LossItem[];
  reportDate: string;
  totalLoss: number;
  notes: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeRentals: number;
  totalCustomers: number;
  inventoryValue: number;
  availabilityRate: number;
  monthlyRevenue: number;
  totalLosses: number;
}
