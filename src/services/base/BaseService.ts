import { db } from "../../db/AppDatabase";
import { BaseEntity } from "../../model/types";
import { v4 as uuidv4 } from "uuid";

export class BaseService<T extends BaseEntity> {
  protected table: Dexie.Table<T, string>;
  protected entityName: string;

  constructor(table: Dexie.Table<T, string>, entityName: string) {
    this.table = table;
    this.entityName = entityName;
  }

  async create(data: Omit<T, "id" | "created_at" | "updated_at">): Promise<T> {
    try {
      const now = new Date().toISOString();
      const entity = {
        ...data,
        id: uuidv4(),
        created_at: now,
        updated_at: now,
      } as T;

      await this.table.add(entity);
      return entity;
    } catch (error) {
      console.error(`Error creating ${this.entityName}:`, error);
      throw new Error(`Failed to create ${this.entityName}`);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const entity = await this.table.get(id);
      return entity || null;
    } catch (error) {
      console.error(`Error getting ${this.entityName}:`, error);
      throw new Error(`Failed to get ${this.entityName}`);
    }
  }

  async getAll(): Promise<T[]> {
    try {
      return await this.table.toArray();
    } catch (error) {
      console.error(`Error getting all ${this.entityName}s:`, error);
      throw new Error(`Failed to get ${this.entityName}s`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const entity = await this.getById(id);
      if (!entity) {
        throw new Error(`${this.entityName} not found`);
      }

      const updatedEntity = {
        ...entity,
        ...data,
        updated_at: new Date().toISOString(),
      };

      await this.table.put(updatedEntity);
      return updatedEntity;
    } catch (error) {
      console.error(`Error updating ${this.entityName}:`, error);
      throw new Error(`Failed to update ${this.entityName}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.table.delete(id);
    } catch (error) {
      console.error(`Error deleting ${this.entityName}:`, error);
      throw new Error(`Failed to delete ${this.entityName}`);
    }
  }

  async bulkCreate(
    entities: Omit<T, "id" | "created_at" | "updated_at">[],
  ): Promise<T[]> {
    try {
      const now = new Date().toISOString();
      const createdEntities = entities.map((entity) => ({
        ...entity,
        id: uuidv4(),
        created_at: now,
        updated_at: now,
      })) as T[];

      await this.table.bulkAdd(createdEntities);
      return createdEntities;
    } catch (error) {
      console.error(`Error bulk creating ${this.entityName}s:`, error);
      throw new Error(`Failed to bulk create ${this.entityName}s`);
    }
  }
}
