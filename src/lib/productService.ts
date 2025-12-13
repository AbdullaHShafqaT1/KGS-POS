import { db, Product } from './database';

// Product catalog and inventory management
export const productService = {
  async getAllProducts(): Promise<Product[]> {
    return await db.products.toArray();
  },

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return await db.products.where('barcode').equals(barcode).first();
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.products.where('category').equals(category).toArray();
  },

  async getLowStockProducts(): Promise<Product[]> {
    const products = await db.products.toArray();
    return products.filter(p => p.quantity <= (p.lowStockThreshold || 5));
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const products = await db.products.toArray();
    const term = searchTerm.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.barcode.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    // Check if barcode already exists
    const existing = await db.products.where('barcode').equals(product.barcode).first();
    if (existing) {
      throw new Error('Product with this barcode already exists');
    }

    return await db.products.add({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<number> {
    return await db.products.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteProduct(id: number): Promise<void> {
    await db.products.delete(id);
  },

  async updateStock(id: number, quantityChange: number): Promise<void> {
    const product = await db.products.get(id);
    if (product) {
      await db.products.update(id, {
        quantity: product.quantity + quantityChange,
        updatedAt: new Date()
      });
    }
  },

  async reduceStock(barcode: string, quantity: number): Promise<void> {
    const product = await db.products.where('barcode').equals(barcode).first();
    if (product && product.id) {
      const newQuantity = Math.max(0, product.quantity - quantity);
      await db.products.update(product.id, {
        quantity: newQuantity,
        updatedAt: new Date()
      });
    }
  }
};
