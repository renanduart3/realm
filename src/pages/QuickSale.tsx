import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import saleService from '../services/saleService';
import { X } from 'lucide-react';

interface QuickSaleProps {
    onClose: () => void;
}

const mockedClients = [
    { id: '1', name: 'Client A' },
    { id: '2', name: 'Client B' },
    { id: '3', name: 'Client C' },
];

const QuickSale: React.FC<QuickSaleProps> = ({ onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [client, setClient] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const { products, loading, error } = useProducts();

    const handleQuickSaleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const saleData = { product: selectedProduct, quantity, client, description };
        await saleService.createQuickSale(saleData);
        alert('Quick sale created successfully!');
        onClose(); // Close the modal after submission
        // Reset form
        setSelectedProduct('');
        setQuantity(1);
        setClient('');
        setDescription('');
    };

    return (
        <div>
            {isModalOpen && (
                <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl relative">
                        {/* Close button positioned absolutely in the top-right corner */}
                        <button
                            onClick={onClose}
                            className="absolute -top-3 -right-3 p-2 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Quick Sale</h2>
                        
                        <form onSubmit={handleQuickSaleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Product/Service:
                                </label>
                                <select 
                                    className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                                    value={selectedProduct} 
                                    onChange={(e) => setSelectedProduct(e.target.value)} 
                                    required
                                >
                                    <option value="">Select a product/service</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Quantity:
                                </label>
                                <input 
                                    type="number" 
                                    className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))} 
                                    min="1" 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Client (optional):
                                </label>
                                <select 
                                    className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                                    value={client} 
                                    onChange={(e) => setClient(e.target.value)}
                                >
                                    <option value="">Select a client</option>
                                    {mockedClients.map((client) => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description:
                                </label>
                                <textarea 
                                    className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    rows={3}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                            >
                                Create Quick Sale
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickSale;
