import { useState } from "react"
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
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react"
import { generateInvoicePDF } from "@/app/utils/pdf"
import { ConfirmDialog } from "./ConfirmDialog"

interface RentalCardProps {
  rental: Rental
  onEdit: (rental: Rental) => void
  onDelete: (rental: Rental) => void
  onConfirm?: (rental: Rental) => void
  onReturn?: (rental: Rental) => void
}

export function RentalCard({
  rental,
  onEdit,
  onDelete,
  onConfirm,
  onReturn,
}: RentalCardProps) {
  const [openDetails, setOpenDetails] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)

  const isConfirmed = rental.status === "active"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <CardTitle>
            {rental.companyName || rental.customerName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {rental.companyName && rental.customerName}
          </p>
          <p className="text-xs text-muted-foreground">
            #{rental.id}
          </p>
        </div>

        <Badge variant={isConfirmed ? "default" : "secondary"}>
          {isConfirmed ? "Confirmado" : "Pendiente"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Entrega</p>
            <p>{rental.eventDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Recolección</p>
            <p>{rental.returnDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-semibold">
              ${rental.total.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          onClick={() => setOpenDetails(!openDetails)}
        >
          Ver detalles del pedido
          {openDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {openDetails && (
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
        )}

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

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>

          {!isConfirmed && onConfirm && (
            <Button size="sm" onClick={() => onConfirm(rental)}>
              <ClipboardCheck className="h-4 w-4 mr-1" />
              Confirmar pedido
            </Button>
          )}

          {isConfirmed && onReturn && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setReturnOpen(true)}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Pedido devuelto
            </Button>
          )}
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar pedido"
        description="Este pedido será eliminado permanentemente"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => {
          onDelete(rental)
          setConfirmOpen(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <ConfirmDialog
        open={returnOpen}
        title="Confirmar devolución"
        description="¿Deseas marcar este pedido como devuelto?"
        confirmText="Confirmar devolución"
        cancelText="Cancelar"
        onConfirm={() => {
          onReturn?.(rental)
          setReturnOpen(false)
        }}
        onCancel={() => setReturnOpen(false)}
      />
    </Card>
  )
}
