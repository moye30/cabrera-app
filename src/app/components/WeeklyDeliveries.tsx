import { Rental } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay() === 0 ? 7 : d.getDay()
  d.setDate(d.getDate() - (day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeek(date: Date) {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 6)
  d.setHours(23, 59, 59, 999)
  return d
}

export function WeeklyDeliveries({ rentals }: { rentals: Rental[] }) {
  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)

  const deliveries = rentals.filter(r => {
    if (r.status !== "active") return false
    if (!r.eventDate) return false
    const date = new Date(r.eventDate)
    return date >= weekStart && date <= weekEnd
  })

  const grouped = DAYS.map((label, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)

    return {
      label,
      date,
      items: deliveries.filter(r => {
        const d = new Date(r.eventDate)
        return d.toDateString() === date.toDateString()
      }),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entregas programadas esta semana</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {grouped.map(day => (
          <div key={day.label} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{day.label}</p>
                <p className="text-xs text-muted-foreground">
                  {day.date.toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "long",
                  })}
                </p>
              </div>

              <Badge variant={day.items.length ? "default" : "secondary"}>
                {day.items.length} entrega
                {day.items.length !== 1 && "s"}
              </Badge>
            </div>

            {day.items.length === 0 && (
              <p className="text-sm text-muted-foreground pl-1">
                No hay entregas programadas
              </p>
            )}

            <div className="space-y-2">
              {day.items.map(r => (
                <div
                  key={r.id}
                  className="rounded-md border bg-card px-4 py-3"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {r.companyName || "Cliente sin empresa"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {r.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Folio #{r.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ${r.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.items.length} artículo
                        {r.items.length !== 1 && "s"}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="text-xs text-muted-foreground">
                    Entrega programada:{" "}
                    {new Date(r.eventDate).toLocaleDateString(
                      "es-MX",
                      {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
