import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import saleService from '../services/saleService';

const QuickSale = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen(false); // Close the modal after submission
        // Reset form
        setSelectedProduct('');
        setQuantity(1);
        setClient('');
        setDescription('');
    };

    return (
        <div>
            <h1>Quick Sale</h1>
            {loading && <p>Loading products...</p>}
            {error && <p>Error loading products: {error}</p>}
            <button onClick={() => setIsModalOpen(true)}>Create Quick Sale</button>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Quick Sale</h2>
                        <form onSubmit={handleQuickSaleSubmit}>
                            <div>
                                <label>Product/Service:</label>
                                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                                    <option value="">Select a product/service</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Quantity:</label>
                                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" required />
                            </div>
                            <div>
                                <label>Client (optional):</label>
                                <input type="text" value={client} onChange={(e) => setClient(e.target.value)} />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <button type="submit">Create Quick Sale</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickSale;