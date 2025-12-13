# QR & Barcode Scanner (Gamma Play) - Complete Setup Guide

## Overview
You're using **QR & Barcode Scanner by Gamma Play** - an excellent professional-grade app for POS systems. It supports webhooks (HTTP POST), which allows it to send scanned barcodes directly to your POS system.

---

## PART 1: ANDROID PHONE SETUP

### Step 1: Download & Install Gamma Play App
1. Open **Google Play Store** on your Android phone
2. Search for: `QR & Barcode Scanner`
3. Find the app by **Gamma Play** (look for green/yellow icon)
4. Tap **Install**
5. Wait for installation to complete

### Step 2: Launch the App & Initial Setup
1. Open "QR & Barcode Scanner" app
2. Grant camera permissions when prompted (required for scanning)
3. You should see a camera preview with scanning crosshairs

---

## PART 2: BARCODE SERVER CONFIGURATION

### Step 3: Get Your PC's IP Address
The barcode server runs on your Windows PC. Follow these steps:

**Option A: From POS App (Easiest)**
1. Launch POS app on PC
2. Go to **Settings → Barcode Scanner Setup**
3. Your IP address will be displayed: `192.168.x.x`
4. Copy the URL shown: `http://192.168.x.x:3001/scan`

**Option B: From Command Prompt (Manual)**
1. Press `Win + R`
2. Type: `cmd` and press Enter
3. Type: `ipconfig`
4. Look for line starting with "IPv4 Address"
5. Note the number (usually `192.168.1.x`)

### Step 4: Verify Network Connection
**CRITICAL: Both your PC and Android phone MUST be on the same WiFi network**

To verify:
1. PC: Open Command Prompt
2. Type: `ipconfig`
3. Find your WiFi network name (SSID)
4. Android: Open Settings → WiFi
5. Connect to the **same WiFi network**
6. Verify the network names match

**Example:**
```
PC WiFi: "Home-WiFi"
Android WiFi: "Home-WiFi" ✓ (Correct)

PC WiFi: "Home-WiFi" 
Android WiFi: "Mobile-Hotspot" ✗ (Wrong - won't work!)
```

---

## PART 3: GAMMA PLAY APP CONFIGURATION

### Step 5: Configure Webhook in Gamma Play App

**Method 1: Using App Settings (Recommended)**

1. Open "QR & Barcode Scanner" app on Android
2. Tap the **hamburger menu** (three horizontal lines) at top left
3. Select **"Settings"**
4. Find section: **"Webhook"** or **"Send to Server"**
5. Tap to enable/turn ON
6. In the URL field, paste:
   ```
   http://YOUR_IP_HERE:3001/scan
   ```
   (Replace `YOUR_IP_HERE` with your actual IP, e.g., `http://192.168.1.5:3001/scan`)

7. **Important Settings:**
   - Request Type: **POST**
   - Content Type: **Plain Text** or **Text/Plain**
   - Format: **Plain** (not JSON if possible)
   - Enable: "Send after each scan" ✓

8. Tap **Save** or **Done**

**Method 2: Via QR Code (If app supports)**
1. In POS Settings → Barcode Scanner Setup
2. Scan the QR code generated (if available)
3. App will auto-configure the webhook URL

---

## PART 4: TESTING THE CONNECTION

### Step 6: Test Barcode Scanner

**Test 1: Health Check**
1. Open web browser on PC (Chrome, Edge, Firefox)
2. Go to: `http://localhost:3001/health`
3. You should see: `{"status":"ok"}`
4. This confirms barcode server is running

**Test 2: Test Scan**
1. Keep POS app running in background (terminal visible)
2. Open Gamma Play app on Android
3. Point at any barcode (product, book, can, etc.)
4. Tap the **Scan** button or capture icon
5. **Check the POS Terminal** - you should see:
   ```
   [Barcode] 1234567890
   ```
6. If barcode appears in terminal → Connection is WORKING ✓

**Test 3: Full Integration Test**
1. In POS app, go to **Billing/POS** section
2. Scan a barcode with Android app
3. Barcode should auto-appear in the barcode input field
4. Product should auto-add to cart
5. If this works → Full integration is SUCCESSFUL ✓

---

## PART 5: DAILY USAGE

### During Product Management (Adding New Products)

**Scenario: Adding new jeans to system**

