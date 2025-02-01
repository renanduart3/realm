import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { appConfig } from '../config/app.config';
import { stripeService } from '../services/payment/StripeService';
import { useToast } from '../hooks/useToast';
import SubscriptionPaymentModal from '../components/SubscriptionPaymentModal';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionData {
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'none';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  plan?: {
    interval: 'month' | 'year';
    amount: number;
  };
}

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData>({ status: 'none' });
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'month' | 'year'>('month');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'pix'>('card');
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const planDetails = appConfig.subscription.plans.premium;

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement fetching actual subscription status from your backend
      // For now, we'll use mock data
      const mockSubscription: SubscriptionData = {
        status: 'none',
      };
      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Error loading subscription status:', error);
      showToast('Error loading subscription status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = (interval: 'month' | 'year') => {
    if (!user?.email) {
      showToast('Please log in to subscribe', 'error');
      navigate('/login');
      return;
    }
    setSelectedPlan(interval);
    setShowPaymentModal(true);
  };

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual cancellation through your backend
      await stripeService.cancelSubscription('subscription_id');
      showToast('Subscription cancelled successfully', 'success');
      loadSubscriptionStatus();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      showToast('Error cancelling subscription', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Subscription Status
      </h1>

      {subscription.status === 'none' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Choose a Plan
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <div className="border dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Monthly Plan
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {formatCurrency(planDetails.price.monthly)}/month
              </p>
              <ul className="space-y-2 mb-6">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('month')}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Subscribe Monthly
              </button>
            </div>

            {/* Annual Plan */}
            <div className="border dark:border-gray-700 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                Save 20%
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Annual Plan
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {formatCurrency(planDetails.price.annual)}/year
              </p>
              <ul className="space-y-2 mb-6">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('year')}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Subscribe Annually
              </button>
            </div>
          </div>

          {planDetails.earlyBirdDiscount?.enabled && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-700 dark:text-blue-300 font-medium">
                🎉 Early Bird Offer!
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                Get {planDetails.earlyBirdDiscount.discountPercentage}% off when you subscribe now! 
                Limited to first {planDetails.earlyBirdDiscount.maxUsers} subscribers.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Current Subscription
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              subscription.status === 'canceled' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>

          {subscription.status === 'active' && (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your subscription will {subscription.cancelAtPeriodEnd ? 'end' : 'renew'} on{' '}
                {new Date(subscription.currentPeriodEnd!).toLocaleDateString()}
              </p>
              
              {!subscription.cancelAtPeriodEnd && (
                <button
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:hover:bg-red-900/20"
                >
                  Cancel Subscription
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showPaymentModal && (
        <SubscriptionPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          email={user?.email || ''}
          paymentMethod={selectedPaymentMethod} // Pass the selected payment method
        />
      )}
    </div>
  );
}
