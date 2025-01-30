import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import QuickSale from './QuickSale'; // Importe o modal QuickSale

const Sales = () => {
  const [isQuickSaleModalOpen, setIsQuickSaleModalOpen] = useState(false);

  const handleOpenQuickSaleModal = () => {
    setIsQuickSaleModalOpen(true);
  };

  const handleCloseQuickSaleModal = () => {
    setIsQuickSaleModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendas</h1>
      <div className="flex space-x-4">
        <button
          onClick={handleOpenQuickSaleModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Venda Rápida
        </button>
        <Link to="/sales/full-sale" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Venda Completa
        </Link>
      </div>
      {isQuickSaleModalOpen && <QuickSale onClose={handleCloseQuickSaleModal} />}
    </div>
  );
};

export default Sales;
