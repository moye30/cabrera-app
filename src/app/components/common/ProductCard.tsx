import { useState } from "react"
import { Product } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"
import { Package, Edit2, AlertCircle, Trash2 } from "lucide-react"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [open, setOpen] = useState(false)

  const percentage =
    product.totalStock > 0
      ? (product.availableStock / product.totalStock) * 100
      : 0

  const status =
    percentage === 0
      ? { label: "Sin Stock", variant: "destructive" as const }
      : percentage < 30
      ? { label: "Stock Bajo", variant: "destructive" as const }
      : percentage < 70
      ? { label: "Stock Medio", variant: "default" as const }
      : { label: "Stock Alto", variant: "default" as const }

  // Valores seguros (no crashea)
  const acquisitionCost = product.acquisitionCost ?? 0
  const lossCost = product.lossCost ?? 0
  const unitPrice = product.unitPrice ?? 0

  return (
    <>
      <Card className="overflow-hidden">
        {product.image && (
          <div className="h-48 w-full bg-muted flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-2"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(product)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => setOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {product.category}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Precios */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Precio renta:</span>
              <span className="font-medium">
                ${unitPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Costo adquisición:</span>
              <span className="text-muted-foreground">
                ${acquisitionCost.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Costo por pérdida:</span>
              <span className="text-destructive font-medium">
                ${lossCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-1 text-sm pt-2 border-t">
            <div className="flex justify-between">
              <span>Disponible:</span>
              <span>{product.availableStock}</span>
            </div>
            <div className="flex justify-between">
              <span>Rentado:</span>
              <span>{product.rentedStock}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{product.totalStock}</span>
            </div>
          </div>

          <Badge variant={status.variant}>{status.label}</Badge>

          {product.availableStock === 0 && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Sin stock disponible</span>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar producto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto{" "}
              <strong>{product.name}</strong> será eliminado
              permanentemente del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete(product.id)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
