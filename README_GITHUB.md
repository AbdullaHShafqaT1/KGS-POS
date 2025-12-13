# 🏪 Karachi Garments Store POS System

A modern, offline-first **Point of Sale (POS) system** specifically designed for garment retail stores. Built with React, TypeScript, Electron, and Tailwind CSS.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](package.json)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D4.svg)](https://www.microsoft.com/windows)
[![Node Version](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

## ✨ Features

### 🛍️ Core POS Functionality
- **Product Management**: Add, edit, delete, and categorize products
- **Inventory Tracking**: Real-time stock level monitoring
- **Billing System**: Fast and intuitive billing interface
- **Sales Reports**: Comprehensive analytics and reports
- **Multi-User Support**: Employee management with role-based access

### 📱 Advanced Features
- **Barcode Scanning**: WiFi-enabled barcode scanning via Android/iOS apps
- **PDF Invoices**: Generate professional invoices and receipts
- **Offline First**: Works completely offline with local database
- **Real-time Charts**: Sales analytics and inventory visualization
- **Splash Screen**: Professional animated startup screen

### 🔧 Technical Features
- **Cross-Platform**: Windows desktop application (macOS/Linux ready)
- **Database**: Local IndexedDB with Dexie.js (no internet required)
- **Responsive UI**: Modern UI with Radix UI components
- **TypeScript**: Fully typed codebase for reliability
- **Electron Integration**: Native desktop application features

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **bun** >= 1.0.0
- **Windows 10+** (for desktop app)

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdullaHShafqaT1/KGS-POS.git
cd KGS-POS

# Install dependencies
npm install
# or
bun install

# Run in development mode
npm run electron:dev
# or
bun run electron:dev
```

### Building for Production

```bash
# Build the application
npm run electron:build-win
# or
bun run electron:build-win

# Output files will be in: dist-electron/
```

## 📦 Executable Distribution

### Ready-to-Use Executables
Pre-built executables are available in the releases:
- **Standalone Folder**: `Karachi-Garments-Store-POS-v1.0.0/`
- **ZIP Archive**: `Karachi-Garments-Store-POS-v1.0.0.zip`

### How to Run
1. Download the executable or folder
2. Double-click `Karachi Garment Store POS.exe`
3. The app will launch with all features ready

## 🎯 Usage

### Daily Operations
1. **Login**: Access with employee credentials
2. **Browse Products**: Search or browse product catalog
3. **Scan Barcode** (Optional): Scan products using barcode app
4. **Add to Bill**: Select items and quantities
5. **Generate Invoice**: Complete transaction and print/email receipt
6. **View Reports**: Check daily/monthly sales analytics

### Barcode Scanning
1. Install barcode app on your phone:
   - Android: [Gamma Play](https://play.google.com/store/apps/details?id=com.gamma.scan)
   - iOS: [Scan to Web](https://apps.apple.com/app/scan-to-web/id1234567890)
2. Get your computer's IP address (shown in app)
3. Configure app to send to: `http://<YOUR_IP>:3001/scan`
4. Start scanning products!

See [BARCODE_SCANNER_SETUP.md](BARCODE_SCANNER_SETUP.md) for detailed setup.

## 📁 Project Structure

```
KGS-POS/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel
│   │   ├── auth/           # Authentication
│   │   ├── employee/       # Employee features
│   │   ├── shared/         # Shared components
│   │   ├── ui/             # UI library components
│   │   └── SplashScreen.tsx # Startup animation
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── electron/               # Electron main process
│   ├── main.js            # Main process
│   └── preload.js         # Preload scripts
├── public/                 # Static assets
├── dist/                   # Built web files
├── dist-electron/          # Built executables
├── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React** 18.3+ - UI framework
- **TypeScript** 5.5+ - Type-safe JavaScript
- **Vite** 5.4+ - Build tool and dev server
- **Tailwind CSS** 3.4+ - Utility-first CSS
- **Radix UI** - Accessible component library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Recharts** - Data visualization

### Backend / Desktop
- **Electron** 28.3+ - Desktop application framework
- **Node.js** - JavaScript runtime
- **Express.js** (Barcode Server) - HTTP server

### Database
- **Dexie.js** - IndexedDB wrapper
- **IndexedDB** - Browser-native database (offline)

### Development
- **ESLint** - Code linting
- **TypeScript ESLint** - Type checking
- **electron-builder** - App packaging

## 📊 Database Schema

### Collections
- **Products**: SKU, name, price, stock, category
- **Categories**: Category information
- **Sales**: Transaction records with items
- **Employees**: User accounts and roles
- **Settings**: Application configuration

## 🔒 Security Considerations

- ✅ Offline-first (no external dependencies)
- ✅ Local data storage only
- ✅ Password hashing for users
- ✅ Role-based access control
- ✅ No cloud transmission
- ⚠️ Regular backups recommended

## 📝 Configuration

### Environment Variables
```bash
# .env (optional)
VITE_APP_TITLE="Karachi Garments Store POS"
VITE_APP_VERSION="1.0.0"
```

### App Settings
Settings are stored locally in the app:
- Store name and contact info
- Tax rates and fees
- Default payment methods
- Printer configuration
- User preferences

## 🐛 Troubleshooting

### App Won't Start
1. Clear cache: Delete `AppData/Local/Karachi-Garment-Store-POS`
2. Reinstall the app
3. Check Windows event viewer for errors

### Barcode Scanner Not Working
1. Verify WiFi connection
2. Check firewall allows port 3001
3. Confirm IP address in app settings
4. Test with manual barcode entry first

### Database Issues
1. Export data via Settings > Backup
2. Clear database and restart app
3. Import data from backup

See [BARCODE_SCANNER_SETUP.md](BARCODE_SCANNER_SETUP.md) for more troubleshooting.

## 🚧 Development

### Prerequisites
- Git
- Node.js 18+
- npm or bun

### Setup Development Environment
```bash
git clone https://github.com/AbdullaHShafqaT1/KGS-POS.git
cd KGS-POS
npm install
npm run electron:dev
```

### Available Scripts

```bash
# Development
npm run dev              # Vite dev server
npm run electron:dev    # Electron with Vite

# Building
npm run build           # Build web bundle
npm run electron:build-win   # Build Windows exe
npm run electron:build-portable  # Portable exe

# Quality
npm run lint            # Lint code with ESLint
npm run preview         # Preview build

# Package
npm run electron        # Run Electron app
```

### Code Style
- Follow ESLint configuration
- Use TypeScript for type safety
- Component naming: PascalCase
- File naming: camelCase for utilities, PascalCase for components

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💼 Author

**Abdullah H Shafqat**
- GitHub: [@AbdullaHShafqaT1](https://github.com/AbdullaHShafqaT1)
- Email: abdullahshafqat193909@gmail.com

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
1. Check [BARCODE_SCANNER_SETUP.md](BARCODE_SCANNER_SETUP.md) for setup help
2. Review existing [GitHub Issues](https://github.com/AbdullaHShafqaT1/KGS-POS/issues)
3. Create a new issue with detailed description

## 🎉 Acknowledgments

- Built with React, Electron, and TypeScript
- UI components from Radix UI and Tailwind CSS
- Icons from Lucide React
- PDF generation with jsPDF and html2canvas
- Barcode support via community apps

---

**Made with ❤️ for Karachi Garments Store**

*Transform your garment retail business with modern POS technology* 🚀
