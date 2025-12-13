
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, User, Phone, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  password: string;
  age?: number;
  phone?: string;
  joinDate: string;
  active: boolean;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { 
      id: '1', 
      name: 'Ahmad', 
      password: 'emp123', 
      age: 25, 
      phone: '+92-300-1234567', 
      joinDate: '2023-01-15',
      active: true 
    },
    { 
      id: '2', 
      name: 'Fatima', 
      password: 'emp123', 
      age: 28, 
      phone: '+92-301-7654321', 
      joinDate: '2023-03-10',
      active: true 
    },
    { 
      id: '3', 
      name: 'Hassan', 
      password: 'emp123', 
      age: 24, 
      phone: '+92-302-9876543', 
      joinDate: '2023-05-20',
      active: false 
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    password: '',
    age: '',
    phone: ''
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.password) {
      toast({ 
        title: 'Validation Error', 
        description: 'Name and password are required fields.',
        variant: 'destructive'
      });
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      password: newEmployee.password,
      age: newEmployee.age ? parseInt(newEmployee.age) : undefined,
      phone: newEmployee.phone || undefined,
      joinDate: new Date().toISOString().split('T')[0],
      active: true
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', password: '', age: '', phone: '' });
    setShowAddForm(false);
    toast({ title: 'Employee Added', description: 'New employee has been successfully added.' });
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Employee Management</h3>
          <p className="text-muted-foreground">Manage store employees and their access</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">{employee.name}</h4>
                  </div>
                  <Badge variant={employee.active ? "default" : "secondary"}>
                    {employee.active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  {employee.age && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Age: {employee.age} years</span>
                    </div>
                  )}
                  
                  {employee.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Joined: {new Date(employee.joinDate).toLocaleDateString()}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Password: {employee.password}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEmployeeStatus(employee.id)}
                    className="flex-1"
                  >
                    {employee.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="empName">Employee Name *</Label>
              <Input
                id="empName"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                placeholder="Enter employee name"
                required
              />
            </div>

            <div>
              <Label htmlFor="empPassword">Password *</Label>
              <Input
                id="empPassword"
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empAge">Age</Label>
                <Input
                  id="empAge"
                  type="number"
                  value={newEmployee.age}
                  onChange={(e) => setNewEmployee({ ...newEmployee, age: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="empPhone">Phone</Label>
                <Input
                  id="empPhone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="+92-300-1234567"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
