import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { productService } from '@/lib/productService';
import { categoryService } from '@/lib/categoryService';
import { Product, Category } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductManagementProps {
  isAdmin: boolean;
}

interface ProductFormProps {
  formData: any;
  categories: Category[];
  showEditDialog: boolean;
  t: (key: string) => string;
  onFormChange: (field: string, value: any) => void;
}

// Separate memoized form component to prevent focus loss
const ProductForm = ({ formData, categories, showEditDialog, t, onFormChange }: ProductFormProps) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="name">{t('productName')} *</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => onFormChange('name', e.target.value)}
        placeholder="Enter product name"
        autoComplete="off"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="brand">{t('brand')} *</Label>
      <Input
        id="brand"
        value={formData.brand}
        onChange={(e) => onFormChange('brand', e.target.value)}
        placeholder="Enter brand"
        autoComplete="off"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="barcode">{t('barcode')} *</Label>
      <Input
        id="barcode"
        value={formData.barcode}
        onChange={(e) => onFormChange('barcode', e.target.value)}
        placeholder="Enter barcode"
        disabled={showEditDialog}
        autoComplete="off"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="category">{t('category')} *</Label>
      <Select value={formData.category} onValueChange={(value) => onFormChange('category', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.name}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="size">{t('size')}</Label>
      <Input
        id="size"
        value={formData.size}
        onChange={(e) => onFormChange('size', e.target.value)}
        placeholder="Enter size"
        autoComplete="off"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="color">{t('color')}</Label>
      <Input
        id="color"
        value={formData.color}
        onChange={(e) => onFormChange('color', e.target.value)}
        placeholder="Enter color"
        autoComplete="off"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="price">{t('price')} (PKR) *</Label>
      <Input
        id="price"
        type="number"
        value={formData.price}
        onChange={(e) => onFormChange('price', parseFloat(e.target.value) || 0)}
        placeholder="0.00"
        min="0"
        step="0.01"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="quantity">{t('quantity')} *</Label>
      <Input
        id="quantity"
        type="number"
        value={formData.quantity}
        onChange={(e) => onFormChange('quantity', parseInt(e.target.value) || 0)}
        placeholder="0"
        min="0"
      />
    </div>
    <div className="space-y-2 col-span-2">
      <Label htmlFor="lowStock">Low Stock Alert Threshold</Label>
      <Input
        id="lowStock"
        type="number"
        value={formData.lowStockThreshold}
        onChange={(e) => onFormChange('lowStockThreshold', parseInt(e.target.value) || 5)}
        placeholder="5"
        min="1"
      />
    </div>
  </div>
);

const ProductManagement = ({ isAdmin }: ProductManagementProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameUrdu, setNewCategoryNameUrdu] = useState('');
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    size: '',
    color: '',
    price: 0,
    quantity: 0,
    barcode: '',
    category: '',
    lowStockThreshold: 5
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allProducts = await productService.getAllProducts();
    const allCategories = await categoryService.getAllCategories();
    setProducts(allProducts);
    setCategories(allCategories);
  };

  const handleFormChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddProduct = async () => {
    try {
      if (!formData.name || !formData.barcode || !formData.category) {
        toast({ 
          title: t('error'), 
          description: 'Please fill all required fields',
          variant: 'destructive'
        });
        return;
      }

      await productService.addProduct(formData);
      toast({ title: t('productAdded') });
      
      setShowAddDialog(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast({ 
        title: t('error'), 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct || !selectedProduct.id) return;

    try {
      await productService.updateProduct(selectedProduct.id, formData);
      toast({ title: t('productUpdated') });
      
      setShowEditDialog(false);
      resetForm();
      setSelectedProduct(null);
      loadData();
    } catch (error: any) {
      toast({ 
        title: t('error'), 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct || !selectedProduct.id) return;

    try {
      await productService.deleteProduct(selectedProduct.id);
      toast({ title: t('productDeleted') });
      
      setShowDeleteDialog(false);
      setSelectedProduct(null);
      loadData();
    } catch (error: any) {
      toast({ 
        title: t('error'), 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        toast({ 
          title: t('error'), 
          description: 'Category name required',
          variant: 'destructive'
        });
        return;
      }

      await categoryService.addCategory(newCategoryName, newCategoryNameUrdu);
      toast({ title: t('success'), description: 'Category added successfully' });
      
      setShowAddCategoryDialog(false);
      setNewCategoryName('');
      setNewCategoryNameUrdu('');
      loadData();
    } catch (error: any) {
      toast({ 
        title: t('error'), 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      size: product.size,
      color: product.color,
      price: product.price,
      quantity: product.quantity,
      barcode: product.barcode,
      category: product.category,
      lowStockThreshold: product.lowStockThreshold || 5
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      size: '',
      color: '',
      price: 0,
      quantity: 0,
      barcode: '',
      category: '',
      lowStockThreshold: 5
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const getLowStockProducts = useMemo(() => {
    return products.filter(p => p.quantity <= (p.lowStockThreshold || 5));
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('products')}</h2>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddCategoryDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
            <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addProduct')}
            </Button>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {getLowStockProducts.length > 0 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-medium">
                {getLowStockProducts.length} {t('lowStock')} products
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('search') + "..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(product)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.size && <Badge variant="outline">{product.size}</Badge>}
                  {product.color && <Badge variant="outline">{product.color}</Badge>}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('stock')}:</span>
                    <Badge variant={product.quantity <= (product.lowStockThreshold || 5) ? "destructive" : "default"}>
                      {product.quantity} units
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('barcode')}:</span>
                    <span className="font-mono">{product.barcode}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground">{t('price')}:</span>
                    <span className="text-2xl font-bold text-green-600">₨{product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('addProduct')}</DialogTitle>
            <DialogDescription>Add a new product to your inventory</DialogDescription>
          </DialogHeader>
          <ProductForm 
            formData={formData} 
            categories={categories} 
            showEditDialog={false}
            t={t}
            onFormChange={handleFormChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              {t('cancel')}
            </Button>
            <Button onClick={handleAddProduct}>{t('add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('edit')} {t('products')}</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <ProductForm 
            formData={formData} 
            categories={categories} 
            showEditDialog={true}
            t={t}
            onFormChange={handleFormChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); setSelectedProduct(null); }}>
              {t('cancel')}
            </Button>
            <Button onClick={handleEditProduct}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedProduct?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProduct(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a custom product category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="catName">Category Name (English)</Label>
              <Input
                id="catName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catNameUrdu">Category Name (Urdu)</Label>
              <Input
                id="catNameUrdu"
                value={newCategoryNameUrdu}
                onChange={(e) => setNewCategoryNameUrdu(e.target.value)}
                placeholder="اردو میں درج کریں"
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddCategoryDialog(false); setNewCategoryName(''); setNewCategoryNameUrdu(''); }}>
              {t('cancel')}
            </Button>
            <Button onClick={handleAddCategory}>{t('add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
