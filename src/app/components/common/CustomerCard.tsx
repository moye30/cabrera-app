import { Customer } from "@/app/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { User, Edit2, Mail, Phone, MapPin } from "lucide-react"

interface CustomerCardProps {
  customer: Customer
  onEdit: (customer: Customer) => void
}

export function CustomerCard({ customer, onEdit }: CustomerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">
              {customer.name}
            </CardTitle>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(customer)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm text-muted-foreground">
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
            <span className="truncate">{customer.address}</span>
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
