# Karachi Garment Store POS - Complete Offline Point of Sale System

A full-featured, offline-first Point of Sale system designed specifically for garment stores in Pakistan. Built with React, TypeScript, IndexedDB (via Dexie.js), and Electron for desktop deployment.

## 🎯 Features

### 💰 Point of Sale (POS)
- **100% Offline Operation** - Works without internet using IndexedDB
- **Barcode Scanner Support** - Add products by scanning barcodes
- **Manual Product Selection** - Browse and add products manually
- **Dynamic Discounts** - Apply discounts per item or overall bill
- **Real-time Bill Preview** - See the receipt as you build it
- **Automatic Stock Management** - Stock reduces automatically after each sale
- **PDF Receipt Generation** - Ask before printing receipts
- **Sales History** - Complete record of all transactions

### 📦 Product & Inventory Management
- **Unlimited Products** - Add, edit, delete products
- **Product Details** - Name, Brand, Size, Color, Price, Quantity, Barcode, Category
- **Product Images** - Optional product images
- **Categories** - Preloaded: Shoes, Dresses + unlimited custom categories
- **Low Stock Alerts** - Automatic alerts when stock is low
- **Search & Filter** - Fast product search and category filtering
- **Barcode Management** - Unique barcode for each product

### 👥 User Management (3 Roles)
1. **Super Admin** (SUPadmin / SUP!@#123)
   - Reset all credentials
   - Manage Admin users
   - Full system access

2. **Admin** (Hassan Admin / Hassan123)
   - Create/remove Employee users
   - Reset employee passwords
   - Cannot be deleted by other Admins

3. **Employee**
   - Scan products and generate bills
   - View inventory (read-only)
   - No management capabilities

### 📊 Reports & Analytics
- **Daily/Weekly/Monthly Sales** - Track sales over time
- **Top Selling Products** - See best performers
- **Low Stock Reports** - List of products needing restock
- **Custom Date Range** - Generate reports for any period
- **PDF Export** - All reports exportable as PDF with charts
- **Visual Analytics** - Line charts, pie charts, bar charts

### 🌐 Bilingual Support
- **English/Urdu Toggle** - Switch language on the fly
- **RTL Support** - Proper right-to-left layout for Urdu
- **Currency** - All prices in PKR (₨)

### 🎨 UI/UX Features
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on different screen sizes
- **Modern Interface** - Clean, intuitive POS-style layout
- **Large Buttons** - Easy touch/click targets
- **Fast Workflow** - Optimized for speed

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Database**: Dexie.js (IndexedDB wrapper)
- **PDF Generation**: jsPDF + jspdf-autotable
- **Charts**: Recharts
- **Desktop**: Electron
- **Build Tool**: Vite

## 📋 Why IndexedDB (Dexie.js)?

I chose **Dexie.js** for the offline database because:

1. **Truly Offline** - Works in browser and Electron without external dependencies
2. **Large Storage** - Can store gigabytes of data (way more than LocalStorage)
3. **Fast Queries** - Indexed database with fast search and filtering
4. **Transaction Support** - ACID compliant for data integrity
5. **Easy to Use** - Dexie.js provides a clean API over IndexedDB
6. **TypeScript Support** - Full type safety
7. **No Server Required** - Everything runs locally
8. **Cross-Platform** - Works on Windows, Mac, Linux

### Alternative Options (Not Used)
- **SQLite**: Requires Electron, more complex setup
- **Realm**: Overkill for this use case, larger bundle size
- **Local JSON**: Too slow for large datasets, no query optimization
- **LocalStorage**: 5-10MB limit, not suitable for POS data

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or bun package manager

### Step 1: Install Dependencies

```bash
cd karachi-store-nexus-main
npm install
```

### Step 2: Run in Development Mode

```bash
# Web browser version
npm run dev

# Desktop Electron version (development)
npm run electron:dev
```

The app will open at `http://localhost:5173` (browser) or in an Electron window (desktop).

### Step 3: Build for Production

```bash
# Build web version
npm run build

# Build desktop app (Windows .exe)
npm run electron:build
```

The desktop installer will be created in `dist-electron/` folder.

## 📱 How to Create Desktop Shortcut

### After Building:
1. Run `npm run electron:build`
2. Find the installer in `dist-electron/` folder
3. Install the application
4. Desktop shortcut will be created automatically
5. Double-click the shortcut to launch quickly

### For Development:
1. Run `npm run electron:dev` once
2. The app will stay open for testing
3. Close and reopen as needed

## 🗂️ Database Schema

### Users Table
```typescript
{
  id: number (auto)
  username: string
  password: string
  role: 'super-admin' | 'admin' | 'employee'
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

### Categories Table
```typescript
{
  id: number (auto)
  name: string
  nameUrdu: string
  createdAt: Date
}
```

### Products Table
```typescript
{
  id: number (auto)
  name: string
  brand: string
  size: string
  color: string
  price: number (PKR)
  quantity: number
  image: string
  barcode: string (unique)
  category: string
  lowStockThreshold: number
  createdAt: Date
  updatedAt: Date
}
```

### Sales Table
```typescript
{
  id: number (auto)
  invoiceNumber: string (format: INV-YYYYMMDD-0001)
  items: SaleItem[] (array of products)
  subtotal: number
  totalDiscount: number
  total: number
  cashierName: string
  date: Date
  paymentMethod: 'cash'
  createdAt: Date
}
```

## 📁 Project Structure

```
karachi-store-nexus-main/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminDashboardNew.tsx
│   │   ├── employee/
│   │   │   ├── BillingSystemNew.tsx
│   │   │   └── EmployeeDashboardNew.tsx
│   │   ├── super-admin/
│   │   │   └── SuperAdminPanelNew.tsx
│   │   ├── shared/
│   │   │   ├── ProductManagementNew.tsx
│   │   │   ├── ReportsComponent.tsx
│   │   │   └── UserManagement.tsx
│   │   ├── auth/
│   │   │   └── LoginForm.tsx
│   │   └── ui/ (Shadcn components)
│   ├── lib/
│   │   ├── database.ts (Dexie database setup)
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── salesService.ts
│   │   └── pdfService.ts (PDF generation)
│   ├── contexts/
│   │   └── LanguageContext.tsx (i18n)
│   ├── pages/
│   │   └── Index.tsx (Main router)
│   └── App.tsx (Root component)
├── electron/
│   ├── main.js (Electron main process)
│   └── preload.js (Electron preload script)
├── public/
├── package.json
└── README.md
```

## 🔐 Default Credentials

### Super Admin
- **Username**: SUPadmin
- **Password**: SUP!@#123

### Admin
- **Username**: Hassan Admin
- **Password**: Hassan123

### Note on Security
- Super Admin can reset all credentials from the dashboard
- Admins can reset employee passwords
- Passwords are stored in IndexedDB (consider encryption for production)

## 🎯 Usage Guide

### For Employees (POS Operation)
1. Login with employee credentials
2. Navigate to "Billing" tab
3. Scan barcode or browse products manually
4. Add products to bill
5. Apply discounts if needed
6. Click "Generate Bill"
7. Choose whether to print receipt
8. Bill is automatically saved to sales history

### For Admins (Management)
1. Access all employee features
2. Add/Edit/Delete products
3. Create custom categories
4. Create/Remove employee users
5. Generate reports
6. Export PDFs

### For Super Admin
1. Access all admin features
2. Manage admin users
3. Reset all credentials to factory defaults
4. Full system control

## 📊 Reports Available

1. **Daily Sales Report** - Today's sales
2. **Weekly Sales Report** - Last 7 days
3. **Monthly Sales Report** - Current month
4. **Custom Date Range** - Any period
5. **Low Stock Alert** - Products below threshold
6. **Top Selling Products** - Best performers

All reports include:
- PDF export with logo
- Charts and graphs
- Detailed transaction lists
- Revenue totals

## 🖨️ Receipt Format

Each receipt includes:
- Store logo and name ("Karachi Garment Store")
- Invoice number
- Date and time
- Cashier name
- Product list with quantities
- Individual prices
- Discounts
- Subtotal and Grand Total
- Thank you message

## 🔧 Customization

### Change Store Name
Edit `src/contexts/LanguageContext.tsx`:
```typescript
appTitle: { en: 'Your Store Name', ur: 'آپ کا اسٹور' }
```

### Add More Languages
Extend translations in `LanguageContext.tsx`

### Modify Receipt Template
Edit `src/lib/pdfService.ts` - `generateReceipt()` function

### Change Default Categories
Edit `src/lib/database.ts` - `initializeDatabase()` function

## 🐛 Troubleshooting

### Database not initializing
- Clear browser cache/IndexedDB
- Restart the application

### Barcode scanner not working
- Ensure scanner is in keyboard emulation mode
- Focus on the barcode input field
- Test with sample barcodes: MFS001, LCS002, etc.

### PDF not generating
- Check browser PDF viewer settings
- Allow pop-ups for the application

### Electron app not starting
- Run `npm install` again
- Check Node.js version (18+)
- Delete node_modules and reinstall

## 🚀 Performance Tips

- Keep products list under 10,000 items for best performance
- Archive old sales data periodically
- Use specific search terms instead of wildcards
- Close unused tabs in the dashboard

## 📝 Future Enhancements (Suggestions)

- [ ] Cloud sync option (optional online backup)
- [ ] Receipt printer integration
- [ ] Customer management
- [ ] Loyalty program
- [ ] Multi-store support
- [ ] Advanced analytics dashboard
- [ ] SMS notifications for low stock
- [ ] Barcode label printing

## 📄 License

This project is private and proprietary. All rights reserved.

## 🤝 Support

For issues or questions:
1. Check this README first
2. Review the code comments
3. Test with default credentials
4. Check browser console for errors

---

**Built with ❤️ for Karachi Garment Store**

*Last Updated: December 2024*
