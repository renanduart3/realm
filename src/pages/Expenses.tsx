import React, { useState } from 'react';

export default function Expenses() {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    is_recurring: false,
    due_date: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-900">
                Despesa Recorrente
              </label>
            </div>

            {formData.is_recurring && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Dia do Vencimento
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Expense
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
          <div className="space-y-4">
            <p className="text-gray-500 text-center">No expenses recorded yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}