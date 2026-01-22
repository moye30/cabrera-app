import { useState } from "react"
import { Rental, Product, Customer, RentalItem } from "../types"
import { Input } from "./ui/input"
import { FileText } from "lucide-react"
import { toast } from "sonner"

import { RentalFormDialog } from "./common/RentalFormDialog"
import { RentalEditFormDialog } from "./common/RentalEditFormDialog"
import { RentalCard } from "./common/RentalCard"
import { ConfirmDialog } from "./common/ConfirmDialog"

interface RentalsManagementProps {
  rentals: Rental[]
  products: Product[]
  customers: Customer[]
  onRentalsChange: (rentals: Rental[]) => void
  onProductsChange: (products: Product[]) => void
}

export function RentalsManagement({
  rentals,
  products,
  customers,
  onRentalsChange,
  onProductsChange,
}: RentalsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRental, setEditingRental] =
    useState<Rental | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rentalToConfirm, setRentalToConfirm] =
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

      const noConflict = returnDate <= r.eventDate || eventDate >= r.returnDate
      return !noConflict 
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
      toast.success("Cotización actualizada")
    } else {
      onRentalsChange([
        ...rentals,
        {
          id: `C${Date.now()}`,
          customerId: customer.id,
          customerName: customer.name,
          companyName: customer.company || "",
          rentalDate: new Date()
            .toISOString()
            .split("T")[0],
          eventDate: formData.eventDate,
          returnDate: formData.returnDate,
          status: "pending",
          items,
          subtotal,
          discount,
          total,
          deposit: 0,
          notes: formData.notes,
        },
      ])

      toast.success("Cotización creada")
    }

    setIsDialogOpen(false)
    setEditingRental(null)
    setItems([])
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

  const handleDelete = (rental: Rental) => {
    onRentalsChange(
      rentals.filter(r => r.id !== rental.id)
    )
    toast.success("Cotización eliminada")
  }

  const handleConfirmClick = (rental: Rental) => {
    setRentalToConfirm(rental)
    setConfirmOpen(true)
  }

  const handleConfirmOrder = () => {
    if (!rentalToConfirm) return

    const updatedProducts = products.map(p => {
      const rentalItem = rentalToConfirm.items.find(
        item => item.productId === p.id
      )
      if (rentalItem) {
        return {
          ...p,
          availableStock: p.availableStock - rentalItem.quantity,
          rentedStock: p.rentedStock + rentalItem.quantity,
        }
      }
      return p
    })

    onProductsChange(updatedProducts)
    
    onRentalsChange(
      rentals.map(r =>
        r.id === rentalToConfirm.id
          ? { ...r, status: "active" }
          : r
      )
    )

    toast.success("Pedido confirmado")
    setConfirmOpen(false)
    setRentalToConfirm(null)
  }

  const filtered = rentals
    .filter(r => r.status === "pending")
    .filter(
      r =>
        r.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm)
    )

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-3xl">Cotizaciones</h2>

        {!editingRental && (
          <RentalFormDialog
            open={isDialogOpen && !editingRental}
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
        )}

        {editingRental && (
          <RentalEditFormDialog
            open={isDialogOpen && !!editingRental}
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
          />
        )}
      </div>

      <Input
        placeholder="Buscar cotizaciones..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {filtered.map(r => (
        <RentalCard
          key={r.id}
          rental={r}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onConfirm={handleConfirmClick}
        />
      ))}

      {!filtered.length && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12" />
          <p>No hay cotizaciones</p>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar pedido"
        description="¿Deseas confirmar este pedido?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmOrder}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
