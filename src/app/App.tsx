/* ======================================================
   IMPORTS DE REACT
====================================================== */

/*
  useState:
  - Permite manejar estado dentro del componente
  - Cuando el estado cambia, React vuelve a renderizar

  useEffect:
  - Se usa para efectos secundarios:
    cargar datos, guardar datos, sincronizar estado

  useMemo:
  - Memoriza cálculos
  - Evita recalcular estadísticas en cada render
*/
import { useEffect, useMemo, useState } from "react"

/* ======================================================
   TIPOS (MODELOS DE DATOS)
====================================================== */

/*
  Estos tipos describen la estructura de los datos
  Funcionan como el "contrato" de tu aplicación
*/
import {
  Product,
  Customer,
  Rental,
  Loss,
  DashboardStats,
} from "./types"

/* ======================================================
   SIMULACIÓN DE BACKEND (localStorage)
====================================================== */

/*
  Estas funciones leen y escriben datos en localStorage
  Hoy simulan un backend
  Mañana aquí irán llamadas HTTP reales
*/
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
   VISTAS PRINCIPALES (PANTALLAS)
====================================================== */

import { Dashboard } from "./components/Dashboard"
import { ProductsManagement } from "./components/ProductsManagement"
import { CustomersManagement } from "./components/CustomersManagement"
import { RentalsManagement } from "./components/RentalsManagement"
import { LossesManagement } from "./components/LossesManagement"

/* ======================================================
   COMPONENTES UI E ICONOS
====================================================== */

import { Button } from "./components/ui/button"
import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react"
import { Toaster } from "./components/ui/sonner"

/* ======================================================
   TIPO DE VISTAS (ENRUTADO MANUAL)
====================================================== */

/*
  Define TODAS las vistas posibles de la aplicación.
  Se usa para controlar qué pantalla se renderiza.
*/
type ViewType =
  | "dashboard"
  | "products"
  | "customers"
  | "rentals"
  | "losses"

/* ======================================================
   COMPONENTE PRINCIPAL
====================================================== */

export default function App() {
  /* ======================================================
     ESTADOS GLOBALES DE LA APLICACIÓN
  ====================================================== */

  // Inventario completo de productos
  const [products, setProducts] = useState<Product[]>([])

  // Lista de clientes
  const [customers, setCustomers] = useState<Customer[]>([])

  // Rentas realizadas
  const [rentals, setRentals] = useState<Rental[]>([])

  // Reportes de pérdidas
  const [losses, setLosses] = useState<Loss[]>([])

  // Vista actual (simula un router)
  const [currentView, setCurrentView] =
    useState<ViewType>("dashboard")

  // Estado del menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  /* ======================================================
     CARGA INICIAL DE DATOS
  ====================================================== */

  /*
    Este efecto se ejecuta SOLO UNA VEZ
    porque el array de dependencias está vacío []

    Aquí:
    - Se cargan los datos guardados previamente
    - Se inicializa el estado global
  */
  useEffect(() => {
    setProducts(getProducts())
    setCustomers(getCustomers())
    setRentals(getRentals())
    setLosses(getLosses())
  }, [])

  /* ======================================================
     GUARDADO AUTOMÁTICO EN localStorage
  ====================================================== */

  /*
    Cada vez que products cambia,
    se guarda automáticamente en localStorage
  */
  useEffect(() => {
    if (products.length > 0) {
      saveProducts(products)
    }
  }, [products])

  /*
    Guarda clientes cuando se modifican
  */
  useEffect(() => {
    if (customers.length > 0) {
      saveCustomers(customers)
    }
  }, [customers])

  /*
    Guarda rentas cada vez que cambian
  */
  useEffect(() => {
    saveRentals(rentals)
  }, [rentals])

  /*
    Guarda pérdidas cada vez que cambian
  */
  useEffect(() => {
    saveLosses(losses)
  }, [losses])

  /* ======================================================
     CÁLCULO DE ESTADÍSTICAS (DASHBOARD)
  ====================================================== */

  /*
    useMemo:
    - Evita recalcular estadísticas en cada render
    - Solo se recalcula si cambian los datos relevantes
  */
  const stats: DashboardStats = useMemo(() => {
    // Rentas devueltas (ingresos reales)
    const returnedRentals = rentals.filter(
      (r) => r.status === "returned"
    )

    // Total de ingresos
    const totalRevenue = returnedRentals.reduce(
      (sum, r) => sum + r.total,
      0
    )

    // Rentas activas
    const activeRentals = rentals.filter(
      (r) => r.status === "active"
    ).length

    // Valor total del inventario
    const inventoryValue = products.reduce(
      (sum, p) => sum + p.totalStock * p.unitPrice,
      0
    )

    // Disponibilidad de inventario
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

    // Ingresos del mes actual
    const currentMonth = new Date().getMonth()

    const monthlyRevenue = returnedRentals
      .filter(
        (r) =>
          new Date(r.rentalDate).getMonth() ===
          currentMonth
      )
      .reduce((sum, r) => sum + r.total, 0)

    // Total de pérdidas
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

  /* ======================================================
     MENÚ LATERAL (SIDEBAR)
  ====================================================== */

  const menuItems = [
    { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
    { id: "products", label: "Inventario", icon: Package },
    { id: "customers", label: "Clientes", icon: Users },
    { id: "rentals", label: "Rentas", icon: Calendar },
    { id: "losses", label: "Pérdidas", icon: AlertTriangle },
  ] as const

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* Botón menú móvil */}
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

          {/* Logo */}
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

          <div className="ml-auto text-sm text-muted-foreground hidden sm:block">
            Sistema de gestión de pedidos e inventario
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ================= SIDEBAR ================= */}
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

        {/* ================= CONTENIDO PRINCIPAL ================= */}
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
          </div>
        </main>
      </div>

      {/* Overlay menú móvil */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Notificaciones */}
      <Toaster />
    </div>
  )
}
