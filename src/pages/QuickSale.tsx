import React, { useState } from 'react';
import Modal from 'react-modal'; // Ensure you import Modal correctly
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuickSale = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to finalize the quick sale goes here
    toast.success('Venda rápida finalizada com sucesso!');
    setIsOpen(false); // Close the modal
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Venda Rápida</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Iniciar Venda Rápida
      </button>

      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} ariaHideApp={false}>
        <h2 className="text-lg font-semibold">Venda Rápida</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Produto/Serviço</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="mt-1 block w-20 rounded-md border-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Finalizar Venda
          </button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default QuickSale;
