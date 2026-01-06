import { useState } from "react"
import { Rental, Product, Customer, RentalItem } from "../types"
import { Input } from "./ui/input"
import { Search, FileText } from "lucide-react"
import { toast } from "sonner"

import { RentalFormDialog } from "./common/RentalFormDialog"
import { RentalCard } from "./common/RentalCard"

interface RentalsManagementProps {
  rentals: Rental[]
  products: Product[]
  customers: Customer[]
  onRentalsChange: (rentals: Rental[]) => void
  onProductsChange: (products: Product[]) => void
  onCustomersChange: (customers: Customer[]) => void
}

export function RentalsManagement({
  rentals,
  products,
  customers,
  onRentalsChange,
  onProductsChange,
  onCustomersChange,
}: RentalsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    customerId: "",
    rentalDate: new Date().toISOString().split("T")[0],
    returnDate: "",
    eventDate: "",
    deposit: "",
    notes: "",
  })

  const [itemForm, setItemForm] = useState({
    productId: "",
    quantity: "",
  })

  const [items, setItems] = useState<RentalItem[]>([])

  const filteredRentals = rentals.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.includes(searchTerm)
  )

  const handleAddItem = () => {
    const product = products.find((p) => p.id === itemForm.productId)
    if (!product) return

    const qty = Number(itemForm.quantity)
    if (qty > product.availableStock) {
      toast.error(`Solo hay ${product.availableStock} disponibles`)
      return
    }

    const existing = items.find((i) => i.productId === product.id)
    if (existing) {
      setItems(
        items.map((i) =>
          i.productId === product.id
            ? {
                ...i,
                quantity: i.quantity + qty,
                subtotal: (i.quantity + qty) * i.unitPrice,
              }
            : i
        )
      )
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          quantity: qty,
          unitPrice: product.unitPrice,
          subtotal: qty * product.unitPrice,
        },
      ])
    }

    setItemForm({ productId: "", quantity: "" })
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.productId !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Agrega al menos un artículo")
      return
    }

    const customer = customers.find((c) => c.id === formData.customerId)
    if (!customer) return

    const subtotal = items.reduce((s, i) => s + i.subtotal, 0)
    const discount = subtotal * (customer.discountPercentage / 100)
    const total = subtotal - discount

    const newRental: Rental = {
      id: `R${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      items,
      rentalDate: formData.rentalDate,
      returnDate: formData.returnDate,
      eventDate: formData.eventDate,
      status: "active",
      subtotal,
      discount,
      total,
      deposit: Number(formData.deposit) || 0,
      notes: formData.notes,
    }

    onRentalsChange([...rentals, newRental])

    onProductsChange(
      products.map((p) => {
        const item = items.find((i) => i.productId === p.id)
        return item
          ? {
              ...p,
              availableStock: p.availableStock - item.quantity,
              rentedStock: p.rentedStock + item.quantity,
            }
          : p
      })
    )

    onCustomersChange(
      customers.map((c) =>
        c.id === customer.id
          ? { ...c, totalOrders: c.totalOrders + 1 }
          : c
      )
    )

    toast.success("Renta creada correctamente")
    setIsDialogOpen(false)
    setItems([])
  }

  const handleReturn = (rental: Rental) => {
    onRentalsChange(
      rentals.map((r) =>
        r.id === rental.id ? { ...r, status: "returned" } : r
      )
    )

    onProductsChange(
      products.map((p) => {
        const item = rental.items.find((i) => i.productId === p.id)
        return item
          ? {
              ...p,
              availableStock: p.availableStock + item.quantity,
              rentedStock: p.rentedStock - item.quantity,
            }
          : p
      })
    )

    toast.success("Renta marcada como devuelta")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl tracking-tight">Rentas</h2>
          <p className="text-muted-foreground">
            Gestión de pedidos y rentas
          </p>
        </div>

        <RentalFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          customers={customers}
          products={products}
          formData={formData}
          setFormData={setFormData}
          itemForm={itemForm}
          setItemForm={setItemForm}
          items={items}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar rentas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredRentals.map((r) => (
          <RentalCard
            key={r.id}
            rental={r}
            onReturn={handleReturn}
          />
        ))}
      </div>

      {filteredRentals.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg">
            No se encontraron rentas
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Comienza creando tu primera renta"}
          </p>
        </div>
      )}
    </div>
  )
}
