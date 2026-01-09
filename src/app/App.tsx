/* ======================================================
   IMPORTS DE REACT
====================================================== */

import { useEffect, useMemo, useState } from "react"

/* ======================================================
   TIPOS
====================================================== */

import {
  Product,
  Customer,
  Rental,
  Loss,
  DashboardStats,
} from "./types"

/* ======================================================
   STORAGE (SIMULA BACKEND)
====================================================== */

import {
  getProducts,
  saveProducts,
  getCustomers,
  saveCustomers,
  getRentals,
  saveRentals,
  getLosses,
  saveLosses,
} from "./utils/storage"

/* ======================================================
   VISTAS
====================================================== */

import { Dashboard } from "./components/Dashboard"
import { ProductsManagement } from "./components/ProductsManagement"
import { CustomersManagement } from "./components/CustomersManagement"
import { RentalsManagement } from "./components/RentalsManagement"
import { LossesManagement } from "./components/LossesManagement"
import { MonthlyReport } from "./components/Reports/MonthlyReport"

/* ======================================================
   LOGIN
====================================================== */

import { Login } from "./components/Login"

/* ======================================================
   UI + ICONOS
====================================================== */

import { Button } from "./components/ui/button"
import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  AlertTriangle,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { Toaster } from "./components/ui/sonner"

/* ======================================================
   VISTAS DISPONIBLES
====================================================== */

type ViewType =
  | "dashboard"
  | "products"
  | "customers"
  | "rentals"
  | "losses"
  | "reports"

/* ======================================================
   APP
====================================================== */

export default function App() {
  /* =======================
     AUTH
  ======================= */

  const [isAuthenticated, setIsAuthenticated] =
    useState(false)

  /* =======================
     ESTADO GLOBAL
  ======================= */

  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [losses, setLosses] = useState<Loss[]>([])

  const [currentView, setCurrentView] =
    useState<ViewType>("dashboard")

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  /* =======================
     CHECK LOGIN AL CARGAR
  ======================= */

  useEffect(() => {
    const auth =
      localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(auth)
  }, [])

  /* =======================
     CARGA INICIAL DATOS
  ======================= */

  useEffect(() => {
    if (!isAuthenticated) return

    setProducts(getProducts())
    setCustomers(getCustomers())
    setRentals(getRentals())
    setLosses(getLosses())
  }, [isAuthenticated])

  /* =======================
     PERSISTENCIA
  ======================= */

  useEffect(() => {
    if (products.length > 0) saveProducts(products)
  }, [products])

  useEffect(() => {
    if (customers.length > 0) saveCustomers(customers)
  }, [customers])

  useEffect(() => {
    saveRentals(rentals)
  }, [rentals])

  useEffect(() => {
    saveLosses(losses)
  }, [losses])

  /* =======================
     ESTADÍSTICAS
  ======================= */

  const stats: DashboardStats = useMemo(() => {
    const returnedRentals = rentals.filter(
      (r) => r.status === "returned"
    )

    const totalRevenue = returnedRentals.reduce(
      (sum, r) => sum + r.total,
      0
    )

    const activeRentals = rentals.filter(
      (r) => r.status === "active"
    ).length

    const inventoryValue = products.reduce(
      (sum, p) => sum + p.totalStock * p.unitPrice,
      0
    )

    const totalStock = products.reduce(
      (sum, p) => sum + p.totalStock,
      0
    )

    const availableStock = products.reduce(
      (sum, p) => sum + p.availableStock,
      0
    )

    const availabilityRate =
      totalStock > 0
        ? (availableStock / totalStock) * 100
        : 0

    const currentMonth = new Date().getMonth()

    const monthlyRevenue = returnedRentals
      .filter(
        (r) =>
          new Date(r.rentalDate).getMonth() ===
          currentMonth
      )
      .reduce((sum, r) => sum + r.total, 0)

    const totalLosses = losses.reduce(
      (sum, l) => sum + l.totalLoss,
      0
    )

    return {
      totalRevenue,
      activeRentals,
      totalCustomers: customers.length,
      inventoryValue,
      availabilityRate,
      monthlyRevenue,
      totalLosses,
    }
  }, [products, customers, rentals, losses])

  /* =======================
     SI NO ESTÁ LOGEADO → LOGIN
  ======================= */

  if (!isAuthenticated) {
    return (
      <>
        <Login
          onLogin={() => {
            localStorage.setItem(
              "isAuthenticated",
              "true"
            )
            setIsAuthenticated(true)
          }}
        />
        <Toaster />
      </>
    )
  }

  /* =======================
     MENÚ
  ======================= */

  const menuItems = [
    { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
    { id: "products", label: "Inventario", icon: Package },
    { id: "customers", label: "Clientes", icon: Users },
    { id: "rentals", label: "Rentas", icon: Calendar },
    { id: "losses", label: "Pérdidas", icon: AlertTriangle },
    { id: "reports", label: "Reportes", icon: BarChart3 },
  ] as const

  /* =======================
     RENDER APP
  ======================= */

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <img
              src="/logoCabrera.jpeg"
              alt="Cabrera Mobiliaria"
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-semibold">
              Cabrera Mobiliaria
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("isAuthenticated")
                setIsAuthenticated(false)
              }}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="flex flex-col gap-1 p-4">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={
                  currentView === id
                    ? "secondary"
                    : "ghost"
                }
                className="justify-start"
                onClick={() => {
                  setCurrentView(id)
                  setMobileMenuOpen(false)
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
                {id === "rentals" &&
                  stats.activeRentals > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 text-xs">
                      {stats.activeRentals}
                    </span>
                  )}
              </Button>
            ))}
          </nav>
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {currentView === "dashboard" && (
              <Dashboard stats={stats} />
            )}

            {currentView === "products" && (
              <ProductsManagement
                products={products}
                onProductsChange={setProducts}
              />
            )}

            {currentView === "customers" && (
              <CustomersManagement
                customers={customers}
                onCustomersChange={setCustomers}
              />
            )}

            {currentView === "rentals" && (
              <RentalsManagement
                rentals={rentals}
                products={products}
                customers={customers}
                onRentalsChange={setRentals}
                onProductsChange={setProducts}
                onCustomersChange={setCustomers}
              />
            )}

            {currentView === "losses" && (
              <LossesManagement
                losses={losses}
                rentals={rentals}
                products={products}
                onLossesChange={setLosses}
                onProductsChange={setProducts}
              />
            )}

            {currentView === "reports" && (
              <MonthlyReport
                rentals={rentals}
                losses={losses}
              />
            )}
          </div>
        </main>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Toaster />
    </div>
  )
}
