//types.ts
export interface BaseEntity {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface SystemConfig extends BaseEntity {
    organization_type: 'profit' | 'nonprofit';
    organization_name: string;
    currency: string;
    theme: 'light' | 'dark';
    require_auth: boolean;
    google_sync_enabled: boolean;
    sheet_ids?: { [key: number]: string };
    is_configured: boolean;
    configured_at?: string;
}

export interface ProductService extends BaseEntity {
    name: string;
    type: 'Product' | 'Service';
    price: number;
    quantity?: number;
    category: string;
    description: string;
    active?: boolean;
}

export interface Sale extends BaseEntity {
    date: string;
    time: string;
    value: number;
    client_id?: string;
    person_id?: string;
}
export interface Expense extends BaseEntity {
    description: string;
    amount: number;
    category_id: string;
    date: string;
    is_recurring: boolean;
    due_date?: number;
    status: 'pending' | 'paid' | 'cancelled';
    payment_method?: string;
    notes?: string;
}
export type PaymentProvider = 'mercadopago' | 'pagarme';

export interface PaymentConfig {
    provider: PaymentProvider;
    apiKey: string;
    environment: 'development' | 'production';
}

export interface SubscriptionStatus extends BaseEntity {
    active: boolean;
    plan: 'free' | 'premium';
    billing: 'monthly' | 'yearly';
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    lastSync: string;
}

export interface PaymentError {
    code: string;
    message: string;
    timestamp: string;
}
export interface SaleItem extends BaseEntity {
    sale_id: string;
    product_service_id: string;
    quantity: number;
}

export interface FinancialCategory extends BaseEntity {
    name: string;
    type: 'income' | 'expense';
}

export interface Transaction extends BaseEntity {
    financial_category_id: string;
    value: number;
    date: string;
    time: string;
}

export interface SystemUser extends BaseEntity {
    username: string;
    password?: string;
    role: 'master' | 'seller';
    nature_type: 'profit' | 'nonprofit';
}

export interface InvitationCode {
    id: string;
    code: string;
    user_gerente_id: string;
    created_at: string;
}

export interface Client extends BaseEntity {
    name: string;
    email: string;
    phone: string;
    document: string;
    address?: string;
    tags?: string[];
    notes?: string;
}

export interface Person extends BaseEntity {
    name: string;
    email: string;
    phone: string;
    document: string;
    address?: string;
    socialPrograms?: string[];
    familyIncome?: number;
    notes?: string;
}

export interface Donor extends BaseEntity {
    name: string;
    email?: string;
    phone?: string;
    document?: string;
    type: 'individual' | 'company' | 'organization';
    address?: string;
    notes?: string;
}

export type TransactionType = 'donation' | 'grant' | 'other';
export type RecurrencePeriod = 'monthly' | 'quarterly' | 'yearly';

export interface Income extends BaseEntity {
    description: string;
    amount: number;
    date: string;
    donor_id?: string;
    category: string;
    type: TransactionType;
    is_recurring: boolean;
    recurrence_period?: RecurrencePeriod;
    notes?: string;
    status: 'pending' | 'completed' | 'cancelled';
    payment_method?: string;
    document_number?: string;
}

export interface RecurringExpense extends BaseEntity {
    description: string;
    amount: number;
    due_date: number;
    category_id: string;
    is_recurring: boolean;
}

// Interfaces para Insights
export interface DemandPrediction {
    topProducts: { name: string; predictedDemand: number; trend: "up" | "down"; confidence: number; }[];
    seasonalTrends?: { [key: string]: string[] }; // Opcional, dependendo do uso
  }
  
  export interface CustomerSentiment {
    overallSentiment: number;
    recentTrend: "positive" | "negative" | "neutral";
    topComplaints: string[];
    topPraises: string[];
    recentReviews: string[];
  }
  
  export interface ExpenseAnalysis {
    topExpenses: { category: string; amount: number; trend: "up" | "down"; }[];
    savingsOpportunities?: string[]; // Opcional, dependendo do uso
  }
  
  export interface SalesPerformance {
    topProducts: { name: string; revenue: number; growth: number; date: string }[];
    seasonalPerformance?: { [key: string]: { revenue: number; growth: number } };
  }
  
  export interface Fidelization {
    topCustomers: { name: string; totalPurchases: number; frequentItems: string[]; suggestedReward: string; }[];
    productPairs?: string[]; // Opcional, dependendo do uso
  }

export interface InsightData {
    demandPrediction: DemandPrediction | null;
    customerSentiment: CustomerSentiment | null;
    expenseAnalysis: ExpenseAnalysis;
    salesPerformance: SalesPerformance | null;
    fidelization: Fidelization | null;
}

export interface OrganizationSetup extends SystemConfig {
    address?: string;
    commercial_phone?: string;
    social_media?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
    };
    website?: string;
    cnpj?: string;
    pix_key?: {
        type: 'cnpj' | 'email' | 'phone' | 'random';
        key: string;
    };
    subscription?: {
        plan: 'free' | 'premium';
        billing: 'monthly' | 'yearly';
        is_early_user: boolean;
        payment_status: 'pending' | 'confirmed' | 'failed';
        last_payment_date?: string;
        next_billing_date?: string;
    };
    integrations?: {
        google_connected?: boolean;
        openai_connected?: boolean;
        supabase_connected?: boolean;
    };
}