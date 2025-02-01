import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { stripeService } from '../services/payment/StripeService';
import { UserSubscription, SystemConfig } from '../model/types';
import { db } from '../db/AppDatabase';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      
      // First try to get subscription from IndexedDB
      const systemConfig = await db.systemConfig.get('system-config');
      
      if (systemConfig?.subscription) {
        setSubscription({
          id: systemConfig.id,
          status: systemConfig.subscription.payment_status === 'confirmed' ? 'active' : 'none',
          plan: systemConfig.subscription.plan,
          interval: systemConfig.subscription.billing === 'monthly' ? 'month' : 'year',
          currentPeriodStart: systemConfig.subscription.last_payment_date || new Date().toISOString(),
          currentPeriodEnd: systemConfig.subscription.next_billing_date || new Date().toISOString(),
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: systemConfig.subscription.stripe_subscription_id,
          stripeCustomerId: systemConfig.subscription.stripe_customer_id
        });
      } else {
        // If no subscription found, set default state
        setSubscription({
          id: 'default',
          status: 'none',
          plan: 'free',
          interval: 'month',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date().toISOString(),
          cancelAtPeriodEnd: false
        });
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      // Set default state in case of error
      setSubscription({
        id: 'default',
        status: 'none',
        plan: 'free',
        interval: 'month',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date().toISOString(),
        cancelAtPeriodEnd: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (options: {
    planId: 'premium';
    interval: 'month' | 'year';
    paymentMethod: 'card' | 'pix'; // Added paymentMethod parameter
  }) => {
    if (!user?.email) {
      throw new Error('User email is required for subscription');
    }

    try {
      const session = await stripeService.createSubscription({
        planId: options.planId,
        interval: options.interval,
        email: user.email,
        paymentMethod: options.paymentMethod // Pass the payment method
      });

      // Get current config
      const currentConfig = await db.systemConfig.get('system-config');
      if (!currentConfig) {
        throw new Error('System config not found');
      }

      // Update local subscription data
      const updatedConfig: SystemConfig = {
        ...currentConfig,
        subscription: {
          plan: options.planId,
          billing: options.interval === 'month' ? 'monthly' : 'yearly',
          payment_status: 'pending',
          last_payment_date: new Date().toISOString(),
          next_billing_date: new Date(Date.now() + (options.interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          stripe_subscription_id: session.subscription?.id,
          stripe_customer_id: session.customer?.id,
          is_early_user: await isEarlyBirdEligible()
        }
      };

      await db.systemConfig.put(updatedConfig);

      return session;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    try {
      await stripeService.cancelSubscription(subscription.stripeSubscriptionId);
      
      // Get current config
      const currentConfig = await db.systemConfig.get('system-config');
      if (!currentConfig) {
        throw new Error('System config not found');
      }

      // Update local subscription data
      const updatedConfig: SystemConfig = {
        ...currentConfig,
        subscription: {
          ...currentConfig.subscription!,
          payment_status: 'cancelled',
          next_billing_date: undefined
        }
      };

      await db.systemConfig.put(updatedConfig);
      
      await loadSubscription(); // Reload subscription state
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  };

  const isSubscriptionActive = () => {
    return subscription?.status === 'active';
  };

  const isEarlyBirdEligible = async () => {
    try {
      // Count total subscriptions
      const configs = await db.systemConfig.toArray();
      const activeSubscriptions = configs.filter(
        config => config.subscription?.payment_status === 'confirmed'
      );
      return activeSubscriptions.length < 50; // First 50 users are eligible
    } catch (error) {
      console.error('Error checking early bird eligibility:', error);
      return false;
    }
  };

  return {
    subscription,
    isLoading,
    createSubscription,
    cancelSubscription,
    isSubscriptionActive,
    isEarlyBirdEligible,
    refreshSubscription: loadSubscription,
  };
}
