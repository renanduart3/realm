import { loadStripe } from "@stripe/stripe-js";
import { appConfig } from "../../config/app.config";

type PlanId = keyof typeof appConfig.subscription.plans;
type PaymentMode = "payment" | "subscription";
type PaymentInterval = "month" | "year";
type PaymentMethod = "card" | "pix";

interface PaymentSessionOptions {
  amount: number;
  currency?: string;
  paymentMethod?: PaymentMethod;
  mode?: PaymentMode;
  subscriptionData?: {
    planId: PlanId;
    interval: PaymentInterval;
  };
}

interface SubscriptionOptions {
  planId: PlanId;
  interval: PaymentInterval;
  email: string;
  paymentMethod: PaymentMethod; // Added paymentMethod property
}

class StripeService {
  private stripe: Promise<any>;

  constructor() {
    this.stripe = loadStripe(appConfig.stripe.publishableKey);
  }

  async createPaymentSession(options: PaymentSessionOptions) {
    try {
      const stripe = await this.stripe;

      // Base configuration for the session
      const sessionConfig = {
        mode: options.mode || "payment",
        payment_method_types: options.paymentMethod
          ? [options.paymentMethod]
          : appConfig.stripe.supportedPaymentMethods,
        line_items: [
          {
            price_data: {
              currency: options.currency || "brl",
              product_data: {
                name: options.subscriptionData
                  ? `${appConfig.subscription.plans.premium.name} - $ {
                  options.subscriptionData.interval === 'month' ? 'Mensal' : 'Anual'
                }`
                  : "Pagamento",
              },
              unit_amount: options.amount * 100, // Stripe expects amount in cents
              recurring: options.subscriptionData
                ? {
                    interval: options.subscriptionData.interval,
                  }
                : undefined,
            },
            quantity: 1,
          },
        ],
        success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      };

      // Create the session
      const session = await stripe.checkout.sessions.create(sessionConfig);

      return session;
    } catch (error) {
      console.error("Error creating payment session:", error);
      throw error;
    }
  }

  async createSubscription(options: SubscriptionOptions) {
    try {
      const plan = appConfig.subscription.plans[options.planId];
      if (!plan) {
        throw new Error("Invalid plan ID");
      }

      const amount =
        options.interval === "month" ? plan.price.monthly : plan.price.annual;

      // Apply early bird discount if eligible
      let finalAmount = amount;
      if (plan.earlyBirdDiscount?.enabled) {
        // TODO: Check if user is eligible for early bird discount
        // This would require checking how many subscriptions have been created
        finalAmount =
          amount * (1 - plan.earlyBirdDiscount.discountPercentage / 100);
      }

      return this.createPaymentSession({
        amount: finalAmount,
        mode: "subscription",
        subscriptionData: {
          planId: options.planId,
          interval: options.interval,
        },
        paymentMethod: options.paymentMethod, // Pass the payment method
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  async handlePaymentSuccess(sessionId: string) {
    try {
      const stripe = await this.stripe;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Handle successful payment
      // TODO: Update user's subscription status in the database
      // TODO: Send confirmation email
      // TODO: Update UI to reflect new subscription status

      return session;
    } catch (error) {
      console.error("Error handling payment success:", error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const stripe = await this.stripe;
      const subscription = await stripe.subscriptions.cancel(subscriptionId);

      // TODO: Update user's subscription status in the database
      // TODO: Send cancellation confirmation email
      // TODO: Update UI to reflect cancelled subscription

      return subscription;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  }

  async getSubscriptionStatus(subscriptionId: string) {
    try {
      const stripe = await this.stripe;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error("Error getting subscription status:", error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
