import jsPDF from "jspdf";
import QRCode from "qrcode";
import { DigitalReceipt } from "@/types/receipt";
import { formatCurrency } from "./utils";

/**
 * Generates an authoritative, beautifully formatted PDF receipt for SmartCart AI.
 * Triggers a direct browser download.
 */
export async function downloadReceiptPdf(receipt: DigitalReceipt): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Header background banner
  doc.setFillColor(11, 68, 59); // #0B443B deep teal
  doc.rect(margin, y, contentWidth, 24, "F");

  // SmartCart AI Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SmartCart AI", margin + 8, y + 11);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("SMART SHOPPING • FASTER CHECKOUT", margin + 8, y + 17);

  // Status Badge in header
  doc.setFillColor(16, 185, 129); // #10B981 emerald
  doc.roundedRect(pageWidth - margin - 38, y + 6, 30, 8, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("PAID & VERIFIED", pageWidth - margin - 35, y + 11.5);

  y += 30;

  // Store & Invoice Information
  doc.setTextColor(16, 43, 53); // #102B35
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(receipt.storeName || "SmartCart Supermarket", margin, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(receipt.storeAddress || "Hitech City, Hyderabad, Telangana - 500081", margin, y);

  y += 4.5;
  doc.text(`GSTIN: ${receipt.storeGstin || "36AABCS1429B1Z8"}  |  Cart: ${receipt.cartTag || "SmartCart"}`, margin, y);

  y += 8;

  // Invoice Meta Box
  doc.setFillColor(247, 250, 249);
  doc.setDrawColor(229, 235, 232);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "FD");

  const formattedDate = new Date(receipt.purchaseDate).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("RECEIPT NO.", margin + 6, y + 6);
  doc.text("DATE & TIME", margin + 50, y + 6);
  doc.text("PAYMENT METHOD", margin + 105, y + 6);
  doc.text("TRANSACTION ID", margin + 145, y + 6);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 43, 53);
  doc.text(receipt.receiptNumber || receipt.orderId, margin + 6, y + 13);
  doc.text(formattedDate, margin + 50, y + 13);
  doc.text(receipt.paymentMethod || "UPI", margin + 105, y + 13);
  doc.text(receipt.transactionId || "-", margin + 145, y + 13);

  y += 26;

  // Items Purchased Table Header
  doc.setFillColor(240, 244, 242);
  doc.rect(margin, y, contentWidth, 7, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("ITEM", margin + 4, y + 4.8);
  doc.text("PRICE", margin + 95, y + 4.8);
  doc.text("QTY", margin + 125, y + 4.8);
  doc.text("TOTAL", pageWidth - margin - 6, y + 4.8, { align: "right" });

  y += 9;

  // Items List
  doc.setFont("helvetica", "normal");
  doc.setTextColor(16, 43, 53);

  for (const item of receipt.items) {
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    const itemName = item.productName.length > 40 ? item.productName.substring(0, 38) + "..." : item.productName;
    doc.text(itemName, margin + 4, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.unit || item.brand || "Standard Unit", margin + 4, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(16, 43, 53);
    doc.text(formatCurrency(item.unitPrice), margin + 95, y);
    doc.text(String(item.quantity), margin + 128, y);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(item.total), pageWidth - margin - 6, y, { align: "right" });

    // Item underline
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

    y += 9.5;
  }

  y += 4;

  // Totals Section
  const totalsY = y;
  const totalsBoxX = margin + 80;
  const totalsBoxWidth = contentWidth - 80;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalsBoxX, totalsY, totalsBoxWidth, 38, 2, 2, "FD");

  let lineY = totalsY + 6;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Items Total (${receipt.itemCount || receipt.items.length} items)`, totalsBoxX + 6, lineY);
  doc.text(formatCurrency(receipt.grossSubtotal), pageWidth - margin - 6, lineY, { align: "right" });

  if (receipt.savings > 0) {
    lineY += 6;
    doc.setTextColor(16, 185, 129); // emerald
    doc.setFont("helvetica", "bold");
    doc.text("Discount / Savings", totalsBoxX + 6, lineY);
    doc.text(`-${formatCurrency(receipt.savings)}`, pageWidth - margin - 6, lineY, { align: "right" });
  }

  lineY += 6;
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  const taxAmount = receipt.taxInclusiveAmount || Math.round(receipt.finalAmount * 0.05 * 100) / 100;
  doc.text("GST (5% Included)", totalsBoxX + 6, lineY);
  doc.text(formatCurrency(taxAmount), pageWidth - margin - 6, lineY, { align: "right" });

  lineY += 7;
  doc.setDrawColor(11, 68, 59);
  doc.line(totalsBoxX + 6, lineY - 2, pageWidth - margin - 6, lineY - 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 68, 59);
  doc.text("Grand Total", totalsBoxX + 6, lineY + 3.5);
  doc.text(formatCurrency(receipt.finalAmount), pageWidth - margin - 6, lineY + 3.5, { align: "right" });

  y = totalsY + 44;

  // Exit QR and Pass Section
  doc.setFillColor(235, 248, 245);
  doc.setDrawColor(197, 237, 226);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, "FD");

  // Generate QR Code data URL
  try {
    const qrPayload = JSON.stringify({
      type: "SMARTCART_EXIT_CREDENTIAL_V1",
      token: receipt.exitCredential?.token || "",
      orderId: receipt.orderId,
      exitCode: receipt.exitCode,
      storeId: receipt.storeId,
    });

    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 120,
      color: {
        dark: "#0B443B",
        light: "#FFFFFF",
      },
    });

    doc.addImage(qrDataUrl, "PNG", margin + 6, y + 4, 26, 26);
  } catch {
    // If QR rendering fails, draw fallback text
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 68, 59);
  doc.text("Exit Gate Clearance Pass", margin + 38, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(74, 114, 107);
  doc.text("Scan this QR code or enter code at store automated turnstiles.", margin + 38, y + 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(11, 68, 59);
  doc.text(`EXIT CODE:  ${receipt.exitCode}`, margin + 38, y + 24);

  y += 40;

  // Footer notes
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This is an official computer-generated digital tax invoice issued by SmartCart AI. No physical signature required.",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  doc.save(`SmartCart-Receipt-${receipt.orderId}.pdf`);
}
