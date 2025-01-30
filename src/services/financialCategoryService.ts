import { db } from '../db/AppDatabase';
import { FinancialCategory } from '../model/types';
import { v4 as uuidv4 } from 'uuid';

export const financialCategoryService = {
  async createFinancialCategory(
    name: string,
    type: 'income' | 'expense'
  ): Promise<FinancialCategory | null> {
    try {
      const newCategory: FinancialCategory = {
        id: uuidv4(),
        name,
        type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await db.financialCategories.add(newCategory);
      return newCategory;
    } catch (error) {
      console.error("FinancialCategoryService - Error creating new category", error);
      return null;
    }
  },

  async getFinancialCategoryById(id: string): Promise<FinancialCategory | null> {
    try {
      const category = await db.financialCategories.get(id);
      return category || null;
    } catch (error) {
      console.error("FinancialCategoryService - Error getting category", error);
      return null;
    }
  },

  async getAllFinancialCategories(): Promise<FinancialCategory[]> {
    try {
      const categories = await db.financialCategories.toArray();
      return categories;
    } catch (error) {
      console.error("FinancialCategoryService - Error getting all categories", error);
      return [];
    }
  },

  async editFinancialCategory(category: FinancialCategory): Promise<FinancialCategory | null> {
    try {
      const updatedCategory = {
        ...category,
        updated_at: new Date().toISOString()
      };
      
      await db.financialCategories.put(updatedCategory);
      return updatedCategory;
    } catch (error) {
      console.error("FinancialCategoryService - Error editing category", error);
      return null;
    }
  },

  async deleteFinancialCategory(id: string): Promise<boolean> {
    try {
      await db.financialCategories.delete(id);
      return true;
    } catch (error) {
      console.error("FinancialCategoryService - Error deleting category", error);
      return false;
    }
  }
};