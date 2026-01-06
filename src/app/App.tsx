import { useState, useEffect } from "react";
import { Product, Customer, Rental, Loss, DashboardStats } from "./types";
import { 
  getProducts, 
  saveProducts, 
  getCustomers, 
  saveCustomers, 
  getRentals, 
  saveRentals,
  getLosses,
  saveLosses
} from "./utils/storage";

import { Dashboard } from "./components/Dashboard";
import { ProductsManagement } from "./components/ProductsManagement";
import { CustomersManagement } from "./components/CustomersManagement";
import { RentalsManagement } from "./components/RentalsManagement";
import { LossesManagement } from "./components/LossesManagement";

import { Button } from "./components/ui/button";
import { LayoutDashboard, Package, Users, Calendar, AlertTriangle, Menu, X } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type ViewType = 'dashboard' | 'products' | 'customers' | 'rentals' | 'losses';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [losses, setLosses] = useState<Loss[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setProducts(getProducts());
    setCustomers(getCustomers());
    setRentals(getRentals());
    setLosses(getLosses());
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (products.length > 0) saveProducts(products);
  }, [products]);

  useEffect(() => {
    if (customers.length > 0) saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveRentals(rentals);
  }, [rentals]);

  useEffect(() => {
    saveLosses(losses);
  }, [losses]);

  // Calculate dashboard stats
  const calculateStats = (): DashboardStats => {
    const totalRevenue = rentals
      .filter(r => r.status === 'returned')
      .reduce((sum, r) => sum + r.total, 0);

    const activeRentals = rentals.filter(r => r.status === 'active').length;

    const inventoryValue = products.reduce(
      (sum, p) => sum + (p.totalStock * p.unitPrice), 
      0
    );

    const totalStock = products.reduce((sum, p) => sum + p.totalStock, 0);
    const availableStock = products.reduce((sum, p) => sum + p.availableStock, 0);
    const availabilityRate = totalStock > 0 ? (availableStock / totalStock) * 100 : 0;

    const currentMonth = new Date().getMonth();
    const monthlyRevenue = rentals
      .filter(r => {
        const rentalMonth = new Date(r.rentalDate).getMonth();
        return rentalMonth === currentMonth && r.status === 'returned';
      })
      .reduce((sum, r) => sum + r.total, 0);

    const totalLosses = losses.reduce((sum, l) => sum + l.totalLoss, 0);

    return {
      totalRevenue,
      activeRentals,
      totalCustomers: customers.length,
      inventoryValue,
      availabilityRate,
      monthlyRevenue,
      totalLosses,
    };
  };

  const stats = calculateStats();

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as ViewType, label: 'Inventario', icon: Package },
    { id: 'customers' as ViewType, label: 'Clientes', icon: Users },
    { id: 'rentals' as ViewType, label: 'Rentas', icon: Calendar },
    { id: 'losses' as ViewType, label: 'Pérdidas', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          <div className="flex items-center gap-2">
            <img
              src="/logoCabrera.jpeg"
              alt="Cabrera Mobiliaria"
              className="h-15 w-auto"
            />
            <h1 className="text-xl font-semibold">
              Cabrera Mobiliaria
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Sistema de gestion de pedidos e inventario
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background
          transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="flex flex-col gap-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.id === 'rentals' && stats.activeRentals > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {stats.activeRentals}
                    </span>
                  )}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <Dashboard stats={stats} />}

            {currentView === 'products' && (
              <ProductsManagement
                products={products}
                onProductsChange={setProducts}
              />
            )}

            {currentView === 'customers' && (
              <CustomersManagement
                customers={customers}
                onCustomersChange={setCustomers}
              />
            )}

            {currentView === 'rentals' && (
              <RentalsManagement
                rentals={rentals}
                products={products}
                customers={customers}
                onRentalsChange={setRentals}
                onProductsChange={setProducts}
                onCustomersChange={setCustomers}
              />
            )}

            {currentView === 'losses' && (
              <LossesManagement
                losses={losses}
                rentals={rentals}
                products={products}
                onLossesChange={setLosses}
                onProductsChange={setProducts}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Toaster />
    </div>
  );
}
