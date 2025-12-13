import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  TrendingUp, 
  Package, 
  Calendar as CalendarIcon, 
  Download,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db, Sale, Product } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  totalSales: number;
  totalRevenue: number;
  avgTransaction: number;
  topProducts: any[];
  salesByDay: any[];
  salesByWeek: any[];
  salesByMonth: any[];
  lowStockProducts: any[];
}

const ReportsComponent = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
    end: new Date() 
  });
  const { t, language } = useLanguage();

  useEffect(() => {
    loadReportData();
    const interval = setInterval(loadReportData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const sales = await db.sales.toArray();
      const products = await db.products.toArray();

      // Filter by date range
      const filteredSales = sales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate >= dateRange.start && saleDate <= dateRange.end;
      });

      // Calculate totals
      const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.total || 0), 0);
      const totalSales = filteredSales.length;
      const avgTransaction = totalSales > 0 ? totalRevenue / totalSales : 0;

      // Top products
      const productSales: any = {};
      filteredSales.forEach(sale => {
        sale.items?.forEach((item: any) => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { qty: 0, revenue: 0, name: item.productName };
          }
          productSales[item.productId].qty += item.quantity;
          productSales[item.productId].revenue += item.subtotal;
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([id, data]: any) => ({ id, ...data }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 10);

      // Sales by day
      const salesByDay: any = {};
      filteredSales.forEach(sale => {
        const day = new Date(sale.date).toLocaleDateString('en-PK');
        if (!salesByDay[day]) salesByDay[day] = { day, sales: 0, revenue: 0 };
        salesByDay[day].sales += 1;
        salesByDay[day].revenue += sale.total;
      });

      // Sales by week
      const salesByWeek: any = {};
      filteredSales.forEach(sale => {
        const date = new Date(sale.date);
        const week = `Week ${Math.ceil(date.getDate() / 7)}-${date.toLocaleString('en-PK', { month: 'short' })}`;
        if (!salesByWeek[week]) salesByWeek[week] = { week, sales: 0, revenue: 0 };
        salesByWeek[week].sales += 1;
        salesByWeek[week].revenue += sale.total;
      });

      // Sales by month
      const salesByMonth: any = {};
      filteredSales.forEach(sale => {
        const month = new Date(sale.date).toLocaleString('en-PK', { month: 'short', year: 'numeric' });
        if (!salesByMonth[month]) salesByMonth[month] = { month, sales: 0, revenue: 0 };
        salesByMonth[month].sales += 1;
        salesByMonth[month].revenue += sale.total;
      });

      // Low stock
      const lowStockProducts = products.filter(p => (p.quantity || 0) < 5);

      setReportData({
        totalSales,
        totalRevenue,
        avgTransaction,
        topProducts,
        salesByDay: Object.values(salesByDay),
        salesByWeek: Object.values(salesByWeek),
        salesByMonth: Object.values(salesByMonth),
        lowStockProducts,
      });
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReportPDF = async (reportType: string) => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPos = 10;

    // Header
    pdf.setFontSize(16);
    pdf.text(t('appTitle'), 10, yPos);
    yPos += 10;
    pdf.setFontSize(10);
    pdf.text(`Report: ${reportType} | Date: ${new Date().toLocaleDateString('en-PK')}`, 10, yPos);
    yPos += 15;

    switch (reportType) {
      case 'Sales Summary':
        pdf.setFontSize(12);
        pdf.text('Sales Summary', 10, yPos);
        yPos += 10;
        pdf.setFontSize(10);
        pdf.text(`Total Sales: ${reportData?.totalSales}`, 10, yPos);
        yPos += 7;
        pdf.text(`Total Revenue: Rs.${reportData?.totalRevenue.toFixed(2)}`, 10, yPos);
        yPos += 7;
        pdf.text(`Average Transaction: Rs.${reportData?.avgTransaction.toFixed(2)}`, 10, yPos);
        break;

      case 'Top Products':
        pdf.setFontSize(12);
        pdf.text('Top 10 Products', 10, yPos);
        yPos += 10;
        pdf.setFontSize(9);
        reportData?.topProducts.forEach((p, idx) => {
          if (yPos > pageHeight - 20) {
            pdf.addPage();
            yPos = 10;
          }
          pdf.text(`${idx + 1}. ${p.name}: ${p.qty} units (Rs.${p.revenue.toFixed(2)})`, 10, yPos);
          yPos += 7;
        });
        break;

      case 'Low Stock':
        pdf.setFontSize(12);
        pdf.text('Low Stock Products', 10, yPos);
        yPos += 10;
        pdf.setFontSize(9);
        reportData?.lowStockProducts.forEach((p, idx) => {
          if (yPos > pageHeight - 20) {
            pdf.addPage();
            yPos = 10;
          }
          pdf.text(`${idx + 1}. ${p.name}: ${p.quantity} units`, 10, yPos);
          yPos += 7;
        });
        break;
    }

    pdf.save(`${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ 
      title: t('success'), 
      description: `${reportType} exported successfully` 
    });
  };

  if (loading) return <div className="p-4 text-center">{t('loading')}...</div>;
  if (!reportData) return <div className="p-4 text-center">{t('noData')}</div>;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">{t('reports')}</h1>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[200px] justify-start text-left font-normal',
                    !dateRange.start && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.start ? format(dateRange.start, 'PPP') : 'Start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.start}
                  onSelect={(date) => date && setDateRange({ ...dateRange, start: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-sm text-muted-foreground">to</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[200px] justify-start text-left font-normal',
                    !dateRange.end && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.end ? format(dateRange.end, 'PPP') : 'End date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.end}
                  onSelect={(date) => date && setDateRange({ ...dateRange, end: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-3xl font-bold">{reportData.totalSales}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">₨{reportData.totalRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Transaction</p>
                <p className="text-3xl font-bold">₨{reportData.avgTransaction.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-3xl font-bold">{reportData.lowStockProducts.length}</p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="top-products">Top Products</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Sales Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value: any) => `₨${value.toFixed(2)}`} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#3b82f6" name="# of Sales" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue (PKR)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Daily */}
            <TabsContent value="daily" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Daily Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `₨${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue (PKR)" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-right p-2">Sales</th>
                        <th className="text-right p-2">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.salesByDay.map((day, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">{day.day}</td>
                          <td className="text-right p-2">{day.sales}</td>
                          <td className="text-right p-2">₨{day.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Weekly */}
            <TabsContent value="weekly" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Weekly Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.salesByWeek}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `₨${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#f59e0b" name="Revenue (PKR)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Monthly */}
            <TabsContent value="monthly" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `₨${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#ec4899" name="Revenue (PKR)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Top Products */}
            <TabsContent value="top-products" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Top 10 Products</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value: any) => value} />
                    <Legend />
                    <Bar dataKey="qty" fill="#8b5cf6" name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Product</th>
                        <th className="text-right p-2">Units</th>
                        <th className="text-right p-2">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.topProducts.map((p, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">{p.name}</td>
                          <td className="text-right p-2">{p.qty}</td>
                          <td className="text-right p-2">₨{p.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Low Stock */}
            <TabsContent value="low-stock" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Low Stock Products (under 5 units)</h3>
                {reportData.lowStockProducts.length === 0 ? (
                  <p className="text-green-600 font-medium">All products are well stocked!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Product</th>
                          <th className="text-right p-2">Current Stock</th>
                          <th className="text-right p-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.lowStockProducts.map((p, i) => (
                          <tr key={i} className="border-b bg-red-50 dark:bg-red-900">
                            <td className="p-2">{p.name}</td>
                            <td className="text-right p-2">
                              <Badge variant="destructive">{p.quantity}</Badge>
                            </td>
                            <td className="text-right p-2">₨{p.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Download Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Download Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => downloadReportPDF('Sales Summary')} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Sales Summary
            </Button>
            <Button 
              onClick={() => downloadReportPDF('Top Products')} 
              className="bg-green-500 hover:bg-green-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Top Products
            </Button>
            <Button 
              onClick={() => downloadReportPDF('Low Stock')} 
              className="bg-red-500 hover:bg-red-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Low Stock Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsComponent;
