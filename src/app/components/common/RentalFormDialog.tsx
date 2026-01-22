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
import { Plus, Search } from "lucide-react"
import { Textarea } from "@/app/components/ui/textarea"
import { RentalItemsTable } from "./RentalItemsTable"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    if (open && !formData.rentalDate) {
      setFormData({
        ...formData,
        rentalDate: new Date().toISOString().split("T")[0],
      })
    }
  }, [open])

  const [search, setSearch] = useState("")
  const [searchCustomer, setSearchCustomer] = useState("")

  const filteredProducts = products
    .filter(p => p.availableStock > 0)
    .filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    )

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.email.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(searchCustomer.toLowerCase()))
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva cotizacion
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl h-[65vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Nueva cotizacion</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col h-full">

          <section className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cliente</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(v) => {
                    setFormData({ ...formData, customerId: v })
                    setSearchCustomer("")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-2">
                      <Input
                        placeholder="Buscar por nombre, empresa o email..."
                        className="h-8"
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.company ? `${c.company} - ${c.name}` : c.name} ({c.email})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                          No se encontraron clientes
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Fecha de entrega</Label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Fecha de recolección</Label>
                <Input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value })
                  }
                />
              </div>
            </div>

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
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                        <Input
                          placeholder="Buscar producto o categoría..."
                          className="pl-10"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {filteredProducts.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.category}) — Disponible: {p.availableStock}
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
                    setItemForm({ ...itemForm, quantity: e.target.value })
                  }
                />

                <Button type="button" onClick={onAddItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="max-h-[250px] overflow-y-auto border rounded-md">
                <RentalItemsTable
                  items={items}
                  onRemove={onRemoveItem}
                />
              </div>
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
          </section>

          <footer className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear cotizacion</Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  )
}
