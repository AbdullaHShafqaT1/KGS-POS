import { db, Category } from './database';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    return await db.categories.toArray();
  },

  async addCategory(name: string, nameUrdu?: string): Promise<number> {
    // Check if category already exists
    const existing = await db.categories.where('name').equals(name).first();
    if (existing) {
      throw new Error('Category already exists');
    }

    return await db.categories.add({
      name,
      nameUrdu,
      createdAt: new Date()
    });
  },

  async deleteCategory(id: number): Promise<void> {
    await db.categories.delete(id);
  }
};
