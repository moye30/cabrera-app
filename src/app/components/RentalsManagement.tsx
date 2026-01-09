import { useState } from "react"
import { Rental, Product, Customer, RentalItem } from "../types"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search, FileText, Archive } from "lucide-react"
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
  const [showArchived, setShowArchived] = useState(false)

  // ===== estados ORIGINALES (NO SE TOCAN)
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

  // ===== FILTRADO + ORDEN
  const filteredRentals = rentals
    .filter(r => (showArchived ? r.archived : !r.archived))
    .filter(
      r =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm)
    )
    .sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1
      if (a.status !== "active" && b.status === "active") return 1
      if (a.status === "returned" && b.status !== "returned") return 1
      if (a.status !== "returned" && b.status === "returned") return -1
      return 0
    })

  // ===== FUNCIONES EXISTENTES (SIN CAMBIOS)

  const handleAddItem = () => {
    const product = products.find(p => p.id === itemForm.productId)
    if (!product) return

    const qty = Number(itemForm.quantity)
    if (qty > product.availableStock) {
      toast.error(`Solo hay ${product.availableStock} disponibles`)
      return
    }

    const existing = items.find(i => i.productId === product.id)
    if (existing) {
      setItems(
        items.map(i =>
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
    setItems(items.filter(i => i.productId !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Agrega al menos un artículo")
      return
    }

    const customer = customers.find(c => c.id === formData.customerId)
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
      products.map(p => {
        const item = items.find(i => i.productId === p.id)
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
      customers.map(c =>
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
      rentals.map(r =>
        r.id === rental.id ? { ...r, status: "returned" } : r
      )
    )

    onProductsChange(
      products.map(p => {
        const item = rental.items.find(i => i.productId === p.id)
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

  // ===== NUEVA FUNCIÓN (ARCHIVAR)
  const handleArchive = (rental: Rental) => {
    onRentalsChange(
      rentals.map(r =>
        r.id === rental.id ? { ...r, archived: true } : r
      )
    )
    toast.success("Renta archivada")
  }

  // ===== UI
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl tracking-tight">Rentas</h2>
          <p className="text-muted-foreground">
            Gestión de pedidos y rentas
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4 mr-2" />
            Rentas archivadas
          </Button>

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
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar rentas..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredRentals.map(r => (
          <RentalCard
            key={r.id}
            rental={r}
            onReturn={handleReturn}
            onArchive={handleArchive}
          />
        ))}
      </div>

      {filteredRentals.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg">
            No se encontraron rentas
          </h3>
        </div>
      )}
    </div>
  )
}
