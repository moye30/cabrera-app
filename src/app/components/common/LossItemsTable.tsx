import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Trash2 } from "lucide-react"
import { LossItem } from "@/app/types"

interface LossItemsTableProps {
  items: LossItem[]
  onRemove: (productId: string) => void
}

export function LossItemsTable({ items, onRemove }: LossItemsTableProps) {
  const total = items.reduce((sum, i) => sum + i.totalLoss, 0)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Precio Unit.</TableHead>
          <TableHead>Total</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => (
          <TableRow key={item.productId}>
            <TableCell>{item.productName}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>
              <Badge
                variant={
                  item.lossType === "broken"
                    ? "destructive"
                    : "default"
                }
              >
                {item.lossType === "broken" ? "Rotura" : "Extravío"}
              </Badge>
            </TableCell>
            <TableCell>${item.unitPrice}</TableCell>
            <TableCell className="font-medium">
              ${item.totalLoss}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.productId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell colSpan={4} className="text-right font-medium">
            Total de Pérdidas
          </TableCell>
          <TableCell className="font-bold text-destructive text-lg">
            ${total.toFixed(2)}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  )
}
