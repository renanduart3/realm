import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProducts } from '../hooks/useProducts';
import saleService from '../services/saleService';

const FullSale = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [items, setItems] = useState([{ product: '', quantity: 1 }]);
  const [client, setClient] = useState('');
  const [total, setTotal] = useState(0);

  const handleAddItem = () => setItems([...items, { product: '', quantity: 1 }]);
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    calculateTotal();
  };

  const calculateTotal = () => {
    const newTotal = items.reduce((acc, item) => {
      const product = products.find(p => p.id === item.product);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
    setTotal(newTotal);
  };

  const handleProductChange = (index, productId) => {
    const newItems = [...items];
    newItems[index].product = productId;
    setItems(newItems);
    calculateTotal();
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
    calculateTotal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saleService.createFullSale({ items, client });
      toast.success('Venda realizada com sucesso!');
      navigate('/sales');
    } catch (error) {
      toast.error('Erro ao processar a venda.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Venda Completa</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg shadow-sm">
            <select
              value={item.product}
              onChange={(e) => handleProductChange(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:border-blue-500 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition"
        >
          <Plus className="h-5 w-5 mr-2" /> Adicionar Item
        </button>

        <div className="text-lg font-semibold text-gray-900 text-center">
          Total: R$ {total.toFixed(2)}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition text-lg"
        >
          Finalizar Venda
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default FullSale;
