import { useState } from "react"
import { Rental } from "../types"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search, FileArchive } from "lucide-react"
import { RentalCard } from "./common/RentalCard"

interface RentalsManagementProps {
  rentals: Rental[]
  onRentalsChange: (rentals: Rental[]) => void
}

export function RentalsManagement({
  rentals,
  onRentalsChange,
}: RentalsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  /* ======================================================
     FILTRO GLOBAL (BUSCADOR)
     → Busca en TODAS las rentas, incluso archivadas
  ====================================================== */
  const searchedRentals = rentals.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /* ======================================================
     SEPARACIÓN DE RENTAS
  ====================================================== */
  const active = searchedRentals.filter(
    (r) => r.status === "active" && !r.archived
  )

  const returned = searchedRentals.filter(
    (r) => r.status === "returned" && !r.archived
  )

  const archived = searchedRentals.filter((r) => r.archived)

  /* ======================================================
     HANDLERS
  ====================================================== */
  const handleReturn = (rental: Rental) => {
    onRentalsChange(
      rentals.map((r) =>
        r.id === rental.id
          ? { ...r, status: "returned" }
          : r
      )
    )
  }

  const handleArchive = (rental: Rental) => {
    onRentalsChange(
      rentals.map((r) =>
        r.id === rental.id
          ? { ...r, archived: true }
          : r
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h2 className="text-3xl tracking-tight">Rentas</h2>
    <p className="text-muted-foreground">
      Gestión de pedidos y rentas
    </p>
  </div>

  {/* BOTONES DE ACCIÓN */}
  <div className="flex gap-2">
    {/* 👉 ESTE ES TU BOTÓN ORIGINAL DE NUEVA RENTA */}
    <Button onClick={() => setIsDialogOpen(true)}>
      Nueva renta
    </Button>

    {/* 👉 BOTÓN NUEVO PARA VER ARCHIVADAS */}
    <Button
      variant="outline"
      onClick={() => setShowArchived(!showArchived)}
    >
      <FileArchive className="mr-2 h-4 w-4" />
      {showArchived ? "Ver rentas activas" : "Rentas archivadas"}
    </Button>
  </div>
</div>


      {/* BUSCADOR */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar rentas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* LISTADO */}
      <div className="space-y-4">
        {!showArchived && (
          <>
            {active.map((r) => (
              <RentalCard
                key={r.id}
                rental={r}
                onReturn={handleReturn}
                onArchive={handleArchive}
              />
            ))}

            {returned.map((r) => (
              <RentalCard
                key={r.id}
                rental={r}
                onReturn={handleReturn}
                onArchive={handleArchive}
              />
            ))}
          </>
        )}

        {showArchived &&
          archived.map((r) => (
            <RentalCard
              key={r.id}
              rental={r}
              onReturn={handleReturn}
              onArchive={handleArchive}
            />
          ))}
      </div>
    </div>
  )
}
