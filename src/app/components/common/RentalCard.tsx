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
  FileText,
  Pencil,
  Trash2,
  ClipboardCheck,
} from "lucide-react"
import { generateInvoicePDF } from "@/app/utils/pdf"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/app/components/ui/dialog"

interface RentalCardProps {
  rental: Rental
  onEdit: (rental: Rental) => void
  onDelete: (rental: Rental) => void
  onConfirm: (rental: Rental) => void
}

export function RentalCard({
  rental,
  onEdit,
  onDelete,
  onConfirm,
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

        <Badge variant="default">{rental.status}</Badge>
      </CardHeader>

      {/* CONTENIDO */}
      <CardContent className="space-y-4">
        {/* FECHAS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              Fecha de cotización
            </p>
            <p>{rental.rentalDate}</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Fecha de entrega
            </p>
            <p>{rental.eventDate || "—"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Fecha de recolección
            </p>
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

          {rental.items.map(item => (
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

          <div className="md:col-span-2">
            <p className="text-muted-foreground font-semibold">
              Total
            </p>
            <p className="font-semibold">
              ${rental.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* NOTAS */}
        {rental.notes && (
          <p className="text-sm text-muted-foreground">
            <strong>Notas:</strong> {rental.notes}
          </p>
        )}

        {/* ACCIONES */}
        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateInvoicePDF(rental)}
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(rental)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  ¿Eliminar cotización?
                </DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer.  
                  Se eliminará la cotización del cliente{" "}
                  <strong>{rental.customerName}</strong>.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2">
                <Button variant="outline">
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(rental)}
                >
                  Sí, eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button size="sm" onClick={() => onConfirm(rental)}>
            <ClipboardCheck className="h-4 w-4 mr-1" />
            Confirmar pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
