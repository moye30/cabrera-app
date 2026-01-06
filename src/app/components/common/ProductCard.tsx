import { Product } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Package, Edit2, AlertCircle } from "lucide-react"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const percentage = (product.availableStock / product.totalStock) * 100

  const status =
    percentage === 0
      ? { label: "Sin Stock", variant: "destructive" as const }
      : percentage < 30
      ? { label: "Stock Bajo", variant: "destructive" as const }
      : percentage < 70
      ? { label: "Stock Medio", variant: "default" as const }
      : { label: "Stock Alto", variant: "default" as const }

  return (
    <Card className="overflow-hidden">
      {/* Imagen */}
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
          <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {product.category}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Precio:</span>
          <span className="text-lg">${product.unitPrice}</span>
        </div>

        <div className="space-y-1 text-sm">
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
  )
}
