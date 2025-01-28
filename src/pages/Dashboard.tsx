import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Users, Package, Brain, Heart, PieChart, BarChart, Award } from 'lucide-react';
import { GoogleSheetsSyncService } from '../services/googleSheetsSyncService';
import type { DemandPrediction, CustomerSentiment, ExpenseAnalysis, SalesPerformance, Fidelization } from '../model/types';

const syncService = new GoogleSheetsSyncService();

const stats = [
  { title: 'Total Sales', value: '$0', icon: DollarSign },
  { title: 'Revenue Growth', value: '0%', icon: TrendingUp },
  { title: 'Total Clients', value: '0', icon: Users },
  { title: 'Products', value: '0', icon: Package },
];

interface Insights {
  demand: DemandPrediction | null;
  sentiment: CustomerSentiment | null;
  expense: ExpenseAnalysis | null;
  sales: SalesPerformance | null;
  fidelization: Fidelization | null;
}

export default function Dashboard() {
  const [insights, setInsights] = useState<Insights>({
    demand: null,
    sentiment: null,
    expense: null,
    sales: null,
    fidelization: null
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const [demand, sentiment, expense, sales, fidelization] = await Promise.all([
        syncService.getDemandPrediction(),
        syncService.getCustomerSentiment(),
        syncService.getExpenseAnalysis(),
        syncService.getSalesPerformance(),
        syncService.getFidelizationInsights()
      ]);

      setInsights({ demand, sentiment, expense, sales, fidelization });
    } catch (error) {
      console.error('Erro ao carregar insights:', error);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-lg md:text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Cards de Business Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Demand Prediction */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-purple-600 w-5 h-5" />
            <h2 className="text-lg font-semibold">Previsão de Demanda</h2>
          </div>
          <div className="space-y-2">
            {insights.demand?.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{product.name}</span>
                <span className={`text-sm ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {product.predictedDemand} un.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Sentiment */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-red-600 w-5 h-5" />
            <h2 className="text-lg font-semibold">Satisfação do Cliente</h2>
          </div>
          <div className="space-y-2">
            <div className="text-center text-2xl font-bold text-blue-600">
              {((insights.sentiment?.overallSentiment ?? 0) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-center text-gray-600">
              Tendência: {insights.sentiment?.recentTrend ?? 'N/A'}
            </div>
          </div>
        </div>

        {/* Expense Analysis */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-green-600 w-5 h-5" />
            <h2 className="text-lg font-semibold">Análise de Despesas</h2>
          </div>
          <div className="space-y-2">
            {insights.expense?.topExpenses.map((expense, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{expense.category}</span>
                <span className={`text-sm ${expense.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                  R$ {expense.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Performance */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="text-blue-600 w-5 h-5" />
            <h2 className="text-lg font-semibold">Performance de Vendas</h2>
          </div>
          <div className="space-y-2">
            {insights.sales?.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{product.name}</span>
                <span className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {product.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fidelization */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-yellow-600 w-5 h-5" />
            <h2 className="text-lg font-semibold">Fidelização</h2>
          </div>
          <div className="space-y-2">
            {insights.fidelization?.topCustomers.map((customer, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{customer.name}</span>
                <span className="text-sm text-blue-600">
                  R$ {customer.totalPurchases}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}