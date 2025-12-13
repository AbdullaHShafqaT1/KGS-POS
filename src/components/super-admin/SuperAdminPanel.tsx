
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LogOut, Shield, Users, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SuperAdminPanelProps {
  user: any;
  onLogout: () => void;
}

const SuperAdminPanel = ({ user, onLogout }: SuperAdminPanelProps) => {
  const [admins, setAdmins] = useState([
    { id: 1, name: 'admin', password: 'admin123', active: true },
    { id: 2, name: 'manager', password: 'manager123', active: true }
  ]);
  
  const [employees] = useState([
    { id: 1, name: 'Ahmad', password: 'emp123', age: 25, phone: '+92-300-1234567' },
    { id: 2, name: 'Fatima', password: 'emp123', age: 28, phone: '+92-301-7654321' },
    { id: 3, name: 'Hassan', password: 'emp123', age: 24, phone: '+92-302-9876543' }
  ]);

  const [newAdmin, setNewAdmin] = useState({ name: '', password: '' });

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.password) {
      setAdmins([...admins, { 
        id: Date.now(), 
        name: newAdmin.name, 
        password: newAdmin.password, 
        active: true 
      }]);
      setNewAdmin({ name: '', password: '' });
      toast({ title: 'Admin Added', description: 'New admin has been successfully created.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-red-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Super Admin Panel
            </h1>
            <p className="text-muted-foreground">System Administration - {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Admins</p>
                  <p className="text-2xl font-bold text-red-600">{admins.length}</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                <Settings className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  placeholder="Enter admin name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddAdmin} className="w-full">Add Admin</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Current Admins:</h4>
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{admin.name}</span>
                    <Badge className="ml-2" variant={admin.active ? "default" : "secondary"}>
                      {admin.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">Password: {admin.password}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{employee.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">Age: {employee.age}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{employee.phone}</div>
                    <Badge variant="outline">Employee</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
