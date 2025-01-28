import React, { useEffect } from 'react';
import { MercadoPagoService } from '../services/payment/MercadoPagoService';

declare global {
  interface Window {
    MercadoPago: any; // ou uma tipagem mais específica se necessário
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'monthly' | 'yearly';
  amount: number;
}

export function PaymentModal({ isOpen, onClose, plan, amount }: PaymentModalProps) {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      initCheckout();
    }
  }, [isOpen]);

  const initCheckout = async () => {
    try {
      setLoading(true);
      const mpService = new MercadoPagoService();
      const response = await mpService.createPreference('premium', plan);
      
      // Inicializa o checkout do Mercado Pago
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => {
        const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
        mp.checkout({
          preference: {
            id: response.id
          },
          render: {
            container: '.mp-checkout',
            label: 'Pagar',
          }
        });
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-lg font-medium">Plano Premium {plan === 'monthly' ? 'Mensal' : 'Anual'}</p>
              <p className="text-2xl font-bold">R$ {amount.toFixed(2)}</p>
            </div>
            <div className="mp-checkout" /> {/* Container para o botão do Mercado Pago */}
          </div>
        )}
      </div>
    </div>
  );
} 