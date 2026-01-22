# Instrucciones para Agentes de IA en Cabrera App

## Descripción General del Proyecto

**Cabrera** es un sistema de gestión de rentas de mobiliario construido con React/TypeScript, Vite y Tailwind CSS. Rastrea productos, clientes, rentas y pérdidas con una base de datos respaldada por localStorage y generación de facturas en PDF.

## Arquitectura

### Modelo de Datos (`src/app/types/index.ts`)
- **Product**: Seguimiento de inventario con totalStock, availableStock, rentedStock, precios
- **Customer**: Perfiles de clientes con contacto, porcentaje de descuento, historial de pedidos
- **Rental**: Gestión de pedidos con estado ("pending" → "active" → "returned"/"overdue"), lista de artículos, totales financieros
- **Loss**: Seguimiento de daños/pérdidas vinculados a rentas con desglose a nivel de artículos
- **DashboardStats**: Métricas calculadas (activeRentals, totalRevenue, inventoryValue, availabilityRate)

### Gestión de Estado
Estado a nivel de App en `App.tsx` con persistencia en localStorage:
- Products, Customers, Rentals, Losses se cargan a través de funciones en `storage.ts`
- El componente padre pasa datos + callbacks a los componentes de características
- Renderizado impulsado por estado: las tarjetas renderizan diferentes acciones basadas en rental.status

### Directorios Clave
- `src/app/components/`: Gestión de características (ProductsManagement, RentalsManagement, etc.)
- `src/app/components/common/`: Tarjetas/diálogos reutilizables (RentalCard, RentalFormDialog)
- `src/app/components/ui/`: Componentes Radix UI envueltos tipo shadcn
- `src/app/utils/`: storage.ts (CRUD de localStorage), pdf.ts (generación de facturas con jsPDF)

## Patrones Críticos

### Patrón de Componentes: Management → Card + Dialog
1. `RentalsManagement.tsx` gestiona estado: array de rentas, formData, searchTerm
2. `RentalFormDialog.tsx` maneja entrada (selección de producto, campos de fecha, tabla de artículos)
3. `RentalCard.tsx` muestra vista compacta con vista de detalles expandible/contraíble
4. Las acciones disparan callbacks: onRentalsChange, onEdit, onDelete, onConfirm, onReturn

### Manejo de Formularios
- Usa componentes controlados con `useState` para cada sección de formulario
- La propiedad `open` del diálogo controla visibilidad, callback `onOpenChange`
- **Validación inline**: Comprueba restricciones antes de agregar artículos (ver `RentalsManagement.handleAddItem`)
- Usa biblioteca `sonner` para notificaciones toast: `toast.success("mensaje")`, `toast.error("mensaje")`

### Persistencia en localStorage
- Claves con namespace: `mobiliaria_products`, `mobiliaria_rentals`, etc.
- Obtén datos al montar App vía `useEffect`, serializa/deserializa con JSON
- Siempre llama a la función de guardado después de actualizar el estado para persistir

### Generación de PDF (`utils/pdf.ts`)
- Helper asincrónico `generateInvoicePDF(rental)` maneja layouts complejos
- Cachea logo para evitar descargas repetidas
- Usa jsPDF + autoTable para facturas
- Se dispara por botón FileText en RentalCard

### Framework UI
- **Componentes Radix UI** envueltos en `src/app/components/ui/` (Dialog, Select, Input, Button, etc.)
- **Tailwind CSS** para estilos con colores de tema personalizados
- **Iconos Lucide React** para consistencia visual
- Dialog/Popover para modales, StatusBadge para estados de renta

## Flujo de Trabajo de Desarrollo

### Build y Ejecución
```bash
pnpm dev        # Inicia servidor Vite dev en http://localhost:5173
pnpm build      # Build de producción a dist/
```

### Alias de Rutas
- `@/` → `src/` (configurado en vite.config.ts y tsconfig.json)
- Siempre usa `@/app/types` y `@/app/components/ui/` para imports

### Testing/Debugging
- No hay tests unitarios configurados actualmente
- Verifica la consola del navegador para errores; localStorage persiste entre sesiones
- Verifica transiciones de estado de renta en lógica de filtrado de MonthlyReport

## Estilo de Código y Convenciones

1. **TypeScript**: Modo strict desactivado, usa interfaces para modelos de datos
2. **React Hooks**: Componentes funcionales con useState/useEffect/useMemo
3. **Campos de Estado**: Usa uniones de literales de cadena (ej: `status: "pending" | "active" | "returned" | "overdue"`)
4. **Nomenclatura**: Prefija manejadores de eventos con `on` (onRentalsChange, onEdit, onDelete)
5. **Fechas**: Formato de cadena ISO (new Date().toISOString().split("T")[0] para inputs de fecha)
6. **i18n**: Etiquetas en español en la UI ("Rentas Activas", "Cotización", etc.) - mantén consistencia
7. **Diálogos Reutilizables**: Extrae lógica de formularios en componentes *FormDialog separados, evita formularios inline

## Puntos de Integración

### Validación de Datos
- Disponibilidad de producto: `availableStock >= cantidad de artículos de renta`
- Descuento de cliente: Aplicado en cálculo de total de renta
- Fechas de renta: eventDate debe ser ≥ rentalDate, returnDate ≥ eventDate

### Comunicación Entre Componentes
- RentalsManagement.tsx inicia ciclo de vida de renta
- Dashboard.tsx calcula estadísticas vía useMemo desde arrays de Rental/Loss
- MonthlyReport.tsx filtra por date.getMonth() y rental.status === "returned"
- ConfirmedOrdersManagement.tsx muestra rentas activas esperando devolución

## Tareas Comunes

### Agregar un Nuevo Campo a Product
1. Actualiza interfaz `Product` en `src/app/types/index.ts`
2. Actualiza campos de entrada en `ProductFormDialog.tsx`
3. Modifica `getInitialProducts()` en storage.ts (si aplica)
4. Actualiza cualquier filtrado/cálculo en componentes de gestión

### Crear un Nuevo Reporte
1. Agrega componente en `src/app/components/Reports/`
2. Recibe rentals/losses como props y filtra/calcula
3. Usa Card + useMemo para cálculos
4. Conecta al enrutamiento de vista en App.tsx

### Generar Nuevo PDF
1. Agrega función de exportación en `src/app/utils/pdf.ts` (sigue patrón de `generateInvoicePDF`)
2. Llama desde botón de acción de componente (ver icono FileText en RentalCard)
3. Maneja carga asincrónica de logo
4. Usa autoTable para datos estructurados

## Trampas y Problemas Conocidos

- Dependencia de Prisma listada pero no activamente usada; localStorage es única fuente de datos
- Sin error boundaries: excepciones no manejadas quebrarán la app
- El z-index del diálogo puede conflictuar si múltiples modales se abren simultáneamente
- La generación de PDF bloquea la UI; considera manejo asincrónico para lotes grandes
- El estado del menú móvil se gestiona por separado; verifica responsividad en pantallas más pequeñas
