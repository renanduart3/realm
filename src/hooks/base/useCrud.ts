import { useState, useCallback } from "react";
import { BaseEntity } from "../../model/types";
import { BaseService } from "../../services/base/BaseService";
import { useToast } from "../useToast";

export function useCrud<T extends BaseEntity>(
  service: BaseService<T>,
  entityName: string,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setItems(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [service, showToast]);

  const createItem = useCallback(
    async (data: Omit<T, "id" | "created_at" | "updated_at">) => {
      setLoading(true);
      setError(null);
      try {
        const newItem = await service.create(data);
        setItems((prev) => [...prev, newItem]);
        showToast(`${entityName} created successfully`, "success");
        return newItem;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, entityName, showToast],
  );

  const updateItem = useCallback(
    async (id: string, data: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedItem = await service.update(id, data);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item)),
        );
        showToast(`${entityName} updated successfully`, "success");
        return updatedItem;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, entityName, showToast],
  );

  const deleteItem = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await service.delete(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        showToast(`${entityName} deleted successfully`, "success");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, entityName, showToast],
  );

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  };
}
