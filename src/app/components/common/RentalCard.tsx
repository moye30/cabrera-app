import { Rental } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import {
  Archive,
  CheckCircle,
  FileText,
} from "lucide-react"
import { generateInvoicePDF } from "@/app/utils/pdf"

interface RentalCardProps {
  rental: Rental
  onReturn: (rental: Rental) => void
  onArchive: (rental: Rental) => void
}

export function RentalCard({
  rental,
  onReturn,
  onArchive,
}: RentalCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* HEADER */}
      <CardHeader className="flex flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <CardTitle>{rental.customerName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            #{rental.id}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateInvoicePDF(rental)}
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>

          {rental.status !== "returned" && (
            <Button
              size="sm"
              onClick={() => onReturn(rental)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Marcar devuelta
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onArchive(rental)}
          >
            <Archive className="h-4 w-4 mr-1" />
            Archivar
          </Button>
        </div>
      </CardHeader>

      {/* CONTENIDO */}
      <CardContent className="space-y-4">
        {/* FECHAS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Fecha renta</p>
            <p>{rental.rentalDate}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Fecha evento</p>
            <p>{rental.eventDate || "—"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Fecha devolución</p>
            <p>{rental.returnDate || "—"}</p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="border rounded-md">
          <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-semibold bg-muted">
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Subtotal</span>
          </div>

          {rental.items.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-3 gap-2 px-3 py-2 text-sm border-t"
            >
              <span>{item.productName}</span>
              <span>{item.quantity}</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* TOTALES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Subtotal</p>
            <p>${rental.subtotal.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Descuento</p>
            <p>${rental.discount.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Depósito</p>
            <p>${rental.deposit.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-muted-foreground font-semibold">Total</p>
            <p className="font-semibold">
              ${rental.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ESTADO + NOTAS */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge
            variant={
              rental.status === "active"
                ? "default"
                : rental.status === "returned"
                ? "secondary"
                : rental.status === "overdue"
                ? "destructive"
                : "outline"
            }
          >
            {rental.status}
          </Badge>

          {rental.notes && (
            <p className="text-sm text-muted-foreground">
              <strong>Notas:</strong> {rental.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
