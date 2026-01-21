import { Rental } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { RotateCcw, FileText } from "lucide-react"
import { generateInvoicePDF } from "@/app/utils/pdf"

interface ConfirmedRentalCardProps {
  rental: Rental
  onReturn: (rental: Rental) => void
}

export function ConfirmedRentalCard({
  rental,
  onReturn,
}: ConfirmedRentalCardProps) {
  return (
    <Card className="overflow-hidden border-primary/40">
      <CardHeader className="flex flex-row justify-between items-start gap-4 bg-muted/40">
        <div className="space-y-1">
          <CardTitle>
            {rental.companyName || rental.customerName}
          </CardTitle>
          {rental.companyName && (
            <p className="text-sm text-muted-foreground">
              {rental.customerName}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            #{rental.id}
          </p>
        </div>

        <Badge>Pedido activo</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              Fecha de entrega
            </p>
            <p>{rental.eventDate}</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Fecha de recolección
            </p>
            <p>{rental.returnDate || "—"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Total
            </p>
            <p className="font-semibold">
              ${rental.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateInvoicePDF(rental)}
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>

          <Button
            size="sm"
            onClick={() => onReturn(rental)}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Pedido devuelto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
