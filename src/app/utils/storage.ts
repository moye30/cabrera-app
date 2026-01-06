// Utilidades para localStorage
import { Product, Customer, Rental, Loss } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'mobiliaria_products',
  CUSTOMERS: 'mobiliaria_customers',
  RENTALS: 'mobiliaria_rentals',
  LOSSES: 'mobiliaria_losses',
};

// Products
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : getInitialProducts();
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

// Customers
export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  return data ? JSON.parse(data) : getInitialCustomers();
};

export const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
};

// Rentals
export const getRentals = (): Rental[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RENTALS);
  return data ? JSON.parse(data) : [];
};

export const saveRentals = (rentals: Rental[]): void => {
  localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
};

// Losses
export const getLosses = (): Loss[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LOSSES);
  return data ? JSON.parse(data) : [];
};

export const saveLosses = (losses: Loss[]): void => {
  localStorage.setItem(STORAGE_KEYS.LOSSES, JSON.stringify(losses));
};

// Initial data
const getInitialProducts = (): Product[] => [
  {
    id: '1',
    name: 'Mesa Rectangular 1.80m',
    category: 'Mesas',
    totalStock: 50,
    availableStock: 50,
    rentedStock: 0,
    unitPrice: 150,
  },
  {
    id: '2',
    name: 'Silla Tiffany Blanca',
    category: 'Sillas',
    totalStock: 200,
    availableStock: 200,
    rentedStock: 0,
    unitPrice: 35,
  },
  {
    id: '3',
    name: 'Mantel Blanco 1.80m',
    category: 'Manteles',
    totalStock: 100,
    availableStock: 100,
    rentedStock: 0,
    unitPrice: 80,
  },
  {
    id: '4',
    name: 'Plato Plano Porcelana',
    category: 'Vajilla',
    totalStock: 500,
    availableStock: 500,
    rentedStock: 0,
    unitPrice: 15,
  },
  {
    id: '5',
    name: 'Copa de Vino',
    category: 'Cristalería',
    totalStock: 400,
    availableStock: 400,
    rentedStock: 0,
    unitPrice: 12,
  },
  {
    id: '6',
    name: 'Cubiertos Set 3 pzs',
    category: 'Cubiertos',
    totalStock: 500,
    availableStock: 500,
    rentedStock: 0,
    unitPrice: 10,
  },
  {
    id: '7',
    name: 'Tablón 2.40m',
    category: 'Tablones',
    totalStock: 30,
    availableStock: 30,
    rentedStock: 0,
    unitPrice: 180,
  },
  {
    id: '8',
    name: 'Servilleta Tela',
    category: 'Lencería',
    totalStock: 600,
    availableStock: 600,
    rentedStock: 0,
    unitPrice: 8,
  },
];

const getInitialCustomers = (): Customer[] => [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '555-0101',
    address: 'Av. Principal 123',
    discountPercentage: 10,
    totalOrders: 5,
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '555-0102',
    address: 'Calle Secundaria 456',
    discountPercentage: 5,
    totalOrders: 3,
    createdAt: '2025-01-02',
  },
];
