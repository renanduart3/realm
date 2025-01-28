import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  Check, 
  X, 
  Brain, 
  Calendar, 
  Star, 
  CreditCard,
  AlertTriangle
} from 'lucide-react';

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [earlyUsersCount] = useState(27); // This would come from your backend

  const premiumPrice = {
    monthly: {
      early: 3.99,
      regular: 5.99
    },
    annual: {
      early: 39.99,
      regular: 59.99
    }
  };

  const currentPrice = isAnnual 
    ? premiumPrice.annual.early 
    : premiumPrice.monthly.early;

  const handleSubscribe = (plan: 'free' | 'premium') => {
    if (plan === 'premium') {
      navigate('/subscriptions');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Select the perfect plan for your business needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Early Access Banner */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold">Early Access Offer!</h2>
              <p className="text-white/90">
                Be one of our first 50 users and get a lifetime discount.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            <span className="font-semibold text-2xl">{50 - earlyUsersCount}</span>
            <span className="text-sm">spots remaining</span>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex items-center">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !isAnnual 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isAnnual 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Annual
            <span className="ml-1 text-xs text-green-600 dark:text-green-400">
              Save 33%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Basic features for small businesses
            </p>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-bold">$0</div>
            <div className="text-gray-600 dark:text-gray-400">Forever free</div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span>Basic business management</span>
            </li>
            <li className="flex items-center gap-3 text-gray-500">
              <X className="w-5 h-5 text-red-600" />
              <span>No cloud backup</span>
            </li>
            <li className="flex items-center gap-3 text-gray-500">
              <X className="w-5 h-5 text-red-600" />
              <span>No business intelligence</span>
            </li>
            <li className="flex items-center gap-3 text-gray-500">
              <X className="w-5 h-5 text-red-600" />
              <span>No scheduling features</span>
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe('free')}
            className="w-full py-2 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-blue-600 to-purple-600 rounded-xl shadow-lg p-[2px]">
          <div className="bg-white dark:bg-gray-900 rounded-[calc(0.75rem-2px)] p-8 h-full">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Premium</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Full features for growing businesses
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">${currentPrice}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  /{isAnnual ? 'year' : 'month'}
                </div>
              </div>
              {earlyUsersCount < 50 && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Early user price - Lock in this rate!</span>
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>All Free features</span>
              </li>
              <li className="flex items-center gap-3">
                <Cloud className="w-5 h-5 text-blue-600" />
                <span>Cloud backup included</span>
              </li>
              <li className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Business Intelligence analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Advanced scheduling</span>
              </li>
              <li className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <span>Priority support</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe('premium')}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold mb-2">Flexible Billing</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Choose between monthly or annual billing. Cancel anytime.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold mb-2">Early User Benefits</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Lock in discounted pricing forever as an early adopter.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold mb-2">100% Satisfaction</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Try Premium risk-free with our 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}