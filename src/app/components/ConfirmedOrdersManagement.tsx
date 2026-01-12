import { Rental } from "../types"
import { Input } from "./ui/input"
import { FileText } from "lucide-react"
import { useState } from "react"
import { RentalCard } from "./common/RentalCard"

interface ConfirmedOrdersManagementProps {
  rentals: Rental[]
}

export function ConfirmedOrdersManagement({
  rentals,
}: ConfirmedOrdersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const confirmed = rentals
    .filter(r => r.status === "active")
    .filter(
      r =>
        r.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm)
    )

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
          onDelete={() => {}}
          onConfirm={() => {}}
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
