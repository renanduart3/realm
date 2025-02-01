import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { stripeService } from '../services/payment/StripeService';
import { useToast } from '../hooks/useToast';
import { appConfig } from '../config/app.config';

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'month' | 'year';
  email: string;
  paymentMethod: 'card' | 'pix'; // Added paymentMethod property
}

export default function SubscriptionPaymentModal({ 
  isOpen, 
  onClose, 
  plan,
  email,
  paymentMethod // Accept paymentMethod as a prop
}: SubscriptionPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const planDetails = appConfig.subscription.plans.premium;
  const amount = plan === 'month' ? planDetails.price.monthly : planDetails.price.annual;

  // Calculate early bird discount if applicable
  const isEarlyBirdEligible = planDetails.earlyBirdDiscount?.enabled;
  const finalAmount = isEarlyBirdEligible
    ? amount * (1 - (planDetails.earlyBirdDiscount?.discountPercentage || 0) / 100)
    : amount;

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const session = await stripeService.createSubscription({
        planId: 'premium',
        interval: plan,
        email,
        paymentMethod // Pass the selected payment method
      });

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Payment error:', error);
      showToast(
        'Error initiating payment. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Subscription Payment
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Plan
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {planDetails.name} - {plan === 'month' ? 'Monthly' : 'Annual'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <div className="space-y-1">
                {isEarlyBirdEligible && (
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Early bird discount: {planDetails.earlyBirdDiscount?.discountPercentage}% off!
                  </p>
                )}
                {isEarlyBirdEligible && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(amount)}
                  </p>
                )}
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(finalAmount)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method:
              </h3>
              <div className="flex space-x-4">
                <label>
                  <input 
                    type="radio" 
                    value="card" 
                    checked={paymentMethod === 'card'} 
                    readOnly 
                  />
                  Credit Card
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="pix" 
                    checked={paymentMethod === 'pix'} 
                    readOnly 
                  />
                  Pix
                </label>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Payment methods supported:</p>
              <div className="flex space-x-2 mt-1">
                {appConfig.stripe.supportedPaymentMethods.map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded capitalize"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
