
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, Filter } from 'lucide-react';
import ProductForm from './ProductForm';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  size?: string;
  image?: string;
  code?: string;
}

interface ProductCatalogProps {
  isAdmin: boolean;
}

const ProductCatalog = ({ isAdmin }: ProductCatalogProps) => {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Men\'s Formal Shirt', price: 1200, stock: 25, category: 'gents', size: 'L', code: 'MFS001' },
    { id: '2', name: 'Ladies Casual Shoes', price: 2500, stock: 15, category: 'ladies', size: '38', code: 'LCS002' },
    { id: '3', name: 'Kids T-Shirt', price: 800, stock: 30, category: 'kids', size: 'M', code: 'KTS003' },
    { id: '4', name: 'Toy Car', price: 350, stock: 50, category: 'toys', code: 'TC004' },
    { id: '5', name: 'Women\'s Dress', price: 3200, stock: 12, category: 'ladies', size: 'S', code: 'WD005' },
    { id: '6', name: 'Men\'s Sneakers', price: 4500, stock: 8, category: 'gents', size: '42', code: 'MS006' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      gents: 'bg-blue-100 text-blue-800',
      ladies: 'bg-pink-100 text-pink-800',
      kids: 'bg-green-100 text-green-800',
      toys: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="gents">Gents</SelectItem>
                <SelectItem value="ladies">Ladies</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="toys">Toys</SelectItem>
              </SelectContent>
            </Select>

            {isAdmin && (
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <Badge className={getCategoryColor(product.category)}>
                    {product.category}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold text-green-600">₹{product.price}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock} units
                    </span>
                  </div>
                  
                  {product.size && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{product.size}</span>
                    </div>
                  )}
                  
                  {product.code && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Code:</span>
                      <span className="font-mono text-xs">{product.code}</span>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}

      {showAddForm && (
        <ProductForm 
          onClose={() => setShowAddForm(false)}
          onSave={(product) => {
            console.log('New product:', product);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductCatalog;
