import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { ProductService, Client, Sale } from '../model/types';
import { productService } from '../services/productService';
import { clientService } from '../services/clientService';
import { saleService } from '../services/saleService';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Sales() {
  const { organizationType } = useAuth();
  const pageTitle = organizationType === 'profit' ? 'Vendas' : 'Entradas';
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleQuickSale = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const product = products.find(p => p.id === selectedProduct);
      if (!product) return;

      const sale = await saleService.createSale(
        new Date().toISOString().split('T')[0],
        new Date().toTimeString().split(' ')[0],
        product.price,
        [product.id],
        [1]
      );

      if (sale) {
        toast.success('Venda realizada com sucesso!');
        setIsQuickSaleOpen(false);
        loadSalesTrend();
      } else {
        toast.error('Não foi possível realizar a venda');
      }
    } catch (error) {
      toast.error('Erro ao processar a venda');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {pageTitle}
        </h1>
        <button
          onClick={() => setIsQuickSaleOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Quick Sale
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Gerencie suas {organizationType === 'profit' ? 'vendas' : 'entradas'} aqui
      </p>

      <Modal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
        title="Quick Sale"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option>Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Complete Sale
          </button>
        </form>
      </Modal>
    </div>
  );
}