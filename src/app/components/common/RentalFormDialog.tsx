import { Product, Customer, RentalItem } from "@/app/types"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Plus } from "lucide-react"
import { Textarea } from "@/app/components/ui/textarea"
import { RentalItemsTable } from "./RentalItemsTable"
import { useEffect } from "react"

interface RentalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  products: Product[]
  formData: any
  setFormData: (data: any) => void
  itemForm: any
  setItemForm: (data: any) => void
  items: RentalItem[]
  onAddItem: () => void
  onRemoveItem: (productId: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RentalFormDialog({
  open,
  onOpenChange,
  customers,
  products,
  formData,
  setFormData,
  itemForm,
  setItemForm,
  items,
  onAddItem,
  onRemoveItem,
  onSubmit,
}: RentalFormDialogProps) {

  /* ======================================
     FECHA DE COTIZACIÓN AUTOMÁTICA
  ====================================== */
  useEffect(() => {
    if (open && !formData.rentalDate) {
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        ...formData,
        rentalDate: today,
      })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Renta
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Renta</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* CLIENTE Y FECHAS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cliente</Label>
              <Select
                value={formData.customerId}
                onValueChange={(v) =>
                  setFormData({ ...formData, customerId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* FECHA DE ENTREGA */}
            <div>
              <Label>Fecha de entrega</Label>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventDate: e.target.value,
                  })
                }
              />
            </div>

            {/* FECHA DE RECOLECCIÓN */}
            <div>
              <Label>Fecha de recolección</Label>
              <Input
                type="date"
                value={formData.returnDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    returnDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ARTÍCULOS */}
          <div>
            <Label>Artículos</Label>
            <div className="flex gap-2 mt-2">
              <Select
                value={itemForm.productId}
                onValueChange={(v) =>
                  setItemForm({ ...itemForm, productId: v })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products
                    .filter((p) => p.availableStock > 0)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} (Disponible: {p.availableStock})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="1"
                placeholder="Cantidad"
                className="w-32"
                value={itemForm.quantity}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    quantity: e.target.value,
                  })
                }
              />

              <Button type="button" onClick={onAddItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <RentalItemsTable
              items={items}
              onRemove={onRemoveItem}
            />
          )}

          {/* NOTAS */}
          <div>
            <Label>Notas</Label>
            <Textarea
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
            />
          </div>

          {/* ACCIONES */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Renta</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
