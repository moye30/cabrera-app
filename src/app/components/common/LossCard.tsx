import { Loss } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { AlertTriangle, Download } from "lucide-react"
import { generateLossPDF } from "@/app/utils/pdf"

interface LossCardProps {
  loss: Loss
}

export function LossCard({ loss }: LossCardProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {loss.customerName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Folio: {loss.id} | Renta: {loss.rentalId}
            </p>
          </div>
          <p className="text-sm">
            {new Date(loss.reportDate).toLocaleDateString("es-MX")}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          {loss.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm"
            >
              <div className="flex gap-2 items-center">
                <span>
                  {item.productName} x {item.quantity}
                </span>
                <Badge
                  variant={
                    item.lossType === "broken"
                      ? "destructive"
                      : "default"
                  }
                  className="text-xs"
                >
                  {item.lossType === "broken"
                    ? "Rotura"
                    : "Extravío"}
                </Badge>
              </div>
              <span className="text-destructive font-medium">
                ${item.totalLoss}
              </span>
            </div>
          ))}
        </div>

        {loss.notes && (
          <div className="bg-muted p-3 rounded-md text-sm">
            {loss.notes}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateLossPDF(loss)}
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Total de Pérdidas
            </p>
            <p className="text-2xl font-bold text-destructive">
              ${loss.totalLoss.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
