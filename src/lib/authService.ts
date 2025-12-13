import { db, User } from './database';

// User authentication and management service
export const authService = {
  async login(username: string, password: string): Promise<User | null> {
    const user = await db.users
      .where('username')
      .equals(username)
      .first();

    if (user && user.password === password) {
      return user;
    }
    return null;
  },

  async getAllUsers(): Promise<User[]> {
    return await db.users.toArray();
  },

  async getUsersByRole(role: 'admin' | 'employee'): Promise<User[]> {
    return await db.users.where('role').equals(role).toArray();
  },

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    return await db.users.add({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateUser(id: number, updates: Partial<User>): Promise<number> {
    return await db.users.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteUser(id: number): Promise<void> {
    await db.users.delete(id);
  },

  async resetPassword(id: number, newPassword: string): Promise<number> {
    return await db.users.update(id, {
      password: newPassword,
      updatedAt: new Date()
    });
  },

  async resetAllCredentials(): Promise<void> {
    // Delete all non-super-admin users
    await db.users.where('role').notEqual('super-admin').delete();
    
    // Reset super admin to default
    const superAdmin = await db.users.where('role').equals('super-admin').first();
    if (superAdmin) {
      await db.users.update(superAdmin.id!, {
        username: 'SUPadmin',
        password: 'SUP!@#123',
        updatedAt: new Date()
      });
    }
    
    // Recreate default admin
    await db.users.add({
      username: 'Hassan Admin',
      password: 'Hassan123',
      role: 'admin',
      createdBy: 'SUPadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};
