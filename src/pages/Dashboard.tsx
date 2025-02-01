import React, { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Brain,
  Heart,
  PieChart,
  BarChart,
  Award,
} from "lucide-react";
import { getMockData } from "../services/mockService";
import { appConfig } from "../config/app.config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  DemandPrediction,
  CustomerSentiment,
  ExpenseAnalysis,
  SalesPerformance,
  Fidelization,
  SystemUser,
} from "../model/types";

// Mock data for sales trend
const mockSalesData = [
  { date: "Jan", total: 4500 },
  { date: "Feb", total: 5200 },
  { date: "Mar", total: 4800 },
  { date: "Apr", total: 6000 },
  { date: "May", total: 5700 },
  { date: "Jun", total: 6500 },
  { date: "Jul", total: 7200 },
  { date: "Aug", total: 6800 },
  { date: "Sep", total: 7500 },
  { date: "Oct", total: 8200 },
  { date: "Nov", total: 8800 },
  { date: "Dec", total: 9500 },
];

const stats = [
  { title: "Total Sales", value: "R$ 82.700", icon: DollarSign },
  { title: "Revenue Growth", value: "+15%", icon: TrendingUp },
  { title: "Total Clients", value: "124", icon: Users },
  { title: "Products", value: "45", icon: Package },
];

interface ChurnRateData {
  month: string;
  churnRate: number;
}

interface Insights {
  demand: {
    topProducts: {
      name: string;
      predictedDemand: number;
      trend: "up" | "down";
      confidence: number;
    }[];
  } | null;
  sentiment: {
    overallSentiment: number;
    recentTrend: "positive" | "negative" | "neutral";
    topComplaints: string[];
    topPraises: string[];
    recentReviews: string[];
  } | null;
  expense: {
    topExpenses: { category: string; amount: number; trend: "up" | "down" }[];
  } | null;
  sales: {
    topProducts: {
      name: string;
      revenue: number;
      growth: number;
      date: string;
    }[];
  } | null;
  fidelization: {
    topCustomers: {
      name: string;
      totalPurchases: number;
      frequentItems: string[];
      suggestedReward: string;
    }[];
  } | null;
}

export default function Dashboard() {
  const [insights, setInsights] = useState<Insights>({
    demand: { topProducts: [] },
    sentiment: {
      overallSentiment: 0,
      recentTrend: "neutral",
      topComplaints: [],
      topPraises: [],
      recentReviews: [],
    },
    expense: { topExpenses: [] },
    sales: { topProducts: [] },
    fidelization: { topCustomers: [] },
  });

  const [salesData, setSalesData] = useState(mockSalesData);
  const [churnRate, setChurnRate] = useState<number>(0);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    // Load insights logic...
  };

  const calculateChurnRate = () => {
    // Logic to calculate churn rate based on historical data
    const totalCustomers = 100; // Example total customers
    const churnedCustomers = 5; // Example churned customers
    const rate = (churnedCustomers / totalCustomers) * 100;
    setChurnRate(rate);
  };

  useEffect(() => {
    calculateChurnRate();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className="text-blue-600 dark:text-blue-500 w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Churn Rate Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Churn Rate
        </h2>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {churnRate.toFixed(2)}%
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Clientes em risco de churn.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ação sugerida: Entre em contato com clientes em risco.
        </p>
      </div>

      {/* Sales Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sales Trend
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#F3F4F6' }} formatter={(value) => [`R$ ${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards de Business Intelligence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Demand Prediction */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-purple-600 dark:text-purple-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Previsão de Demanda</h2>
          </div>
          <div className="space-y-2">
            {insights.demand?.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                <span className={`text-sm ${product.trend === "up" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                  {product.predictedDemand} un.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Sentiment */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-red-600 dark:text-red-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Satisfação do Cliente</h2>
          </div>
          <div className="space-y-2">
            <div className="text-center text-2xl font-bold text-blue-600 dark:text-blue-500">
              {((insights.sentiment?.overallSentiment ?? 0) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              Tendência: {insights.sentiment?.recentTrend ?? "N/A"}
            </div>
          </div>
        </div>

        {/* Expense Analysis */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-green-600 dark:text-green-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Análise de Despesas</h2>
          </div>
          <div className="space-y-2">
            {insights.expense?.topExpenses.map((expense, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{expense.category}</span>
                <span className={`text-sm ${expense.trend === "up" ? "text-red-600 dark:text-red-500" : "text-green-600 dark:text-green-500"}`}>
                  R$ {expense.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Performance */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="text-blue-600 dark:text-blue-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance de Vendas</h2>
          </div>
          <div className="space-y-2">
            {insights.sales?.topProducts?.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                <span className="text-sm text-blue-600 dark:text-blue-500">R$ {product.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fidelization */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-yellow-600 dark:text-yellow-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fidelização</h2>
          </div>
          <div className="space-y-2">
            {insights.fidelization?.topCustomers.map((customer, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{customer.name}</span>
                <span className="text-sm text-blue-600 dark:text-blue-500">R$ {customer.totalPurchases}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
