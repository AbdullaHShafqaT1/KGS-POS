import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, Package, Users, BarChart3, LogOut, Moon, Sun, Languages } from 'lucide-react';
import BillingSystem from '../employee/BillingSystemNew';
import ProductManagement from '../shared/ProductManagementNew';
import UserManagement from '../shared/UserManagement';
import ReportsComponent from '../shared/ReportsComponent';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { User } from '@/lib/database';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboardNew = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('billing');
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">{t('appTitle')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('admin')}: {user.username}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage('en')}>
                    English {language === 'en' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('ur')}>
                    اردو {language === 'ur' && '✓'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light {theme === 'light' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark {theme === 'dark' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    System {theme === 'system' && '✓'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {t('billing')}
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('products')}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('users')}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('reports')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="billing" className="space-y-4">
            <BillingSystem employeeName={user.username} />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductManagement isAdmin={true} />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement currentUser={user} canManageAdmin={false} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <ReportsComponent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboardNew;