1. Open POS app → **Product Management**
2. Click **"Add New Product"**
3. In "Barcode" field, leave empty (you'll scan it)
4. Have the physical product jeans in front of you
5. **Use Gamma Play app to scan the barcode on jeans**
6. Barcode auto-fills in the form
7. Fill in: Name, Category, Price, etc.
8. Click **Save**

### During Billing/Checkout

**Scenario: Customer buying 3 items**

1. Open POS app → **Billing/POS**
2. You see barcode input field at top
3. **Pick up 1st product (T-shirt)**
4. **Scan barcode using Gamma Play** on your Android phone
5. T-shirt auto-adds to cart
6. **Pick up 2nd product (Jeans)**
7. **Scan barcode**
8. Jeans auto-adds to cart
9. **Pick up 3rd product (Shoes)**
10. **Scan barcode**
11. Shoes auto-adds to cart
12. Adjust quantities manually if needed (if customer wants 2 of something)
13. Apply discount if applicable
14. Click **Generate Bill**
15. Choose **Download PDF** or **Print**
16. Done! Repeat for next customer

### Using Batch Scan Mode (For Speed Testing)

The Gamma Play app has a **Batch Scan** feature for scanning multiple items quickly:

1. Open Gamma Play
2. Tap menu → **Batch Scan** mode
3. Scan multiple barcodes continuously
4. Each barcode is sent to your POS
5. All appear in cart automatically
6. Perfect for large orders

---

## PART 6: TROUBLESHOOTING

### Issue: Barcodes Not Appearing in POS

**Checklist:**
1. ✓ Is POS app running? (Check terminal should show barcode server message)
2. ✓ Is Android phone on same WiFi as PC? (Check WiFi network names match)
3. ✓ Is barcode server starting? (Check terminal for "[Barcode Server Started]" message)
4. ✓ Did you paste correct URL in Gamma Play? (Should include `:3001/scan`)
5. ✓ Did you enable Webhook in Gamma Play settings?
6. ✓ Is barcode valid? (Try scanning different barcodes)

**Quick Fix Steps:**
```
1. Close POS app completely
2. Close Gamma Play app
3. Restart POS app
4. Wait 5 seconds for barcode server to start
5. Open Gamma Play app again
6. Try scanning
```

### Issue: "Connection Refused" Error in Gamma Play

**Causes & Solutions:**
- **PC IP is wrong**: Verify IP with `ipconfig` command, update in Gamma Play
- **Port 3001 blocked**: This is rare, but check Windows Firewall
- **Different WiFi networks**: Verify both are on same WiFi with `ipconfig` and Android WiFi settings
- **POS app not running**: Make sure POS is running and you can see terminal

**Manual Test:**
```
From Android phone:
1. Open browser
2. Go to: http://YOUR_PC_IP:3001/health
3. Should see: {"status":"ok"}
```

### Issue: "Barcode Format Wrong" or "Invalid Barcode"

**Causes:**
- Gamma Play sending wrong format (JSON instead of plain text)
- Barcode has special characters

**Solution:**
1. In Gamma Play Settings
2. Change "Content Type" to "Plain Text"
3. Change "Format" to "Text" not "JSON"
4. Save and retry

### Issue: Server Port Already in Use

**If POS shows error: "Port 3001 already in use"**

1. Close POS app
2. Open Command Prompt
3. Type: `netstat -ano | findstr :3001`
4. If something shows, note the PID (last column)
5. Type: `taskkill /PID [PID] /F`
6. Restart POS app

---

## PART 7: TECHNICAL DETAILS

### How It Works

```
Android Phone (Gamma Play)
    ↓ (Scans barcode)
    ↓ (Sends HTTP POST to webhook URL)
    ↓
Windows PC (POS App)
    ↓ (Receives on port 3001)
    ↓ (Electron receives via HTTP server)
    ↓ (Sends to React app via IPC)
    ↓
React App
    ↓ (Processes barcode)
    ↓ (Looks up product in database)
    ↓ (Auto-adds to cart)
    ↓
Customer sees product in cart!
```

### URL Structure
- **IP**: Your PC's local network IP (192.168.x.x)
- **Port**: 3001 (where barcode server listens)
- **Endpoint**: /scan (where Gamma Play sends barcodes)
- **Full URL**: `http://192.168.1.5:3001/scan` (example)

### Data Format
Gamma Play sends data in this format:
```
POST /scan HTTP/1.1
Host: 192.168.1.5:3001
Content-Type: text/plain

9780201379624
```
(Just the raw barcode as plain text)

---

## PART 8: QUICK REFERENCE

| Task | Steps |
|------|-------|
| **Get Server URL** | POS → Settings → Barcode Scanner |
| **Configure Gamma Play** | Menu → Settings → Webhook → Paste URL → Save |
| **Test Connection** | Open `http://YOUR_IP:3001/health` in browser |
| **Add Product via Scanner** | Product Mgmt → Scan barcode → Fill details → Save |
| **Scan During Billing** | Open Billing → Scan each product → Bill auto-updates |
| **Restart Server** | Close POS app and reopen |
| **Check Server Status** | Watch terminal/console for log messages |

---

## PART 9: BEST PRACTICES

1. **Keep Phone Charged**: Scanner needs power - use a charging dock while working
2. **Same WiFi Always**: Never switch between WiFi networks mid-shift
3. **Use Batch Mode**: For multiple items, use Gamma Play's Batch Scan feature
4. **Have Backup**: Keep manual barcode entry ready in case of WiFi issues
5. **Label Products**: Make sure all products have readable barcodes
6. **Test Regularly**: Test scanner at start of each shift
7. **Network Stability**: Use 2.4GHz WiFi for better range in store (not 5GHz)

---

## PART 10: SUPPORT

**Common Questions:**

Q: Can I use this with cellular data instead of WiFi?
A: No, local network only. WiFi is required.

Q: What if I have multiple Android devices?
A: Each can send to same PC IP:3001. All barcodes go to same cart.

Q: Can I configure this remotely?
A: Only on same WiFi network. Can't work over internet without VPN.

Q: What barcode formats are supported?
A: All standard formats - EAN-13, UPC, Code 39, QR, Aztec, Data Matrix, etc.

Q: How many barcodes can I scan?
A: Unlimited - all go to cart, you manage quantities.

---

## SUMMARY

Your setup is complete when:
✓ Gamma Play app installed
✓ Webhook URL configured in app
✓ PC and Android on same WiFi
✓ Barcode server running (see message in terminal)
✓ Test scan shows barcode in terminal
✓ Test scan adds product to cart in POS

**You're ready to start using barcode scanning in your POS system!**

Good luck with your Karachi Store POS!
