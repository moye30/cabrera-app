import { useEffect, useMemo, useState } from "react"
import {
  Product,
  Customer,
  Rental,
  Loss,
  DashboardStats,
} from "./types"
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
import { Dashboard } from "./components/Dashboard"
import { WeeklyDeliveries } from "./components/WeeklyDeliveries"
import { ProductsManagement } from "./components/ProductsManagement"
import { CustomersManagement } from "./components/CustomersManagement"
import { RentalsManagement } from "./components/RentalsManagement"
import { ConfirmedOrdersManagement } from "./components/ConfirmedOrdersManagement"
import { LossesManagement } from "./components/LossesManagement"
import { MonthlyReport } from "./components/Reports/MonthlyReport"
import { Login } from "./components/Login"
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
  FileText,
  CheckCircle,
} from "lucide-react"
import { Toaster } from "./components/ui/sonner"

type ViewType =
  | "dashboard"
  | "products"
  | "customers"
  | "quotations"
  | "confirmedOrders"
  | "losses"
  | "reports"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [losses, setLosses] = useState<Loss[]>([])

  const [currentView, setCurrentView] =
    useState<ViewType>("dashboard")

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [rentalsMenuOpen, setRentalsMenuOpen] = useState(false)

  useEffect(() => {
    const auth =
      localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(auth)
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    setProducts(getProducts())
    setCustomers(getCustomers())
    setRentals(getRentals())
    setLosses(getLosses())
  }, [isAuthenticated])

  useEffect(() => {
    if (products.length) saveProducts(products)
  }, [products])

  useEffect(() => {
    if (customers.length) saveCustomers(customers)
  }, [customers])

  useEffect(() => {
    saveRentals(rentals)
  }, [rentals])

  useEffect(() => {
    saveLosses(losses)
  }, [losses])

  const stats: DashboardStats = useMemo(() => {
    const returnedRentals = rentals.filter(
      r => r.status === "returned"
    )

    const totalRevenue = returnedRentals.reduce(
      (sum, r) => sum + r.total,
      0
    )

    const activeRentals = rentals.filter(
      r => r.status === "active"
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
        r =>
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

  if (!authChecked) return null

  if (!isAuthenticated) {
    return (
      <>
        <Login
          onLogin={() => {
            localStorage.setItem("isAuthenticated", "true")
            setIsAuthenticated(true)
          }}
        />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>

          <div className="flex items-center gap-2">
            <img
              src="/cabreraLG.png"
              alt="Cabrera Mobiliaria"
              className="h-20 w-auto object-contain"
            />

          </div>

          <Button
            className="ml-auto"
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
      </header>

      <div className="flex">
        {/* Overlay para cerrar menú móvil */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="flex flex-col gap-1 p-4">
            <Button
              variant={currentView === "dashboard" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => {
                setCurrentView("dashboard")
                setMobileMenuOpen(false)
              }}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Inicio
            </Button>

            <Button
              variant={currentView === "products" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => {
                setCurrentView("products")
                setMobileMenuOpen(false)
              }}
            >
              <Package className="mr-2 h-4 w-4" />
              Inventario
            </Button>

            <Button
              variant={currentView === "customers" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => {
                setCurrentView("customers")
                setMobileMenuOpen(false)
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              Clientes
            </Button>

            <Button
              variant={
                currentView === "quotations" ||
                currentView === "confirmedOrders"
                  ? "secondary"
                  : "ghost"
              }
              className="justify-start"
              onClick={() => setRentalsMenuOpen(!rentalsMenuOpen)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Rentas
            </Button>

            {rentalsMenuOpen && (
              <div className="ml-6 flex flex-col gap-1">
                <Button
                  variant={currentView === "quotations" ? "secondary" : "ghost"}
                  className="justify-start text-sm"
                  onClick={() => {
                    setCurrentView("quotations")
                    setMobileMenuOpen(false)
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Cotizaciones
                </Button>

                <Button
                  variant={
                    currentView === "confirmedOrders"
                      ? "secondary"
                      : "ghost"
                  }
                  className="justify-start text-sm"
                  onClick={() => {
                    setCurrentView("confirmedOrders")
                    setMobileMenuOpen(false)
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Pedidos confirmados
                </Button>
              </div>
            )}

            <Button
              variant={currentView === "losses" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => {
                setCurrentView("losses")
                setMobileMenuOpen(false)
              }}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Pérdidas
            </Button>

            <Button
              variant={currentView === "reports" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => {
                setCurrentView("reports")
                setMobileMenuOpen(false)
              }}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Reportes
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {currentView === "dashboard" && (
              <div className="space-y-6">
                <Dashboard stats={stats} />
                <WeeklyDeliveries rentals={rentals} />
              </div>
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

            {currentView === "quotations" && (
              <RentalsManagement
                rentals={rentals}
                products={products}
                customers={customers}
                onRentalsChange={setRentals}
                onProductsChange={setProducts}
              />
            )}

            {currentView === "confirmedOrders" && (
              <ConfirmedOrdersManagement
                rentals={rentals}
                products={products}
                customers={customers}
                onRentalsChange={setRentals}
                onProductsChange={setProducts}
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

      <Toaster />
    </div>
  )
}
