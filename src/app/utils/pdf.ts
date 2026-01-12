import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Loss, Rental } from "../types"

/* =======================
   ESTILO CORPORATIVO
======================= */

const DARK = [33, 33, 33]
const GRAY = [120, 120, 120]

let cachedLogo: string | null = null

/* =======================
   UTILIDADES
======================= */

const formatDate = (date = new Date()) =>
  date.toISOString().split("T")[0]

const sanitize = (text: string) =>
  text.replace(/\s+/g, "_").replace(/[^\w]/g, "")

/* =======================
   CARGAR LOGO (SEGURO)
======================= */

const loadLogo = async (): Promise<string | null> => {
  try {
    if (cachedLogo) return cachedLogo

    const res = await fetch("/logoCabrera.jpeg")
    const blob = await res.blob()

    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        cachedLogo = reader.result as string
        resolve(cachedLogo)
      }
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/* =======================
   HEADER SIMPLE
======================= */

const drawHeader = async (doc: jsPDF, title: string) => {
  const logo = await loadLogo()

  if (logo) {
    doc.addImage(logo, "JPEG", 20, 15, 30, 20)
  }

  doc.setFontSize(16)
  doc.setTextColor(...DARK)
  doc.text("CABRERA MOBILIARIA", 60, 22)

  doc.setFontSize(10)
  doc.setTextColor(...GRAY)
  doc.text("Renta de mobiliario para eventos", 60, 28)

  doc.setFontSize(14)
  doc.setTextColor(...DARK)
  doc.text(title, 20, 50)

  doc.setDrawColor(...GRAY)
  doc.line(20, 54, 190, 54)
}

/* =======================
   BLOQUE INFO
======================= */

const drawInfoBlock = (
  doc: jsPDF,
  startY: number,
  data: { label: string; value: string }[]
) => {
  let y = startY
  doc.setFontSize(10)

  data.forEach(({ label, value }) => {
    doc.setTextColor(...GRAY)
    doc.text(label, 20, y)
    doc.setTextColor(...DARK)
    doc.text(value, 70, y)
    y += 7
  })

  return y
}

/* =======================
   FOOTER
======================= */

const drawFooter = (doc: jsPDF) => {
  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text(
    `Documento generado el ${new Date().toLocaleString("es-MX")}`,
    105,
    285,
    { align: "center" }
  )
}

/* =======================
   REPORTE DE PÉRDIDAS
======================= */

export const generateLossPDF = async (loss: Loss) => {
  const doc = new jsPDF()

  await drawHeader(doc, "Reporte de Pérdidas")

  const infoEndY = drawInfoBlock(doc, 65, [
    { label: "Folio:", value: loss.id },
    {
      label: "Fecha:",
      value: new Date(loss.reportDate).toLocaleDateString("es-MX"),
    },
    { label: "Cliente:", value: loss.customerName },
    { label: "Renta:", value: loss.rentalId },
  ])

  autoTable(doc, {
    startY: infoEndY + 8,
    head: [["Artículo", "Cantidad", "Tipo", "Precio", "Total"]],
    body: loss.items.map((i) => [
      i.productName,
      i.quantity,
      i.lossType === "broken" ? "Daño" : "Extravío",
      `$${i.unitPrice.toFixed(2)}`,
      `$${i.totalLoss.toFixed(2)}`,
    ]),
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: DARK,
    },
  })

  const y = (doc as any).lastAutoTable.finalY + 10

  doc.setFontSize(12)
  doc.text(`TOTAL: $${loss.totalLoss.toFixed(2)}`, 190, y, {
    align: "right",
  })

  drawFooter(doc)

  const filename = `Perdidas_${sanitize(
    loss.customerName
  )}_${loss.id}_${formatDate()}.pdf`

  doc.save(filename)
}

/* =======================
   FACTURA / COTIZACIÓN
======================= */

export const generateInvoicePDF = async (rental: Rental) => {
  const doc = new jsPDF()

  await drawHeader(doc, "Cotización / Factura")

  const today = formatDate()

  const infoEndY = drawInfoBlock(doc, 65, [
    { label: "Folio:", value: rental.id },
    { label: "Cliente:", value: rental.customerName },
    { label: "Fecha cotización:", value: today },
    {
      label: "Entrega:",
      value: new Date(rental.deliveryDate).toLocaleDateString("es-MX"),
    },
    {
      label: "Recolección:",
      value: new Date(rental.returnDate).toLocaleDateString("es-MX"),
    },
  ])

  autoTable(doc, {
    startY: infoEndY + 8,
    head: [["Artículo", "Cantidad", "Precio", "Subtotal"]],
    body: rental.items.map((i) => [
      i.productName,
      i.quantity,
      `$${i.unitPrice.toFixed(2)}`,
      `$${i.subtotal.toFixed(2)}`,
    ]),
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: DARK,
    },
  })

  const y = (doc as any).lastAutoTable.finalY + 10

  doc.setFontSize(11)
  doc.text(`Subtotal: $${rental.subtotal.toFixed(2)}`, 190, y, {
    align: "right",
  })

  doc.text(`Descuento: $${rental.discount.toFixed(2)}`, 190, y + 6, {
    align: "right",
  })

  doc.setFontSize(13)
  doc.text(`TOTAL: $${rental.total.toFixed(2)}`, 190, y + 14, {
    align: "right",
  })

  drawFooter(doc)

  const filename = `Cotizacion_${sanitize(
    rental.customerName
  )}_${rental.id}_${today}.pdf`

  doc.save(filename)
}
