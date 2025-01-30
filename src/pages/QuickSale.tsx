import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import saleService from '../services/saleService';

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
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <span className="close cursor-pointer text-red-600" onClick={onClose}>&times;</span>
                        <h2 className="text-xl font-bold mb-4">Quick Sale</h2>
                        <form onSubmit={handleQuickSaleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Product/Service:</label>
                                <select className="w-full p-2 border rounded" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                                    <option value="">Select a product/service</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Quantity:</label>
                                <input type="number" className="w-full p-2 border rounded" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" required />
                            </div>
                            <div>
                                <label className="block mb-1">Client (optional):</label>
                                <select className="w-full p-2 border rounded" value={client} onChange={(e) => setClient(e.target.value)}>
                                    <option value="">Select a client</option>
                                    {mockedClients.map((client) => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Description:</label>
                                <textarea className="w-full p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Quick Sale</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickSale;