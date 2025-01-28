import { db } from '../db/AppDatabase';
import { Transaction } from '../model/types';
import { v4 as uuidv4 } from 'uuid';

export const transactionService = {
  async createTransaction(
    financial_category_id: string,
    value: number,
    date: string,
    time: string
  ): Promise<Transaction | null> {
    try {
      const newTransaction: Transaction = {
        id: uuidv4(),
        financial_category_id,
        value,
        date,
        time,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await db.transactions.add(newTransaction);
      return newTransaction;
    } catch (error) {
      console.error("Error creating new transaction", error);
      return null;
    }
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await db.transactions.get(id);
      return transaction || null;
    } catch (error) {
      console.error("Error getting transaction", error);
      return null;
    }
  },

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await db.transactions.toArray();
      return transactions;
    } catch (error) {
      console.error("Error getting all transactions", error);
      return [];
    }
  },

  async editTransaction(transaction: Transaction): Promise<Transaction | null> {
    try {
      const updatedTransaction = {
        ...transaction,
        updated_at: new Date().toISOString()
      };
      
      await db.transactions.put(updatedTransaction);
      return updatedTransaction;
    } catch (error) {
      console.error("Error editing transaction", error);
      return null;
    }
  },

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      await db.transactions.delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting transaction", error);
      return false;
    }
  }
};