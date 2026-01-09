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

  const [formData, setFormData] = useState({
    customerId: "",
    rentalDate: new Date().toISOString().split("T")[0],
    eventDate: "",
    returnDate: "",
    deposit: "",
    notes: "",
  })

  const [itemForm, setItemForm] = useState({
    productId: "",
    quantity: "",
  })

  const [items, setItems] = useState<RentalItem[]>([])

  // =============================
  // NUEVA FUNCIÓN CLAVE
  // =============================
  const getAvailableStockForDates = (
    product: Product,
    start: string,
    end: string
  ) => {
    const used = rentals.reduce((sum, rental) => {
      if (
        rental.status !== "returned" &&
        rental.eventDate < end &&
        rental.returnDate > start
      ) {
        const item = rental.items.find(i => i.productId === product.id)
        return item ? sum + item.quantity : sum
      }
      return sum
    }, 0)

    return product.totalStock - used
  }

  const handleAddItem = () => {
    const product = products.find(p => p.id === itemForm.productId)
    if (!product) return

    if (!formData.eventDate || !formData.returnDate) {
      toast.error("Selecciona fechas de entrega y recolección")
      return
    }

    const available = getAvailableStockForDates(
      product,
      formData.eventDate,
      formData.returnDate
    )

    const qty = Number(itemForm.quantity)

    if (qty > available) {
      toast.error(`Solo hay ${available} disponibles para esas fechas`)
      return
    }

    const existing = items.find(i => i.productId === product.id)

    if (existing) {
      if (existing.quantity + qty > available) {
        toast.error(`Excede el stock disponible (${available})`)
        return
      }

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
      eventDate: formData.eventDate,
      returnDate: formData.returnDate,
      status: "active",
      subtotal,
      discount,
      total,
      deposit: Number(formData.deposit) || 0,
      notes: formData.notes,
    }

    onRentalsChange([...rentals, newRental])

    // ❌ YA NO SE MODIFICA EL STOCK AQUÍ

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

    toast.success("Renta marcada como devuelta")
  }

  const handleArchive = (rental: Rental) => {
    onRentalsChange(
      rentals.map(r =>
        r.id === rental.id ? { ...r, archived: true } : r
      )
    )
    toast.success("Renta archivada")
  }

  const filteredRentals = rentals
    .filter(r => (showArchived ? r.archived : !r.archived))
    .filter(
      r =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm)
    )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl">Rentas</h2>

        <RentalFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          customers={customers}
          products={products.map(p => ({
            ...p,
            availableStock:
              formData.eventDate && formData.returnDate
                ? getAvailableStockForDates(
                    p,
                    formData.eventDate,
                    formData.returnDate
                  )
                : p.totalStock,
          }))}
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

      <Input
        placeholder="Buscar rentas..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {filteredRentals.map(r => (
        <RentalCard
          key={r.id}
          rental={r}
          onReturn={handleReturn}
          onArchive={handleArchive}
        />
      ))}

      {filteredRentals.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12" />
          <h3>No se encontraron rentas</h3>
        </div>
      )}
    </div>
  )
}
