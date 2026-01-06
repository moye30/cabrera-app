import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loss, Rental } from "../types";

/* =======================
   COLORES Y ESTILOS
======================= */

const PRIMARY = [37, 99, 235];
const DANGER = [220, 38, 38];
const GRAY = [107, 114, 128];

let cachedLogo: string | null = null;

/* =======================
   CARGAR LOGO (BASE64)
======================= */

const loadLogo = async (): Promise<string> => {
  if (cachedLogo) return cachedLogo;

  const response = await fetch("/logoCabrera.jpeg");
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      cachedLogo = reader.result as string;
      resolve(cachedLogo);
    };
    reader.readAsDataURL(blob);
  });
};

/* =======================
   HEADER CON LOGO
======================= */

const drawHeader = async (
  doc: jsPDF,
  title: string,
  subtitle?: string
) => {
  // Fondo
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 0, 210, 38, "F");

  // Logo
  const logo = await loadLogo();
  doc.addImage(logo, "JPEG", 20, 10, 24, 18);

  // Título
  doc.setFontSize(20);
  doc.setTextColor(...PRIMARY);
  doc.text(title, 50, 22);

  // Subtítulo
  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text(subtitle, 50, 29);
  }

  // Línea separadora
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
};

const drawFooter = (doc: jsPDF) => {
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(
    `Documento generado el ${new Date().toLocaleString("es-MX")}`,
    105,
    285,
    { align: "center" }
  );
};

const drawInfoBlock = (
  doc: jsPDF,
  startY: number,
  data: { label: string; value: string }[]
) => {
  let y = startY;
  doc.setFontSize(10);

  data.forEach(({ label, value }) => {
    doc.setTextColor(...GRAY);
    doc.text(label, 20, y);
    doc.setTextColor(0, 0, 0);
    doc.text(value, 70, y);
    y += 7;
  });

  return y;
};

/* =======================
   REPORTE DE PÉRDIDAS
======================= */

export const generateLossPDF = async (loss: Loss) => {
  const doc = new jsPDF();

  await drawHeader(
    doc,
    "Reporte de Pérdidas",
    "Control interno de daños y extravíos"
  );

  const infoEndY = drawInfoBlock(doc, 55, [
    { label: "Folio:", value: loss.id },
    {
      label: "Fecha de reporte:",
      value: new Date(loss.reportDate).toLocaleDateString("es-MX"),
    },
    { label: "Cliente:", value: loss.customerName },
    { label: "ID de renta:", value: loss.rentalId },
  ]);

  const tableData = loss.items.map((item) => [
    item.productName,
    item.quantity.toString(),
    item.lossType === "broken" ? "Rotura" : "Extravío",
    `$${item.unitPrice.toFixed(2)}`,
    `$${item.totalLoss.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: infoEndY + 6,
    head: [["Artículo", "Cantidad", "Tipo", "Precio Unitario", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: DANGER,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setTextColor(...DANGER);
  doc.text(
    `TOTAL DE PÉRDIDAS: $${loss.totalLoss.toFixed(2)}`,
    190,
    finalY,
    { align: "right" }
  );

  if (loss.notes) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("Notas:", 20, finalY + 12);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(loss.notes, 170);
    doc.text(splitNotes, 20, finalY + 18);
  }

  drawFooter(doc);
  doc.save(`reporte-perdidas-${loss.id}.pdf`);
};

/* =======================
   FACTURA / COTIZACIÓN
======================= */

export const generateInvoicePDF = async (rental: Rental) => {
  const doc = new jsPDF();

  await drawHeader(
    doc,
    "Factura / Cotización",
    "Servicio de renta de mobiliario"
  );

  const infoEndY = drawInfoBlock(doc, 55, [
    { label: "Folio:", value: rental.id },
    { label: "Cliente:", value: rental.customerName },
    {
      label: "Fecha de renta:",
      value: new Date(rental.rentalDate).toLocaleDateString("es-MX"),
    },
    {
      label: "Fecha del evento:",
      value: new Date(rental.eventDate).toLocaleDateString("es-MX"),
    },
    {
      label: "Fecha de devolución:",
      value: rental.returnDate
        ? new Date(rental.returnDate).toLocaleDateString("es-MX")
        : "Pendiente",
    },
  ]);

  const tableData = rental.items.map((item) => [
    item.productName,
    item.quantity.toString(),
    `$${item.unitPrice.toFixed(2)}`,
    `$${item.subtotal.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: infoEndY + 6,
    head: [["Artículo", "Cantidad", "Precio Unitario", "Subtotal"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Subtotal: $${rental.subtotal.toFixed(2)}`, 190, finalY, {
    align: "right",
  });

  let offset = 7;

  if (rental.discount > 0) {
    doc.setTextColor(...DANGER);
    doc.text(
      `Descuento: -$${rental.discount.toFixed(2)}`,
      190,
      finalY + offset,
      { align: "right" }
    );
    offset += 7;
  }

  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY);
  doc.text(`TOTAL: $${rental.total.toFixed(2)}`, 190, finalY + offset, {
    align: "right",
  });

  if (rental.deposit > 0) {
    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text(
      `Depósito: $${rental.deposit.toFixed(2)}`,
      190,
      finalY + offset + 8,
      { align: "right" }
    );
  }

  if (rental.notes) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("Notas:", 20, finalY + offset + 18);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(rental.notes, 170);
    doc.text(splitNotes, 20, finalY + offset + 24);
  }

  drawFooter(doc);
  doc.save(`factura-${rental.id}.pdf`);
};
