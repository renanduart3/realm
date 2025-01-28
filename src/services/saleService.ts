//src/services/saleService.ts
import { db } from '../db/AppDatabase';
import { Sale, SaleItem } from '../model/types';
import { v4 as uuidv4 } from 'uuid';

export const saleService = {
  async createSale(
    date: string,
    time: string,
    value: number,
    productIds: string[],
    quantities: number[]
  ): Promise<Sale | null> {
    try {
      // Inicia uma transação para garantir que tanto a venda quanto os itens sejam salvos
      return await db.transaction('rw', [db.sales, db.saleItems], async () => {
        const newSale: Sale = {
          id: uuidv4(),
          date,
          time,
          value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await db.sales.add(newSale);

        // Cria os itens da venda
        const saleItems = productIds.map((productId, index) => ({
          id: uuidv4(),
          sale_id: newSale.id,
          product_service_id: productId,
          quantity: quantities[index],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        await db.saleItems.bulkAdd(saleItems);

        return newSale;
      });
    } catch (error) {
      console.error("Error creating new sale", error);
      return null;
    }
  },

  async getSaleById(id: string): Promise<{ sale: Sale; items: SaleItem[] } | null> {
    try {
      const sale = await db.sales.get(id);
      if (!sale) return null;

      const items = await db.saleItems
        .where('sale_id')
        .equals(id)
        .toArray();

      return { sale, items };
    } catch (error) {
      console.error("Error getting sale", error);
      return null;
    }
  },

  async getAllSales(): Promise<Sale[]> {
    try {
      const sales = await db.sales.toArray();
      return sales;
    } catch (error) {
      console.error("Error getting all sales", error);
      return [];
    }
  },

  async getSaleItems(saleId: string): Promise<SaleItem[]> {
    try {
      const items = await db.saleItems
        .where('sale_id')
        .equals(saleId)
        .toArray();
      return items;
    } catch (error) {
      console.error("Error getting sale items", error);
      return [];
    }
  },

  async editSale(
    sale: Sale,
    productIds: string[],
    quantities: number[]
  ): Promise<Sale | null> {
    try {
      return await db.transaction('rw', [db.sales, db.saleItems], async () => {
        const updatedSale = {
          ...sale,
          updated_at: new Date().toISOString()
        };

        await db.sales.put(updatedSale);

        // Remove os itens antigos
        await db.saleItems
          .where('sale_id')
          .equals(sale.id)
          .delete();

        // Adiciona os novos itens
        const newSaleItems = productIds.map((productId, index) => ({
          id: uuidv4(),
          sale_id: sale.id,
          product_service_id: productId,
          quantity: quantities[index],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        await db.saleItems.bulkAdd(newSaleItems);

        return updatedSale;
      });
    } catch (error) {
      console.error("Error editing sale", error);
      return null;
    }
  },

  async deleteSale(id: string): Promise<boolean> {
    try {
      await db.transaction('rw', [db.sales, db.saleItems], async () => {
        // Remove os itens da venda
        await db.saleItems
          .where('sale_id')
          .equals(id)
          .delete();

        // Remove a venda
        await db.sales.delete(id);
      });
      return true;
    } catch (error) {
      console.error("Error deleting sale", error);
      return false;
    }
  }
};