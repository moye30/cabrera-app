import { Rental } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Calendar, Download } from "lucide-react"
import { generateInvoicePDF } from "@/app/utils/pdf"

interface RentalCardProps {
  rental: Rental
  onReturn: (rental: Rental) => void
}

export function RentalCard({ rental, onReturn }: RentalCardProps) {
  const statusMap = {
    active: { label: "Activa", variant: "default" as const },
    returned: { label: "Devuelta", variant: "outline" as const },
  }

  const status = statusMap[rental.status]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{rental.customerName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Folio: {rental.id}
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Renta</span>
            <p>{new Date(rental.rentalDate).toLocaleDateString("es-MX")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Evento</span>
            <p>{new Date(rental.eventDate).toLocaleDateString("es-MX")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Devolución</span>
            <p>{new Date(rental.returnDate).toLocaleDateString("es-MX")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total</span>
            <p className="font-medium text-lg">
              ${rental.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div>
          <p className="font-medium mb-2">Artículos</p>
          <div className="space-y-1 text-sm">
            {rental.items.map((i) => (
              <div key={i.productId} className="flex justify-between">
                <span>
                  {i.productName} x {i.quantity}
                </span>
                <span>${i.subtotal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateInvoicePDF(rental)}
          >
            <Download className="mr-2 h-4 w-4" />
            Factura PDF
          </Button>

          {rental.status === "active" && (
            <Button size="sm" onClick={() => onReturn(rental)}>
              <Calendar className="mr-2 h-4 w-4" />
              Marcar Devuelta
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
