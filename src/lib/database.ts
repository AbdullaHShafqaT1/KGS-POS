import Dexie, { Table } from 'dexie';

// Database schema and interfaces
export interface User {
  id?: number;
  username: string;
  password: string;
  role: 'super-admin' | 'admin' | 'employee';
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id?: number;
  name: string;
  nameUrdu?: string;
  createdAt?: Date;
}

export interface Product {
  id?: number;
  name: string;
  brand: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image?: string;
  barcode: string;
  category: string;
  lowStockThreshold?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaleItem {
  productId: number;
  productName: string;
  barcode: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface Sale {
  id?: number;
  invoiceNumber: string;
  items: SaleItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  cashierName: string;
  date: Date;
  paymentMethod: 'cash';
  createdAt?: Date;
}

// Dexie IndexedDB Database Class
class KarachiStoreDB extends Dexie {
  users!: Table<User>;
  categories!: Table<Category>;
  products!: Table<Product>;
  sales!: Table<Sale>;

  constructor() {
    super('KarachiStoreDB');
    
    this.version(1).stores({
      users: '++id, username, role',
      categories: '++id, name',
      products: '++id, barcode, name, category, quantity',
      sales: '++id, invoiceNumber, date, cashierName'
    });
  }
}

export const db = new KarachiStoreDB();

// Initialize database with default data
export async function initializeDatabase() {
  const superAdminExists = await db.users.where('role').equals('super-admin').count();
  
  if (superAdminExists === 0) {
    await db.users.add({
      username: 'SUPadmin',
      password: 'SUP!@#123',
      role: 'super-admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.users.add({
      username: 'Hassan Admin',
      password: 'Hassan123',
      role: 'admin',
      createdBy: 'SUPadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  const categoriesCount = await db.categories.count();
  
  if (categoriesCount === 0) {
    await db.categories.bulkAdd([
      { name: 'Shoes', nameUrdu: 'جوتے', createdAt: new Date() },
      { name: 'Dresses', nameUrdu: 'لباس', createdAt: new Date() },
      { name: 'Ladies', nameUrdu: 'خواتین', createdAt: new Date() },
      { name: 'Gents', nameUrdu: 'مرد', createdAt: new Date() },
      { name: 'Kids', nameUrdu: 'بچے', createdAt: new Date() },
      { name: 'Toys', nameUrdu: 'کھلونے', createdAt: new Date() }
    ]);
  }

  const productsCount = await db.products.count();
  
  if (productsCount === 0) {
    await db.products.bulkAdd([
      {
        name: "Men's Formal Shirt",
        brand: 'Bonanza',
        size: 'L',
        color: 'White',
        price: 2500,
        quantity: 25,
        barcode: 'MFS001',
        category: 'Gents',
        lowStockThreshold: 5,
        createdAt: new Date()
      },
      {
        name: 'Ladies Casual Shoes',
        brand: 'Bata',
        size: '38',
        color: 'Black',
        price: 3500,
        quantity: 15,
        barcode: 'LCS002',
        category: 'Shoes',
        lowStockThreshold: 3,
        createdAt: new Date()
      },
      {
        name: 'Kids T-Shirt',
        brand: 'Outfitters Junior',
        size: 'M',
        color: 'Blue',
        price: 1200,
        quantity: 30,
        barcode: 'KTS003',
        category: 'Kids',
        lowStockThreshold: 10,
        createdAt: new Date()
      },
      {
        name: 'Toy Car',
        brand: 'Hot Wheels',
        size: 'Standard',
        color: 'Red',
        price: 450,
        quantity: 50,
        barcode: 'TC004',
        category: 'Toys',
        lowStockThreshold: 15,
        createdAt: new Date()
      },
      {
        name: "Women's Dress",
        brand: 'Khaadi',
        size: 'M',
        color: 'Green',
        price: 4500,
        quantity: 12,
        barcode: 'WD005',
        category: 'Ladies',
        lowStockThreshold: 3,
        createdAt: new Date()
      },
      {
        name: "Men's Sneakers",
        brand: 'Servis',
        size: '42',
        color: 'Black',
        price: 5500,
        quantity: 8,
        barcode: 'MS006',
        category: 'Shoes',
        lowStockThreshold: 2,
        createdAt: new Date()
      }
    ]);
  }
}
