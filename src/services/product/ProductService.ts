import { db } from "../../db/AppDatabase";
import { BaseService } from "../base/BaseService";
import { ProductService as ProductType } from "../../model/types";

class ProductService extends BaseService<ProductType> {
  constructor() {
    super(db.products, "Product");
  }

  async getByCategory(category: string): Promise<ProductType[]> {
    try {
      return await this.table.where("category").equals(category).toArray();
    } catch (error) {
      console.error("Error getting products by category:", error);
      throw new Error("Failed to get products by category");
    }
  }

  async getActiveProducts(): Promise<ProductType[]> {
    try {
      return await this.table.where("active").equals(true).toArray();
    } catch (error) {
      console.error("Error getting active products:", error);
      throw new Error("Failed to get active products");
    }
  }
}

export const productService = new ProductService();
