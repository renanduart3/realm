import { useEffect } from "react";
import { useCrud } from "../base/useCrud";
import { saleService } from "../../services/sale/SaleService";
import { Sale, SaleItem } from "../../model/types";
import { useNavigate } from "react-router-dom";

export function useSales() {
  const navigate = useNavigate();
  const crud = useCrud<Sale>(saleService, "Sale");

  useEffect(() => {
    crud.loadItems();
  }, []);

  const createFullSale = async (data: {
    items: Omit<SaleItem, "id" | "created_at" | "updated_at">[];
    customer?: string;
    totalAmount: number;
  }) => {
    try {
      await saleService.createFullSale(data);
      navigate("/sales");
    } catch (error) {
      throw error;
    }
  };

  return {
    sales: crud.items,
    loading: crud.loading,
    error: crud.error,
    createSale: crud.createItem,
    createFullSale,
    updateSale: crud.updateItem,
    deleteSale: crud.deleteItem,
    reloadSales: crud.loadItems,
  };
}
