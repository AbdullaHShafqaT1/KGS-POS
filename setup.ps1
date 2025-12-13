# Karachi Garment Store POS - Installation Script
# Run this script to automatically set up everything

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Karachi Garment Store POS - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    
    # Check if version is 18 or higher
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "✗ Node.js version must be 18 or higher" -ForegroundColor Red
        Write-Host "Please download from: https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Dependencies..." -ForegroundColor Cyan
Write-Host "This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "How to run the POS system:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Browser Version:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host "   Then open: http://localhost:5173" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Desktop App Version:" -ForegroundColor Yellow
    Write-Host "   npm run electron:dev" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Build Desktop Installer:" -ForegroundColor Yellow
    Write-Host "   npm run electron:build" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Default Credentials:" -ForegroundColor Cyan
    Write-Host "  Super Admin: SUPadmin / SUP!@#123" -ForegroundColor White
    Write-Host "  Admin: Hassan Admin / Hassan123" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Would you like to start the POS now? (Y/N)"
    
    if ($choice -eq 'Y' -or $choice -eq 'y') {
        Write-Host ""
        Write-Host "Starting POS system..." -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    } else {
        Write-Host ""
        Write-Host "Setup complete! Run 'npm run dev' when ready." -ForegroundColor Green
    }
    
} else {
    Write-Host ""
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try these fixes:" -ForegroundColor Yellow
    Write-Host "1. npm cache clean --force" -ForegroundColor White
    Write-Host "2. Delete node_modules folder" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}
