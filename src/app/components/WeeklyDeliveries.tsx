import { Rental } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

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

export function WeeklyDeliveries({
  rentals,
}: {
  rentals: Rental[]
}) {
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
        <CardTitle>Entregas de la semana</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {grouped.map(day => (
          <div key={day.label}>
            <p className="font-semibold mb-2">
              {day.label}
            </p>

            {day.items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Sin entregas
              </p>
            )}

            <div className="space-y-2">
              {day.items.map(r => (
                <div
                  key={r.id}
                  className="flex justify-between items-center border rounded-md px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {r.customerName}
                    </p>
                    <p className="text-muted-foreground">
                      #{r.id}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ${r.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
