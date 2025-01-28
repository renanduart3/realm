import React, { useEffect, useState } from 'react';
import { ProductService } from '../model/types';
import { getAllProducts } from '../utils/dataLoader';
import { Pencil } from 'lucide-react';

interface ProductListProps {
  isManager: boolean;
}

const ProductList = ({ isManager }: ProductListProps) => {
  const [products, setProducts] = useState<ProductService[] | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const loadedProducts = await getAllProducts();
      setProducts(loadedProducts);
    };
    loadProducts();
  }, []);

  if (!products) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-gray-500 text-center py-4">No products or services registered yet</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            {isManager && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">R$ {product.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.type === 'Product' ? product.quantity : '-'}</td>
              <td className="px-6 py-4 truncate max-w-xs">{product.description}</td>
              {isManager && (
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Pencil className="h-5 w-5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;