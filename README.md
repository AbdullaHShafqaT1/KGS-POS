# Karachi Garments Store POS System

A modern, offline-first Point of Sale (POS) system designed for garment retail stores. Built with React, TypeScript, Electron, and Tailwind CSS for desktop deployment on Windows systems.

## Features

Core Functionality:
- Product Management: Add, edit, delete, and categorize products with full inventory tracking
- Inventory Control: Real-time stock level monitoring with low stock alerts
- Billing System: Fast and intuitive point-of-sale interface
- Sales Reports: Comprehensive analytics and daily/monthly reports
- Multi-User Support: Employee management with role-based access control

Advanced Features:
- Barcode Scanning: WiFi-enabled barcode scanning via Android/iOS apps
- PDF Invoices: Generate professional invoices and receipts
- Offline First: Complete functionality without internet connection
- Real-time Charts: Sales analytics and inventory visualization
- Splash Screen: Professional animated startup screen

## Technical Specifications

Framework and Libraries:
- React 18.3+ with TypeScript for type-safe component development
- Vite 5.4+ for fast build and development
- Tailwind CSS 3.4+ for styling
- Radix UI for accessible components
- Electron 28.3+ for desktop application

Database:
- Dexie.js with IndexedDB for local-first data storage
- No external database required
- Complete offline capability

Build Tools:
- electron-builder for Windows packaging
- ESLint for code quality
- TypeScript for static type checking

## System Requirements

Minimum:
- OS: Windows 7 SP1 or later
- RAM: 2 GB
- Storage: 500 MB free space
- Processor: 1.5 GHz dual-core

Recommended:
- OS: Windows 10 or Windows 11
- RAM: 4 GB or more
- Storage: 1 GB free space
- Network: WiFi for barcode scanner feature

## Installation and Setup

Extract the Application:
1. Download Karachi-Garments-Store-POS-v1.0.0.zip
2. Extract to preferred location (C:\Program Files\ or C:\Users\YourUsername\AppData\Local\)
3. Verify the extracted folder contains Karachi Garment Store POS.exe

Verify Installation:
1. Navigate to extracted folder
2. Confirm Karachi Garment Store POS.exe is present
3. Check that resources/ folder exists

Create Desktop Shortcut:
1. Right-click Karachi Garment Store POS.exe
2. Select "Send to" then "Desktop (create shortcut)"
3. Alternatively, manually create shortcut through right-click > New > Shortcut

Run the Application:
1. Double-click the desktop shortcut
2. Wait for splash screen animation (3-5 seconds)
3. Application loads with login screen
4. Login with default credentials or employee credentials

## Default Credentials

Super Admin Account:
- Username: SUPadmin
- Password: SUP!@#123

Admin Account:
- Username: Hassan Admin
- Password: Hassan123

## Configuration After Installation

Folder Placement Options:

User AppData (Recommended):
- Path: C:\Users\YourUsername\AppData\Local\Karachi-Garments-Store-POS-v1.0.0\
- Advantages: No admin rights required, per-user data storage, easy backup

Program Files:
- Path: C:\Program Files\Karachi-Garments-Store-POS-v1.0.0\
- Advantages: Standard installation location
- Disadvantages: Requires admin rights, shared across users

Customize Shortcut:
1. Right-click shortcut > Properties
2. Change Icon: Click "Change Icon" > browse to resources/app/public/logo.png
3. Run as Administrator: Check "Advanced" option for barcode server
4. Advanced Options: Adjust window size, startup behavior

Create Start Menu Entry:
1. Navigate to C:\ProgramData\Microsoft\Windows\Start Menu\Programs\
2. Create new shortcut pointing to executable
3. Name it "Karachi Garments Store POS"
4. Application appears in Windows Start Menu

Pin to Taskbar:
1. Right-click desktop shortcut
2. Select "Pin to taskbar"
3. Application accessible from taskbar

## Barcode Scanner Setup

Configuration for Android Devices:

Install Scanner App:
1. Download and install Gamma Play from Google Play Store
2. Open the app on your Android device

Get Server Information:
1. Launch Karachi Garments Store POS application
2. Navigate to Settings or Barcode Configuration screen
3. Note the displayed IP address and port (3001)

Configure Webhook URL:
1. In Gamma Play app settings
2. Set webhook URL to: http://[YOUR_IP]:3001/scan
3. Select POST as request method
4. Save configuration

Test Connection:
1. Scan any barcode in the POS application area
2. Barcode data should appear in the application
3. Product should be identifiable if barcode exists in database

Configuration for iOS Devices:

Install Scanner App:
1. Download and install "Scan to Web" from App Store
2. Alternative: "Barcode to PC" application

Configure Settings:
1. In app settings, enter IP and port details
2. Set format to standard barcode format
3. Enable HTTPS if required by your network

## Development Setup

For developers who want to contribute or modify the codebase:

Clone Repository:
git clone https://github.com/AbdullaHShafqaT1/KGS-POS.git
cd KGS-POS

Install Dependencies:
npm install
or
bun install

Run Development Server:
npm run electron:dev
or
bun run electron:dev

Build for Production:
npm run electron:build-win
or
bun run electron:build-win

Available Scripts:
- npm run dev: Start Vite development server
- npm run build: Build production bundle
- npm run electron:dev: Run Electron with development server
- npm run electron:build-win: Build Windows executable
- npm run lint: Run ESLint code quality checks
- npm run preview: Preview production build

