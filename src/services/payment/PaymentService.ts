import { db } from '../../db/AppDatabase';
import { PaymentConfig,PaymentProvider, SubscriptionStatus, PaymentError } from '../../model/types';

export class PaymentService {
  private static instance: PaymentService;
  private config: PaymentConfig;
  private lastError?: PaymentError;

  private constructor() {
    this.config = {
      provider: import.meta.env.VITE_PAYMENT_PROVIDER as PaymentProvider,
      apiKey: import.meta.env.VITE_PAYMENT_API_KEY,
      environment: import.meta.env.MODE as 'development' | 'production'
    };
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
    try {
      // Primeiro tenta pegar do cache local
      const cachedStatus = await this.getCachedStatus();
      if (cachedStatus && this.isStatusValid(cachedStatus)) {
        return cachedStatus;
      }

      // Se não tiver cache ou estiver expirado, busca da API
      const status = await this.fetchStatusFromAPI();
      if (status) {
        await this.cacheStatus(status);
        return status;
      }

      return null;
    } catch (error) {
      this.handleError(error);
      return this.getCachedStatus();
    }
  }

  private async getCachedStatus(): Promise<SubscriptionStatus | null> {
    try {
      const status = await db.subscriptionStatus.get('current');
      return status || null;
    } catch {
      return null;
    }
  }

  private async cacheStatus(status: SubscriptionStatus): Promise<void> {
    try {
      await db.subscriptionStatus.put({
        ...status,
        id: 'current',
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error caching subscription status:', error);
    }
  }

  private isStatusValid(status: SubscriptionStatus): boolean {
    const lastSync = new Date(status.lastSync);
    const now = new Date();
    // Considera válido se a última sincronização foi há menos de 1 hora
    return now.getTime() - lastSync.getTime() < 60 * 60 * 1000;
  }

  private async fetchStatusFromAPI(): Promise<SubscriptionStatus | null> {
    // Implementar integração específica com Mercado Pago ou Pagar.me
    if (this.config.provider === 'mercadopago') {
      return this.fetchMercadoPagoStatus();
    } else {
      return this.fetchPagarMeStatus();
    }
  }

  private handleError(error: any): void {
    this.lastError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      timestamp: new Date().toISOString()
    };

    if (this.config.environment === 'development') {
      console.error('Payment Service Error:', error);
    }
  }

  // Implementações específicas para cada provedor
  private async fetchMercadoPagoStatus(): Promise<SubscriptionStatus | null> {
    // Implementar
    return null;
  }

  private async fetchPagarMeStatus(): Promise<SubscriptionStatus | null> {
    // Implementar
    return null;
  }
} 