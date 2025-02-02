import { useEffect } from "react";
import { useCrud } from "../base/useCrud";
import { productService } from "../../services/product/ProductService";
import { ProductService } from "../../model/types";

export function useProducts() {
  const crud = useCrud<ProductService>(productService, "Product");

  useEffect(() => {
    crud.loadItems();
  }, []);

  return {
    products: crud.items,
    loading: crud.loading,
    error: crud.error,
    createProduct: crud.createItem,
    updateProduct: crud.updateItem,
    deleteProduct: crud.deleteItem,
    reloadProducts: crud.loadItems,
  };
}
