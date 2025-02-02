import { db } from "../../db/AppDatabase";
import { BaseService } from "../base/BaseService";
import { Sale, SaleItem } from "../../model/types";

class SaleService extends BaseService<Sale> {
  constructor() {
    super(db.sales, "Sale");
  }

  async createFullSale(saleData: {
    items: Omit<SaleItem, "id" | "created_at" | "updated_at">[];
    customer?: string;
    totalAmount: number;
  }): Promise<Sale> {
    try {
      const sale = await this.create({
        value: saleData.totalAmount,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0],
        client_id: saleData.customer,
      });

      // Create sale items
      const saleItems = saleData.items.map((item) => ({
        ...item,
        sale_id: sale.id,
      }));

      await db.saleItems.bulkAdd(saleItems);

      return sale;
    } catch (error) {
      console.error("Error creating full sale:", error);
      throw new Error("Failed to create sale");
    }
  }

  async getSaleWithItems(
    saleId: string,
  ): Promise<{ sale: Sale; items: SaleItem[] }> {
    try {
      const sale = await this.getById(saleId);
      if (!sale) throw new Error("Sale not found");

      const items = await db.saleItems
        .where("sale_id")
        .equals(saleId)
        .toArray();

      return { sale, items };
    } catch (error) {
      console.error("Error getting sale with items:", error);
      throw new Error("Failed to get sale details");
    }
  }
}

export const saleService = new SaleService();
