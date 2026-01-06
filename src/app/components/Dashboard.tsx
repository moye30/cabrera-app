import { StatCard } from "@/app/components/common/StatCard"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

import {
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from "lucide-react"

import { DashboardStats } from "../types"

interface DashboardProps {
  stats: DashboardStats
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl tracking-tight font-bold">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Vista general del negocio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Rentas Activas"
          value={stats.activeRentals}
          description="En curso actualmente"
          icon={Calendar}
        />

        <StatCard
          title="Clientes"
          value={stats.totalCustomers}
          description="Clientes registrados"
          icon={Users}
        />

        <StatCard
          title="Valor del Inventario"
          value={`$${stats.inventoryValue.toLocaleString()}`}
          description={`Disponibilidad: ${stats.availabilityRate.toFixed(1)}%`}
          icon={Package}
        />
      </div>

      {/* Monthly Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Resumen del Mes</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm">Ingresos Mensuales</p>
                <p className="text-2xl font-bold">
                  ${stats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm">Pérdidas Acumuladas</p>
                <p className="text-2xl font-bold">
                  ${stats.totalLosses.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
