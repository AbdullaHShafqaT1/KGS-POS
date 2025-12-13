import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, Receipt, Scan, Search, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { productService } from '@/lib/productService';
import { salesService } from '@/lib/salesService';
import { pdfService } from '@/lib/pdfService';
import { Product, SaleItem } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BillingSystemProps {
  employeeName: string;
}

const BillingSystem = ({ employeeName }: BillingSystemProps) => {
  const [billItems, setBillItems] = useState<SaleItem[]>([]);
  const [barcode, setBarcode] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductDialog, setShowProductDialog] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadProducts();
    
    // Listen for barcode scans from Gamma Play app
    try {
      if (typeof window !== 'undefined' && window.electron?.onBarcodeScan) {
        window.electron.onBarcodeScan((data: any) => {
          const scannedBarcode = data.barcode || data;
          console.log('Barcode scanned:', scannedBarcode);
          setBarcode(scannedBarcode);
          // Auto-process after a short delay to ensure state is updated
          setTimeout(() => {
            processBarcodeScan(scannedBarcode);
          }, 100);
        });
      }
    } catch (error) {
      console.error('Barcode scanner initialization error:', error);
    }
  }, []);

  const loadProducts = async () => {
    const allProducts = await productService.getAllProducts();
    setProducts(allProducts);
  };

  const processBarcodeScan = async (barcodeValue: string) => {
    if (!barcodeValue.trim()) return;

    try {
      const product = await productService.getProductByBarcode(barcodeValue.trim());
      
      if (product) {
        if (product.quantity <= 0) {
          toast({ 
            title: 'Stock Error', 
            description: 'Product out of stock',
            variant: 'destructive'
          });
          return;
        }

        addProductToBill(product);
      } else {
        toast({ 
          title: 'Not Found', 
          description: `No product: ${barcodeValue}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to process barcode',
        variant: 'destructive'
      });
    }
  };

  const addProductByBarcode = async () => {
    if (!barcode.trim()) return;

    try {
      const product = await productService.getProductByBarcode(barcode.trim());
      
      if (product) {
        if (product.quantity <= 0) {
          toast({ 
            title: t('error'), 
            description: 'Product out of stock',
            variant: 'destructive'
          });
          return;
        }

        addProductToBill(product);
        setBarcode('');
      } else {
        toast({ 
          title: 'Product Not Found', 
          description: `No product with barcode: ${barcode}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: t('error'), 
        description: 'Failed to add product',
        variant: 'destructive'
      });
    }
  };

  const addProductToBill = (product: Product) => {
    const existingItemIndex = billItems.findIndex(item => item.barcode === product.barcode);
    
    if (existingItemIndex >= 0) {
      const newItems = [...billItems];
      const existingItem = newItems[existingItemIndex];
      
      if (existingItem.quantity >= product.quantity) {
        toast({ 
          title: 'Stock Limit', 
          description: 'Cannot add more than available stock',
          variant: 'destructive'
        });
        return;
      }
      
      existingItem.quantity += 1;
      existingItem.total = (existingItem.price * existingItem.quantity) - existingItem.discount;
      setBillItems(newItems);
    } else {
      const newItem: SaleItem = {
        productId: product.id!,
        productName: product.name,
        barcode: product.barcode,
        price: product.price,
        quantity: 1,
        discount: 0,
        total: product.price
      };
      setBillItems([...billItems, newItem]);
    }

    toast({ 
      title: t('productAdded'), 
      description: product.name 
    });
  };

  const updateQuantity = (barcode: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(barcode);
      return;
    }

    const product = products.find(p => p.barcode === barcode);
    if (product && newQuantity > product.quantity) {
      toast({ 
        title: 'Stock Limit', 
        description: `Only ${product.quantity} units available`,
        variant: 'destructive'
      });
      return;
    }

    setBillItems(billItems.map(item => 
      item.barcode === barcode 
        ? { ...item, quantity: newQuantity, total: (item.price * newQuantity) - item.discount }
        : item
    ));
  };

  const updateDiscount = (barcode: string, discount: number) => {
    if (discount < 0) discount = 0;
    
    setBillItems(billItems.map(item => {
      if (item.barcode === barcode) {
        const maxDiscount = item.price * item.quantity;
        const validDiscount = Math.min(discount, maxDiscount);
        return { ...item, discount: validDiscount, total: (item.price * item.quantity) - validDiscount };
      }
      return item;
    }));
  };

  const removeItem = (barcode: string) => {
    setBillItems(billItems.filter(item => item.barcode !== barcode));
  };

  const getTotalAmount = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const getSubtotal = () => {
    return billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalDiscount = () => {
    return billItems.reduce((sum, item) => sum + item.discount, 0);
  };

  const generateBill = async () => {
    if (billItems.length === 0) {
      toast({ 
        title: t('error'), 
        description: 'Add items to generate bill',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Create sale in database
      const saleId = await salesService.createSale(billItems, employeeName);
      const sale = await salesService.getSaleById(saleId);

      if (sale) {
        // Generate PDF receipt
        pdfService.generateReceipt(sale, true);

        toast({ 
          title: t('saleSaved'), 
          description: `Invoice: ${sale.invoiceNumber}` 
        });

        // Clear bill
        setBillItems([]);
        
        // Reload products to update stock
        await loadProducts();
      }
    } catch (error) {
      toast({ 
        title: t('error'), 
        description: 'Failed to generate bill',
        variant: 'destructive'
      });
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('pos')}</h2>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {billItems.length} {t('products').toLowerCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Barcode Scanner & Product Browser */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              {t('scanBarcode')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barcode Input */}
            <div className="space-y-2">
              <Input
                placeholder={t('barcode')}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addProductByBarcode()}
                autoFocus
                className="text-lg"
              />
              <Button onClick={addProductByBarcode} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('add')}
              </Button>
            </div>

            <Separator />

            {/* Manual Product Selection */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowProductDialog(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </CardContent>
        </Card>

        {/* Right Side - Bill Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Bill</span>
              <Badge variant="secondary">{billItems.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {billItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">{t('scanBarcode')} to get started</p>
              </div>
            ) : (
              <>
                {/* Bill Items List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {billItems.map((item) => (
                    <div key={item.barcode} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('barcode')}: {item.barcode} | ₨{item.price} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.barcode)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">{t('quantity')}</label>
                          <div className="flex items-center gap-1 mt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.barcode, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center font-medium text-lg">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.barcode, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground">{t('discount')} (₨)</label>
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateDiscount(item.barcode, parseFloat(e.target.value) || 0)}
                            className="mt-1 h-8"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground">{t('total')}</label>
                          <p className="text-xl font-bold text-green-600 mt-1">₨{item.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>{t('subtotal')}:</span>
                    <span className="font-medium">₨{getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>{t('discount')}:</span>
                    <span className="font-medium">-₨{getTotalDiscount().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">{t('total')}:</span>
                    <span className="text-3xl font-bold text-green-600">₨{getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>

                {/* Generate Bill Button */}
                <Button onClick={generateBill} className="w-full h-14" size="lg">
                  <Receipt className="h-5 w-5 mr-2" />
                  {t('generateBill')}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Browser Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('products')}</DialogTitle>
            <DialogDescription>
              Select products to add to the bill
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <Input
              placeholder={t('search') + "..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-1">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    addProductToBill(product);
                    setShowProductDialog(false);
                    setSearchTerm('');
                  }}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.brand} | {product.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant={product.quantity > 10 ? "default" : "destructive"}>
                        {t('stock')}: {product.quantity}
                      </Badge>
                      <span className="font-bold text-lg">₨{product.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{product.barcode}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingSystem;
