import { db } from '../db/AppDatabase';
import { SystemConfig } from '../model/types';

let isInitialized = false;

export const systemConfigService = {
  async initialize() {
    console.log('Initializing systemConfigService...');
    if (!isInitialized) {
      try {
        console.log('Opening database...');
        await db.open();
        isInitialized = true;
        console.log('Database opened successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
      }
    } else {
      console.log('Database already initialized');
    }
  },

  async getConfig(): Promise<SystemConfig | null> {
    try {
      console.log('Getting system config...');
      await this.initialize();
      
      const config = await db.systemConfig.get('system-config');
      console.log('Current config:', config);
      
      if (!config) {
        console.log('No config found, creating default config...');
        const defaultConfig: SystemConfig = {
          id: 'system-config',
          organization_type: 'profit',
          organization_name: 'Minha Organização',
          currency: 'BRL',
          theme: 'light',
          require_auth: true,
          google_sync_enabled: false,
          is_configured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await db.systemConfig.put(defaultConfig);
        console.log('Default config created:', defaultConfig);
        return defaultConfig;
      }
      return config;
    } catch (error) {
      console.error('Error getting config:', error);
      return null;
    }
  },

  async saveConfig(config: Partial<SystemConfig>): Promise<boolean> {
    try {
      console.log('Saving config:', config);
      await this.initialize();
      
      const currentConfig = await this.getConfig();
      const updatedConfig: SystemConfig = {
        ...currentConfig!,
        ...config,
        updated_at: new Date().toISOString()
      };

      await db.systemConfig.put(updatedConfig);
      console.log('Config saved successfully:', updatedConfig);
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  },

  async updateSheetId(year: number, sheetId: string): Promise<boolean> {
    try {
      console.log('Updating sheet ID for year:', year);
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
      console.log('Sheet ID updated successfully');
      return true;
    } catch (error) {
      console.error("Error updating sheet id:", error);
      return false;
    }
  }
};
