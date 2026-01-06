import { useState } from "react"
import { Product } from "../types"
import { Input } from "./ui/input"
import { Search, Package } from "lucide-react"
import { toast } from "sonner"

import { ProductCard } from "./common/ProductCard"
import { ProductFormDialog } from "./common/ProductFormDialog"

interface ProductsManagementProps {
  products: Product[]
  onProductsChange: (products: Product[]) => void
}

export function ProductsManagement({
  products,
  onProductsChange,
}: ProductsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    totalStock: "",
    unitPrice: "",
    image: undefined as string | undefined,
  })

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              category: formData.category,
              totalStock: Number(formData.totalStock),
              availableStock:
                p.availableStock +
                (Number(formData.totalStock) - p.totalStock),
              unitPrice: Number(formData.unitPrice),
              image: formData.image ?? p.image,
            }
          : p
      )

      onProductsChange(updated)
      toast.success("Producto actualizado correctamente")
    } else {
      onProductsChange([
        ...products,
        {
          id: Date.now().toString(),
          name: formData.name,
          category: formData.category,
          totalStock: Number(formData.totalStock),
          availableStock: Number(formData.totalStock),
          rentedStock: 0,
          unitPrice: Number(formData.unitPrice),
          image: formData.image,
        },
      ])

      toast.success("Producto agregado correctamente")
    }

    setFormData({
      name: "",
      category: "",
      totalStock: "",
      unitPrice: "",
      image: undefined,
    })
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl tracking-tight">Inventario</h2>
          <p className="text-muted-foreground">
            Gestión de productos y stock
          </p>
        </div>

        <ProductFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingProduct={editingProduct}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={(p) => {
              setEditingProduct(p)
              setFormData({
                name: p.name,
                category: p.category,
                totalStock: p.totalStock.toString(),
                unitPrice: p.unitPrice.toString(),
                image: p.image,
              })
              setIsDialogOpen(true)
            }}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg">No se encontraron productos</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Comienza agregando tu primer producto"}
          </p>
        </div>
      )}
    </div>
  )
}
