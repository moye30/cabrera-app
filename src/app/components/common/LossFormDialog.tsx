import { LossItem, Rental, Product } from "@/app/types"
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
import { LossItemsTable } from "./LossItemsTable"

interface LossFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rentals: Rental[]
  products: Product[]
  formData: any
  setFormData: (data: any) => void
  itemForm: any
  setItemForm: (data: any) => void
  items: LossItem[]
  onAddItem: () => void
  onRemoveItem: (productId: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function LossFormDialog({
  open,
  onOpenChange,
  rentals,
  products,
  formData,
  setFormData,
  itemForm,
  setItemForm,
  items,
  onAddItem,
  onRemoveItem,
  onSubmit,
}: LossFormDialogProps) {
  const selectedRental = rentals.find(
    (r) => r.id === formData.rentalId
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Reportar Pérdida
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Reporte de Pérdidas</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Renta Devuelta</Label>
            <Select
              value={formData.rentalId}
              onValueChange={(v) =>
                setFormData({ ...formData, rentalId: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar renta" />
              </SelectTrigger>
              <SelectContent>
                {rentals.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.id} - {r.customerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRental && (
            <>
              <div>
                <Label>Artículos con pérdida</Label>
                <div className="flex gap-2 mt-2">
                  <Select
                    value={itemForm.productId}
                    onValueChange={(v) =>
                      setItemForm({ ...itemForm, productId: v })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRental.items.map((i) => (
                        <SelectItem
                          key={i.productId}
                          value={i.productId}
                        >
                          {i.productName} (Rentado: {i.quantity})
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

                  <Select
                    value={itemForm.lossType}
                    onValueChange={(v) =>
                      setItemForm({
                        ...itemForm,
                        lossType: v,
                      })
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broken">Rotura</SelectItem>
                      <SelectItem value="lost">Extravío</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button type="button" onClick={onAddItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {items.length > 0 && (
                <LossItemsTable
                  items={items}
                  onRemove={onRemoveItem}
                />
              )}

              <div>
                <Label>Notas</Label>
                <Textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={items.length === 0}>
              Crear Reporte
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
