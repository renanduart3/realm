import { db } from '../db/AppDatabase';
import { SystemConfig } from '../model/types';

let isInitialized = false;

export const systemConfigService = {
  async initialize() {
    if (!isInitialized) {
      try {
        await db.open();
        isInitialized = true;
      } catch (error) {
        console.error('Erro ao inicializar banco:', error);
      }
    }
  },

  async getConfig(): Promise<SystemConfig | null> {
    try {
      await this.initialize();
      
      const config = await db.systemConfig.get('system-config');
      if (!config) {
        // Se não existir configuração, cria uma padrão
        const defaultConfig: SystemConfig = {
          id: 'system-config',
          organization_type: 'profit',
          organization_name: 'Minha Organização',
          currency: 'BRL',
          theme: 'light',
          require_auth: true,
          google_sync_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await db.systemConfig.put(defaultConfig);
        return defaultConfig;
      }
      return config;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return null;
    }
  },

  async saveConfig(config: Partial<SystemConfig>): Promise<boolean> {
    try {
      await this.initialize();
      
      const currentConfig = await this.getConfig();
      const updatedConfig: SystemConfig = {
        ...currentConfig!,
        ...config,
        updated_at: new Date().toISOString()
      };

      await db.systemConfig.put(updatedConfig);
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  },

  async updateSheetId(year: number, sheetId: string): Promise<boolean> {
    try {
      const config = await this.getConfig();
      if (!config) return false;

      const updatedConfig = {
        ...config,
        sheet_ids: {
          ...config.sheet_ids,
          [year]: sheetId
        },
        updated_at: new Date().toISOString()
      };

      await db.systemConfig.put(updatedConfig);
      return true;
    } catch (error) {
      console.error("Error updating sheet id", error);
      return false;
    }
  }
}; 