//src/utils/dataLoader.ts
import mockData from '../mocks/dataMock.json';
import { appConfig } from '../config/app.config';
import { db } from '../db/AppDatabase';
import { 
  SystemConfig, 
  ProductService, 
  Income, 
  Donor, 
  Person, 
  FinancialCategory, 
  SystemUser,
  TransactionType 
} from '../model/types';

const shouldUseMockData = () => {
  return appConfig.isDevelopment && appConfig.useMockData;
};

const convertMockData = {
  systemConfig: (data: any): SystemConfig => ({
    ...data,
    organization_type: data.organization_type as "profit" | "nonprofit",
  }),
  income: (data: any[]): Income[] => data.map(item => ({
    ...item,
    type: item.type as TransactionType,
  })),
  donors: (data: any[]): Donor[] => data.map(item => ({
    ...item,
    type: item.type as "organization" | "individual" | "company",
  })),
  financialCategories: (data: any[]): FinancialCategory[] => data.map(item => ({
    ...item,
    type: item.type as "income" | "expense",
  })),
  systemUsers: (data: any[]): SystemUser[] => data.map(item => ({
    ...item,
    role: item.role as "master" | "seller",
    nature_type: item.nature_type as "profit" | "nonprofit",
  })),
};

export const loadInitialData = async () => {
  if (!shouldUseMockData()) return;

  try {
    // Verifica se já existem dados no banco
    const existingConfig = await db.systemConfig.get('system-config');
    if (existingConfig) {
      console.log('Database already initialized');
      return;
    }

    // Carrega os dados mock sem deletar o banco
    await db.systemConfig.put(convertMockData.systemConfig(mockData.systemConfig));
    await db.products.bulkPut(mockData.products);
    await db.income.bulkPut(convertMockData.income(mockData.income));
    await db.donors.bulkPut(convertMockData.donors(mockData.donors));
    await db.persons.bulkPut(mockData.persons);
    await db.financialCategories.bulkPut(convertMockData.financialCategories(mockData.financialCategories));
    await db.systemUsers.bulkPut(convertMockData.systemUsers(mockData.systemUsers));

    console.log('Mock data loaded successfully');
  } catch (error) {
    console.error('Error loading mock data:', error);
  }
};

// Funções auxiliares para recuperar dados
export const getMockData = async <T>(tableName: string): Promise<T[]> => {
  if (!shouldUseMockData()) return [];
  return (mockData as any)[tableName] || [];
};

export const getAllProducts = async (): Promise<ProductService[]> => {
  try {
    const products = await db.products.toArray();
    return products.map(product => ({
      ...product,
      category: product.category || 'Geral',
      description: product.description || ''
    }));
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};