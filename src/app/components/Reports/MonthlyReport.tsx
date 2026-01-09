import { useMemo, useState } from "react"
import { Rental, Loss } from "@/app/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { TrendingUp, AlertTriangle } from "lucide-react"
import { MonthPicker } from "./MonthPicker"

interface MonthlyReportProps {
  rentals: Rental[]
  losses: Loss[]
}

export function MonthlyReport({ rentals, losses }: MonthlyReportProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { income, totalLoss } = useMemo(() => {
    const month = selectedDate.getMonth()
    const year = selectedDate.getFullYear()

    const monthlyIncome = rentals
      .filter(
        (r) =>
          r.status === "returned" &&
          new Date(r.rentalDate).getMonth() === month &&
          new Date(r.rentalDate).getFullYear() === year
      )
      .reduce((sum, r) => sum + r.total, 0)

    const monthlyLoss = losses
      .filter(
        (l) =>
          new Date(l.reportDate).getMonth() === month &&
          new Date(l.reportDate).getFullYear() === year
      )
      .reduce((sum, l) => sum + l.totalLoss, 0)

    return {
      income: monthlyIncome,
      totalLoss: monthlyLoss,
    }
  }, [selectedDate, rentals, losses])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Reporte Mensual</h2>
        <p className="text-muted-foreground">
          Resumen de ingresos y pérdidas por mes
        </p>
      </div>

      <MonthPicker
        value={selectedDate}
        onChange={setSelectedDate}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Ingresos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ${income.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Pérdidas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              ${totalLoss.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
