import React, { useState } from 'react';
import ProductList from '../components/ProductList';

export default function Products() {
  const [productType, setProductType] = useState<'Product' | 'Service'>('Product');
  const [isManager] = useState(true); // Isso deve vir do contexto de autenticação

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product/Service Registration</h1>
      
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Add New Product/Service</h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setProductType(e.target.value as 'Product' | 'Service')}
                  value={productType}
                >
                  <option value="Product">Product</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
           
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Product/Service
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Product/Service List</h2>
        <ProductList isManager={isManager} />
      </div>
    </div>
  );
}