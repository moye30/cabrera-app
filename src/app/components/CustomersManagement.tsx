import { useState } from "react"
import { Customer } from "../types"
import { Input } from "./ui/input"
import { Search, User } from "lucide-react"
import { toast } from "sonner"

import { CustomerCard } from "./common/CustomerCard"
import { CustomerFormDialog } from "./common/CustomerFormDialog"

interface CustomersManagementProps {
  customers: Customer[]
  onCustomersChange: (customers: Customer[]) => void
}

export function CustomersManagement({
  customers,
  onCustomersChange,
}: CustomersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    discountPercentage: "",
  })

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCustomer) {
      onCustomersChange(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                ...formData,
                discountPercentage: Number(formData.discountPercentage),
              }
            : c
        )
      )
      toast.success("Cliente actualizado correctamente")
    } else {
      onCustomersChange([
        ...customers,
        {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          discountPercentage: Number(formData.discountPercentage),
          totalOrders: 0,
          createdAt: new Date().toISOString(),
        },
      ])
      toast.success("Cliente agregado correctamente")
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      discountPercentage: "",
    })
    setEditingCustomer(null)
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl tracking-tight">
            Clientes
          </h2>
          <p className="text-muted-foreground">
            Gestión de clientes y descuentos
          </p>
        </div>

        <CustomerFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingCustomer={editingCustomer}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={(c) => {
              setEditingCustomer(c)
              setFormData({
                name: c.name,
                email: c.email,
                phone: c.phone,
                address: c.address,
                discountPercentage: c.discountPercentage.toString(),
              })
              setIsDialogOpen(true)
            }}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg">
            No se encontraron clientes
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Comienza agregando tu primer cliente"}
          </p>
        </div>
      )}
    </div>
  )
}
