import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Persons from './pages/Persons';
import ClientRedirect from './components/ClientRedirect';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { loadInitialData } from './utils/dataLoader';
import { useOrganizationType } from './hooks/useOrganizationType';
import Navbar from './components/Navbar';
import { ThemeProvider } from './contexts/ThemeContext';
import Breadcrumb from './components/Breadcrumb';
import Income from './pages/Income';
import Componentes from './pages/Componentes';
import SubscriptionPlans from './pages/SubscriptionPlans';
import SubscriptionStatus from './pages/SubscriptionStatus';
import SetupWizard from './pages/SetupWizard';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    loadInitialData();
  }, [])
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<PrivateRoutes />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

function PrivateRoutes() {
  const { isAuthenticated } = useAuth();
  const isProfit = useOrganizationType();
  const entityLabel = isProfit ? 'Cliente' : 'Pessoa';

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
              <Navbar />
              <div className="flex pt-16">
                <Sidebar />
                <main className={`flex-1 transition-all duration-300 ml-64 p-6`}>
                  <div className="mb-6">
                    <Breadcrumb />
                  </div>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route 
                      path="/sales" 
                      element={
                        isProfit ? <Sales /> : <Income />
                      } 
                    />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/persons" element={<Persons />} />
                    <Route path="/people" element={<ClientRedirect />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/componentes" element={<Componentes />} />
                    <Route path="/subscription-plans" element={<SubscriptionPlans />} />
                    <Route path="/subscription" element={<SubscriptionStatus />} />
                    <Route path="/setup" element={<SetupWizard />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
