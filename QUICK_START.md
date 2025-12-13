# 🚀 QUICK START GUIDE - Karachi Garment Store POS

## ⚡ Super Fast Setup (5 Minutes)

### Step 1: Open Terminal in Project Folder
```powershell
cd "C:\Users\Acer\Desktop\projects\POS\karachi-store-nexus-main"
```

### Step 2: Install Everything
```powershell
npm install
```
*This will take 2-3 minutes*

### Step 3: Run the App
```powershell
# Option A: Run in Browser
npm run dev

# Option B: Run as Desktop App
npm run electron:dev
```

### Step 4: Login
- **Super Admin**: SUPadmin / SUP!@#123
- **Admin**: Hassan Admin / Hassan123

## 🎯 What You Get

✅ Complete offline POS system
✅ Barcode scanner support
✅ Product management
✅ User management (3 roles)
✅ Sales reports with charts
✅ PDF receipt generation
✅ English/Urdu bilingual
✅ Dark mode
✅ Desktop app ready

## 📦 Build Desktop App

### Create Windows Installer
```powershell
npm run electron:build
```

### Find Your App
Location: `dist-electron\Karachi Garment Store POS Setup X.X.X.exe`

### Install & Run
1. Double-click the installer
2. Follow installation wizard
3. Desktop shortcut created automatically
4. Click shortcut to launch

## 🔥 Quick Test

### Test POS
1. Login as any user
2. Go to "Billing" tab
3. Type barcode: `MFS001` and press Enter
4. Click "Generate Bill"
5. Choose to print receipt

### Test Products
1. Login as Admin
2. Go to "Products" tab
3. Click "Add Product"
4. Fill in details and save
5. Search for your product

### Test Reports
1. Login as Admin or Super Admin
2. Go to "Reports" tab
3. Click "Export PDF" on any report

## 🛠️ Troubleshooting

### If npm install fails:
```powershell
# Clear cache and try again
npm cache clean --force
npm install
```

### If Electron won't start:
```powershell
# Reinstall Electron
npm install electron --save-dev
npm run electron:dev
```

### If database doesn't initialize:
1. Close app
2. Clear browser data (if using browser)
3. Restart app

## 📝 Sample Data Included

### Products (6 items):
- MFS001 - Men's Formal Shirt (₨2500)
- LCS002 - Ladies Casual Shoes (₨3500)
- KTS003 - Kids T-Shirt (₨1200)
- TC004 - Toy Car (₨450)
- WD005 - Women's Dress (₨4500)
- MS006 - Men's Sneakers (₨5500)

### Categories:
- Shoes, Dresses, Ladies, Gents, Kids, Toys

### Users:
- 1 Super Admin
- 1 Admin
- (Create employees as needed)

## 🎓 First Time Using POS?

### Employee Workflow:
1. **Login** → Enter credentials
2. **Scan** → Use barcode scanner or type code
3. **Add** → Products appear in bill
4. **Discount** → Optional, per item
5. **Generate** → Creates invoice & receipt
6. **Print** → Choose yes/no
7. **Done** → Bill saved automatically

### Admin Workflow:
1. **Manage Products** → Add/Edit/Delete
2. **Manage Users** → Create employees
3. **View Reports** → Sales analytics
4. **Export PDFs** → Download reports

### Super Admin Extras:
1. **Create Admins** → Manage admin users
2. **Reset All** → Factory reset option

## 🌐 Language & Theme

### Switch Language:
- Click language icon (🌐) in top right
- Choose English or اردو

### Change Theme:
- Click sun/moon icon in top right
- Choose Light, Dark, or System

## 📊 Using Reports

### Daily Sales:
- Shows today's transactions
- Exports as PDF

### Low Stock:
- Products below threshold
- Automatic alerts

### Top Selling:
- Best performing products
- Revenue breakdown

### Custom Range:
- Select any date range
- Detailed analytics

## 🖨️ Receipt Format

Each receipt includes:
```
============================
  Karachi Garment Store
    Karachi, Pakistan
----------------------------
Invoice: INV-20241211-0001
Date: 11/12/2024 15:30
Cashier: Hassan Admin
----------------------------
Product          Qty  Total
Men's Shirt       2   ₨5000
Discount              -₨500
----------------------------
TOTAL:               ₨4500
----------------------------
  Thank you, come again!
============================
```

## 💡 Pro Tips

1. **Barcode Scanner Setup**:
   - Set to USB keyboard emulation mode
   - Enable Enter key after scan
   - Test with sample codes

2. **Backup Data**:
   - Browser: Export IndexedDB regularly
   - Desktop: Data in AppData folder

3. **Performance**:
   - Keep under 10,000 products
   - Archive old sales quarterly

4. **Custom Categories**:
   - Click "Add Category" in Products
   - Name in English and Urdu

5. **User Passwords**:
   - No length restrictions
   - Keep secure records

## 🆘 Need Help?

### Check These First:
1. Read README_NEW.md for full details
2. Read ARCHITECTURE.md for technical info
3. Check browser console for errors
4. Verify Node.js version: `node --version` (need 18+)

### Common Issues:

**"Module not found"**
→ Run `npm install` again

**"Database error"**
→ Clear browser cache/IndexedDB

**"Barcode not working"**
→ Type manually first to test

**"PDF won't generate"**
→ Allow pop-ups in browser

## 🎉 You're Ready!

Your POS system is now:
✅ Fully functional offline
✅ Ready for real transactions
✅ Backed by reliable database
✅ Equipped with all features
✅ Deployable as desktop app

**Start selling! 🛍️**

---

*Need to customize? Edit the source files in `src/` folder.*
*Want to rebrand? Change store name in `LanguageContext.tsx`.*
*Questions? Check the detailed documentation.*

**Happy Selling! 💰**