## Project Structure

src/
- App.tsx: Main application component
- main.tsx: Entry point
- components/: React components organized by feature
  - admin/: Admin dashboard and management
  - auth/: Login and authentication
  - employee/: Employee POS interface
  - shared/: Shared components
  - ui/: UI library components
  - super-admin/: Super admin panel
- lib/: Services and utilities
  - database.ts: Dexie database setup
  - authService.ts: Authentication service
  - productService.ts: Product management
  - salesService.ts: Sales tracking
  - pdfService.ts: Invoice generation
  - categoryService.ts: Category management
- pages/: Page components
- hooks/: Custom React hooks
- contexts/: React context providers
- types/: TypeScript type definitions

electron/
- main.js: Electron main process and barcode server
- preload.js: Preload script for IPC communication

## Database Schema

Users Table:
- id: Unique identifier
- username: Login username
- password: User password
- role: User role (super-admin, admin, employee)
- createdAt: Account creation date
- updatedAt: Last modification date

Products Table:
- id: Unique identifier
- name: Product name
- brand: Manufacturer or brand
- size: Product size
- color: Product color
- price: Selling price
- quantity: Current stock level
- barcode: Barcode identifier
- category: Product category
- lowStockThreshold: Alert level for inventory
- createdAt: Record creation date
- updatedAt: Last modification date

Sales Table:
- id: Unique identifier
- invoiceNumber: Sales transaction number
- items: Array of sold items
- subtotal: Total before discounts
- totalDiscount: Applied discount amount
- total: Final amount
- cashierName: Employee name
- date: Transaction date
- paymentMethod: Payment type
- createdAt: Record creation date

Categories Table:
- id: Unique identifier
- name: Category name (English)
- nameUrdu: Category name (Urdu translation)
- createdAt: Record creation date

## Usage Guide

Daily Operations:

Login:
1. Start application
2. Enter username and password
3. Click Login button
4. Access appropriate dashboard based on user role

Browse Products:
1. Navigate to Products section
2. View all products or filter by category
3. Search using product name, brand, or barcode
4. See real-time stock levels

Create a Sale:
1. Go to Billing section
2. Search and select products
3. Enter quantity for each item
4. Apply discount if applicable
5. Select payment method
6. Generate and print invoice
7. Complete transaction

Barcode Scanning:
1. Open barcode scanner app on phone
2. Aim at product barcode
3. Scan product
4. Item automatically adds to current bill
5. Continue scanning or enter quantity manually

Generate Reports:
1. Navigate to Reports section
2. Select date range
3. View sales data, top products, revenue
4. Export or print reports

Manage Inventory:
1. Go to Products section
2. View all inventory
3. Check low stock items
4. Add new products
5. Update quantities
6. Remove discontinued items

## Troubleshooting

Application Won't Start:
1. Ensure Windows 7 SP1 or later installed
2. Run as Administrator if permission denied
3. Delete cache: Remove AppData\Local\Karachi-Garment-Store-POS folder
4. Reinstall application from fresh ZIP extraction
5. Check Windows Event Viewer for detailed errors

Barcode Scanner Not Working:
1. Verify WiFi connection on phone and computer
2. Confirm devices on same network
3. Check IP address displayed in app settings
4. Test URL: http://[IP]:3001 in browser
5. Verify scanner app webhook URL is correct
6. Try manual barcode entry first

Database Errors:
1. Close application completely
2. Delete local database file from AppData
3. Restart application (database recreates)
4. Restore from backup if data loss occurred

Login Issues:
1. Verify username and password are correct
2. Check Caps Lock is off
3. Try super admin credentials (SUPadmin / SUP!@#123)
4. Reset password through admin panel

## Support and Documentation

GitHub Repository:
https://github.com/AbdullaHShafqaT1/KGS-POS

Issue Reporting:
https://github.com/AbdullaHShafqaT1/KGS-POS/issues

Documentation:
- RUNNING_GUIDE.txt: Complete installation and deployment guide
- BARCODE_SCANNER_SETUP.md: Detailed barcode setup instructions
- Application Help: Available in Settings menu

## License

MIT License - See LICENSE file for details

Permission is granted for:
- Commercial use
- Personal use
- Modification
- Distribution

Requirements:
- Proper attribution to original author
- Include copy of license in distributions

## Version Information

Current Version: 1.0.0
Release Date: December 13, 2025
Build: Production Ready
Platform: Windows x64

## Contact and Author

Author: Abdullah H Shafqat
Email: abdullahshafqat193909@gmail.com
GitHub: https://github.com/AbdullaHShafqaT1

## Changelog

Version 1.0.0:
- Initial production release
- Complete offline POS functionality
- Barcode scanning integration
- Professional invoice generation
- Real-time sales analytics
- Multi-user role-based access
- Animated splash screen
- Comprehensive documentation

## Acknowledgments

Built with:
- React and TypeScript for robust application structure
- Electron for cross-platform desktop deployment
- Radix UI for accessible component library
- Tailwind CSS for modern styling
- Dexie.js for efficient offline data management

---

For latest updates and information, visit:
https://github.com/AbdullaHShafqaT1/KGS-POS

Professional Point of Sale System for Karachi Garments Store
