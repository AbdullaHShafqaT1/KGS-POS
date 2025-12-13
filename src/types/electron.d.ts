/**
 * Type definitions for Electron API exposed through preload.js
 */

interface ElectronAPI {
  // System info
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };

  // App info
  getAppVersion: () => Promise<string>;
  getAppPath: () => Promise<string>;
  getUserDataPath: () => Promise<string>;

  // Barcode scanner integration
  onBarcodeScan: (callback: (data: { barcode: string; timestamp: number }) => void) => void;
  onBarcodeServerReady: (callback: (data: { ip: string; port: number; url: string }) => void) => void;
  getBarcodeServerInfo: (callback: (data: { ip: string; port: number; url: string }) => void) => void;

  // System operations
  onOnline: (callback: () => void) => void;
  onOffline: (callback: () => void) => void;
  isOnline: () => boolean;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
