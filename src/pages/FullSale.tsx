import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Updated import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FullSale = () => {
  const navigate = useNavigate(); // Updated to useNavigate
  const [items, setItems] = useState<{ product: string; quantity: number }[]>([{ product: '', quantity: 1 }]);
  const [client, setClient] = useState('');

  const handleAddItem = () => {
    setItems([...items, { product: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => { // Explicitly typed index
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => { // Explicitly typed e
    e.preventDefault();
    // Logic to finalize the sale goes here
    // For now, we will simulate a successful sale
    toast.success('Venda completa com sucesso!');
    navigate('/sales'); // Redirect to sales page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Venda Completa</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300"
            required
          />
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Produto"
              value={item.product}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].product = e.target.value;
                setItems(newItems);
              }}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].quantity = parseInt(e.target.value);
                setItems(newItems);
              }}
              className="mt-1 block w-20 rounded-md border-gray-300 ml-2"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="ml-2 text-red-600"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Adicionar Item
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg ml-4"
        >
          Finalizar Venda
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default FullSale;
