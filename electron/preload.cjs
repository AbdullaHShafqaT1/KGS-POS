const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // System info
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },

  // IPC methods for app communication
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),

  // Barcode scanner integration
  onBarcodeScan: (callback) => {
    ipcRenderer.on('barcode-scanned', (event, data) => {
      callback(data);
    });
  },

  onBarcodeServerReady: (callback) => {
    ipcRenderer.on('barcode-server-ready', (event, data) => {
      callback(data);
    });
  },

  getBarcodeServerInfo: (callback) => {
    ipcRenderer.on('barcode-server-info', (event, data) => {
      callback(data);
    });
    ipcRenderer.send('get-barcode-server-info');
  },

  // System operations
  onOnline: (callback) => {
    window.addEventListener('online', callback);
  },
  onOffline: (callback) => {
    window.addEventListener('offline', callback);
  },
  isOnline: () => navigator.onLine,
});
