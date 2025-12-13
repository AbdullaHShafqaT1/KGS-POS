import { useState, useEffect } from 'react';
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
import { Users, Plus, Trash2, Key, Shield, UserCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/lib/authService';
import { User } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserManagementProps {
  currentUser: User;
  canManageAdmin?: boolean;
}

const UserManagement = ({ currentUser, canManageAdmin = false }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { t } = useLanguage();

  const [newUserForm, setNewUserForm] = useState({
    username: '',
    password: '',
    role: 'employee' as 'admin' | 'employee'
  });

  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = await authService.getAllUsers();
    // Filter out super admin from regular view
    const filteredUsers = allUsers.filter(u => u.role !== 'super-admin');
    setUsers(filteredUsers);
  };

  const handleCreateUser = async () => {
    try {
      if (!newUserForm.username || !newUserForm.password) {
        toast({ 
          title: t('error'), 
          description: 'Username and password required',
          variant: 'destructive'
        });
        return;
      }

      // Check if admin is trying to create another admin
      if (newUserForm.role === 'admin' && currentUser.role !== 'super-admin') {
        toast({ 
          title: t('error'), 
          description: 'Only Super Admin can create Admin users',
          variant: 'destructive'
        });
        return;
      }

      await authService.createUser({
        username: newUserForm.username,
        password: newUserForm.password,
        role: newUserForm.role,
        createdBy: currentUser.username
      });

      toast({ title: t('success'), description: 'User created successfully' });
      setShowCreateDialog(false);
      setNewUserForm({ username: '', password: '', role: 'employee' });
      loadUsers();
    } catch (error: any) {
      toast({ 
        title: t('error'), 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !selectedUser.id) return;

    try {
      if (!resetPasswordForm.newPassword || !resetPasswordForm.confirmPassword) {
        toast({ 
          title: t('error'), 
          description: 'Please fill all fields',
          variant: 'destructive'
        });
        return;
      }

      if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
        toast({ 
          title: t('error'), 
          description: 'Passwords do not match',
          variant: 'destructive'
        });
        return;
      }

      await authService.resetPassword(selectedUser.id, resetPasswordForm.newPassword);
      toast({ title: t('success'), description: 'Password reset successfully' });
      
      setShowResetDialog(false);
      setResetPasswordForm({ newPassword: '', confirmPassword: '' });
      setSelectedUser(null);
    } catch (error: any) {
      toast({ 
        title: t('error'), 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !selectedUser.id) return;

    try {
      // Prevent deleting admin if current user is not super admin
      if (selectedUser.role === 'admin' && currentUser.role !== 'super-admin') {
        toast({ 
          title: t('error'), 
          description: 'Only Super Admin can delete Admin users',
          variant: 'destructive'
        });
        return;
      }

      await authService.deleteUser(selectedUser.id);
      toast({ title: t('success'), description: 'User deleted successfully' });
      
      setShowDeleteDialog(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast({ 
        title: t('error'), 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'employee':
        return <UserCircle className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'employee':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('users')} Management</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('createUser')}
        </Button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.username}</h3>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  {user.createdBy && (
                    <p>Created by: {user.createdBy}</p>
                  )}
                  {user.createdAt && (
                    <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowResetDialog(true);
                    }}
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Reset Password
                  </Button>
                  
                  {(currentUser.role === 'super-admin' || user.role === 'employee') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteDialog(true);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createUser')}</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input
                id="username"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t('role')}</Label>
              <Select 
                value={newUserForm.role} 
                onValueChange={(value: 'admin' | 'employee') => setNewUserForm({ ...newUserForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">{t('employee')}</SelectItem>
                  {canManageAdmin && <SelectItem value="admin">{t('admin')}</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); setNewUserForm({ username: '', password: '', role: 'employee' }); }}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreateUser}>{t('createUser')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('resetPassword')}</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={resetPasswordForm.newPassword}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={resetPasswordForm.confirmPassword}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { 
                setShowResetDialog(false); 
                setResetPasswordForm({ newPassword: '', confirmPassword: '' }); 
                setSelectedUser(null); 
              }}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleResetPassword}>{t('resetPassword')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete user "{selectedUser?.username}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
