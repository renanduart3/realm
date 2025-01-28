import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Receipt,
  Boxes
} from 'lucide-react';
import { systemConfigService } from '../services/systemConfigService';
import { SystemConfig } from '../model/types';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const location = useLocation();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const savedConfig = await systemConfigService.getConfig();
    setConfig(savedConfig);
  };

  const menuItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { 
      path: '/sales', 
      icon: <DollarSign size={20} />, 
      label: config?.organization_type === 'profit' ? 'Vendas' : 'Entradas'
    },
    { path: '/expenses', icon: <Receipt size={20} />, label: 'Despesas' },
    { 
      path: '/products', 
      icon: <ShoppingBag size={20} />, 
      label: 'Produtos',
      show: config?.organization_type === 'profit'
    },
    { 
      path: '/people', 
      icon: <Users size={20} />, 
      label: config?.organization_type === 'profit' ? 'Clientes' : 'Pessoas'
    },
    { path: '/settings', icon: <Settings size={20} />, label: 'Configurações' },
    { path: '/componentes', icon: <Boxes size={20} />, label: 'Teste Componentes' },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {isCollapsed ? (
          <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <nav className="mt-6">
        {menuItems
          .filter(item => item.show !== false)
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                location.pathname === item.path
                  ? 'text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
      </nav>
    </aside>
  );
}