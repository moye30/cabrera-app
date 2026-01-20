import { Customer } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import {
  User,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Fingerprint,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/app/components/ui/dialog"

interface CustomerCardProps {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {customer.company && (
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                {customer.company}
              </CardTitle>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{customer.name}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(customer)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    ¿Eliminar cliente?
                  </DialogTitle>
                  <DialogDescription>
                    Esta acción no se puede deshacer.  
                    Se eliminará el cliente{" "}
                    <strong>
                      {customer.company || customer.name}
                    </strong>{" "}
                    y toda su información asociada.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                  <Button variant="outline">
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(customer)}
                  >
                    Eliminar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          {customer.rfc && (
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4" />
              <span>{customer.rfc}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="truncate">{customer.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{customer.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {customer.address}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground">
            Pedidos
          </span>
          <span className="font-medium">
            {customer.totalOrders}
          </span>
        </div>

        {customer.discountPercentage > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Descuento
            </span>
            <Badge variant="secondary">
              {customer.discountPercentage}%
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
