import { useState, useEffect } from 'react';
import { PaymentService } from '../services/payment/PaymentService';
import { SubscriptionStatus } from '../model/types';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const paymentService = PaymentService.getInstance();
      const status = await paymentService.getSubscriptionStatus();
      setStatus(status);
      setError(null);
    } catch (error) {
      setError('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, error, refresh: loadStatus };
} 