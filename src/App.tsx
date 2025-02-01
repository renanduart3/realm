import React, { useEffect, useState } from 'react';
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
import SubscriptionStatus from './pages/SubscriptionStatus';
import Preloader from './components/Preloader';

// Payment success/cancel pages
const PaymentSuccess = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Handle successful payment
      // TODO: Update subscription status
      window.location.href = '/subscription';
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600">Redirecting to your subscription...</p>
      </div>
    </div>
  );
};

const PaymentCancel = () => {
  useEffect(() => {
    // Redirect back to subscription page after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/subscription';
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You'll be redirected back to the subscription page...
        </p>
      </div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize mock data when the app starts
        await mockDataService.initializeMockData();
        
        // Simulate minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error('Failed to initialize mock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

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
                <Route path="/subscription" element={<SubscriptionStatus />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
