import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
  };
}

const translations: Translations = {
  // App Title
  appTitle: { en: 'Karachi Garment Store', ur: 'کراچی گارمنٹ سٹور' },
  
  // Common
  search: { en: 'Search', ur: 'تلاش' },
  add: { en: 'Add', ur: 'شامل کریں' },
  edit: { en: 'Edit', ur: 'ترمیم' },
  delete: { en: 'Delete', ur: 'حذف کریں' },
  save: { en: 'Save', ur: 'محفوظ کریں' },
  cancel: { en: 'Cancel', ur: 'منسوخ کریں' },
  logout: { en: 'Logout', ur: 'لاگ آؤٹ' },
  close: { en: 'Close', ur: 'بند کریں' },
  confirm: { en: 'Confirm', ur: 'تصدیق کریں' },
  yes: { en: 'Yes', ur: 'ہاں' },
  no: { en: 'No', ur: 'نہیں' },
  
  // Login
  login: { en: 'Login', ur: 'لاگ ان' },
  username: { en: 'Username', ur: 'صارف نام' },
  password: { en: 'Password', ur: 'پاس ورڈ' },
  signIn: { en: 'Sign In', ur: 'داخل ہوں' },
  
  // Dashboard
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  products: { en: 'Products', ur: 'مصنوعات' },
  inventory: { en: 'Inventory', ur: 'انوینٹری' },
  sales: { en: 'Sales', ur: 'فروخت' },
  reports: { en: 'Reports', ur: 'رپورٹس' },
  users: { en: 'Users', ur: 'صارفین' },
  settings: { en: 'Settings', ur: 'ترتیبات' },
  
  // POS
  pos: { en: 'Point of Sale', ur: 'فروخت کا نظام' },
  billing: { en: 'Billing', ur: 'بلنگ' },
  scanBarcode: { en: 'Scan Barcode', ur: 'بارکوڈ اسکین کریں' },
  addProduct: { en: 'Add Product', ur: 'مصنوعات شامل کریں' },
  quantity: { en: 'Quantity', ur: 'مقدار' },
  price: { en: 'Price', ur: 'قیمت' },
  discount: { en: 'Discount', ur: 'رعایت' },
  total: { en: 'Total', ur: 'کُل' },
  subtotal: { en: 'Subtotal', ur: 'ذیلی کُل' },
  generateBill: { en: 'Generate Bill', ur: 'بل بنائیں' },
  printReceipt: { en: 'Print Receipt', ur: 'رسید پرنٹ کریں' },
  
  // Products
  productName: { en: 'Product Name', ur: 'مصنوعات کا نام' },
  brand: { en: 'Brand', ur: 'برانڈ' },
  size: { en: 'Size', ur: 'سائز' },
  color: { en: 'Color', ur: 'رنگ' },
  stock: { en: 'Stock', ur: 'اسٹاک' },
  category: { en: 'Category', ur: 'قسم' },
  barcode: { en: 'Barcode', ur: 'بارکوڈ' },
  lowStock: { en: 'Low Stock', ur: 'کم اسٹاک' },
  
  // Categories
  shoes: { en: 'Shoes', ur: 'جوتے' },
  dresses: { en: 'Dresses', ur: 'لباس' },
  ladies: { en: 'Ladies', ur: 'خواتین' },
  gents: { en: 'Gents', ur: 'مرد' },
  kids: { en: 'Kids', ur: 'بچے' },
  toys: { en: 'Toys', ur: 'کھلونے' },
  
  // Reports
  dailySales: { en: 'Daily Sales', ur: 'روزانہ فروخت' },
  weeklySales: { en: 'Weekly Sales', ur: 'ہفتہ وار فروخت' },
  monthlySales: { en: 'Monthly Sales', ur: 'ماہانہ فروخت' },
  topSelling: { en: 'Top Selling', ur: 'سب سے زیادہ فروخت' },
  revenue: { en: 'Revenue', ur: 'آمدنی' },
  
  // User Management
  createUser: { en: 'Create User', ur: 'صارف بنائیں' },
  resetPassword: { en: 'Reset Password', ur: 'پاس ورڈ ری سیٹ کریں' },
  role: { en: 'Role', ur: 'کردار' },
  admin: { en: 'Admin', ur: 'ایڈمن' },
  employee: { en: 'Employee', ur: 'ملازم' },
  superAdmin: { en: 'Super Admin', ur: 'سپر ایڈمن' },
  
  // Messages
  success: { en: 'Success', ur: 'کامیابی' },
  error: { en: 'Error', ur: 'خرابی' },
  productAdded: { en: 'Product added successfully', ur: 'مصنوعات کامیابی سے شامل کی گئی' },
  productUpdated: { en: 'Product updated successfully', ur: 'مصنوعات کامیابی سے اپ ڈیٹ کی گئی' },
  productDeleted: { en: 'Product deleted successfully', ur: 'مصنوعات کامیابی سے حذف کی گئی' },
  saleSaved: { en: 'Sale saved successfully', ur: 'فروخت کامیابی سے محفوظ کی گئی' },
  
  // Currency
  pkr: { en: 'PKR', ur: '₨' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.dir = lang === 'ur' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
