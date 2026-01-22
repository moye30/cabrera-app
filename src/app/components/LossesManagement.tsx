import { useState } from "react"
import { Loss, Rental, Product, LossItem } from "../types"
import { Input } from "./ui/input"
import { Search, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { LossFormDialog } from "./common/LossFormDialog"
import { LossCard } from "./common/LossCard"

interface LossesManagementProps {
  losses: Loss[]
  rentals: Rental[]
  products: Product[]
  onLossesChange: (losses: Loss[]) => void
  onProductsChange: (products: Product[]) => void
}

export function LossesManagement({
  losses,
  rentals,
  products,
  onLossesChange,
  onProductsChange,
}: LossesManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    rentalId: "",
    notes: "",
  })

  const [itemForm, setItemForm] = useState({
    productId: "",
    quantity: "",
    lossType: "broken" as "broken" | "lost",
  })

  const [items, setItems] = useState<LossItem[]>([])

  const returnedRentals = rentals.filter(
    (r) => r.status === "returned"
  )

  const filteredLosses = losses.filter(
    (l) =>
      l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.rentalId.includes(searchTerm)
  )


  const handleAddItem = () => {
    const rental = returnedRentals.find(
      (r) => r.id === formData.rentalId
    )
    if (!rental) return

    const rentalItem = rental.items.find(
      (i) => i.productId === itemForm.productId
    )
    if (!rentalItem) return

    const qty = Number(itemForm.quantity)
    if (qty > rentalItem.quantity) {
      toast.error(`Máximo ${rentalItem.quantity}`)
      return
    }

    const product = products.find(
      (p) => p.id === itemForm.productId
    )
    if (!product) return

    const lossPrice = product.lossCost ?? product.unitPrice

    setItems([
      ...items,
      {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        lossType: itemForm.lossType,
        unitPrice: lossPrice,
        totalLoss: qty * lossPrice,
      },
    ])

    setItemForm({
      productId: "",
      quantity: "",
      lossType: "broken",
    })
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.productId !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    const rental = returnedRentals.find(
      (r) => r.id === formData.rentalId
    )
    if (!rental) return

    const totalLoss = items.reduce(
      (sum, item) => sum + item.totalLoss,
      0
    )

    const newLoss: Loss = {
      id: `L${Date.now()}`,
      rentalId: rental.id,
      customerName: rental.customerName,
      items,
      reportDate: new Date().toISOString(),
      totalLoss,
      notes: formData.notes,
    }

    onLossesChange([...losses, newLoss])
    onProductsChange(
      products.map((p) => {
        const item = items.find((i) => i.productId === p.id)
        return item
          ? { ...p, totalStock: p.totalStock - item.quantity }
          : p
      })
    )

    toast.success("Reporte de pérdidas creado correctamente")
    setIsDialogOpen(false)
    setItems([])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl tracking-tight">Pérdidas</h2>
          <p className="text-muted-foreground">
            Gestión de roturas y extravíos
          </p>
        </div>

        <LossFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          rentals={returnedRentals}
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
          placeholder="Buscar reportes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredLosses.map((loss) => (
          <LossCard key={loss.id} loss={loss} />
        ))}
      </div>

      {filteredLosses.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg">
            No se encontraron reportes de pérdidas
          </h3>
        </div>
      )}
    </div>
  )
}
