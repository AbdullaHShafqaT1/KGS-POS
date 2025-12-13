import { db, Sale, SaleItem } from './database';
import { productService } from './productService';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const salesService = {
  async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await db.sales
      .where('date')
      .between(startOfDay(today), endOfDay(today))
      .count();
    return `INV-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  },

  async createSale(
    items: SaleItem[],
    cashierName: string,
    discount: number = 0
  ): Promise<number> {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0) + discount;
    const total = subtotal - totalDiscount;

    const invoiceNumber = await this.generateInvoiceNumber();

    // Reduce stock for each item
    for (const item of items) {
      await productService.reduceStock(item.barcode, item.quantity);
    }

    return await db.sales.add({
      invoiceNumber,
      items,
      subtotal,
      totalDiscount,
      total,
      cashierName,
      date: new Date(),
      paymentMethod: 'cash',
      createdAt: new Date()
    });
  },

  async getAllSales(): Promise<Sale[]> {
    return await db.sales.orderBy('date').reverse().toArray();
  },

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return await db.sales
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  },

  async getSalesToday(): Promise<Sale[]> {
    const today = new Date();
    return await this.getSalesByDateRange(startOfDay(today), endOfDay(today));
  },

  async getSalesThisWeek(): Promise<Sale[]> {
    const today = new Date();
    return await this.getSalesByDateRange(startOfWeek(today), endOfWeek(today));
  },

  async getSalesThisMonth(): Promise<Sale[]> {
    const today = new Date();
    return await this.getSalesByDateRange(startOfMonth(today), endOfMonth(today));
  },

  async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    let sales: Sale[];
    if (startDate && endDate) {
      sales = await this.getSalesByDateRange(startDate, endDate);
    } else {
      sales = await db.sales.toArray();
    }
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  },

  async getTopSellingProducts(limit: number = 10): Promise<Array<{ productName: string; barcode: string; totalQuantity: number; totalRevenue: number }>> {
    const sales = await db.sales.toArray();
    const productStats = new Map<string, { name: string; barcode: string; quantity: number; revenue: number }>();

    sales.forEach(sale => {
      sale.items.forEach(item => {
        const key = item.barcode;
        if (productStats.has(key)) {
          const stats = productStats.get(key)!;
          stats.quantity += item.quantity;
          stats.revenue += item.total;
        } else {
          productStats.set(key, {
            name: item.productName,
            barcode: item.barcode,
            quantity: item.quantity,
            revenue: item.total
          });
        }
      });
    });

    return Array.from(productStats.values())
      .map(stats => ({
        productName: stats.name,
        barcode: stats.barcode,
        totalQuantity: stats.quantity,
        totalRevenue: stats.revenue
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  },

  async getSaleById(id: number): Promise<Sale | undefined> {
    return await db.sales.get(id);
  }
};
