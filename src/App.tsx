import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Products from './pages/Products';
import People from './pages/People';
import Settings from './pages/Settings';
import Expenses from './pages/Expenses';
import ComponentsTest from './pages/ComponentsTest';
import SubscriptionStatus from './pages/SubscriptionStatus';
import FullSale from './pages/FullSale';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/sales/full" element={<FullSale />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/products" element={<Products />} />
              <Route path="/people" element={<People />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscription" element={<SubscriptionStatus />} />
              <Route path="/componentes" element={<ComponentsTest />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
