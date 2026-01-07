import { Product } from "@/app/types"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Plus } from "lucide-react"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingProduct: Product | null
  formData: {
    name: string
    category: string
    totalStock: string
    unitPrice: string
    acquisitionCost: string
    lossCost: string
    image?: string
  }
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  editingProduct,
  formData,
  setFormData,
  onSubmit,
}: ProductFormDialogProps) {
  const handleImageChange = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result as string,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          onClick={() =>
            setFormData({
              name: "",
              category: "",
              totalStock: "",
              unitPrice: "",
              acquisitionCost: "",
              lossCost: "",
              image: undefined,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Imagen */}
          <div>
            <Label>Imagen del Producto</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageChange(file)
              }}
            />

            {formData.image && (
              <img
                src={formData.image}
                alt="Vista previa"
                className="mt-2 h-32 w-full object-cover rounded-md border"
              />
            )}
          </div>

          <div>
            <Label>Nombre del Producto</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Categoría</Label>
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Stock Total</Label>
            <Input
              type="number"
              min="0"
              value={formData.totalStock}
              onChange={(e) =>
                setFormData({ ...formData, totalStock: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Precio Unitario (Renta)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Costo de Adquisición</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.acquisitionCost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  acquisitionCost: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <Label>Costo por Pérdida</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.lossCost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lossCost: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingProduct ? "Actualizar" : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
