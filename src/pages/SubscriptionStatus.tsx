import React, { useState } from 'react';
import { QrCode, Clock, CheckCircle, AlertTriangle, Copy, RefreshCw, Star, CreditCard, Brain, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import  PaymentModal  from '../components/PaymentModal';

interface Subscription {
  id: string;
  type: 'monthly' | 'annual';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'delayed';
  paidAt?: string;
  pixCode?: string;
}

export default function SubscriptionStatus() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [earlyUsersCount] = useState(27); // This would come from your backend
  const [isAnnual, setIsAnnual] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'monthly' | 'yearly';
    amount: number;
  } | null>(null);

  // In a real app, fetch this from your database
  const subscriptions: Subscription[] = [
    {
      id: '1',
      type: 'monthly',
      amount: 29.99,
      dueDate: '2024-03-15',
      status: 'delayed',
      pixCode: '00020126580014br.gov.bcb.pix0136a629532e-7e9a-4b4e-b755-344a52e3652704',
    },
    {
      id: '2',
      type: 'monthly',
      amount: 29.99,
      dueDate: '2024-02-15',
      status: 'paid',
      paidAt: '2024-02-13',
    },
    {
      id: '3',
      type: 'monthly',
      amount: 29.99,
      dueDate: '2024-01-15',
      status: 'paid',
      paidAt: '2024-01-14',
    },
    {
      id: '4',
      type: 'annual',
      amount: 299.99,
      dueDate: '2023-12-31',
      status: 'paid',
      paidAt: '2023-12-30',
    },
    {
      id: '5',
      type: 'monthly',
      amount: 29.99,
      dueDate: '2023-12-15',
      status: 'paid',
      paidAt: '2023-12-14',
    },
  ];

  const currentSubscription = subscriptions[0];
  const isPaymentNeeded = currentSubscription.status === 'pending' || currentSubscription.status === 'delayed';
  const isDelayed = currentSubscription.status === 'delayed';

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

  const handleCopyCode = () => {
    if (currentSubscription.pixCode) {
      navigator.clipboard.writeText(currentSubscription.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshCode = () => {
    setIsRefreshing(true);
    // Simulate refreshing the QR code
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 dark:text-green-400';
      case 'delayed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleUpgradeClick = (plan: 'monthly' | 'yearly') => {
    const isEarlyUser = !localStorage.getItem('not_early_user');
    const amount = plan === 'monthly' 
      ? (isEarlyUser ? 19.90 : 29.90)
      : (isEarlyUser ? 199.90 : 299.90);

    setSelectedPlan({ type: plan, amount });
    setShowPayment(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Tabs defaultValue="plan">
        <TabsList>
          <TabsTrigger value="plan">Subscription Plan</TabsTrigger>
          <TabsTrigger value="details">Subscription Details</TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          {/* Plan Selection */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Your Plan</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Billing:</span>
                  <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex items-center">
                    <button
                      onClick={() => setIsAnnual(false)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        !isAnnual 
                          ? 'bg-white dark:bg-gray-700 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setIsAnnual(true)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isAnnual 
                          ? 'bg-white dark:bg-gray-700 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Annual
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Basic features for small businesses
                  </p>
                </div>
                <div className="mb-6">
                  <div className="text-3xl font-bold">$0</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Forever free</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Basic business management</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>No cloud backup</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>No business intelligence</span>
                  </li>
                </ul>
                <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium">
                  Current Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className="relative bg-gradient-to-b from-blue-600 to-purple-600 p-[1px] rounded-lg">
                <div className="bg-white dark:bg-gray-900 rounded-[calc(0.5rem-1px)] p-6">
                  {earlyUsersCount < 50 && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                        Early Access Price
                      </div>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Premium Plan</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Full features for growing businesses
                    </p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold">
                        ${isAnnual ? premiumPrice.annual.early : premiumPrice.monthly.early}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        /{isAnnual ? 'year' : 'month'}
                      </div>
                    </div>
                    {isAnnual && (
                      <div className="text-green-600 dark:text-green-400 text-sm mt-1">
                        Save 33% with annual billing
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>All Free features</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Cloud className="w-4 h-4 text-blue-600" />
                      <span>Cloud backup included</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span>Business Intelligence analytics</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleUpgradeClick('monthly')}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Upgrade Now
                  </button>
                  {earlyUsersCount < 50 && (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                      <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
                      Lock in early user pricing forever!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {earlyUsersCount < 50 && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                    <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-200">
                      Early Access Offer
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {50 - earlyUsersCount} spots remaining for lifetime discount pricing!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details">
          {/* Current Subscription Status */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Current Subscription</h2>
            
            {isPaymentNeeded ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* QR Code Section */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <QrCode className="w-48 h-48" />
                        {isRefreshing && (
                          <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg flex items-center justify-center">
                            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleRefreshCode}
                        className="absolute -top-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                    
                    {currentSubscription.pixCode && (
                      <div className="mt-4 w-full max-w-xs">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <code className="flex-1 text-sm truncate">
                            {currentSubscription.pixCode}
                          </code>
                          <button
                            onClick={handleCopyCode}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {copied && (
                          <p className="text-sm text-green-600 dark:text-green-400 text-center mt-2">
                            Code copied!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="flex-1 w-full">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="font-medium mb-2">Payment Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <span className="font-semibold">${currentSubscription.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                            <span className="font-semibold">
                              {new Date(currentSubscription.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className={`font-semibold ${getStatusColor(currentSubscription.status)}`}>
                              {currentSubscription.status.toUpperCase()}
                            </span>
                          </div>
                          {isDelayed && (
                            <div className="flex justify-between text-red-600 dark:text-red-400">
                              <span>Days Overdue:</span>
                              <span className="font-semibold">
                                {getDaysOverdue(currentSubscription.dueDate)} days
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                          Payment Instructions
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-600 dark:text-blue-300">
                          <li>Open your bank's app</li>
                          <li>Select the PIX payment option</li>
                          <li>Scan the QR code or copy the code below</li>
                          <li>Confirm the payment amount</li>
                          <li>Complete the transaction</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                {isDelayed && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <span>
                        Your payment is overdue by {getDaysOverdue(currentSubscription.dueDate)} days. 
                        Please make the payment as soon as possible to avoid service interruption.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Your subscription is active and up to date</span>
              </div>
            )}
          </div>

          {/* Subscription History */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">Payment History</h2>
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${getStatusColor(subscription.status)}`}>
                      {getStatusIcon(subscription.status)}
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">
                        {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)} Subscription
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {new Date(subscription.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getStatusColor(subscription.status)}`}>
                      ${subscription.amount}
                    </p>
                    {subscription.paidAt && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Paid: {new Date(subscription.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedPlan && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          plan={selectedPlan.type}
          amount={selectedPlan.amount}
        />
      )}
    </div>
  );
}