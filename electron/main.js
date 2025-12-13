const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const http = require('http');
const os = require('os');

let mainWindow;
let barcodeServer;

// Get local network IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// HTTP server for barcode scanner webhook
function startBarcodeServer() {
  const PORT = 3001;
  barcodeServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url.includes('/scan') && (req.method === 'POST' || req.method === 'PUT')) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          let barcode = body;

          try {
            const jsonData = JSON.parse(body);
            barcode = jsonData.barcode || jsonData.code || jsonData.result || body;
          } catch (e) {}

          barcode = String(barcode).trim();
          console.log(`[Barcode] ${barcode}`);

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('barcode-scanned', { barcode, timestamp: Date.now() });
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, barcode }));
        } catch (error) {
          console.error('[Error]', error.message);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }

    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    if (req.url === '/' && req.method === 'GET') {
      const localIP = getLocalIP();
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>POS Scanner Ready</h1><p>http://${localIP}:${PORT}/scan</p>`);
      return;
    }

    res.writeHead(404);
    res.end();
  });

  barcodeServer.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`\n========================================`);
    console.log(`Barcode Server: http://${localIP}:${PORT}/scan`);
    console.log(`========================================\n`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../public/logo.png'),
    show: false, // Don't show until ready
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });

  // Send barcode server info to renderer on load
  mainWindow.webContents.once('did-finish-load', () => {
    const localIP = getLocalIP();
    mainWindow.webContents.send('barcode-server-ready', {
      ip: localIP,
      port: 3001,
      url: `http://${localIP}:3001/scan`,
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
  startBarcodeServer();
}

const createMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],{ label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        ...(isDev ? [{ role: 'toggleDevTools' }] : []),
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen'
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (barcodeServer) {
    barcodeServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});

ipcMain.on('get-barcode-server-info', (event) => {
  const localIP = getLocalIP();
  event.reply('barcode-server-info', {
    ip: localIP,
    port: 3001,
    url: `http://${localIP}:3001/scan`,
  });
});
