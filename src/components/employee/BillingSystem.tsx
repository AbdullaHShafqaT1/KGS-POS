
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, Receipt, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

interface BillingSystemProps {
  employeeName: string;
}

const BillingSystem = ({ employeeName }: BillingSystemProps) => {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [barcode, setBarcode] = useState('');

  const sampleProducts = [
    { code: 'MFS001', name: 'Men\'s Formal Shirt', price: 1200 },
    { code: 'LCS002', name: 'Ladies Casual Shoes', price: 2500 },
    { code: 'KTS003', name: 'Kids T-Shirt', price: 800 },
    { code: 'TC004', name: 'Toy Car', price: 350 },
    { code: 'WD005', name: 'Women\'s Dress', price: 3200 },
    { code: 'MS006', name: 'Men\'s Sneakers', price: 4500 }
  ];

  const addProductByBarcode = () => {
    const product = sampleProducts.find(p => p.code === barcode.toUpperCase());
    if (product) {
      const existingItem = billItems.find(item => item.id === product.code);
      if (existingItem) {
        updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        const newItem: BillItem = {
          id: product.code,
          name: product.name,
          price: product.price,
          quantity: 1,
          discount: 0,
          total: product.price
        };
        setBillItems([...billItems, newItem]);
      }
      setBarcode('');
      toast({ title: 'Product Added', description: `${product.name} added to bill` });
    } else {
      toast({ 
        title: 'Product Not Found', 
        description: 'Try: MFS001, LCS002, KTS003, TC004, WD005, MS006',
        variant: 'destructive'
      });
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setBillItems(billItems.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, total: (item.price * newQuantity) - item.discount }
        : item
    ));
  };

  const updateDiscount = (id: string, discount: number) => {
    setBillItems(billItems.map(item => 
      item.id === id 
        ? { ...item, discount, total: (item.price * item.quantity) - discount }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const generateBill = () => {
    if (billItems.length === 0) {
      toast({ 
        title: 'Empty Bill', 
        description: 'Add items to generate bill',
        variant: 'destructive'
      });
      return;
    }

    const billData = {
      billNumber: `BILL-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      employee: employeeName,
      items: billItems,
      total: getTotalAmount()
    };

    console.log('Generated Bill:', billData);
    setBillItems([]);
    toast({ 
      title: 'Bill Generated', 
      description: `Bill #${billData.billNumber} generated successfully!` 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Barcode Scanner & Quick Add */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Quick Add
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Scan barcode or enter code"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProductByBarcode()}
            />
            <Button onClick={addProductByBarcode} className="w-full">
              Add to Bill
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sample codes:</p>
            <div className="grid grid-cols-2 gap-2">
              {sampleProducts.slice(0, 4).map(product => (
                <Button
                  key={product.code}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBarcode(product.code);
                    addProductByBarcode();
                  }}
                  className="text-xs"
                >
                  {product.code}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bill Items */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Bill</span>
            <Badge variant="secondary">{billItems.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {billItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No items in bill. Scan a product to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {billItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="text-xs text-muted-foreground">Quantity</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Discount (₹)</label>
                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                        className="mt-1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Total</label>
                      <p className="text-lg font-bold text-green-600 mt-1">₹{item.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {billItems.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Grand Total:</span>
                  <span className="text-2xl font-bold text-green-600">₹{getTotalAmount()}</span>
                </div>
                <Button onClick={generateBill} className="w-full" size="lg">
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Bill & Print
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bill Preview */}
      {billItems.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Bill Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto bg-white border p-6 font-mono text-sm">
              <div className="text-center mb-4">
                <h2 className="font-bold text-lg">Karachi Garment & Shoes Store</h2>
                <p className="text-xs">Complete Fashion Solution</p>
                <hr className="my-2" />
                <p className="text-xs">Employee: {employeeName}</p>
                <p className="text-xs">Date: {new Date().toLocaleString()}</p>
              </div>

              <div className="space-y-1 mb-4">
                {billItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <span className="truncate flex-1 mr-2">{item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Qty: {item.quantity} | Disc: ₹{item.discount}</span>
                      <span>₹{item.total}</span>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>₹{getTotalAmount()}</span>
              </div>
              <div className="text-center mt-4 text-xs">
                <p>Thank you, come again!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingSystem;
