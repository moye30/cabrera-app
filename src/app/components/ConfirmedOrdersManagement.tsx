import { useState } from "react"
import { Rental, Product, Customer, RentalItem } from "../types"
import { Input } from "./ui/input"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { RentalCard } from "./common/RentalCard"
import { RentalEditFormDialog } from "./common/RentalEditFormDialog"

interface ConfirmedOrdersManagementProps {
  rentals: Rental[]
  products: Product[]
  customers: Customer[]
  onRentalsChange: (rentals: Rental[]) => void
  onProductsChange: (products: Product[]) => void
}

export function ConfirmedOrdersManagement({
  rentals,
  products,
  customers,
  onRentalsChange,
  onProductsChange,
}: ConfirmedOrdersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRental, setEditingRental] =
    useState<Rental | null>(null)

  const [formData, setFormData] = useState({
    customerId: "",
    rentalDate: "",
    eventDate: "",
    returnDate: "",
    notes: "",
  })

  const [itemForm, setItemForm] = useState({
    productId: "",
    quantity: "",
  })

  const [items, setItems] = useState<RentalItem[]>([])

  // Función para verificar si un producto está disponible en el rango de fechas
  const isProductAvailableForDates = (
    productId: string,
    eventDate: string,
    returnDate: string,
    excludeRentalId?: string
  ): boolean => {
    const activeRentals = rentals.filter(
      r => r.status === "active" && r.id !== excludeRentalId
    )

    return !activeRentals.some(r => {
      const rentalItem = r.items.find(i => i.productId === productId)
      if (!rentalItem) return false

      // NO hay conflicto si:
      // - La nueva renta termina antes o en el día que comienza la existente (returnDate <= r.eventDate)
      // - O la nueva renta comienza en o después del día que termina la existente (eventDate >= r.returnDate)
      // Hay conflicto si AMBAS condiciones son falsas
      const noConflict = returnDate <= r.eventDate || eventDate >= r.returnDate
      return !noConflict // Retorna true si HAY conflicto
    })
  }

  const handleAddItem = () => {
    const product = products.find(
      p => p.id === itemForm.productId
    )
    if (!product) return

    const qty = Number(itemForm.quantity)
    if (!qty || qty <= 0) {
      toast.error("Cantidad inválida")
      return
    }

    // Validar disponibilidad según fechas
    if (!formData.eventDate || !formData.returnDate) {
      toast.error("Debes especificar las fechas de entrega y recolección")
      return
    }

    if (!isProductAvailableForDates(
      product.id,
      formData.eventDate,
      formData.returnDate,
      editingRental?.id
    )) {
      toast.error(`El producto "${product.name}" no está disponible para el rango de fechas seleccionado`)
      return
    }

    const existing = items.find(
      i => i.productId === product.id
    )

    if (existing) {
      setItems(
        items.map(i =>
          i.productId === product.id
            ? {
                ...i,
                quantity: i.quantity + qty,
                subtotal:
                  (i.quantity + qty) * i.unitPrice,
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

    if (!items.length) {
      toast.error("Agrega al menos un artículo")
      return
    }

    const customer = customers.find(
      c => c.id === formData.customerId
    )
    if (!customer) return

    const subtotal = items.reduce(
      (s, i) => s + i.subtotal,
      0
    )
    const discount =
      subtotal * (customer.discountPercentage / 100)
    const total = subtotal - discount

    if (editingRental) {
      onRentalsChange(
        rentals.map(r =>
          r.id === editingRental.id
            ? {
                ...r,
                items,
                eventDate: formData.eventDate,
                returnDate: formData.returnDate,
                notes: formData.notes,
                subtotal,
                discount,
                total,
              }
            : r
        )
      )
      toast.success("Pedido actualizado")
    }

    setIsDialogOpen(false)
    setEditingRental(null)
    setItems([])
    setFormData({
      customerId: "",
      rentalDate: "",
      eventDate: "",
      returnDate: "",
      notes: "",
    })
  }

  const handleEdit = (rental: Rental) => {
    setEditingRental(rental)
    setFormData({
      customerId: rental.customerId,
      rentalDate: rental.rentalDate,
      eventDate: rental.eventDate,
      returnDate: rental.returnDate,
      notes: rental.notes,
    })
    setItems(rental.items)
    setItemForm({ productId: "", quantity: "" })
    setIsDialogOpen(true)
  }

  const confirmed = rentals
    .filter(r => r.status === "active")
    .filter(
      r =>
        (r.companyName || r.customerName)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm)
    )

  const handleDelete = (rental: Rental) => {
    const updatedProducts = products.map(p => {
      const rentalItem = rental.items.find(
        item => item.productId === p.id
      )
      if (rentalItem) {
        return {
          ...p,
          availableStock: p.availableStock + rentalItem.quantity,
          rentedStock: p.rentedStock - rentalItem.quantity,
        }
      }
      return p
    })

    onRentalsChange(rentals.filter(r => r.id !== rental.id))
    onProductsChange(updatedProducts)
    toast.success("Pedido eliminado y stock restaurado")
  }

  const handleReturn = (rental: Rental) => {
    const updatedProducts = products.map(p => {
      const rentalItem = rental.items.find(
        item => item.productId === p.id
      )
      if (rentalItem) {
        return {
          ...p,
          availableStock: p.availableStock + rentalItem.quantity,
          rentedStock: p.rentedStock - rentalItem.quantity,
        }
      }
      return p
    })

    onProductsChange(updatedProducts)
    
    onRentalsChange(
      rentals.map(r =>
        r.id === rental.id
          ? { ...r, status: "returned" }
          : r
      )
    )
    toast.success("Pedido marcado como devuelto")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl">Pedidos Confirmados</h2>

      <Input
        placeholder="Buscar pedidos..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {editingRental && (
        <RentalEditFormDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingRental(null)
              setItems([])
              setFormData({
                customerId: "",
                rentalDate: "",
                eventDate: "",
                returnDate: "",
                notes: "",
              })
            }
          }}
          rental={editingRental}
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
          title="Editar pedido"
        />
      )}

      {confirmed.map(r => (
        <RentalCard
          key={r.id}
          rental={r}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReturn={handleReturn}
        />
      ))}

      {!confirmed.length && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12" />
          <p>No hay pedidos confirmados</p>
        </div>
      )}
    </div>
  )
}
