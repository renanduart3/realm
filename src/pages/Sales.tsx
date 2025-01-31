import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import QuickSale from './QuickSale';
import Breadcrumb from '../components/Breadcrumb';

const Sales = () => {
    const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);

    return (
        <div className="p-6">
            <Breadcrumb />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendas</h1>
                <div className="space-x-2">
                    <Link
                        to="/sales/full"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Venda Completa
                    </Link>
                    <button
                        onClick={() => setIsQuickSaleOpen(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Venda Rápida
                    </button>
                </div>
            </div>

            {/* Lista de vendas aqui */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    Nenhuma venda registrada ainda
                </p>
            </div>

            {isQuickSaleOpen && (
                <QuickSale onClose={() => setIsQuickSaleOpen(false)} />
            )}
        </div>
    );
};

export default Sales;
