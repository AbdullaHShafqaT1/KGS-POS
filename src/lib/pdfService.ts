import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Sale, Product } from './database';
import { format } from 'date-fns';

export const pdfService = {
  generateReceipt(sale: Sale, askBeforePrint: boolean = true): void {
    if (askBeforePrint) {
      const shouldPrint = window.confirm('Do you want to print the receipt?');
      if (!shouldPrint) return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200] // Thermal printer size
    });

    // Store Logo/Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Karachi Garment Store', 40, 10, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Karachi, Pakistan', 40, 15, { align: 'center' });
    doc.text('Tel: +92-XXX-XXXXXXX', 40, 19, { align: 'center' });
    
    // Line separator
    doc.line(5, 22, 75, 22);

    // Invoice Details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice: ${sale.invoiceNumber}`, 5, 27);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${format(sale.date, 'dd/MM/yyyy HH:mm')}`, 5, 32);
    doc.text(`Cashier: ${sale.cashierName}`, 5, 37);
    
    doc.line(5, 40, 75, 40);

    // Items Table
    const tableData = sale.items.map(item => [
      item.productName,
      item.quantity.toString(),
      `Rs.${Math.round(item.price)}`,
      item.discount > 0 ? `Rs.${Math.round(item.discount)}` : '-',
      `Rs.${Math.round(item.total)}`
    ]);

    autoTable(doc, {
      startY: 43,
      head: [['Product', 'Qty', 'Price', 'Disc', 'Total']],
      body: tableData,
      theme: 'plain',
      styles: { 
        fontSize: 8,
        cellPadding: 1
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 12, halign: 'right' },
        3: { cellWidth: 10, halign: 'right' },
        4: { cellWidth: 13, halign: 'right' }
      },
      margin: { left: 5, right: 5 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 5;

    // Totals
    doc.line(5, finalY, 75, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Subtotal:`, 5, finalY + 5);
    doc.text(`Rs.${Math.round(sale.subtotal)}`, 70, finalY + 5, { align: 'right' });
    
    if (sale.totalDiscount > 0) {
      doc.text(`Discount:`, 5, finalY + 10);
      doc.text(`-Rs.${Math.round(sale.totalDiscount)}`, 70, finalY + 10, { align: 'right' });
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`TOTAL:`, 5, finalY + 15);
    doc.text(`Rs.${Math.round(sale.total)}`, 70, finalY + 15, { align: 'right' });
    
    doc.line(5, finalY + 18, 75, finalY + 18);

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for shopping!', 40, finalY + 25, { align: 'center' });
    doc.text('Visit us again!', 40, finalY + 30, { align: 'center' });

    // Auto print or download
    if (window.navigator.userAgent.indexOf('Electron') > -1) {
      // In Electron, auto-print
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } else {
      // In browser, download
      doc.save(`receipt-${sale.invoiceNumber}.pdf`);
    }
  },

  generateSalesReport(sales: Sale[], title: string = 'Sales Report'): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Karachi Garment Store', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(title, 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 38, { align: 'center' });

    // Summary
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = sales.length;

    doc.setFontSize(12);
    doc.text(`Total Sales: ${totalSales}`, 20, 50);
    doc.text(`Total Revenue: Rs.${totalRevenue.toFixed(2)}`, 20, 57);

    // Sales Table
    const tableData = sales.map(sale => [
      sale.invoiceNumber,
      format(sale.date, 'dd/MM/yyyy HH:mm'),
      sale.cashierName,
      sale.items.length.toString(),
      `Rs.${sale.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 65,
      head: [['Invoice #', 'Date/Time', 'Cashier', 'Items', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyyMMdd')}.pdf`);
  },

  generateLowStockReport(products: Product[]): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Karachi Garment Store', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Low Stock Alert Report', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 38, { align: 'center' });

    doc.text(`Total Low Stock Items: ${products.length}`, 20, 50);

    // Products Table
    const tableData = products.map(product => [
      product.barcode,
      product.name,
      product.category,
      product.quantity.toString(),
      (product.lowStockThreshold || 5).toString(),
      `Rs.${product.price.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 58,
      head: [['Barcode', 'Product Name', 'Category', 'Current Stock', 'Threshold', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [231, 76, 60] },
      styles: { fontSize: 9 }
    });

    doc.save(`low-stock-report-${format(new Date(), 'yyyyMMdd')}.pdf`);
  },

  generateTopSellingReport(products: Array<{ productName: string; barcode: string; totalQuantity: number; totalRevenue: number }>): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Karachi Garment Store', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Top Selling Products Report', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 38, { align: 'center' });

    // Products Table
    const tableData = products.map((product, index) => [
      (index + 1).toString(),
      product.barcode,
      product.productName,
      product.totalQuantity.toString(),
      `Rs.${product.totalRevenue.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 48,
      head: [['Rank', 'Barcode', 'Product Name', 'Units Sold', 'Total Revenue']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [46, 204, 113] },
      styles: { fontSize: 9 }
    });

    doc.save(`top-selling-report-${format(new Date(), 'yyyyMMdd')}.pdf`);
  }
};
