# 🎯 KARACHI GARMENT STORE POS - INSTALLATION & TESTING CHECKLIST

## 📋 PRE-INSTALLATION CHECKLIST

### System Requirements
- [ ] Windows 10 or later
- [ ] Node.js 18+ installed ([Download](https://nodejs.org))
- [ ] At least 2GB free disk space
- [ ] Administrator rights (for installation)

### Optional Hardware
- [ ] Barcode scanner (USB, keyboard emulation mode)
- [ ] Thermal receipt printer (optional, for physical receipts)

---

## 🚀 INSTALLATION STEPS

### Method 1: PowerShell Script (Recommended)
- [ ] Open PowerShell as Administrator
- [ ] Navigate to project folder
- [ ] Run: `.\setup.ps1`
- [ ] Follow on-screen instructions
- [ ] Script completes successfully

### Method 2: Manual Installation
- [ ] Open PowerShell/Command Prompt in project folder
- [ ] Run: `npm install`
- [ ] Wait for installation (2-3 minutes)
- [ ] No errors in console
- [ ] `node_modules` folder created

---

## ✅ POST-INSTALLATION VERIFICATION

### Test Web Version
- [ ] Run: `npm run dev`
- [ ] Browser opens at http://localhost:5173
- [ ] Login screen appears
- [ ] No console errors

### Test Desktop Version
- [ ] Run: `npm run electron:dev`
- [ ] Electron window opens
- [ ] Login screen appears
- [ ] Window is responsive

---

## 🧪 FEATURE TESTING CHECKLIST

### 1. Authentication Tests
#### Super Admin
- [ ] Login: SUPadmin / SUP!@#123
- [ ] Access granted
- [ ] All tabs visible (Billing, Products, Users, Reports)
- [ ] "Reset All Credentials" button visible
- [ ] Logout works

#### Admin
- [ ] Login: Hassan Admin / Hassan123
- [ ] Access granted
- [ ] All tabs visible
- [ ] Can't create other admins (verified)
- [ ] Logout works

#### Invalid Credentials
- [ ] Wrong username → Error message
- [ ] Wrong password → Error message
- [ ] Empty fields → Validation error

### 2. UI/UX Tests
#### Language Toggle
- [ ] Click language icon (🌐)
- [ ] Switch to Urdu (اردو)
- [ ] Text changes to Urdu
- [ ] Layout switches to RTL
- [ ] Switch back to English
- [ ] Layout switches to LTR

#### Theme Toggle
- [ ] Click sun/moon icon
- [ ] Switch to Dark mode
- [ ] Colors change appropriately
- [ ] All text readable
- [ ] Switch to Light mode
- [ ] Back to original colors

### 3. POS/Billing Tests
#### Barcode Scanner
- [ ] Navigate to Billing tab
- [ ] Focus on barcode input
- [ ] Type: MFS001 and press Enter
- [ ] Product added to bill
- [ ] Quantity shows 1
- [ ] Price shows ₨2500

#### Manual Product Selection
- [ ] Click "Browse Products" button
- [ ] Product dialog opens
- [ ] Can search products
- [ ] Click on a product
- [ ] Product added to bill
- [ ] Dialog closes

#### Bill Calculations
- [ ] Add multiple products
- [ ] Increase quantity with + button
- [ ] Subtotal updates correctly
- [ ] Add discount to item
- [ ] Total recalculates
- [ ] Remove item with trash icon
- [ ] Item disappears

#### Generate Bill
- [ ] Fill bill with products
- [ ] Click "Generate Bill"
- [ ] "Print receipt?" prompt appears
- [ ] Choose Yes
- [ ] PDF opens/downloads
- [ ] Receipt shows all details
- [ ] Bill clears after generation
- [ ] Sale saved to history

### 4. Product Management Tests
#### View Products (All Users)
- [ ] Navigate to Products tab
- [ ] Products grid displays
- [ ] Sample products visible (6 items)
- [ ] Search box works
- [ ] Category filter works
- [ ] Low stock alert shows (if any)

#### Add Product (Admin Only)
- [ ] Click "Add Product" button
- [ ] Dialog opens
- [ ] Fill all required fields:
  - [ ] Name: Test Product
  - [ ] Brand: Test Brand
  - [ ] Barcode: TEST001
  - [ ] Category: Select one
  - [ ] Price: 1000
  - [ ] Quantity: 10
- [ ] Click "Add"
- [ ] Success message appears
- [ ] Product appears in grid
- [ ] Can search and find it

#### Edit Product (Admin Only)
- [ ] Click edit icon on a product
- [ ] Dialog opens with data
- [ ] Modify name
- [ ] Click "Save"
- [ ] Success message
- [ ] Changes reflected in grid

#### Delete Product (Admin Only)
- [ ] Click delete icon on a product
- [ ] Confirmation dialog appears
- [ ] Click "Delete"
- [ ] Product removed from grid

#### Add Custom Category (Admin Only)
- [ ] Click "Add Category"
- [ ] Enter name: "Custom Category"
- [ ] Enter Urdu name: "کسٹم زمرہ"
- [ ] Click "Add"
- [ ] Success message
- [ ] Category appears in filter dropdown

### 5. User Management Tests
#### View Users (Admin/Super Admin)
- [ ] Navigate to Users tab
- [ ] User cards display
- [ ] Shows Super Admin (if Super Admin logged in)
- [ ] Shows Admin users
- [ ] Shows Employee users

#### Create Employee (Admin)
- [ ] Click "Create User"
- [ ] Fill username: TestEmployee
- [ ] Fill password: test123
- [ ] Select role: Employee
- [ ] Click "Create User"
- [ ] Success message
- [ ] User appears in list

#### Create Admin (Super Admin Only)
- [ ] Login as Super Admin
- [ ] Click "Create User"
- [ ] Fill username: TestAdmin
- [ ] Fill password: admin123
- [ ] Select role: Admin
- [ ] Click "Create User"
- [ ] Success message
- [ ] User appears in list

#### Reset Password
- [ ] Click "Reset Password" on a user
- [ ] Dialog opens
- [ ] Enter new password
- [ ] Confirm password
- [ ] Click "Reset Password"
- [ ] Success message
- [ ] Logout and login with new password

#### Delete User
- [ ] Click delete icon on employee
- [ ] Confirmation dialog
- [ ] Click "Delete"
- [ ] User removed from list
- [ ] Verify: Can't delete admin as admin (should fail)

#### Reset All Credentials (Super Admin Only)
- [ ] Login as Super Admin
- [ ] Click "Reset All Credentials" button
- [ ] Confirmation dialog appears
- [ ] Click "Reset Everything"
- [ ] All users deleted except Super Admin
- [ ] Super Admin password reset to default
- [ ] Default Admin recreated
- [ ] Auto logout
- [ ] Login with default credentials works

### 6. Reports Tests
#### View Reports Tab
- [ ] Navigate to Reports tab
- [ ] Summary cards display:
  - [ ] Total Sales count
  - [ ] Total Revenue (₨)
  - [ ] Low Stock Items count
  - [ ] Top Selling count
- [ ] Charts render:
  - [ ] Sales Trend (line chart)
  - [ ] Products Distribution (pie chart)

#### Daily Sales Report
- [ ] Click "Export PDF" under Daily Sales
- [ ] PDF generates
- [ ] Contains today's sales
- [ ] Shows invoice numbers
- [ ] Shows totals

#### Weekly Sales Report
- [ ] Click "Export PDF" under Weekly Sales
- [ ] PDF generates
- [ ] Contains last 7 days
- [ ] Correct date range

#### Monthly Sales Report
- [ ] Click "Export PDF" under Monthly Sales
- [ ] PDF generates
- [ ] Contains current month
- [ ] Correct calculations

#### Low Stock Report
- [ ] Go to Inventory tab
- [ ] Click "Export PDF" on Low Stock
- [ ] PDF lists products below threshold
- [ ] Shows current stock levels

#### Top Selling Report
- [ ] Go to Inventory tab
- [ ] Click "Export PDF" on Top Selling
- [ ] PDF lists best sellers
- [ ] Shows quantities sold
- [ ] Shows revenue per product

#### Custom Date Range
- [ ] Go to Custom tab
- [ ] Click "Pick start date"
- [ ] Select date
- [ ] Click "Pick end date"
- [ ] Select later date
- [ ] Click "Export Custom Range Report"
- [ ] PDF generates
- [ ] Contains only sales in range

### 7. Data Persistence Tests
#### Browser Refresh
- [ ] Add some products to bill
- [ ] Refresh browser (F5)
- [ ] Bill clears (expected)
- [ ] Products still exist
- [ ] Sales history preserved
- [ ] Users still exist

#### App Close/Reopen
- [ ] Close application
- [ ] Reopen application
- [ ] Login again
- [ ] All data preserved:
  - [ ] Products
  - [ ] Users
  - [ ] Sales history
  - [ ] Categories

#### Database Initialization
- [ ] Clear browser data / IndexedDB
- [ ] Restart app
- [ ] Default users created:
  - [ ] SUPadmin
  - [ ] Hassan Admin
- [ ] Default categories created (6)
- [ ] Sample products created (6)

### 8. Stock Management Tests
#### Stock Reduction
- [ ] Note product quantity (e.g., 25)
- [ ] Add product to bill (qty: 2)
- [ ] Generate bill
- [ ] Check product in inventory
- [ ] Quantity reduced by 2 (now 23)

#### Out of Stock Prevention
- [ ] Find product with 0 quantity
- [ ] Try to add to bill
- [ ] Error message: "Out of stock"
- [ ] Product not added

#### Low Stock Alert
- [ ] Edit product quantity to 3
- [ ] Set low stock threshold to 5
- [ ] Save product
- [ ] Orange alert banner appears
- [ ] Product listed in Low Stock report

### 9. PDF Receipt Tests
#### Receipt Content
- [ ] Generate a bill
- [ ] Choose to print
- [ ] PDF contains:
  - [ ] Store name: "Karachi Garment Store"
  - [ ] Invoice number (format: INV-YYYYMMDD-XXXX)
  - [ ] Date and time
  - [ ] Cashier name
  - [ ] Product list
  - [ ] Quantities
  - [ ] Prices per item
  - [ ] Discounts
  - [ ] Subtotal
  - [ ] Total discount
  - [ ] Grand total (₨)
  - [ ] Thank you message

#### Receipt Format
- [ ] Proper alignment
- [ ] Readable fonts
- [ ] Thermal printer size (80mm width)
- [ ] All text in English (receipts are English only)

### 10. Performance Tests
#### Search Speed
- [ ] Search for product
- [ ] Results appear instantly (< 100ms)
- [ ] Try partial search
- [ ] Results update in real-time

#### Transaction Speed
- [ ] Add 5 products to bill
- [ ] Update quantities
- [ ] Add discounts
- [ ] Generate bill
- [ ] Total time < 3 seconds

#### App Startup
- [ ] Close app
- [ ] Measure startup time
- [ ] Desktop app opens < 3 seconds
- [ ] Web app loads < 2 seconds

---

## 🏗️ BUILD TESTING CHECKLIST

### Build Desktop Installer
- [ ] Run: `npm run electron:build`
- [ ] Build completes without errors
- [ ] Installer created in `dist-electron/`
- [ ] File size reasonable (~150MB)

### Install Desktop App
- [ ] Double-click installer
- [ ] Installation wizard opens
- [ ] Choose install location
- [ ] Installation completes
- [ ] Desktop shortcut created
- [ ] Start menu entry created

### Launch Desktop App
- [ ] Double-click shortcut
- [ ] App launches
- [ ] No errors
- [ ] Login screen appears
- [ ] All features work
- [ ] Close and reopen works

---

## 🐛 ERROR HANDLING TESTS

### Database Errors
- [ ] Try duplicate barcode → Error message
- [ ] Try empty required fields → Validation error
- [ ] Try invalid price → Validation error

### UI Errors
- [ ] Try to print without items → Error message
- [ ] Try to delete non-existent item → Handled gracefully
- [ ] Network errors (if any) → Proper message

### Permission Errors
- [ ] Employee tries to add product → Access denied
- [ ] Admin tries to create admin → Error message
- [ ] Employee tries to access reports → Hidden/Disabled

---

## 🎓 USER ACCEPTANCE CRITERIA

### For Employees
- [ ] Can login quickly
- [ ] Can scan barcodes easily
- [ ] Can find products manually
- [ ] Can complete sale in < 1 minute
- [ ] Receipt prints correctly
- [ ] Interface is intuitive

### For Admins
- [ ] Can manage products efficiently
- [ ] Can create employees
- [ ] Can view reports
- [ ] Can export PDFs
- [ ] Dashboard is clear

### For Super Admin
- [ ] Has full control
- [ ] Can manage admins
- [ ] Can reset system
- [ ] Override capabilities work

---

## 📊 FINAL SIGN-OFF

### Functionality
- [ ] All features working
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] UI responsive

### Documentation
- [ ] README complete
- [ ] Architecture documented
- [ ] Quick start guide available
- [ ] Code commented

### Deployment
- [ ] Web version builds
- [ ] Desktop app builds
- [ ] Installer works
- [ ] Shortcuts functional

### Training
- [ ] User guide provided
- [ ] Sample data available
- [ ] Support documentation ready

---

## ✅ APPROVAL

**Tested By**: _________________
**Date**: _________________
**Status**: 
- [ ] ✅ Approved for Production
- [ ] 🔄 Needs Minor Fixes
- [ ] ❌ Major Issues Found

**Notes**: 
_________________________________________________
_________________________________________________
_________________________________________________

---

## 📞 POST-DEPLOYMENT CHECKLIST

### First Week
- [ ] Monitor for errors
- [ ] Collect user feedback
- [ ] Fix any issues
- [ ] Train users

### First Month
- [ ] Review sales data
- [ ] Check performance
- [ ] Optimize if needed
- [ ] Plan enhancements

---

**IMPORTANT**: Test everything before production use!

*This checklist ensures a smooth deployment and happy users* ✨
