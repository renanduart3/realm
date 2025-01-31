import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { mockDataService } from './services/mockDataService';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import PersonClientManager from './components/PersonClientManager';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Expenses from './pages/Expenses';
import ComponentsTest from './pages/ComponentsTest';
import FullSale from './pages/FullSale';
import Login from './pages/Login';
import Income from './pages/Income';
import SetupWizard from './pages/SetupWizard';

function App() {
  useEffect(() => {
    // Initialize mock data when the app starts
    mockDataService.initializeMockData()
      .catch(error => console.error('Failed to initialize mock data:', error));
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/sales/full" element={<FullSale />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/products" element={<Products />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/componentes" element={<ComponentsTest />} />
                <Route path="/persons" element={<PersonClientManager />} />
                <Route path="/login" element={<Login />} />
                <Route path="/income" element={<Income />} />
                <Route path="/setup" element={<SetupWizard />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
