import { Customer } from "@/app/types"
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

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCustomer: Customer | null
  formData: {
    company: string
    name: string
    rfc: string
    email: string
    phone: string
    address: string
    discountPercentage: string
  }
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  editingCustomer,
  formData,
  setFormData,
  onSubmit,
}: CustomerFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          onClick={() =>
            setFormData({
              company: "",
              name: "",
              rfc: "",
              email: "",
              phone: "",
              address: "",
              discountPercentage: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Cliente
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-">
          <div>
            <Label>Empresa</Label>
            <Input
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Nombre de la empresa (opcional)"
            />
          </div>

          <div>
            <Label>Nombre Completo</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nombre del cliente"
              required
            />
          </div>

          <div>
            <Label>RFC</Label>
            <Input
              value={formData.rfc}
              onChange={(e) =>
                setFormData({ ...formData, rfc: e.target.value })
              }
              placeholder="RFC del cliente"
            />
          </div>

          <div>
            <Label>Correo Electrónico</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Correo electronico"
              required
            />
          </div>

          <div>
            <Label>Teléfono</Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Numero de telefono"
              required
            />
          </div>

          <div>
            <Label>Dirección</Label>
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Direccion"
              required
            />
          </div>

          <div>
            <Label>Descuento (%)</Label>
            <Input
              type="number"
              min=""
              max="100"
              value={formData.discountPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountPercentage: e.target.value,
                })
              }
              placeholder="Ingresa el porcentaje de descuento para este cliente."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingCustomer ? "Actualizar" : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
