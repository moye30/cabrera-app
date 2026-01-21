import { useState } from "react"
import { Rental } from "../types"
import { Input } from "./ui/input"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { RentalCard } from "./common/RentalCard"

interface ConfirmedOrdersManagementProps {
  rentals: Rental[]
  onRentalsChange: (rentals: Rental[]) => void
}

export function ConfirmedOrdersManagement({
  rentals,
  onRentalsChange,
}: ConfirmedOrdersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

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
    onRentalsChange(rentals.filter(r => r.id !== rental.id))
    toast.success("Pedido eliminado")
  }

  const handleReturn = (rental: Rental) => {
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

      {confirmed.map(r => (
        <RentalCard
          key={r.id}
          rental={r}
          onEdit={() => {}}
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
