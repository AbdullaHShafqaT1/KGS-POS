import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Copy, Wifi, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

export const BarcodeConfig: React.FC = () => {
  const { t } = useLanguage();
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Get barcode server info from Electron
    const getServerInfo = async () => {
      try {
        if (typeof window !== 'undefined' && window.electron?.getBarcodeServerInfo) {
          window.electron.getBarcodeServerInfo((info: any) => {
            setServerInfo(info);
            setStatus('success');
          });
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Failed to get barcode server info:', error);
        setStatus('error');
      }
    };

    getServerInfo();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading') {
    return (
      <Card className="p-6 max-w-2xl">
        <div className="animate-pulse">Loading barcode server...</div>
      </Card>
    );
  }

  if (status === 'error' || !serverInfo) {
    return (
      <Card className="p-6 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Barcode server not available. Please restart the application.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h2 className="text-2xl font-bold">Gamma Play Barcode Scanner Setup</h2>
        </div>

        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200">
          <Wifi className="h-4 w-4" />
          <AlertDescription>
            Make sure your Android phone is connected to the same WiFi network as this PC
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Server Info */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-bold text-sm text-gray-600 dark:text-gray-400 mb-3">
              SERVER CONNECTION DETAILS
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                <span>IP Address:</span>
                <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                  {serverInfo.ip}
                </code>
              </div>
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                <span>Port:</span>
                <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                  {serverInfo.port}
                </code>
              </div>
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                <span>Endpoint:</span>
                <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded text-xs">
                  /scan
                </code>
              </div>
            </div>
          </div>

          {/* Full URL */}
          <div className="space-y-2">
            <label className="font-bold text-sm">WEBHOOK URL (Copy & Paste into Gamma Play)</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <code className="text-sm break-all text-blue-900 dark:text-blue-100 font-mono">
                  {serverInfo.url}
                </code>
              </div>
              <Button
                onClick={() => copyToClipboard(serverInfo.url)}
                variant="outline"
                className="h-auto"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Configuration Steps */}
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold mb-3 text-green-900 dark:text-green-100">
              STEPS TO CONFIGURE GAMMA PLAY APP
            </h3>
            <ol className="space-y-2 text-sm list-decimal list-inside text-green-900 dark:text-green-100">
              <li>Open "QR & Barcode Scanner" app on your Android phone</li>
              <li>Tap the menu (three dots) at top right</li>
              <li>Select "Settings"</li>
              <li>Find "Scan History" or "Post/Webhook" section</li>
              <li>Enable "Send to Server" or "Webhook"</li>
              <li>
                Paste this URL into the server field:
                <code className="block bg-white dark:bg-gray-800 p-2 rounded mt-2 font-mono text-xs">
                  {serverInfo.url}
                </code>
              </li>
              <li>Set Format to "Plain Text" or "Custom"</li>
              <li>Save settings</li>
              <li>Done! Now scan any barcode and it will appear in POS</li>
            </ol>
          </div>

          {/* Usage Instructions */}
          <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <h3 className="font-bold mb-3 text-purple-900 dark:text-purple-100">
              HOW TO USE WHILE ADDING/BILLING
            </h3>
            <ul className="space-y-2 text-sm list-disc list-inside text-purple-900 dark:text-purple-100">
              <li>
                <strong>Adding Products:</strong> Scan product barcode → Code auto-fills → Enter
                other details → Save
              </li>
              <li>
                <strong>During Billing:</strong> Scan each product → Auto-adds to cart → Adjust
                qty if needed → Complete bill
              </li>
              <li>
                <strong>Quick Scanning:</strong> Use Batch Scan mode in Gamma Play for multiple
                barcodes at once
              </li>
              <li>
                <strong>QR Codes:</strong> App also reads QR codes for products, if you use them
              </li>
            </ul>
          </div>

          {/* Troubleshooting */}
          <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
            <h3 className="font-bold mb-3 text-orange-900 dark:text-orange-100">
              TROUBLESHOOTING
            </h3>
            <ul className="space-y-2 text-sm text-orange-900 dark:text-orange-100">
              <li>
                <strong>Barcodes not appearing?</strong> Check that phone is on same WiFi and
                server URL is correct
              </li>
              <li>
                <strong>Connection refused?</strong> Make sure POS app is running and port 3001
                is accessible
              </li>
              <li>
                <strong>Wrong format?</strong> Check Gamma Play sends plain text barcodes, not
                JSON
              </li>
              <li>
                <strong>Need to change IP?</strong> Restart POS app to get updated server info
              </li>
            </ul>
          </div>

          {/* Test Info */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
            Server Status: <span className="text-green-600 font-bold">Active</span>
            <br />
            This barcode server will automatically start when POS app launches
          </div>
        </div>
      </Card>
    </div>
  );
};
